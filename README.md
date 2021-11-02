
# Pulumi - Kubernets Guestbook Apps
[![versionpulumi](https://img.shields.io/badge/pulumi-v3.15.0-green)](https://www.pulumi.com/)

This repository shows how to use [Pulumi](https://www.pulumi.com/) for create a Kubernets infrastructure.

We'll create, build and deploy the [Kubernets Guestbook](https://github.com/kubernetes/examples/tree/master/guestbook) example using typescript whit Pulumi.


## Installation

#### Install Pulumi

https://www.pulumi.com/docs/get-started/install/

install Pulumi on Windows:

`$ choco install pulumi`

or on Linux:

`$ curl -fsSL https://get.pulumi.com | sh`

or on MacOS:

`$ brew install pulumi`

#### After clone this repository:

```sh
$ npm install
```

Create a new stack
```sh
$ pulumi stack init
Enter a stack name: dev
```

If you will use stack of dev, the Guestbook application
already knows to use type `ClusterIP` of minikube (minikube does not support `LoadBalancer`).

## Perform the deployment
```sh
$ pulumi up
Previewing update (dev)

View Live: https://app.pulumi.com/acme/k8s-guestbook/dev/previews/9fb88818e4-756d-48ed-baf8-f44774d9bbd0

     Type                                 Name               Plan       Info
 +   pulumi:pulumi:Stack                  k8s-guestbook-dev  create     1 message
 +   ├─ k8sjs:service:ServiceDeployment   redis-leader       create
 +   │  ├─ kubernetes:apps/v1:Deployment  redis-leader       create
 +   │  └─ kubernetes:core/v1:Service     redis-leader       create
 +   ├─ k8sjs:service:ServiceDeployment   frontend           create
 +   │  ├─ kubernetes:apps/v1:Deployment  frontend           create
 +   │  └─ kubernetes:core/v1:Service     frontend           create
 +   └─ k8sjs:service:ServiceDeployment   redis-replica      create
 +      ├─ kubernetes:apps/v1:Deployment  redis-replica      create
 +      └─ kubernetes:core/v1:Service     redis-replica      create

Diagnostics:
  pulumi:pulumi:Stack (k8s-guestbook-dev):
    Creating Pulumi Project k8s-guestbook on Stack dev


Do you want to perform this update? yes
Updating (dev)

View Live: https://app.pulumi.com/acme/k8s-guestbook/dev/updates/23

     Type                                 Name               Status      Info
 +   pulumi:pulumi:Stack                  k8s-guestbook-dev  created     1 message
 +   ├─ k8sjs:service:ServiceDeployment   frontend           created
 +   │  ├─ kubernetes:apps/v1:Deployment  frontend           created
 +   │  └─ kubernetes:core/v1:Service     frontend           created
 +   ├─ k8sjs:service:ServiceDeployment   redis-replica      created
 +   │  ├─ kubernetes:apps/v1:Deployment  redis-replica      created
 +   │  └─ kubernetes:core/v1:Service     redis-replica      created
 +   └─ k8sjs:service:ServiceDeployment   redis-leader       created
 +      ├─ kubernetes:apps/v1:Deployment  redis-leader       created
 +      └─ kubernetes:core/v1:Service     redis-leader       created

Diagnostics:
  pulumi:pulumi:Stack (k8s-guestbook-dev):
    Creating Pulumi Project k8s-guestbook on Stack dev

Outputs:
    frontendIp: "10.108.227.133"

Resources:
    + 10 created

Duration: 44s
```

#### Checking the results

Inspect your cluster to validate the Guestbook App services:
```sh
$ kubectl get services
```
 
 Minikube does not support type `LoadBalancer`; if you are using dev stack, run:
 ```sh
$ kubectl port-forward svc/frontend 8080:80
 ```

 and open in browser [http://localhost:8080](http://localhost:8080)


 ## Destroying the Project

 To clean up and destroy resources, run commands to destroy and remove your stack/resources:
 ```sh
$ pulumi destroy --yes
$ pulumi stack rm --yes
 ```
 
 ## Links
 Pulumi example projects https://github.com/pulumi/examples
