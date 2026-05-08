# Fête, en fait — Web

Plateforme de location de logements entre étudiants pour des événements et soirées.

> **Tagline :** *La plateforme de location pour vos événements entre étudiants.*

---

## Stack technique

| Couche | Choix |
|---|---|
| Framework | **Next.js 16** (App Router) |
| Langage | **TypeScript** strict |
| Base de données | **SQLite** via **Prisma 7** + `better-sqlite3` |
| Authentification | **NextAuth v5** (Credentials provider + JWT) |
| UI | **Tailwind CSS v4** + **shadcn/ui** (Base UI primitives) |
| Cartes | **MapLibre GL** via **react-map-gl** |
| Icônes | **lucide-react** |
| Formulaires | **react-hook-form** + **Zod** |

---

## Démarrage

### Prérequis

- Node.js ≥ 18
- npm

### Installation

```bash
npm install
```

### Base de données

```bash
# Créer la base et appliquer les migrations
npx prisma db push

# Peupler avec les données de test
npx prisma db seed
```

### Serveur de développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

---

## Comptes de test

Une fois la base initialisée, ces comptes sont disponibles :

| Rôle | Email | Mot de passe |
|---|---|---|
| **Admin** | `admin@feteenfait.fr` | `admin123` |
| **Hôte** | `julie.martin@etu.univ-paris.fr` | `julie123` |
| **Voyageur** | `lucas.dubois@etu.epita.fr` | `lucas123` |

---

## Structure du projet

```
web/
├── prisma/
│   ├── schema.prisma          # Modèle de données (User, Listing, Booking)
│   ├── seed.ts                # Peuplement des données de test
│   └── migrations/            # Migrations SQLite
├── src/
│   ├── app/                   # Routes Next.js App Router
│   │   ├── layout.tsx         # Layout racine (Navbar, Footer, SessionProvider)
│   │   ├── page.tsx           # Page d'accueil
│   │   ├── connexion/         # Connexion
│   │   ├── inscription/       # Inscription
│   │   ├── recherche/         # Recherche de logements
│   │   ├── annonce/[id]/      # Détail d'une annonce
│   │   ├── reserver/[id]/     # Flux de réservation
│   │   ├── reservation/[id]/  # Détail d'une réservation
│   │   ├── reservations/      # Mes réservations
│   │   ├── profil/            # Profil utilisateur
│   │   ├── hote/              # Espace hôte
│   │   ├── admin/             # Tableau de bord admin
│   │   ├── a-propos/          # À propos
│   │   └── api/               # Routes API REST
│   ├── components/
│   │   ├── layout/            # Navbar, Footer, UserMenu
│   │   ├── listings/          # ListingCard
│   │   └── ui/                # Composants shadcn (button, input, avatar, dropdown)
│   ├── lib/
│   │   ├── auth.ts            # Configuration NextAuth
│   │   ├── db.ts               # Client Prisma singleton
│   │   └── utils.ts           # Utilitaire cn()
│   └── types/                 # Types TypeScript globaux
├── public/                    # Assets statiques
├── next.config.ts             # Configuration Next.js
├── tailwind.config.js         # Configuration Tailwind CSS v4
└── package.json
```

---

## Rôles utilisateurs

| Rôle | Permissions |
|---|---|
| **Voyageur** (guest) | Rechercher, voir les annonces, réserver, voir/annuler ses réservations |
| **Hôte** (host) | Créer/modifier/supprimer des annonces, confirmer/refuser les demandes |
| **Admin** | Gérer utilisateurs, annonces (masquer/afficher), voir les statistiques |

---

## API

Les routes API sont documentées dans [`API.md`](./API.md).

Endpoints principaux :
- `POST /api/auth/token` — Connexion (JWT)
- `POST /api/auth/register` — Inscription
- `GET /api/listings` — Liste des annonces
- `GET /api/listings/[id]` — Détail d'une annonce
- `POST /api/bookings` — Créer une réservation
- `PATCH /api/bookings/[id]` — Modifier le statut
- `POST /api/users/me/verify` — Vérification étudiante

---

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Lancer le serveur de développement |
| `npm run build` | Build de production |
| `npm start` | Démarrer en production |
| `npm run lint` | ESLint |

---

## Application mobile

L'application mobile Expo (React Native) se trouve dans [`../mobile/`](../mobile/). Elle consomme la même API.
