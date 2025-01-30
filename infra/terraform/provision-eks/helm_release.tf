
# Data for AWS Account and EKS OIDC details
data "aws_iam_openid_connect_provider" "eks" {
  arn = module.eks.oidc_provider_arn
}

data "aws_caller_identity" "current" {}

# ExternalDNS IAM Policy
resource "aws_iam_policy" "external_dns_policy" {
  name        = "ExternalDNSPolicy"
  description = "Policy for external-dns to manage Route 53"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "route53:ChangeResourceRecordSets",
          "route53:ListHostedZones",
          "route53:ListResourceRecordSets",
          "route53:CreateHostedZone" # Add permission for creating hosted zones
        ],
        Resource = "*"
      }
    ]
  })
}

# ExternalDNS IAM Role
resource "aws_iam_role" "external_dns_role" {
  name = "ExternalDNSRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Federated = data.aws_iam_openid_connect_provider.eks.arn
        },
        Action = "sts:AssumeRoleWithWebIdentity",
        Condition = {
          StringEquals = {
            "${replace(data.aws_iam_openid_connect_provider.eks.url, "https://", "")}:sub" = "system:serviceaccount:kube-system:external-dns"
          }
        }
      }
    ]
  })
}

# Attach the policy to the role
resource "aws_iam_role_policy_attachment" "external_dns_policy_attachment" {
  role       = aws_iam_role.external_dns_role.name
  policy_arn = aws_iam_policy.external_dns_policy.arn
}

provider "helm" {
  kubernetes {
    config_path = "~/.kube/config" # Adjust as needed
  }
}

# Deploy ExternalDNS via Helm
resource "helm_release" "external_dns" {
  name       = "external-dns"
  repository = "https://kubernetes-sigs.github.io/external-dns"
  chart      = "external-dns"
  version    = "1.14.0" # Use the latest version from the Helm repository
  namespace  = "kube-system"

  create_namespace = true

  values = [
    <<EOT
serviceAccount:
  create: true
  name: external-dns
  annotations:
    eks.amazonaws.com/role-arn: "${aws_iam_role.external_dns_role.arn}"

provider: aws

aws:
  region: "us-east-2"
  zoneType: "public"

sources:
  - ingress
  - service

txtOwnerId: "external-dns-cluster"

domainFilters:
  - "www.vvasylkovskyi.com"
EOT
  ]
}
resource "helm_release" "cert_manager" {
  name       = "cert-manager"
  repository = "https://charts.jetstack.io"
  chart      = "cert-manager"
  version    = "v1.13.0"

  set {
    name  = "installCRDs"
    value = "true"
  }

  #   depends_on = [kubernetes_namespace.cert_manager]
}




resource "helm_release" "nginx_ingress" {
  name       = "nginx-ingress"
  repository = "https://kubernetes.github.io/ingress-nginx"
  chart      = "ingress-nginx"
  version    = "4.0.19" # Choose the appropriate version of the ingress-nginx chart

  namespace = "kube-system"

  create_namespace = true

  values = [
    <<EOF
controller:
  ingressClass: nginx
  service:
    enabled: true
    annotations:
      service.beta.kubernetes.io/aws-load-balancer-internal: "false"  # Set this to true for internal load balancer
  ingressController:
    installCRDs: true
EOF
  ]

  # Ensure that the release is replaced if it already exists
  replace = true
}

resource "helm_release" "blog" {
  depends_on = [helm_release.cert_manager]

  name       = "blog"
  repository = "oci://registry-1.docker.io/vvasylkovskyi1"
  chart      = "blog"
  version    = "0.1.4"
}

