FROM node:23-alpine AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --production

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
