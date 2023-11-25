
FROM node:18-alpine

WORKDIR /user/src/app

COPY package.json yarn.lock ./

RUN yarn install --omit=dev

COPY . .

RUN yarn build

USER node

CMD [ "yarn", "run", "start:prod" ]