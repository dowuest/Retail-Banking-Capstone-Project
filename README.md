# Retail Banking Capstone Project

🌐 **Live site:** https://dowuest.github.io/Retail-Banking-Capstone-Project/

---

## Team

| Name | GitHub | Topic | Branch |
|------|--------|-------|--------|
| Vivek Ramachandran | @username | Loans & Credit | `feature/loans-credit` |
| Ade Olanrewaju | @username | Loans & Credit | `feature/loans-credit` |
| Peter Sewing | @username | Savings & Deposits | `feature/savings-deposits` |
| Davron Mirtursunov | @username | Savings & Deposits | `feature/savings-deposits` |
| Francisco Martha Gonzalez | @username | Payments | `feature/payments` |
| Dominik Wüst | @username | Payments | `feature/payments` |
 
---

## Topics

1. **Loans & Credit** — Types of loans, interest rates, credit scoring, application process
2. **Savings & Deposits** — Account types, interest, FDIC insurance, term deposits
3. **Payments** — Payment methods, digital payments, wire transfers, transaction security

---

## Branch Strategy

```
main              ← live site (GitHub Pages)
└── dev           ← integration branch (merge here first)
    ├── feature/loans-credit
    ├── feature/savings-deposits
    └── feature/payments
```

**Rules:**
- Always branch off `dev`, never directly off `main`
- Open a Pull Request into `dev` when your section is ready
- At least 1 teammate must review & approve before merging
- Only merge `dev → main` when the full site is ready to publish

---

## Git Workflow (step by step)

```bash
# 1. Clone the repo (first time only)
git clone https://github.com/dowuest/Retail-Banking-Capstone-Project.git
cd Retail-Banking-Capstone-Project

# 2. Switch to dev and pull latest
git checkout dev
git pull origin dev

# 3. Create your feature branch (first time only)
git checkout -b feature/loans-credit   # change to your topic

# 4. Work on your files, then commit
git add .
git commit -m "feat: add loans section intro"

# 5. Push your branch
git push origin feature/loans-credit

# 6. Open a Pull Request on GitHub: feature/loans-credit → dev
```

---

## File Structure

```
Retail-Banking-Capstone-Project/
├── index.html              ← main page linking all sections
├── README.md
├── assets/
│   ├── css/
│   │   └── style.css       ← shared styles
│   └── js/
│       └── main.js         ← shared scripts
├── loans-credit/
│   └── index.html          ← Loans & Credit section
├── savings-deposits/
│   └── index.html          ← Savings & Deposits section
└── payments/
    └── index.html          ← Payments section
```

---

## Deadline

> ⏳ Fill in your deadline here

---

## GitHub Pages

The live site is served from the `main` branch root.
Go to **Settings → Pages** → Source: `main` / `/ (root)` to enable it.
