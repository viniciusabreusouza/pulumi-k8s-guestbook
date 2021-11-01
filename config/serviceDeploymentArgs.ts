import * as k8stypes from "@pulumi/kubernetes/types/input";

export interface ServiceDeploymentArgs {
    image: string;
    resources?: k8stypes.core.v1.ResourceRequirements;
    replicas?: number;
    ports?: number[];
    allocateIpAddress?: boolean;
    isMinikube?: boolean;
}