FROM node:13.6.0-stretch

COPY package.json .

RUN yarn install

COPY . .

RUN yarn build

RUN yarn install --production

EXPOSE 80

CMD ["yarn", "start"]