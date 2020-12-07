FROM node:12 as builder
WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:12
WORKDIR /usr/app
COPY package*.json ./
RUN npm install --production

COPY --from=builder /usr/app/dist ./dist
COPY ormconfig.js ./ormconfig.js

EXPOSE 3000
CMD [ "npm", "start" ]