# Yuka Clone — Flutter + PocketBase

Projet ECE 2026 — Application mobile de scan de produits alimentaires.

## Structure du repo

```
.
├── app/        # Application Flutter
└── server/     # Backend PocketBase
    ├── pb_hooks/       # Scripts JS (hooks CRON)
    └── pb_schema.json  # Export du schéma de la base
```

## Lancer l'application Flutter

```bash
cd app
flutter pub get
flutter run
```

## Lancer le serveur PocketBase

```bash
cd server
./pocketbase serve      # Linux/macOS
pocketbase.exe serve    # Windows
```

Interface admin : http://127.0.0.1:8090/_/

Voir [POCKETBASE.md](POCKETBASE.md) pour la configuration complète.

## Groupe

- Étudiant 1 : Roméo Fondaneiche
- Étudiant 2 : Médéric Rolland
