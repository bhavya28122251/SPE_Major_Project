pipeline {
    agent any

    triggers {
        githubPush()
    }
    
    environment {
        DOCKER_USER = "bhavya28122251"
        DOCKER_CREDENTIALS_ID = "DockerHubCred"
        KUBECONFIG = credentials('kubeconfig')
    }

    
    //Tesing3w632462
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

        stage('Setup Kubernetes') {
            steps {
                sh '''
                    mkdir -p ~/.kube
                    echo "$KUBECONFIG" > ~/.kube/config
                    chmod 600 ~/.kube/config
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                    python3 -m pip install --user ansible
                    ansible-galaxy collection install kubernetes.core
                    pip install openshift
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                dir('ansible-simple') {
                    sh '''
                        export KUBECONFIG=~/.kube/config
                        ansible-playbook -i inventory.ini deploy.yml
                    '''
                }
            }
        }

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
        always {
            sh '''
                docker logout
                rm -f ~/.kube/config
            '''
            cleanWs()
        }
        success {
            echo '✅ All images built, tested, and pushed successfully.'
        }
        failure {
            echo '❌ Build, test, or push failed.'
        }
    }
}
