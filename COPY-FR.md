# Fête, en fait — Copy française

> Tout le texte visible par l'utilisateur. Antigravity doit utiliser **exactement** ces formulations. Si une chose manque, demander avant d'inventer.

---

## Slogans & taglines

- **Tagline principal :** *La plateforme de location pour vos événements entre étudiants.*
- **Sous-tagline :** *Des hôtes qui acceptent les groupes. Sans règles absurdes.*
- **Court (footer, social) :** *Louer une maison entre potes, en fait.*

---

## Navigation

### Header (non connecté)
- Découvrir
- Devenir hôte
- Connexion
- S'inscrire

### Header (connecté en tant que voyageur)
- Découvrir
- Mes réservations
- Devenir hôte
- [Avatar] → Mon profil / Déconnexion

### Header (connecté en tant qu'hôte)
- Découvrir
- Mes annonces
- Mes réservations
- [Avatar] → Mon profil / Déconnexion

### Header (admin)
Idem hôte + lien `Admin` qui pointe vers `/admin`.

### Footer
**Colonne 1 — Fête, en fait**
- À propos
- Comment ça marche
- Nous contacter

**Colonne 2 — Hôtes**
- Mettre une annonce
- Conditions hôte
- Centre d'aide

**Colonne 3 — Légal**
- Mentions légales
- CGU
- Politique de confidentialité

**Bas de footer :** *© 2026 Fête, en fait — Projet étudiant EPITA. Pas un service commercial.*

---

## Page d'accueil (`/`)

### Hero
- **Badge au-dessus du titre :** Réservé aux étudiants vérifiés
- **Titre H1 :** Louez la maison parfaite pour vos événements entre amis
- **Sous-titre :** Des hôtes qui acceptent les groupes étudiants. Sans règles absurdes, sans frais cachés.
- **Barre de recherche — labels :** Ville · Dates · Voyageurs
- **Bouton recherche :** Rechercher

### Section "Pourquoi Fête, en fait"
**Titre :** Pensé pour les étudiants, par des étudiants.

Trois colonnes :

1. **Hôtes qui vous acceptent**
   Nos hôtes savent que vous venez en groupe pour faire la fête. Ils ont choisi cette plateforme pour ça.

2. **Prix transparents**
   Le prix affiché est le prix payé. Pas de frais de ménage cachés, pas de surprises au moment de payer.

3. **Vérifié étudiant**
   Tous les voyageurs sont des étudiants vérifiés. Vous savez avec qui vous traitez, et les hôtes aussi.

### Section "Annonces populaires"
- **Titre :** Des maisons faites pour vos weekends
- **Bouton :** Voir toutes les annonces

### Section "Comment ça marche" (3 étapes)
1. **Cherchez** — Trouvez une maison qui correspond à votre groupe et vos dates.
2. **Réservez** — Paiement sécurisé, confirmation immédiate.
3. **Profitez** — Récupérez les clés et passez un super weekend.

### CTA bas de page
- **Titre :** Vous avez une maison à louer ?
- **Texte :** Rejoignez nos hôtes et louez votre bien à des étudiants qui en prendront soin.
- **Bouton :** Devenir hôte

---

## Page À propos (`/a-propos`)

### Titre
Le concept

### Texte d'intro
**Fête, en fait** est née d'un constat simple : trouver un logement pour un weekend entre potes, c'est devenu impossible. Les plateformes classiques interdisent les groupes, les fêtes, les anniversaires — autrement dit, à peu près tout ce qui rend un weekend mémorable.

### Section "Le problème"
- "Pas de fête." "Pas plus de 6 personnes." "Pas après 22h."
- Les hôtes des grandes plateformes ont peur des groupes étudiants — souvent à juste titre, parfois à tort. Résultat : des centaines de propriétaires bannis, des étudiants privés de logement pour leurs événements.

### Section "Notre solution"
On a recruté des hôtes qui *veulent* louer à des groupes étudiants. Des maisons hors des centres-ville, équipées pour recevoir, avec des règles claires des deux côtés. Vous savez à quoi vous attendre. Eux aussi.

### Section "Pour qui ?"
- Anniversaires
- Weekends d'intégration
- Crémaillères
- Fêtes de fin de partiels
- EVJF / EVG
- Retrouvailles entre promos

