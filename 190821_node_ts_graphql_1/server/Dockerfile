# @danger # @note - THIS HAS BEEN COPIED FROM ANOTHER SOURCE AND HAS NOT BEEN TESTED

FROM node:alpine
WORKDIR /node-server
COPY ./package.json ./
RUN yarn install
COPY . .
CMD ["yarn", "start"]