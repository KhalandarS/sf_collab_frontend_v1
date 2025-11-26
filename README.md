# SFCOLAB - Project Collaboration Guide

## 📌 Branching Strategy & Workflow
To maintain organized development, follow these rules:

1. **Do NOT push directly to `main` branch**
2. **Each developer works on their own branch**

---

## 🛠️ Setup & Development
1. **Clone the repo:**
   ```bash
   git clone [repo-url]
   cd [repo-name]
   git checkout -b [your-branch-name]
2. **Create and switch to your branch:**
   ```bash
   git clone [repo-url]
   cd [repo-name]
   git checkout -b [your-branch-name]
3. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "Descriptive commit message"
   git push origin [your-branch-name]

⚠️ Important Notes: 
- Never force-push to shared branches
- Always pull latest changes before pushing.