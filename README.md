# Tota Compania

Site web de la Cie Tota Compania — Next.js 14 + MongoDB, déployé derrière Caddy (HTTPS auto Let's Encrypt).

URL prod : <https://totacompania.fr>

---

## Stack

| Couche        | Techno                                        |
| ------------- | --------------------------------------------- |
| Front + API   | Next.js 14 (App Router), TypeScript, Tailwind |
| Auth          | NextAuth                                      |
| DB            | MongoDB 7 (Mongoose)                          |
| Reverse proxy | Caddy 2                                       |
| Orchestration | Docker Compose                                |
| Hébergement   | VPS Hetzner Cloud (CX23, Nuremberg)           |

---

## Développement local

```bash
# Variables d'environnement (créer un .env à la racine)
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3101
MONGODB_URI=mongodb://mongodb:27017/totacompania
TZ=Europe/Paris

# Démarrer la stack
docker compose -f docker-compose.yml up -d --build

# L'app écoute sur http://localhost:3101
```

Sans Docker :

```bash
npm install
npm run dev   # next dev sur :3000
```

---

## Structure

```
src/
  app/
    api/           # routes API (publiques + /admin/*)
    admin/         # pages d'administration (NextAuth requis)
    agenda/        # page publique agenda
    la-compagnie/  # page « Qui sommes-nous »
    ...
  components/
    admin/         # MediaPicker, AnimatedList, ...
    layout/        # Navigation, Footer
    ...
  lib/             # mongodb, utils
  models/index.ts  # tous les schémas Mongoose
```

---

## Modèle Event (extrait)

```ts
interface IEvent {
  title: string;
  subtitle?: string;
  description?: string;
  date: Date;
  endDate?: Date;
  time?: string;
  endTime?: string;
  location: string;
  address?: string;
  price?: string;
  ageRange?: string;
  type: 'spectacle' | 'stage' | 'inscription' | 'residence' | 'ag';
  ticketUrl?: string;
  externalUrl?: string;
  image?: string;
  spectacleId?: ObjectId;       // ref Spectacle
  documents?: { title: string; file: string }[];  // PDFs attachés
  published: boolean;
}
```

`documents` : liste de PDFs téléchargeables — `title` affiché à l'utilisateur, `file` = chemin retourné par `/api/admin/media/upload`. Visible dans le modal détail de la page agenda.

---

## Médias

- Upload : `POST /api/admin/media/upload` (multipart `file`)
- Stockage : `public/uploads/<YYYY>/<MM>/<safe_name>_<timestamp>.<ext>`
- Métadonnées Mongo : collection `Media` (filename, mimeType, size, path, url, alt, tags, folder, …)
- Picker côté admin : composant `MediaPicker` (`accept: image | video | audio | all`)
- Sur la prod, le dossier est bind-mount → les uploads survivent à un rebuild.

### Règle d'or : résolution d'URL avec `getImageUrl`

Selon la source, un champ « image » peut contenir :

| Valeur                                      | Forme                                         |
| ------------------------------------------- | --------------------------------------------- |
| ObjectId Mongo (`Media._id`)                | `6a01cab05a639105dbc76ca4` (24 hex chars)     |
| Chemin upload local                         | `/uploads/2026/01/photo_1736...jpg`           |
| URL absolue (légacy WordPress, partenaire) | `https://…`                                  |

`MediaPicker` enregistre toujours un `_id`. **Côté rendu, ne JAMAIS passer la valeur brute à `<img>` ou `<Image>`** — sinon l'`_id` finit comme URL relative et l'image apparaît cassée.

```tsx
import { getImageUrl } from '@/lib/utils';

<Image src={getImageUrl(value)} alt="…" fill className="object-cover" unoptimized />
//          ^^^^^^^^^^^^^^^^^^ résout _id → /media/<id>, laisse les URL absolues intactes
```

Côté API (server route), faire la résolution avant de renvoyer au front si la donnée traverse plusieurs collections (cf. `src/app/api/events/route.ts` qui résout les `Media._id` via une `Map` pour éviter N+1).

### Pièges fréquents

- Une nouvelle page ou composant qui rend `<Image src={champ}>` sans passer par `getImageUrl()` → cassé pour tout champ stocké en `_id`.
- Un champ tableau (galerie, documents) — chaque élément doit être résolu individuellement.
- `next/image` n'accepte que des URL ; un `_id` brut produit une route 404. Toujours `unoptimized` pour les images servies par `/media/<id>` (route Next, pas un host configuré).

---

## Déploiement (manuel)

Pas de CI/CD. Le `git push` ne déclenche aucun déploiement — il faut rebuild le container Docker sur le serveur.

```bash
# Sur le VPS (accès SSH requis)
cd /opt/totacompania
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build totacompania
```

Le rebuild de l'image Next.js prend ~3-5 min. Caddy et Mongo ne sont pas redémarrés tant que leur config n'a pas changé.

Vérifications rapides :

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs --tail 100 totacompania
curl -s https://totacompania.fr/api/events?limit=1
```

---

## Backups MongoDB

Script `backup.sh` à la racine, dump quotidien via `mongodump`, rétention 7 jours.

```bash
./backup.sh
```

À programmer via cron (`0 3 * * *` typiquement).

---

## Tests

- Type-check : `npx tsc --noEmit`
- Pas de suite de tests automatisés pour le moment.

---

## Notes

- L'édition des fichiers `.ts` / `.tsx` via un partage SMB Windows peut introduire des CRLF dans des fichiers d'origine LF, générant des diffs énormes. Éditer en SSH directement (ou normaliser les line endings avant commit) si le fichier visé contient déjà du CRLF mixé.
- Le secret `NEXTAUTH_SECRET` ne doit jamais être commit. Le `.env` est dans `.gitignore`.
- Les uploads sont servis sous `/uploads/...` via une route Next.js, pas par Caddy directement.

---

## Checklist avant un push qui touche aux images

1. Tout `<Image src={...}>` ou `<img src={...}>` passe par `getImageUrl()` ?
2. Le champ peut-il contenir un `Media._id` (vu côté admin via `MediaPicker`) ? Si oui, le front doit le résoudre.
3. Pour les API server-side qui agrègent depuis plusieurs collections, faire un batch fetch sur `Media` et populer une `Map<id, url>` (voir `/api/events/route.ts` ligne ~55).
4. Type-check avant push : `npx tsc --noEmit`.
5. Tester sur la prod avec une requête réelle : `curl -s https://totacompania.fr/api/<endpoint> | jq .`.
