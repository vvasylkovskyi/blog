# Terraform with AWS

## Setting up AWS to obtain keys and AWS CLI

In order to provision infrastructure to AWS, we first need an access key. The following step by step describes how to setup AWS account 

1. Create a new `User` in IAM
2. Create a new policy `AdministratorAccess`
3. Create a new User Group where the `User` has the `AdministratorAccess`
4. Create a API token/Access key 
   1. The Access key ID is `AWS_ACCESS_KEY_ID`
   2. The Access key is `AWS_SECRET_ACCESS_KEY`
5. Save the `AWS_SECRET_ACCESS_KEY` secure as it will never be shown again.

```bash
export AWS_ACCESS_KEY_ID=
export AWS_SECRET_ACCESS_KEY= 
```

### Install AWS CLI

Install AWS CLI - https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html 

```sh
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /
```

Check the installation

```sh
aws --version
```

The AWS CLI should be configured with the right `AWS_SECRET_ACCESS_KEY` and `AWS_ACCESS_KEY_ID` as long as they are defined as environment variables.

## Terraform Basics

In the `terraform` folder where `main.tf` is - run:
 
### Terraform Init

`terraform init`

### Plan and Apply Resources

To plan and inspect what resources will be applied, run the following: 

`terraform plan`

Then, to actually apply them, run 

`terraform apply`

### Destroy changes

To reset, run the terraform destroy: 

`terraform destroy`


## Kubernetes Helm Chart - Practice with Minikube

Before deploying helm chart onto AWS, let's ensure that it works fine locally using Minikube. 

### Bootstrap Minikube

To bootstrap minikube, start it, add ingress addon and start with tls tunnel

```sh
minikube start
minikube addons enable ingress
minikube tunnel
```

### Start helm chart on minikube

We already have pre-packaged helm chart. To start it, run the following from the `infra` folder: 

```sh
helm upgrade blog ./blog
```

And that should be it. You should see your app running on minikube. Now, let's see how we can bootstrap infrastracture on AWS in a way to use our helm chart. 

## Provision EKS cluster

Folowing the tutorial from HashiCorp - https://developer.hashicorp.com/terraform/tutorials/kubernetes/eks, we will copy the code to provision the EKS cluster. Essentially EKS cluster comprises the necessary infrastructure to run the cluster including VPC and security permissions. This `terraform` folder already contains the necessary terraform code to start the cluster, so we will just install and apply the changes. 


```sh
terraform init -upgrade
terraform apply
```

### Configure kubectl

After provisioning the cluster, we need to configure `kubectl` to interact with it. The cluster names e region are already defined in `outputs.tf` and once the terraform apply is executed, they should be available in the console. Now we can run the following command to retrieve the access credentials from our cluster and configure `kubectl`

```sh
aws eks --region $(terraform output -raw region) update-kubeconfig \
    --name $(terraform output -raw cluster_name)
```

This should add the context to the kube config. The output of the command above should be something like follows:

```sh
Added new context arn:aws:eks:us-east-2:088656249151:cluster/education-eks-kwUslMSH to /Users/viktorvasylkovskyi/.kube/config
```

Notice now we should have control over the AWS cluster from current CMD. Let's verify the cluster: 

### Verify Cluster

```sh
kubectl cluster-info
kubectl get nodes
```

## Install Kubernetes Provider

To use kubernetes to interact with EKS cluster via terraform, we need to install the kubernetes provider. Full tutorial can be found here - https://developer.hashicorp.com/terraform/tutorials/kubernetes/kubernetes-provider. 

Essentially, in `./install-helm/kubernetes.tf` we are configuring the kubernetes provider that will connect to the EKS cluster using the terraform state. In particular, the following code authenticates to the AWS EKS cluster: 

```tf
provider "kubernetes" {
  host                   = data.aws_eks_cluster.cluster.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority.0.data)
  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    args        = ["eks", "get-token", "--cluster-name", data.aws_eks_cluster.cluster.name]
    command     = "aws"
  }
}
```

