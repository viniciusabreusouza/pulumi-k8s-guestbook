import * as k8s from "@pulumi/kubernetes";
import * as k8stypes from "@pulumi/kubernetes/types/input";
import * as pulumi from "@pulumi/pulumi";
import * as serviceDeployArgs  from "./serviceDeploymentArgs"

export class ServiceDeployment extends pulumi.ComponentResource {
    public readonly deployment: k8s.apps.v1.Deployment;
    public readonly service: k8s.core.v1.Service;
    public readonly ipAddress?: pulumi.Output<string>;

    constructor(name: string, args: serviceDeployArgs.ServiceDeploymentArgs,
                opts?: pulumi.ComponentResourceOptions) {
        super("k8sjs:service:ServiceDeployment", name, {}, opts);

        const labels = { app: name };
        const container: k8stypes.core.v1.Container = {
            name,
            image: args.image,
            resources: args.resources || { requests: { cpu: "100m", memory: "100Mi" } },
            env: [{ name: "GET_HOSTS_FROM", value: "dns" }],
            ports: args.ports && args.ports.map(p => ({ containerPort: p })),
        };
        this.deployment = new k8s.apps.v1.Deployment(name, {
            spec: {
                selector: { matchLabels: labels },
                replicas: args.replicas || 1,
                template: {
                    metadata: { labels: labels },
                    spec: { containers: [ container ] },
                },
            },
        }, { parent: this });

        this.service = new k8s.core.v1.Service(name, {
            metadata: {
                name: name,
                labels: this.deployment.metadata.labels,
            },
            spec: {
                ports: args.ports && args.ports.map(p => ({ port: p, targetPort: p })),
                selector: this.deployment.spec.template.metadata.labels,
                type: args.allocateIpAddress ? (args.isMinikube ? "ClusterIP" : "LoadBalancer") : undefined,
            },
        }, { parent: this });

        if (args.allocateIpAddress) {
            this.ipAddress = args.isMinikube ?
                this.service.spec.clusterIP :
                this.service.status.loadBalancer.ingress[0].ip;
        }
    }
}