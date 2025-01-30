# Setting up Jenkins on VM

Setting up a Jenkins server and integrating it with GitHub for continuous integration involves several steps. I'll guide you through the process step by step. We'll start with the installation of Jenkins, followed by the integration with GitHub, and finally, creating jobs for continuous integration.

1. **Install Jenkins:**

   - First, you need to set up a Jenkins server. You can install Jenkins on various operating systems. Assuming you're installing on a Unix/Linux-based system, you'd start by downloading and installing Jenkins. Here is a simplified example of how to do it on a system like Ubuntu:

     ```sh
     # Update your system
     sudo apt-get update

     # Install Java (Jenkins is a Java-based program)
     sudo apt-get install openjdk-11-jdk

     # Download and install Jenkins
     wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo apt-key add -
     sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
     sudo apt-get update
     sudo apt-get install jenkins

     # Start Jenkins
     sudo systemctl start jenkins

     # Enable Jenkins to start on boot
     sudo systemctl enable jenkins
     ```

   - In case installation doesn't work, install debian step by step from here https://pkg.origin.jenkins.io/debian-stable/.
   - Jenkins will now be running at `http://your-server-address:8080`. Visit this URL in your browser, and you'll be prompted to enter the administrator password from your server.

2. **Initial Jenkins Setup:**

   - When you first access your Jenkins instance, you will be prompted to unlock it using an admin password. Retrieve the password using the command:
     ```sh
     sudo cat /var/lib/jenkins/secrets/initialAdminPassword
     ```
   - Copy the password, paste it into the Administrator password field, and proceed.
   - You'll be prompted to customize Jenkins by installing suggested plugins or selecting specific plugins. For simplicity, you can start with the suggested plugins.
   - Create the first admin user with the required details (username, password, full name, email).

3. **Integrate Jenkins with GitHub:**

   - Go to your Jenkins dashboard and select “Manage Jenkins”.
   - Then, go to “Manage Plugins”, and under the “Available” tab, search for “GitHub” and install the plugin without restart.
   - Once installed, navigate back to “Manage Jenkins” > “Configure System”.
   - Scroll to the GitHub section and add a GitHub server configuration. You'll need to generate and use a personal access token from your GitHub account:
     - Go to your GitHub account settings.
     - Select “Developer settings” > “Personal access tokens” > “Generate new token”.
     - Select the scopes needed for your project and create the token.
     - Copy this token and paste it back in your Jenkins configuration for GitHub.
   - Test the connection to ensure Jenkins can communicate with GitHub.

4. **Setting up a Jenkins Job:**

   - Go back to the main Jenkins dashboard and select “New Item”.
   - Enter a name for your job and choose the project type (e.g., Freestyle project).
   - Under the “Source Code Management” section, select “Git”.
   - Enter your GitHub repository URL and set the necessary credentials.
   - In the “Build Triggers” section, you can choose how you want to trigger the build. One common way is to select “GitHub hook trigger for GITScm polling”.
   - Depending on your project, you'll need to configure your build system under the “Build” section.
   - Save your job configuration.

## Setting Github Webhook to trigger jenkins

GitHub has discontinued password authentication for Git operations. It's part of their increased security measures. You would now need to use a personal access token or SSH keys for authentication. Here's how you can use a personal access token:

1. **Create a GitHub Personal Access Token:**

   - Go to your GitHub account.
   - Click on your profile photo in the upper-right corner, and go to `Settings`.
   - From the settings sidebar, click on `Developer settings`.
   - Now, click on `Personal access tokens`.
   - Then, click on `Generate new token`.
   - Give your token a descriptive name.
   - Select the scopes (or permissions) you'd like to grant this token. To access your private repositories, you generally need to select `repo`, `admin:repo_hook` for hooks setup (optional), and any other relevant permissions.
   - Click `Generate token` at the bottom of the page.

2. **Copy the Generated Token:**

   - After generating the token, make sure to copy it immediately and store it securely. Once you navigate away from the page, you will not be able to see the token again.

3. **Add Credentials in Jenkins:**

   - Go to your Jenkins dashboard.
   - Click on `Credentials` in the sidebar.
   - Click on `(global)` from the list, then `Add Credentials` on the left side.
   - Select `Username with password` from the "Kind" dropdown.
   - In the "Username" field, enter your GitHub username.
   - In the "Password" field, paste your personal access token.
   - Assign an ID and description for identifying these credentials within Jenkins.
   - Click `OK` to add the credentials.

