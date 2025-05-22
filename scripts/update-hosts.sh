#!/bin/bash

# Get the Minikube IP
MINIKUBE_IP=$(minikube ip)
DOMAIN="patient-management.local"

echo "Current Minikube IP: $MINIKUBE_IP"

# Remove old entry if exists
sudo sed -i "/$DOMAIN/d" /etc/hosts

# Add new entry
echo "$MINIKUBE_IP $DOMAIN" | sudo tee -a /etc/hosts

echo "Updated /etc/hosts with $MINIKUBE_IP for $DOMAIN"

# Verify Ingress is running
kubectl get pods -n ingress-nginx | grep controller

echo -e "\nYou can now access:"
echo "Frontend: http://$DOMAIN/"
echo "API: http://$DOMAIN/api/" 