### Section "Note légale"
Cette plateforme est un projet pédagogique réalisé dans le cadre d'un cours de français à EPITA. Elle n'est pas un service commercial réel et aucune transaction réelle n'est traitée.

---

## Inscription (`/inscription`)

- **Titre :** Créer un compte
- **Sous-titre :** C'est gratuit et ça prend 30 secondes.
- **Champs :**
  - Prénom
  - Nom
  - Adresse email
  - Mot de passe (8 caractères minimum)
- **Case à cocher :** J'accepte les conditions générales d'utilisation
- **Bouton :** Créer mon compte
- **Lien dessous :** Déjà inscrit ? Se connecter

### Messages d'erreur
- Email déjà utilisé : Un compte existe déjà avec cette adresse. [Se connecter ?]
- Mot de passe trop court : Le mot de passe doit contenir au moins 8 caractères.
- Email invalide : Adresse email invalide.
- CGU non cochées : Vous devez accepter les conditions pour continuer.

---

## Connexion (`/connexion`)

- **Titre :** Connexion
- **Champs :** Email · Mot de passe
- **Bouton :** Se connecter
- **Lien :** Pas encore de compte ? S'inscrire
- **Erreur :** Email ou mot de passe incorrect.

---

## Profil (`/profil`)

### Si non vérifié
- **Bandeau d'avertissement (jaune) :** Vous n'êtes pas encore vérifié comme étudiant. Vous ne pouvez pas réserver tant que votre statut n'est pas confirmé.
- **Bouton :** Vérifier mon statut étudiant

### Modal de vérification
- **Titre :** Vérification étudiante
- **Texte :** On a besoin de quelques infos pour confirmer que vous êtes bien étudiant·e.
- **Champs :**
  - Établissement (dropdown : EPITA, Sorbonne, Sciences Po, HEC, Centrale, ESCP, Polytechnique, Autre…)
  - Numéro étudiant
- **Bouton :** Soumettre
- **Pendant le chargement :** Vérification en cours…
- **Succès :** Vérification réussie ! Vous êtes maintenant un étudiant vérifié.

### Si vérifié
- **Badge :** ✓ Étudiant vérifié
- **Texte :** Vérifié le [date] · [Université]

