FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN cp .env.example .env

EXPOSE 7340

CMD ["npm", "start"]
