pipeline {
    agent any

    environment {
        DOCKER_USER = "bhavya28122251"
        DOCKER_CREDENTIALS_ID = "	DockerHubCred"
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Clone Repo') {
            steps {
                git 'https://github.com/bhavya28122251/SPE_Major_Project.git'
            }
        }

        stage('Build and Push Images') {
            steps {
                script {
                    def services = ['api-gateway', 'auth-service', 'doctor-service', 'patient-service', 'config-server', 'service-registry']
                    withCredentials([usernamePassword(
                        credentialsId: DOCKER_CREDENTIALS_ID,
                        usernameVariable: 'USER',
                        passwordVariable: 'PASS'
                    )]) {
                        sh "echo $PASS | docker login -u $USER --password-stdin"
                        for (service in services) {
                            def image = "${DOCKER_USER}/${service}:latest"
                            sh """
                                docker build -t ${image} ./${service}
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
            echo 'Images built and pushed successfully.'
        }
        failure {
            echo 'Build or push failed.'
        }
    }
}
