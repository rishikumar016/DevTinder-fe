# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable && corepack prepare pnpm@10.27.0 --activate

RUN pnpm approve-builds esbuild

RUN pnpm install --frozen-lockfile

COPY . .

ARG VITE_BASE_URL=/api
ENV VITE_BASE_URL=$VITE_BASE_URL

RUN pnpm build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
