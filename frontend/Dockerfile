FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache git

COPY package*.json ./
RUN npm install

COPY . .

# Porta padrão do Expo Web
EXPOSE 8081

CMD ["npx", "expo", "start", "--web", "--non-interactive"]
