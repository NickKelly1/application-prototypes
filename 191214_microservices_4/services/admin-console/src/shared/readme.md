# WARNING

The Shared directory is r-synced into services

Do not make changes to shared code from within a service. Any such changes will be overidden on the next rsync.

Run `sync-shared.sh` in the project root to begin synchronisation / watching
