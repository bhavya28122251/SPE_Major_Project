#!/bin/bash

# Create namespace
kubectl apply -f elk-namespace.yml

# Deploy Elasticsearch
kubectl apply -f elasticsearch/elasticsearch-deployment.yml

# Wait for Elasticsearch to be ready
echo "Waiting for Elasticsearch to be ready..."
kubectl wait --namespace=elk --for=condition=ready pod -l app=elasticsearch --timeout=300s

# Deploy Logstash
kubectl apply -f logstash/logstash-deployment.yml

# Deploy Kibana
kubectl apply -f kibana/kibana-deployment.yml

# Deploy Filebeat
kubectl apply -f filebeat/filebeat-kubernetes.yml

echo "ELK stack deployment completed!"
echo "Waiting for all components to be ready..."
kubectl wait --namespace=elk --for=condition=ready pod -l app=logstash --timeout=300s
kubectl wait --namespace=elk --for=condition=ready pod -l app=kibana --timeout=300s
kubectl wait --namespace=elk --for=condition=ready pod -l k8s-app=filebeat --timeout=300s

echo "ELK stack is ready!"
echo "Kibana will be available at http://NODE_IP:30601"
echo "To view your logs:"
echo "1. Open Kibana at http://NODE_IP:30601"
echo "2. Go to Stack Management > Index Patterns"
echo "3. Create an index pattern with pattern: healthcare-logs-*"
echo "4. Go to Discover to view your logs" 