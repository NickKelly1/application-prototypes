echo 'Deleting .env file and replacing with each services concatenated .env file...'

# clear .env
echo "# **************************
# **    GENERATED FILE    **
# **      DO NOT EDIT     **
# **************************
" > .env

cat services/user-service/.env >> .env

echo "Pruning shared environment variables"

# https://stackoverflow.com/questions/5694228/sed-in-place-flag-that-works-both-on-mac-bsd-and-linux
# https://stackoverflow.com/questions/7657647/combining-two-sed-commands
# https://gist.github.com/NickKelly1/87bd871b21082923d2f2a780c516ee52
sed -i "/s/REDIS_HOST//d" .env
sed -i "/s/REDIS_PORT//d" .env
sed -i "/s/REDIS_PASSWORD//d" .env

echo "Re-adding (once) shared environment variables"

# https://hub.docker.com/r/bitnami/redis/
echo "


# ******************
# ***** SHARED *****
# ******************

REDIS_HOST=ms3_redis
REDIS_PORT=6379
REDIS_PASSWORD=password123

" >> .env
