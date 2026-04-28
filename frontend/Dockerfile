FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Porta padrão do Expo Web
EXPOSE 8081

CMD ["npx", "expo", "start", "--web", "--non-interactive"]
