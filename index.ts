import * as pulumi from "@pulumi/pulumi";
import * as k8sjs from "./config/k8sconfig";

let stack = pulumi.getStack();
let project = pulumi.getProject();

console.log(`Creating Pulumi Project ${project} on Stack ${stack}`)

const config = new pulumi.Config();
const isMinikube = stack == "dev";

const redisImageLeader = "docker.io/redis:6.0.5";
const redisImageFollower = "gcr.io/google_samples/gb-redis-follower:v2";
const frontEndImage = "gcr.io/google_samples/gb-frontend:v5";

const redisLeader = new k8sjs.ServiceDeployment("redis-leader", {
    image: redisImageLeader,
    ports: [6379],
});

const redisReplica = new k8sjs.ServiceDeployment("redis-replica", {
    image: redisImageFollower,
    ports: [6379],
});

const frontend = new k8sjs.ServiceDeployment("frontend", {
    replicas: 3,
    image: frontEndImage,
    ports: [80],
    allocateIpAddress: true,
    isMinikube: isMinikube,
});

export let frontendIp = frontend.ipAddress;

