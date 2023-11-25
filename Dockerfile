
# Save package in cache
FROM node:alpine3.16 AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile


FROM node:alpine3.16 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build


FROM node:alpine3.16 AS runner

WORKDIR /user/src/app

COPY package.json yarn.lock ./

RUN yarn install --prod

COPY --from=builder /app/dist ./dist


RUN adduser --disabled-password mangauser
RUN chown -R mangauser:mangauser ./manga-api
USER mangauser

CMD [ "node", "dist/main" ]