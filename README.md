# Fête, en fait

Plateforme de location de logements entre étudiants pour des événements et soirées.

## Comptes de test par défaut

Une fois la base de données initialisée via `npx prisma db seed`, vous pouvez utiliser les comptes de test suivants pour vous connecter et tester l'application :

| Rôle | Email | Mot de passe | Description |
|------|-------|--------------|-------------|
| **Administrateur** | `admin@feteenfait.fr` | `admin123` | Accès au tableau de bord admin pour gérer la plateforme |
| **Hôte** | `julie.martin@etu.univ-paris.fr` | `julie123` | Accès à l'espace hôte pour publier et gérer des annonces |
| **Voyageur** | `lucas.dubois@etu.epita.fr` | `lucas123` | Compte étudiant vérifié standard pour chercher et réserver |

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
