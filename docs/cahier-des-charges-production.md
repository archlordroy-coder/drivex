# Cahier des Charges de Production — Projet ArchGenOs / DriveX

- **Auteur** : Manus AI
- **Date** : 6 avril 2026
- **Version** : 1.0

## 1) Présentation du projet

Le projet **ArchGenOs** (nom commercial **DriveX**) est une solution de gestion de fichiers multi-plateforme intégrée à l’écosystème Google Drive.

L’architecture est pensée en **monorepo** afin de :
- déployer une interface web sur Vercel,
- proposer des applications natives Desktop (Windows, macOS, Linux),
- proposer des applications mobiles (Android, iOS).

### Objectif principal
Offrir une expérience utilisateur fluide, sécurisée et performante pour la manipulation des fichiers cloud, avec synchronisation locale sur Desktop/Mobile.

Chaque utilisateur conserve ses données sur **son propre compte Google Drive**, ce qui permet une solution applicative 100% gratuite côté stockage.

## 2) Architecture technique

Le projet repose sur une architecture modulaire centralisée dans un monorepo afin de favoriser le partage de code.

### 2.1 Structure du monorepo

| Composant | Technologie | Rôle |
|---|---|---|
| Frontend Web | React, Vite, PWA | Interface SPA déployée sur Vercel |
| Frontend Mobile | React, Capacitor | Application native Android/iOS (build via Capacitor) |
| Frontend Desktop | React, Electron | Application de bureau multi-OS (build via Electron) |
| Backend | Node.js, Express | API REST partagée (Serverless sur Vercel) |
| Stockage cloud | Google Drive API v3 | Source de vérité des fichiers |

### 2.2 Gestion des données et persistance

Approche hybride :
- **Web** : pas de stockage local persistant des fichiers (consultation / upload direct).
- **Desktop/Mobile** : base locale SQLite pour indexation et suivi de synchronisation.
- **Chargement local** : support de données issues de dossiers locaux (ex. bases SQLite locales).

## 3) Spécifications fonctionnelles

### 3.1 Gestion des fichiers (CRUD)

- **Upload** : drag & drop (Web/Desktop), uploads multiples, résumables via API Drive.
- **Téléchargement** : récupération des fichiers avec dialogue natif de sauvegarde (Desktop/Mobile).
- **Organisation** : création de dossiers, navigation arborescente, renommage, déplacement.
- **Recherche** : moteur basé sur les requêtes `q` de l’API Google Drive.
- **Prévisualisation** : images, PDF, texte directement dans l’interface.

### 3.2 Fonctionnalités spécifiques par plateforme

#### Mobile (Inspiration & Référence)
- **Scan de documents** : Utilisation de la caméra pour scanner et convertir en PDF directement vers Drive.
- **Authentification Biométrique** : Verrouillage de l'application via Empreinte digitale ou FaceID.
- **Extension de Partage (Share Extension)** : Envoyer des fichiers vers DriveX depuis n'importe quelle autre application mobile.
- **Gestion du Cache Intelligent** : Mise en cache agressive pour minimiser l'usage de la data mobile.
- **Mode Sombre Natif** : Adaptation automatique au thème du système.

#### Web (Ajustements)
- **Support PWA** : Installation sur l'écran d'accueil, fonctionnement offline partiel.
- **Web Share API** : Partage natif des fichiers depuis le navigateur vers d'autres apps.
- **IndexedDB** : Persistance locale des métadonnées pour un chargement instantané.

#### Desktop (Ajustements)
- **Intégration Menu Contextuel** : "Envoyer vers DriveX" par clic droit sur un fichier local.
- **Systray / Barre de menus** : Icône de notification pour suivre l'état de la synchronisation en un coup d'œil.
- **Disque Virtuel (VFS)** : Montage d'un lecteur réseau virtuel pour accéder aux fichiers sans encombrer le disque local (FUSE).

### 3.3 Synchronisation (Desktop & Mobile)

- **SyncEngine** : gestion des deltas entre local et cloud.
- **Mode hors-ligne** : modifications locales puis synchronisation au retour de la connexion.
- **Watcher** : détection en temps réel des changements locaux (ex. `chokidar` sur Desktop, FileSystem Observer sur Mobile).

## 4) Sécurité et authentification

### 4.1 Protocole OAuth 2.0

