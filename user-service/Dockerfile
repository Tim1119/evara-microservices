FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY tsconfig.json ./

RUN npm install -D typescript @types/node @types/express @types/bcryptjs @types/jsonwebtoken ts-node

COPY src ./src

RUN npm run build

RUN npm prune --production

RUN chown -R nodeuser:nodejs /app
USER nodeuser

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/auth/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

CMD ["npm", "start"]

