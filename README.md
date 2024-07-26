![DeClustor Logo](https://github.com/oslabs-beta/DeClustor/blob/dev/client/src/assets/nobglogo.png?raw=true)

- [What is DeClustor?](#introduce)
- [Features](#key-features)
- [Getting Started](#getstart)
- [Meet the Team](#meet-the-team)

## What is DeClustor?

Managing AWS ECS environments can be challenging due to fragmented metrics and real-time performance monitoring across clusters. AWS's dashboard can be confusing and lacks a unified interface.

DeClustor offers a centralized solution for seamless ECS monitoring and management, enabling effortless tracking of metrics and real-time performance across multiple services within a single ECS cluster.


## Features

1. Centralized Dashboard with easy-to-use account management feature
A very powerful dashboard displays which can present users all the real-time metircs based on the service they choose, and users are enabled to manage their AWS accounts easily, as depicted in this demo

![dash-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/1ad4b259-78c5-4ea7-be31-1eb9a61bc18e)

2. Logs and data report generation by notification setting
Users are able to customize different types of metrics and set thresholds to monitor their services. They will be noticed once the thresholds are reached.
They can also analyze the sorted logs and export customized reports.

![logsnew-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/a4c80276-302c-41f5-b5e5-6a5cbfdc80ce)

3. Task and cluster overview
Users can observe their task data and cluster metrics in detail by easily choosing different accounts, cluster names and services.

![taskoverview-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/f3b6806f-ba2b-4aab-99ae-92c65e9c35b0)
![clustermetrics-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/74fc381a-2068-4737-b753-7a61f31b87f7)


4. Local database intergration
The security of users' credentials is most valued. Therefore, by providing lightweight and self contained data management, Decluster allows users to store their credentials locally.

5. Seamless third-party authentication
Users are provided with easy signup and login options through Google and GitHub OAuth, enhancing security and user experience.



## Getting Started

So what are you waiting for? Follow the instructions below to get started!

# Using GitHub Repository
1. **Pull the Docker Image from [DockerHub](https://hub.docker.com/r/declustorteam/declustor):**
   ```sh
   docker pull declustorteam/declustor
2. Clone this repository from GitHub
3. Decrypt the the .env file by using the following commands:
   ```yml
   openssl enc -aes-256-cbc -d -pbkdf2 -iter 100000 -in .env.enc -out .env -k ilovedeclustor
   ```
4. docker-compose up -build
5. Access the application by opening up your web browser and head over to http://localhost:8080
6. Sign up to make an account
7. Use our [Google Docs Instructions](https://docs.google.com/document/d/1Vf7OrThD2bj3LU9Dxm4l7vFzVKmexYBO/edit) to create a IAM User for DeClustor to access your AWS account
8. Select Account → Clusters → Services



## Meet the Team

| Developed By          | GitHub                                                | LinkedIn                                                     |
|-----------------------|-------------------------------------------------------|--------------------------------------------------------------|
| Grace Lo              | [GitHub](https://github.com/gracelo0717)              | [LinkedIn](https://www.linkedin.com/in/gracelo0717)          |
| Will Di               | [GitHub](https://github.com/xiudou401)                | [LinkedIn](https://www.linkedin.com/in/will-di)              |
| Aria Liang            | [GitHub](https://github.com/Aria-Liang)               | [LinkedIn](https://www.linkedin.com/in/arialiang)            |
| Ploynapa Yang         | [GitHub](https://github.com/Ploynpk)                  | [LinkedIn](https://www.linkedin.com/in/ploynapa-py/)         |
