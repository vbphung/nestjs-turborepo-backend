FROM node:22-alpine as base
ENV PNPM_HOME=/usr/local/bin
RUN corepack enable && \ 
corepack prepare pnpm@9.9.0 --activate

FROM base as pruner
WORKDIR /app

COPY . .

RUN pnpm i -g turbo && \ 
turbo prune shop --docker

FROM base as builder
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm i

COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm turbo build --filter=shop && \ 
pnpm prune --prod

FROM node:22-alpine as exec

WORKDIR /app

COPY --from=builder /app .

EXPOSE 9000

CMD node apps/shop/dist/main.js