### Champs profil (toujours visibles)
- Prénom
- Nom
- Email (non modifiable)
- Téléphone (optionnel — utilisé pour contacter l'hôte après réservation)
- **Bouton :** Enregistrer les modifications
- **Toast confirmation :** Profil mis à jour.

### Section danger
- **Bouton rouge :** Supprimer mon compte
- (Au clic) Modal : *Cette action est irréversible. Toutes vos réservations seront annulées.* — Annuler / Confirmer la suppression

---

## Recherche (`/recherche`)

### Filtres (sidebar gauche)
- **Titre :** Filtres
- **Section "Prix par nuit"** — slider, format "X € — Y €"
- **Section "Dates"** — date range picker
- **Section "Voyageurs"** — number input, label "Nombre de voyageurs"
- **Section "Type de logement"** — checkboxes : Maison, Villa, Appartement, Autre
- **Bouton :** Réinitialiser les filtres

### Header de résultats
- **Compteur :** [N] logements trouvés
- **Toggle vue :** Liste · Carte
- **Tri :** Pertinence / Prix croissant / Prix décroissant / Plus récents

### État vide
- **Titre :** Aucun logement trouvé
- **Texte :** Essayez d'élargir vos critères ou de changer de ville.
- **Bouton :** Réinitialiser les filtres

### Carte (mode carte)
- Marqueurs cliquables → mini-card avec photo, titre, prix.
- **Lien sur mini-card :** Voir l'annonce →

---

## Détail annonce (`/annonce/[id]`)

### Sections (de haut en bas)
1. **Galerie photos** — carrousel ou grille
2. **Titre + ville**
3. **Caractéristiques rapides** — "X voyageurs · Y chambres · Type"
4. **Description**
5. **Équipements** (label : "Ce que propose ce logement")
6. **Localisation** — carte avec marqueur
7. **Règles de la maison** (label : "Règles de la maison")
8. **Hôte** (label : "Votre hôte" + nom + badge vérifié si applicable)
9. **Booking widget** (sticky à droite sur desktop)

### Booking widget
- **Prix affiché :** **[X] €** par nuit (ou "[Y] € le weekend" si dispo)
- **Sélection dates** — input dates
- **Sélection voyageurs** — number stepper
- **Bouton (si vérifié) :** Réserver
- **Bouton (si non vérifié) :** *Vérifiez votre statut étudiant pour réserver* (désactivé) + lien vers `/profil`
- **Bouton (si non connecté) :** Se connecter pour réserver
- **Décomposition prix** (s'affiche après sélection dates) :
  - "X € × N nuits" → sous-total
  - "Caution" → montant (si applicable)
  - **Total**

### Équipements — labels exacts
- Piscine
- Parking
- Jardin
- Sono
- Barbecue
- Lave-vaisselle
- Machine à laver
- Wifi
- Terrasse
- Cuisine équipée

---

## Réservation — étapes

### `/reserver/[listingId]` — Récapitulatif
- **Titre :** Récapitulatif de votre réservation
- **Bloc annonce :** photo + titre + ville
- **Bloc dates :** Du [date] au [date] · N nuit(s)
- **Bloc voyageurs :** N voyageurs
- **Bloc prix :** détail (sous-total, caution, total)
- **Bloc contact hôte :** *Les coordonnées de votre hôte vous seront communiquées après confirmation du paiement.*
- **Bouton :** Continuer vers le paiement
- **Lien :** Modifier ma réservation

### `/reserver/[listingId]/paiement` — Paiement (faux)
- **Titre :** Paiement
- **Sous-titre :** Paiement 100 % sécurisé. *(En réalité c'est un faux paiement — voir mention ci-dessous.)*
- **Champs :**
  - Numéro de carte
  - Date d'expiration (MM/AA)
  - CVC
  - Nom sur la carte
- **Bouton :** Confirmer le paiement de [X] €
- **Mention en petit, gris :** *Démo : aucun paiement réel n'est traité. Cette plateforme est un projet pédagogique.*

### `/reserver/[listingId]/confirmation` — Confirmation
- **Icône grande coche verte**
- **Titre :** Réservation confirmée !
- **Texte :** Votre hôte a été notifié. Voici ses coordonnées pour la suite.
- **Bloc hôte :**
  - Nom de l'hôte
  - Email : [email]
  - Téléphone : [phone]
- **Numéro de réservation :** REF-XXXX
- **Bouton primaire :** Voir mes réservations
- **Bouton secondaire :** Retour à l'accueil

---

## Mes réservations (`/reservations`)

- **Titre :** Mes réservations
- **Tabs :** À venir · Passées · Annulées
- **Carte de réservation :**
  - Photo + titre logement
  - Dates · N voyageurs
  - **Statut** — badge coloré :
    - `pending` → "En attente de confirmation" (jaune)
    - `confirmed` → "Confirmée" (vert)
    - `declined` → "Refusée par l'hôte" (rouge)
    - `cancelled` → "Annulée" (gris)
    - `completed` → "Terminée" (gris)
  - Bouton : Voir le détail

### État vide
- **Titre :** Aucune réservation pour l'instant
- **Bouton :** Découvrir les logements

### Détail réservation (`/reservation/[id]`)
- Tout ce qui est sur la carte + bloc contact hôte (si confirmé) + bouton **Annuler la réservation** (si pending ou confirmed).
- **Modal annulation :** *Êtes-vous sûr·e ? Cette action est irréversible.* — Annuler / Confirmer l'annulation
- **Toast après annulation :** Réservation annulée.

---

## Espace hôte (`/hote`)

### Dashboard
- **Titre :** Mon espace hôte
- **Stats cards :**
  - Annonces actives : N
  - Réservations en attente : N
  - Réservations ce mois : N
  - Revenus simulés ce mois : X €
- **Section "Mes annonces"** — grille de cards d'annonces avec menu (Modifier / Supprimer / Voir l'annonce)
- **Bouton flottant :** + Nouvelle annonce
- **Section "Réservations à traiter"** — liste des réservations `pending` avec boutons Confirmer / Refuser

### `/hote/annonces/nouvelle` — Création multi-étapes

**Étape 1/5 — Les bases**
- Titre de l'annonce *(placeholder : "Villa avec piscine pour vos weekends")*
- Description *(textarea, placeholder : "Décrivez votre logement, ce qui le rend spécial, le quartier…")*
- Type de logement (Maison / Appartement / Villa / Autre)

**Étape 2/5 — La localisation**
- Adresse
- Ville
- Code postal
- Pays
- **Bouton :** Géocoder l'adresse (remplit lat/lng automatiquement via Nominatim)
- Carte de prévisualisation

**Étape 3/5 — Les détails**
- Nombre de voyageurs maximum
- Nombre de chambres
- Équipements (multi-checkbox — voir liste plus haut)
- Règles de la maison (textarea)

**Étape 4/5 — Les photos**
- *Pour la démo, collez 3 à 8 URLs d'images (par exemple depuis Unsplash).*
- Champs URL avec preview
- Bouton + Ajouter une photo

**Étape 5/5 — Les tarifs**
- Prix par nuit (€)
- Prix forfait weekend (vendredi → dimanche, optionnel) (€)
- Caution (optionnelle) (€)
- **Bouton final :** Publier l'annonce
- **Toast :** Annonce publiée ! Elle est maintenant visible.

### Boutons de navigation entre étapes
- Précédent · Suivant · Publier (à la dernière étape)

---

## Admin (`/admin`)

### Dashboard (`/admin`)
- **Titre :** Administration
- **Stats cards :** Utilisateurs · Annonces · Réservations · Réservations ce mois

### `/admin/utilisateurs`
- **Titre :** Utilisateurs
- Tableau : Avatar · Nom · Email · Rôle · Vérifié · Inscrit le

### `/admin/annonces`
- **Titre :** Toutes les annonces
- Tableau : Photo · Titre · Hôte · Ville · Statut · Actions
- **Action :** Masquer / Afficher
- **Toast :** Annonce masquée. / Annonce réactivée.

### `/admin/reservations`
- **Titre :** Toutes les réservations
- Tableau : Référence · Annonce · Voyageur · Dates · Statut · Total

---

## Messages système

### Toasts génériques
- Succès générique : Modifications enregistrées.
- Erreur générique : Une erreur est survenue. Réessayez.
- Erreur réseau : Pas de connexion. Vérifiez votre internet.

### Pages d'erreur
- **404 :** "Page introuvable. Cette page n'existe pas — ou plus." Bouton : Retour à l'accueil
- **500 :** "Quelque chose a cassé. On regarde ça. Réessayez dans quelques instants." Bouton : Réessayer

### Loading states
- Liste vide en chargement : *Chargement…*
- Bouton en cours d'action : *...* (afficher un spinner inline)

---

## Données de seed — exemples de titres d'annonces

Pour le `prisma/seed.ts`, voici 8 titres réalistes :

1. *Villa avec piscine pour vos weekends à Marseille*
2. *Grande maison de campagne près de Bordeaux — événements bienvenus*
3. *Loft avec terrasse à Lyon — parfait pour 8*
4. *Maison normande, idéale pour anniversaires (Lille)*
5. *Mas provençal avec jardin clos (Aix-en-Provence)*
6. *Appartement haussmannien grand format (Paris 11e)*
7. *Chalet en bois à 30 min de Toulouse — terrasse + barbecue*
8. *Villa moderne avec sono intégrée (Nice arrière-pays)*

### Descriptions d'exemple (varier le ton)

**#1 (Marseille)** :
> Notre villa accueille les groupes d'étudiants pour vos weekends, anniversaires ou EVJF. Piscine privée, grande terrasse, cuisine entièrement équipée. Quartier calme, voisins compréhensifs. Caution de 500 € à la réservation, restituée si tout va bien — et ça va bien la plupart du temps.

**#3 (Lyon)** :
> Loft de 120 m² au cœur de la Croix-Rousse. Idéal pour 8 personnes (2 chambres + 1 canapé-lit). Terrasse de 30 m² avec vue, sono Bose, baby-foot. Pas de voisins directs. Métro à 3 minutes.

(Antigravity peut générer les autres en suivant ce ton — pratique, factuel, avec un détail qui sonne réel.)
