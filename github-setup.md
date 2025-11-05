# GitHub Setup Instructions

## After Git is installed, run these commands:

### 1. Configure Git (one-time setup)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 2. Initialize Git Repository
```bash
cd c:\Users\DELL\CascadeProjects\personal-website
git init
git add .
git commit -m "Initial commit: SaaS Scout website with premium design"
```

### 3. Connect to GitHub and Push
Replace YOUR_USERNAME and YOUR_REPO with your actual GitHub username and repository name:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## Example (replace with your details):
```bash
# Example if your GitHub username is "johndoe" and repo is "saas-scout"
git remote add origin https://github.com/johndoe/saas-scout.git
git branch -M main
git push -u origin main
```

## Troubleshooting

If you get authentication errors:
1. Use GitHub's Personal Access Token instead of password
2. Generate token at: https://github.com/settings/tokens
3. Use token as password when prompted

## For Future Updates
After making changes:
```bash
git add .
git commit -m "Your commit message"
git push
```