4. **Configure Your Jenkins Job:**

   - Go back to your job configuration page by clicking on the job and then `Configure`.
   - Under the `Source Code Management` section, select `Git`.
   - In the `Repository URL` field, enter the HTTPS URL of your private GitHub repository.
   - In the `Credentials` field, select the credentials you added from the drop-down menu.
   - Configure the rest of the options for your job as needed (branches to build, build triggers, etc.).
   - Click `Save` or `Apply` to save your job configuration.

5. **Test the Configuration:**
   - You can now trigger a new build to check if Jenkins is able to check out your code using the credentials you provided.

Using a personal access token is more secure than using your GitHub account password, and it allows you more granular control over access rights. Remember that personal access tokens are like passwords — keep them secret, keep them safe.

1. **Setting Webhook in GitHub:**

   - In your GitHub repository, go to “Settings” > “Webhooks” > “Add webhook”.
   - Set the Payload URL to your Jenkins server's GitHub webhook URL (usually `http://your-jenkins-url:8080/github-webhook/`).
   - Choose which events trigger the webhook. Usually, it's set to “Just the push event”.
   - Add the webhook, and it should be set up!

## **Testing Your Setup:**

- Now, try pushing a change to your GitHub repository. If everything is set up correctly, this should trigger a build in Jenkins.
- Go back to your Jenkins dashboard and select the job you've just created. You should see it building, and you can click on it to see the console output and results.

## Adding Jenkins in Docker

Below is a basic `docker-compose.yml` example for setting up Jenkins. This configuration sets up a Jenkins container and persists the data using a volume. You might need to adjust this configuration to match your specific needs, especially for production environments.

```yaml
version: "3.7" # choose the appropriate version based on your Docker environment

services:
  jenkins:
    image: jenkins/jenkins:lts # use the latest LTS version from the official Jenkins repo
    container_name: jenkins
    ports:
      - "8080:8080" # map Jenkins web UI port to the host
      - "50000:50000" # map Jenkins agent port to the host (optional, only needed if you're attaching build agents)
    volumes:
      - jenkins_home:/var/jenkins_home # mount the Jenkins home directory from the named volume below
      # If you want to use Docker within your Jenkins builds, you can uncomment the line below to mount the Docker socket
      # - /var/run/docker.sock:/var/run/docker.sock
    environment:
      JENKINS_OPTS: --httpPort=8080 # additional options; here, we set the running port
      # You can set additional environment variables that Jenkins will use upon start-up
      # JAVA_OPTS: "-Xmx2048m"  # for example, to control Java memory settings

volumes:
  jenkins_home: # named volume for Jenkins data, making it persistent across container restarts
    external: true # set this to false if you want Docker to handle the creation of the volume
```

### Steps to use this `docker-compose` file:

1. **Create the file:**

   - Save this content in a file named `docker-compose.yml`.

2. **Run Docker Compose:**

   - Open a terminal window and navigate to the directory where you have saved the `docker-compose.yml` file.
   - Run the following command:
     ```sh
     docker-compose up -d
     ```
   - This command will download the Jenkins image (if it's not downloaded) and start a new container.

3. **Access Jenkins:**

   - Once the container is up, you can access Jenkins through your web browser at `http://localhost:8080`.

4. **Initial Setup:**

   - The first time you start Jenkins, it will ask for an initial admin password. You can retrieve it by looking at the container logs or by running the following command (assuming the container name is "jenkins"):
     ```sh
     docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
     ```
   - Copy the password from the terminal, and use it to proceed with the initial setup in the web UI.

5. **Proceed with Jenkins Configuration:**
   - Follow the on-screen instructions to complete the Jenkins setup. This process involves creating an admin user, installing default plugins, and configuring basic settings.

### Additional Considerations:

- If you plan to use Docker commands within your Jenkins builds, you need access to the Docker socket. This access is granted by sharing the Docker socket with the Jenkins container (`/var/run/docker.sock`), as indicated in the commented line in the volumes section. Be aware that this method provides significant privileged access to the host system and can have security implications.

- The `external: true` part under the `jenkins_home` volume assumes you've created a Docker volume named `jenkins_home` externally before running `docker-compose up`. If you haven't done this, you can either create the volume manually using `docker volume create jenkins_home` or change `external: true` to `external: false` (or remove the `external` line entirely) to let Docker create the volume for you.

- The snippet above is a basic example and might not meet all production-grade requirements, such as networking aspects, data backup, and high availability considerations. Please tailor your configuration to meet your specific requirements.
