pipeline {
    agent any

    environment {
        DOCKER_USER = "bhavya28122251"
        DOCKER_CREDENTIALS_ID = "DockerHubCred"
    }

    triggers {
        githubPush()
    }
    //Tesing122333867868
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


        stage('Build and Push Images') {
            steps {
                script {
                    def services = ['service-registry','config-server','auth-service', 'api-gateway', 'doctor-service', 'patient-service']

                    withCredentials([usernamePassword(
                        credentialsId: DOCKER_CREDENTIALS_ID,
                        usernameVariable: 'USER',
                        passwordVariable: 'PASS'
                    )]) {
                        sh 'echo "$PASS" | docker login -u "$USER" --password-stdin'

                        for (service in services) {
                            def image = "${DOCKER_USER}/${service}:latest"
                            def dockerfile = "Backend/patient-management/${service}/Dockerfile"
                            def context = "Backend/patient-management/${service}"

                            echo "Building and pushing ${image}"

                            // Build the Docker image using the specific service folder as context
                            sh """
                                docker build -t ${image} -f ${dockerfile} ${context}
                                docker push ${image}
                            """
                        }
                    }
                }
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
