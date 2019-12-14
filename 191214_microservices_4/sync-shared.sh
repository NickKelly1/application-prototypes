#! /usr/bin/env sh

# https://stackoverflow.com/questions/12460279/how-to-keep-two-folders-automatically-synchronized

# sudo apt-get install inotify-tools
while inotifywait -r -e modify,create,delete,move ./shared; do
  rsync -avz ./shared/ ./services/admin-console/src/shared
  rsync -avz ./shared/ ./services/user-service/src/shared
done
