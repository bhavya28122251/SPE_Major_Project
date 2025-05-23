# Ansible Deployment for Healthcare Microservices

## Initial Setup

1. Copy the vault template to create your vault file:
   ```bash
   cp group_vars/all/vault.yml.template group_vars/all/vault.yml
   ```

2. Get your Kubernetes cluster details:
   ```bash
   # Get Kubernetes master IP
   kubectl cluster-info | grep "control plane"
   
   # Get current user
   kubectl config view --minify | grep user:
   ```

3. Create Docker Hub access token:
   - Go to Docker Hub → Account Settings → Security
   - Create new access token
   - Save it securely

4. Create and encrypt your vault file:
   ```bash
   # Create a vault password file (don't commit this!)
   echo "your-strong-vault-password" > .vault_pass
   
   # Encrypt the vault file
   ansible-vault encrypt group_vars/all/vault.yml
   ```

5. Edit the vault file with your actual values:
   ```bash
   ansible-vault edit group_vars/all/vault.yml
   ```

## Security Notes

- Never commit the actual `vault.yml` file to Git
- Never commit the `.vault_pass` file to Git
- Use strong passwords for all secrets
- Rotate secrets periodically
- Use Docker Hub access tokens instead of account password

## Directory Structure
```
ansible/
├── inventory/
│   └── hosts.yml
├── group_vars/
│   └── all/
│       ├── vault.yml.template  # Template file (committed to Git)
│       └── vault.yml          # Actual vault file (NOT committed)
├── roles/
│   ├── common/
│   ├── mysql/
│   ├── service-registry/
│   ├── config-server/
│   ├── patient-service/
│   ├── doctor-service/
│   ├── appointment-service/
│   └── api-gateway/
└── site.yml
```

## Usage

1. Update the inventory file with your Kubernetes master node details:
   ```yaml
   # inventory/hosts.yml
   kubernetes:
     hosts:
       master:
         ansible_host: your_master_ip
   ```

2. Run the playbook:
   ```bash
   ansible-playbook -i inventory/hosts.yml site.yml --vault-password-file .vault_pass
   ```

## Roles

1. **common**: Sets up namespace, configmaps, and secrets
2. **mysql**: Deploys MySQL database with persistent storage
3. **service-registry**: Deploys Eureka service registry
4. **config-server**: Deploys Spring Cloud Config Server
5. **patient-service**: Deploys patient microservice
6. **doctor-service**: Deploys doctor microservice
7. **appointment-service**: Deploys appointment microservice
8. **api-gateway**: Deploys API gateway

## Security

- Sensitive information is stored in `vault.yml` and should be encrypted
- Docker registry credentials are stored securely in Kubernetes secrets
- Database credentials are stored in Kubernetes secrets
- JWT secrets are stored in Kubernetes secrets
- Each service uses appropriate resource limits and requests 