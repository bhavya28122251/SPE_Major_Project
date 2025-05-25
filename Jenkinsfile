pipeline {
    agent any

    triggers {
        githubPush()
    }
    
    environment {
        DOCKER_USER = "bhavya28122251"
        DOCKER_CREDENTIALS_ID = "DockerHubCred"
    }

    stages {
        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/bhavya28122251/SPE_Major_Project.git'
            }
        }

        stage('Build with Maven and Run Tests') {
            steps {
                dir('Backend/patient-management') {
                    sh 'mvn clean package'
                }
            }
        }

        stage('Verify Artifacts') {
            steps {
                sh 'find Backend/patient-management -name "*.jar"'
            }
        }

        stage('Build Frontend') {
            steps {
                dir('Frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Build and Push Images') {
            steps {
                script {
                    def services = [
                        'service-registry',
                        'auth-service',
                        'api-gateway',
                        'doctor-service',
                        'patient-service',
                        'appointment-service'
                    ]

                    withCredentials([usernamePassword(
                        credentialsId: DOCKER_CREDENTIALS_ID,
                        usernameVariable: 'USER',
                        passwordVariable: 'PASS'
                    )]) {
                        sh 'echo "$PASS" | docker login -u "$USER" --password-stdin'

                        // Build and push backend services
                        for (service in services) {
                            def image = "${DOCKER_USER}/${service}:latest"
                            def dockerfile = "Backend/patient-management/${service}/Dockerfile"
                            def context = "Backend/patient-management/${service}"

                            echo "Building and pushing ${image}"
                            sh """
                                docker build -t ${image} -f ${dockerfile} ${context}
                                docker push ${image}
                            """
                        }

                        // Build and push frontend
                        def frontendImage = "${DOCKER_USER}/frontend:latest"
                        echo "Building and pushing frontend image"
                        sh """
                            docker build -t ${frontendImage} -f Frontend/Dockerfile Frontend/
                            docker push ${frontendImage}
                        """
                    }
                }
            }
        }
        stage('Cleanup Docker Images') {
            steps {
                script {
                    echo "Cleaning up unused Docker images..."
                    // Remove dangling images
                    sh 'docker image prune -f'

                    // Remove all images without a tag
                    sh 'docker images | grep "<none>" | awk \'{print $3}\' | xargs -r docker rmi -f'
                }
            }
        }
        
        stage('Setup Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG_FILE')]) {
                    sh '''
                        mkdir -p ~/.kube
                        cp "$KUBECONFIG_FILE" ~/.kube/config
                        chmod 600 ~/.kube/config
                    '''
                }
            }
        }

        stage('Deploy ELK Stack') {
            steps {
                sh '''
                    chmod +x elk/deploy-elk.sh
                    ./elk/deploy-elk.sh
                    
                    # Wait for ELK stack to be ready
                    echo "Waiting for ELK stack to be fully ready..."
                    kubectl wait --namespace=elk --for=condition=ready pod -l app=elasticsearch --timeout=300s
                    kubectl wait --namespace=elk --for=condition=ready pod -l app=logstash --timeout=300s
                    kubectl wait --namespace=elk --for=condition=ready pod -l app=kibana --timeout=300s
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    export LC_ALL=C.UTF-8
                    export LANG=C.UTF-8
                    python3 -m pip install --user ansible
                    export PATH=$PATH:/var/lib/jenkins/.local/bin
                    ansible-galaxy collection install kubernetes.core
                    pip install openshift
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                dir('ansible-simple') {
                    withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG_FILE')]) {
                        sh '''
                            export LC_ALL=C.UTF-8
                            export LANG=C.UTF-8
                            export KUBECONFIG=$KUBECONFIG_FILE
                            ansible-playbook -i inventory.ini deploy.yml
                        '''
                    }
                }
            }
        }

        // stage('Deploy to Kubernetes') {
        //         steps {
        //             dir('ansible-simple') {
        //                 withCredentials([
        //                     file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG_FILE'),
        //                     string(credentialsId: 'ansible-vault-password', variable: 'VAULT_PASS')
        //                 ]) {
        //                     sh '''
        //                         export LC_ALL=C.UTF-8
        //                         export LANG=C.UTF-8
        //                         export KUBECONFIG=$KUBECONFIG_FILE

        //                         echo "$VAULT_PASS" > vault.txt

        //                         ansible-playbook -i inventory.ini deploy.yml --vault-password-file vault.txt

        //                         rm -f vault.txt
        //                     '''
        //                 }
        //             }
        //         }
        //     }


        stage('Verify Deployment') {
            steps {
                sh '''
                    kubectl get pods -n healthcare-app
                    kubectl get services -n healthcare-app
                '''
            }
        }
    }

    post {
        success {
            echo '✅ All images built, tested, and pushed successfully.'
        }
        failure {
            echo '❌ Build, test, or push failed.'
        }
    }
}