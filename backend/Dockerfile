FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

RUN npm ci --include=dev
COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist

ENV MONGODB_URI=mongodb+srv://juanmapimientae:playattentionh502@cluster0.yzjmu4m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

EXPOSE 3000
CMD ["node", "dist/main.js"]