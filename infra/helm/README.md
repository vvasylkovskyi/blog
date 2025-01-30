# Helm Charts - https://helm.sh/

## Create a helm repo

`helm create blog`

1. Delete everything in `templates` (keep the folder)
2. Add there a barebones `configmap.yaml`

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: blog-configmap
data:
  myvalue: "Hello World"
```

### Add cert manager 

```sh
helm repo add jetstack https://charts.jetstack.io
helm repo update

# Install cert-manager
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.12.0 \
  --set installCRDs=true
```

Add both `certificate.yaml` and `cluster-issuer.yaml`

### Add Certificate from CA to helm

  - Create Certificates using instructions from `app/blog-content/ready/adding-ssl-with-ca.md`
  - **Create a Kubernetes TLS Secret**
    ```sh
      kubectl create secret tls tls-certificate-secret \
      --key ./ca/vvasylkovskyi.key \
      --cert ./ca/vvasylkovskyi.crt
    ```
  - Add the secret to ingress at `secretName`
  - Docs: https://devopscube.com/configure-ingress-tls-kubernetes/ 


## Install

Make sure that the service and deployment are not managed by `kubectl` directly.

### Clean resources first

`kubectl delete service blog`
`kubectl delete deployment blog`

### Install with helm

`helm install blog ./blog`

### Install with replace

`helm install --replace blog ./blog`

## Check the manifest

`helm list`

`helm get manifest blog`

## Uninstall

`helm uninstall blog`

## Upgrade

`helm upgrade blog ./blog`

## Update Version

Go to `Chart.yaml` and increment version. 

## Package and publish

To package and publish run the following two commands:

```sh
helm package ./blog
helm push blog-0.1.1.tgz oci://registry-1.docker.io/<username>
```

## Debug without installing

`helm install --debug --dry-run blog ./blog`
