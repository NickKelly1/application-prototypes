echo 'Deleting .env file and replacing with each services concatenated .env file...'

cat services/user-service/.env > .env
