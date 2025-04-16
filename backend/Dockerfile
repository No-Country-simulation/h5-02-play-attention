FROM node:23-alpine AS builder

WORKDIR /usr/src/app 

COPY package*.json ./
COPY yarn.lock* ./
COPY pnpm-lock.yaml* ./

RUN npm ci --omit=dev
COPY . .
RUN npm run build

FROM node:23-alpine

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]