L’accès aux données passe par OAuth 2.0 Google.

- **Scope unique** : `https://www.googleapis.com/auth/drive.file`

> Ce scope limite l’accès aux fichiers/dossiers créés ou ouverts par l’application, renforçant la confidentialité.

### 4.2 Gestion des tokens

- **Stockage** : `access_token` et `refresh_token` dans le Keychain natif (Desktop via `keytar`) ou dans des fichiers chiffrés AES‑256.
- **Cycle de vie** : Token Manager pour rafraîchissement automatique avant expiration.
- **Isolation Electron** :
  - `contextIsolation: true`
  - `nodeIntegration: false`

## 5) Déploiement et build

### 5.1 Environnements

- **Production web** : déploiement automatisé sur Vercel via `vercel.json`.
- **Builds natifs** :
  - Desktop : `.exe`, `.dmg`, `.deb` via `electron-builder`.
  - Mobile : `.apk`, `.ipa` via Capacitor (Android Studio / Xcode).

### 5.2 Scripts de gestion (package.json racine via npm workspaces)

```json
{
  "name": "drivex-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "frontend-web",
    "frontend-desktop",
    "frontend-mobile",
    "backend"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev -w frontend-web\" \"npm run dev -w backend\"",
    "dev:all": "concurrently \"npm run dev -w frontend-web\" \"npm run dev -w backend\" \"npm run dev -w frontend-desktop\"",
    "dev:desktop": "npm run dev -w frontend-desktop",
    "dev:backend": "npm run dev -w backend",
    "build": "npm run build --workspaces",
    "install:all": "npm install"
  }
}
```

| Commande | Action |
|---|---|
| `npm run dev` | Lance frontend web + backend en développement |
| `npm run dev:all` | Lance web + backend + desktop |
| `npm run dev:desktop` | Lance l’application Electron en développement |
| `npm run dev:backend` | Lance le backend Express en développement |
| `npm run build` | Build tous les projets via workspaces |
| `npm run install:all` | Installe les dépendances du monorepo |

## 6) Stratégie de production 100% gratuite et sans blocage

### 6.1 Choix du scope `drive.file`

- Scope essentiel pour la gratuité et une vérification simplifiée.
- Scope classé **sensible** mais non **restreint** : pas d’audit tiers coûteux requis.

### 6.2 Configuration Google Cloud Console

#### Étape A — Écran de consentement OAuth
1. Ouvrir Google Cloud Console.
2. Sélectionner le projet.
3. Aller dans **API et services > Écran de consentement OAuth**.
4. Choisir **Externe**.
5. Renseigner les informations de base (nom d’app, email support).
   - Éviter un logo au départ pour limiter les délais de validation de marque.

#### Étape B — Ajouter le scope
1. Section **Scopes** > **Ajouter ou supprimer des champs d’application**.
2. Rechercher Google Drive API.
3. Sélectionner uniquement `.../auth/drive.file`.
4. Enregistrer.

#### Étape C — État de publication

| État | Limites | Écran de blocage | Recommandation |
|---|---|---|---|
| Testing | 100 utilisateurs max (ajout manuel par email) | Avertissement “Application non vérifiée” (contournable) | Idéal pour développement/tests |
| Production | Utilisateurs illimités | Bloqué sans vérification Google | Obligatoire pour distribution publique |

### Stratégie recommandée
1. **Développement/Test** : rester en mode **Testing** et ajouter manuellement les utilisateurs test.
2. **Production (>100 utilisateurs)** : publier l’application et passer la vérification Google (gratuite avec `drive.file`).
   - Préparer un screencast de connexion OAuth et d’usage de l’application.

### 6.3 Éviter l’écran “Cette application est bloquée”

Causes courantes :
1. Utilisation de `https://www.googleapis.com/auth/drive` (accès total) au lieu de `drive.file`.
2. Utilisateur non présent dans les testeurs quand l’app est en mode Testing.
3. Application non publiée et utilisateur non testeur.

## 7) Évolutions futures (Phase 2+)

- Partage avancé avec permissions Drive (lecteur/éditeur).
- Historique des versions.
- Notifications système (fin d’upload, erreurs de sync).

## Références

1. OAuth App Verification Help Center — Google Cloud Platform Console
2. When is verification not needed — Google Cloud Platform Console
