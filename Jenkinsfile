pipeline {
    agent any 

    environment {
        // Define your repository and credentials
        GIT_REPO_URL = 'https://github.com/your-username/your-repo.git'
        GIT_CREDENTIALS = 'your-git-credentials-id' // This is the Jenkins credentials ID used for GitHub
        DOCKER_IMAGE = 'your-app-name:latest' // The name and tag for your Docker image
        DOCKER_CONTAINER = 'your-app-container' // A name for your running container instance
    }

    stages {
        stage('Checkout') {
            steps {
                // Check out from version control.
                // This will clone the repository into the current working directory on the Jenkins agent.
                git credentialsId: "${env.GIT_CREDENTIALS}", url: "${env.GIT_REPO_URL}"
            }
        }

        stage('Build') {
            steps {
                script {
                    // Assuming your Dockerfile is located at the root of your project, build an image.
                    // This also assumes you have a 'docker-compose.yml' for your project.
                    sh 'docker-compose build'
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    // Run your Docker container from the image built in the previous stage.
                    // It uses 'docker-compose up' assuming you might have multiple services to run.
                    sh 'docker-compose up -d' // The '-d' flag is for detached mode (running in the background)
                }
            }
        }

        stage('Post-deployment') {
            steps {
                echo 'Deployment completed.'
                // Here, you could include other post-deployment steps such as health checks or notifications.
            }
        }
    }
    
    post {
        always {
            // This block executes after the build finishes to perform cleanup, notify, etc.
            echo 'The pipeline has finished executing.'
        }
    }
}
