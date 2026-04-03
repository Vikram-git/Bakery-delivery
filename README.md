# Bakery-delivery

React + Vite app lives in **`frontend/`**.

## Live site (GitHub Pages)

The bakery UI is **not** the `README` you see when Pages is set to “Deploy from a branch.” You must use **GitHub Actions**:

1. Repo → **Settings** → **Pages**
2. **Build and deployment** → **Source**: choose **GitHub Actions** (not “Deploy from a branch”).
3. Repo → **Actions** → open **Deploy to GitHub Pages** → confirm the latest run is green (if it’s the first time, you may need to approve the `github-pages` environment under **Settings** → **Environments**).
4. Site URL: `https://vikram-git.github.io/Bakery-delivery/`

To redeploy: push to `main`, or **Actions** → **Deploy to GitHub Pages** → **Run workflow**.

## Local

```bash
cd frontend && npm ci && npm run dev
```