FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install --omit=dev
COPY . .
RUN npm run build
EXPOSE 7410
CMD ["npm","start"]
