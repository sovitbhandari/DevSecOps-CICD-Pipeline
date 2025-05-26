# DevSecOps CICD Pipeline: Tic Tac Toe Game

A fully containerized, production-grade Tic Tac Toe game with an end-to-end CI/CD pipeline using GitHub Actions, GHCR, Docker, Kubernetes, and Argo CD.

![image](https://github.com/user-attachments/assets/d310d77f-b652-4f07-811a-3ee39a9bb14a)





**Description:**
 Whenever a developer creates a commit or pull request, GitHub Actions is triggered. The CI pipeline includes multiple jobs such as unit testing, static code analysis, building the app, creating and scanning the Docker image with Trivy, and pushing it to the GitHub Container Registry.

Once the CI process is complete, Argo CD handles continuous deployment. It watches for changes in the deployment files or Helm chart, and automatically pulls the latest image tag to deploy it to the Kubernetes cluster.

This forms the complete end-to-end DevSecOps pipeline.




## Features

- Full-featured Tic Tac Toe game built with React and TypeScript
- Score tracking for X, O, and draws
- Game history with timestamps
- Highlights winning lines
- Fully responsive design
- Reset stats and game
- Implements DevSecOps practices from code to production



## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons   
- **CI/CD**: GitHub Actions  
- **Registry**: GitHub Container Registry (GHCR)  
- **Containerization**: Docker  
- **Orchestration**: Kubernetes (kind on EC2)  
- **Deployment**: Argo CD  

## Project Structure

```
devsecops-cicd-pipeline/
├── .dockerignore
├── .gitignore
├── Dockerfile
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts

├── .github/
│   └── workflows/
│       └── ci-cd.yml

├── kubernetes/
│   ├── deployment.yaml
│   ├── ingress.yaml
│   └── service.yaml

├── src/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── vite-env.d.ts
│   ├── __tests__/
│   │   └── gameLogic.test.ts
│   ├── components/
│   │   ├── Board.tsx
│   │   ├── GameHistory.tsx
│   │   ├── ScoreBoard.tsx
│   │   └── Square.tsx
│   └── utils/
│       └── gameLogic.ts
```

<h6>&nbsp;</h6>

## Getting Started Locally

### Prerequisites

- Node.js v14+
- Docker
- GitHub PAT (Personal Access Token with packages and repo access)

### 1. Clone and Run Locally

```bash
git clone https://github.com/yourusername/devsecops-cicd-pipeline.git
cd devsecops-cicd-pipeline
npm install
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

<img width="498" alt="image" src="https://github.com/user-attachments/assets/d07bdda6-dd1c-4069-92a6-3fafb5b7bcd0" />

### 2. Production Build

```bash
npm run build
```

## Docker Workflow

### 1. Build & Run Locally

```bash
docker build -t tiktacktoe:v1 .
docker run -d -p 9099:80 tiktacktoe:v1
```

Visit: [http://localhost:9099](http://localhost:9099)

**Docker container running locally with the app accessible in a browser.**

<img width="501" alt="image" src="https://github.com/user-attachments/assets/29099f77-a6bc-46bb-8f85-09a45139e06b" />


---

### 2. Push to GitHub Container Registry (GHCR)

```bash
echo YOUR_GITHUB_PAT | docker login ghcr.io -u sovitbhandari --password-stdin
docker build -t ghcr.io/sovitbhandari/devsecops-cicd-pipeline:latest .
docker login ghcr.io -u sovitbhandari
docker push ghcr.io/sovitbhandari/devsecops-cicd-pipeline:latest
```

**Note**: Keep your GitHub Personal Access Token (PAT) secure during deployment.
### GitHub Actions: Login to GitHub Container Registry

In your `.github/workflows/ci-cd.yml`, use the following step to authenticate with GitHub Container Registry:

```yaml
- name: Login to GitHub Container Registry
  uses: docker/login-action@v3
  with:
    registry: ${{ env.REGISTRY }}
    username: ${{ github.actor }}
    password: ${{ secrets.TOKEN }}
```

**Important Setup:**

- Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**
- Under the **Secrets** tab, click **New repository secret**
- Name the secret exactly: `TOKEN`
- Paste your GitHub **Personal Access Token (PAT)** with `write:packages` and `repo` permissions

**Now you should be able to see your workflow working properly in repository action section**

![image](https://github.com/user-attachments/assets/e2e47421-8b20-4be2-89cd-451125ca368b)


<h6>&nbsp;</h6>

## Deployment on EC2

### Prerequisite: Create & Connect to EC2 Instance

- Launch a new **EC2 instance** (Amazon Linux 2 or Ubuntu)
- Instance type: `t2.medium` or `t2.large` (recommended for smoother cluster and Argo CD operation)
- Add inbound rules for ports **1010 (for docker)** and **9000 (Argo CD UI)** in the security group
- Connect to the instance via SSH:

```bash
ssh -i your-key.pem ec2-user@<ec2-public-ip>
```


### Step-by-Step Guide:

1. **Install Docker on EC2**

   ```bash
   sudo apt update
   sudo apt install docker.io -y
   sudo usermod -aG docker ubuntu
   ```

2. **Login to GitHub Container Registry (GHCR)**

   > **Important**: Use the same GitHub Personal Access Token (PAT) created earlier. Keep it saved securely until the project is completed.

   ```bash
   echo YOUR_GITHUB_PAT | sudo docker login ghcr.io -u sovitbhandari --password-stdin
   ```

3. **Run the Docker Container**

   Find the latest image tag from your `deployment.yaml` file and run:

   ```bash
   sudo docker run -d -p 1010:80 ghcr.io/sovitbhandari/devsecops-cicd-pipeline:sha-75c0dd411610607cc1de50ed67007eb4f4b3b64d
   ```

4. **Verify the Deployment**

   Visit: `http://<your-ec2-public-ip>:1010`

   You should now see the updated application reflecting the changes you made.

<h6>&nbsp;</h6>
<h6>&nbsp;</h6>

---
> 🧩 **At This Stage**:  
We have completed everything from building the Docker image to updating the image tag in the GitHub repository via CI.

> ⚠️ **IMPORTANT:**  
The only remaining step is to **install Argo CD on the Kubernetes cluster** and **deploy the project using Argo CD**. This final step will connect your GitOps workflow, allowing automated and continuous delivery from GitHub to your Kubernetes cluster.

Make sure your Kubernetes cluster is running and accessible before proceeding with Argo CD installation and configuration.

---

<h6>&nbsp;</h6>

## Kubernetes Cluster Setup on EC2 (Using kind)

After building and pushing the Docker image, and updating the image tag in the GitHub repository, the final step is deploying the application to a Kubernetes cluster using Argo CD.

### Step 1: Install kind (Kubernetes in Docker)

On your **EC2 instance (Linux)**, install kind using the official quickstart command:

```bash
# For AMD64 / x86_64
[ $(uname -m) = x86_64 ] && curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.29.0/kind-linux-amd64

# For ARM64 (if applicable)
[ $(uname -m) = aarch64 ] && curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.29.0/kind-linux-arm64

chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind
```

> 💡 **Note**: The kind website provides platform-specific options for macOS, Windows, and Linux. Make sure you choose the one that matches your EC2 architecture (`x86_64` or `aarch64`).


### Step 2: Create Kubernetes Cluster

```bash
sudo kind create cluster --name=devsecops-cicd-pipeline-cluster
```

> This creates a local Kubernetes cluster inside Docker on your EC2 instance.


### Step 3: Install kubectl

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

Verify the cluster is running:

```bash
sudo kubectl get nodes
```

> You should see one or more nodes in `Ready` state if the setup was successful.

<h6>&nbsp;</h6>

## Install & Access Argo CD

### 1. Install Argo CD

```bash
sudo kubectl create namespace argocd
sudo kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
sudo kubectl get pods -n argocd  #to check everything is in running state
```

---

### 2. Expose Argo CD UI (Port Forward)

```bash
sudo kubectl get svc -n argocd
sudo kubectl port-forward svc/argocd-server -n argocd 9000:80 --address 0.0.0.0   #make sure in ec2 security group you allowed port 9000
```

Visit: `http://<ec2-public-ip>:9000`

---

### 3. Login to Argo CD

```bash
sudo kubectl get secrets -n argocd
sudo kubectl edit secret argocd-initial-admin-secret -n argocd # copy password from here
echo <copied-password-from-above-step> | base64 --decode
```

- **Username**: `admin`  
- **Password**: (use the decoded value from the command above)

---
**Create application in ArgoCD using following steps**

![image](https://github.com/user-attachments/assets/4e377544-8919-4118-8d2b-b0b70f7d3ade)
![image](https://github.com/user-attachments/assets/523ceae6-a0e3-4674-a693-d26c944e4bc1)
![image](https://github.com/user-attachments/assets/b53e9069-1184-4505-9acd-033bbfc51b12)



## How to Pull from GHCR (Private Registry)

❗ Note:
The Argo CD app might shows a ImagePullBackOff error, it's because the image is hosted on GitHub Container Registry (GHCR), which is private by default. Unlike public Docker Hub images, GHCR requires authentication.
To fix this, you need to configure imagePullSecrets in your Kubernetes deployment to allow access.

![image](https://github.com/user-attachments/assets/e8614fbf-0df9-4fc7-a4b0-e1b8d7e9ced9)


### Fix: Create `imagePullSecret`

```bash
kubectl create secret docker-registry github-container-registry \
  --docker-server=ghcr.io \
  --docker-username=YOUR_GITHUB_USERNAME \
  --docker-password=YOUR_GITHUB_PAT \
  --docker-email=YOUR_EMAIL
```

This command creates a Kubernetes secret that authenticates your cluster with the GitHub Container Registry.

---

### Add to `deployment.yaml` if not

In your Kubernetes deployment manifest (`kubernetes/deployment.yaml`), add the following under the `spec.template.spec` section:

```yaml
imagePullSecrets:
  - name: github-container-registry
```

This tells Kubernetes to use the created secret when pulling the image.


## Final Output
![image](https://github.com/user-attachments/assets/fafb79a3-b2a8-4f72-b137-f6c18595d111)


- Application successfully deployed to Kubernetes
- GitHub Actions CI/CD pipeline running end-to-end
- Argo CD synced with GitHub for automated live deployment

---

## License

This project is licensed under the **MIT License**.