Now that we have provisioned kubernetes, the next step is to publish our helm chart into OCI (Open Container Initiative) so that we can use it in terraform.

## Publish Helm Chart to OCI

For the sake of simplicity, we will be using docker OCI. Let's push the helm chart. 

### Package helm chart

Run the following command: 

```sh
helm package ./blog
```

### Push to OCI registry

Enable OCI support in Helm:

```sh
export HELM_EXPERIMENTAL_OCI=1
```

Now, let's authenticate to Docker OCI registry:

```sh
helm registry login -u <username> registry-1.docker.io
```

And finally, push the helm chart to Docker OCI registry

```sh
helm push your-helm-chart-0.1.0.tgz oci://registry-1.docker.io/<username>
```

## Add Helm Provider with the Published Chart

Similar to kubernetes provider, helm provider also must authenticate to AWS EKS using the `eks get-token`, so our `helm_release.tf` will do just that. Further, we will specify the exact helm chart location and name to be installed, using the oci registry from the previous step. 

### Add Cert Manager

Since our app uses SSL certificate manager for creation of TLS certificate, we need to install cert manager. We can automate that in terraform as follows (note, namespaces have to be explicitly created in terraform):

```tf

resource "kubernetes_namespace" "cert_manager" {
  metadata {
    name = "cert-manager"
  }
}

resource "helm_release" "cert_manager" {
  name       = "cert-manager"
  namespace  = "cert-manager"
  repository = "https://charts.jetstack.io"
  chart      = "cert-manager"
  version    = "v1.13.0" # Use the latest compatible version

  set {
    name  = "installCRDs"
    value = "true"
  }
}
```

### Add External DNS Record for the Ingress

When using ExternalDNS terraform module, and external-dns annotations in kubernetes manifesta, the ExternalDNS will configure DNS records automatically. Bellow follows the setup for DNS using terraform. 

**Ingress (note, for backend service use LoadBalancer)**

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: example-ingress
  annotations:
    external-dns.alpha.kubernetes.io/hostname: "{{ .Values.ingress.host }}"
```

**Provision DNS using Terraform Helm Provider with Route53**

```tf

resource "aws_iam_role" "external_dns_role" {
  name = "external-dns-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = { Service = "ec2.amazonaws.com" },
        Action    = "sts:AssumeRole"
      }
    ]
  })
}

# IAM Policy for ExternalDNS 
resource "aws_iam_policy" "external_dns_policy" {
  name        = "ExternalDNSPolicy"
  description = "Policy for ExternalDNS to manage Route53 DNS records"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "route53:ChangeResourceRecordSets",
          "route53:ListHostedZones",
          "route53:ListResourceRecordSets"
        ],
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_external_dns_policy" {
  role       = aws_iam_role.external_dns_role.name
  policy_arn = aws_iam_policy.external_dns_policy.arn
}

resource "helm_release" "external_dns" {
  name       = "external-dns"
  namespace  = "kube-system"
  chart      = "external-dns"
  repository = "https://kubernetes-sigs.github.io/external-dns"

  values = [
    yamlencode({
      provider      = "aws"
      domainFilters = ["www.vvasylkovskyi.com"]
      txtOwnerId    = "external-dns"
      rbac = {
        create = true
      }
    })
  ]
}

```

## Manually Adding secrets Kubernetes TLS Secret

  - **Create a Kubernetes TLS Secret**

      kubectl create secret tls tls-certificate-secret \
      --key ./ca/vvasylkovskyi.key \
      --cert ./ca/vvasylkovskyi.crt


## Automating it all 
https://www.linkedin.com/pulse/automate-dns-ssl-aws-using-cert-manager-external-eks-mariani-1f/


## Add Helm Chart Release of the app

Finally, we can add the helm chart of the app itself the we have developed. Add the following code into `helm_release.tf`:

```tf
resource "helm_release" "blog" {
  name       = "blog"
  repository = "oci://registry-1.docker.io/vvasylkovskyi1"
  chart      = "blog"

  depends_on = [helm_release.cert_manager]
}
```
