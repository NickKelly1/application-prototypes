# https://hub.docker.com/_/node/
FROM node:10.17.0-alpine

WORKDIR /app

# Initially only copy package.json. The intermediate image at
# this point will be cached and used UNTIL package.json changes
COPY package.json .

# Copy everything else after we've got an image cached with node_modules already installed
# This way when we make changes and rebuild the docker image, we don't npm install unless
# package.json has changed
COPY . .

# Build production code
RUN yarn build

# Expose port 80 on AWS
EXPOSE 80

# Default command
CMD ["yarn", "start"]
