FROM oven/bun:canary-debian

WORKDIR /app

# Install only production dependencies
COPY bun.lock package.json ./

RUN bun install --ci --frozen-lockfile --production

# Copy source
COPY tsconfig.json ./
COPY src ./src
COPY .env ./

ENV NODE_ENV=production
EXPOSE 3100

CMD ["bun", "run", "src/index.ts"]


