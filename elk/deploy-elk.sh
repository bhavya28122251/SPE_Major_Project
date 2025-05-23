#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Create namespace
kubectl apply -f "${SCRIPT_DIR}/elk-namespace.yml"

# Deploy Elasticsearch
kubectl apply -f "${SCRIPT_DIR}/elasticsearch/elasticsearch-deployment.yml"

# Wait for Elasticsearch to be ready
echo "Waiting for Elasticsearch to be ready..."
kubectl wait --namespace=elk --for=condition=ready pod -l app=elasticsearch --timeout=300s

# Deploy Logstash
kubectl apply -f "${SCRIPT_DIR}/logstash/logstash-deployment.yml"

# Deploy Kibana
kubectl apply -f "${SCRIPT_DIR}/kibana/kibana-deployment.yml"

# Deploy Filebeat
kubectl apply -f "${SCRIPT_DIR}/filebeat/filebeat-kubernetes.yml"

echo "ELK stack deployment completed!"
echo "Waiting for all components to be ready..."
kubectl wait --namespace=elk --for=condition=ready pod -l app=logstash --timeout=300s
kubectl wait --namespace=elk --for=condition=ready pod -l app=kibana --timeout=300s
kubectl wait --namespace=elk --for=condition=ready pod -l k8s-app=filebeat --timeout=300s

echo "ELK stack is ready!"
echo "Kibana will be available at http://$(minikube ip):30601"
echo "To view your logs:"
echo "1. Open Kibana at http://$(minikube ip):30601"
echo "2. Go to Stack Management > Index Patterns"
echo "3. Create an index pattern with pattern: healthcare-logs-*"
echo "4. Go to Discover to view your logs" 