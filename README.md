# BNS Services - E-commerce Materiel Informatique

Site e-commerce pour la vente de materiel informatique au Senegal.

## Liens de production

- **Frontend** : https://bns-nine.vercel.app
- **Backend API** : https://bns-api-production.up.railway.app
- **Admin** : https://bns-nine.vercel.app/admin/connexion

## Stack technique

- **Frontend** : React + Vite + Tailwind CSS
- **Backend** : Node.js + Express + Prisma + PostgreSQL
- **Email** : Brevo (SMTP)
- **Images** : Cloudinary
- **Deploiement** : Vercel (frontend) + Railway (backend)

## Development

```bash
# Frontend
npm run dev

# Backend
cd server && npm run dev
```

## Test push - Deploiements automatiques actifs

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
