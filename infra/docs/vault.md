# Working with Vault


This tutorial is focus on onboarding to hashicorp vault. Vault stores secrets and works with kubernetes. 


Install Vault Server and Injector Agent as helm using the following command: 

```sh
helm repo add hashicorp https://helm.releases.hashicorp.com
helm repo update
helm install vault hashicorp/vault
```


## Docs
  - beginner’s vault guide on Kubernetes - https://devopscube.com/vault-in-kubernetes/
  - init containers - https://devopscube.com/kubernetes-init-containers/
  - Service Account - https://devopscube.com/kubernetes-api-access-service-account/ 
  - Kubernetes Mutation Webhook Controller - https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/ 
  - Dynamic Secrets - https://www.hashicorp.com/resources/what-are-dynamic-secrets-why-do-i-need-them
  - vault server setup guide on Kubernetes - https://devopscube.com/vault-in-kubernetes/
  - https://devopscube.com/vault-agent-injector-tutorial/