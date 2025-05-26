minikube delete

minikube start

minikube start

kubectl create namespace healthcare-app

kubectl apply -f K8s/config/common-config.yml -n healthcare-app
kubectl apply -f K8s/config/mysql-secret.yml -n healthcare-app
kubectl apply -f K8s/config/mysql-init-script.yml -n healthcare-app
kubectl apply -f K8s/storage/pv-pvc.yml -n healthcare-app
kubectl apply -f K8s/services/mysql/deployment.yml -n healthcare-app
kubectl apply -f K8s/services/mysql/service.yml -n healthcare-app
kubectl apply -f K8s/services/service-registry/statefulset.yml -n healthcare-app
kubectl apply -f K8s/services/service-registry/service.yml -n healthcare-app
kubectl apply -f K8s/microservices/auth-service/config.yml -n healthcare-app
kubectl apply -f K8s/microservices/auth-service/deployment.yml -n healthcare-app
kubectl apply -f K8s/microservices/auth-service/service.yml -n healthcare-app
kubectl apply -f K8s/microservices/patient-service/deployment.yml -n healthcare-app
kubectl apply -f K8s/microservices/patient-service/service.yml -n healthcare-app
kubectl apply -f K8s/microservices/doctor-service/config.yml -n healthcare-app
kubectl apply -f K8s/microservices/doctor-service/deployment.yml -n healthcare-app
kubectl apply -f K8s/microservices/doctor-service/service.yml -n healthcare-app
kubectl apply -f K8s/microservices/appointment-service/deployment.yml -n healthcare-app
kubectl apply -f K8s/microservices/appointment-service/service.yml -n healthcare-app
kubectl apply -f K8s/microservices/api-gateway/config.yml -n healthcare-app
kubectl apply -f K8s/microservices/api-gateway/deployment.yml -n healthcare-app
kubectl apply -f K8s/microservices/api-gateway/service.yml -n healthcare-app
kubectl apply -f K8s/frontend/deployment.yml -n healthcare-app
kubectl apply -f K8s/frontend/service.yml -n healthcare-app
kubectl apply -f K8s/microservices/auth-service/HPA.yml -n healthcare-app
kubectl apply -f K8s/microservices/doctor-service/HPA.yml -n healthcare-app
kubectl apply -f K8s/microservices/appointment-service/HPA.yml -n healthcare-app
kubectl apply -f K8s/ingress/ingress.yml -n healthcare-app

minikube addons enable ingress

Add hostname to your hosts file: Add this to your hosts file:
127.0.0.1 patient-management.local

minikube tunnel


# Delete all resources in the namespace
kubectl delete all --all -n healthcare-app

# Delete configmaps, secrets, and other resources
kubectl delete configmaps --all -n healthcare-app
kubectl delete secrets --all -n healthcare-app
kubectl delete pvc --all -n healthcare-app
kubectl delete ingress --all -n healthcare-app