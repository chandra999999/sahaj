FROM node:18.16.1-alpine3.18@sha256:bf6c61feabc1a1bd565065016abe77fa378500ec75efa67f5b04e5e5c4d447cd AS cache

WORKDIR /home/app
COPY package.json /home/app/
RUN npm install

FROM node:18.16.1-alpine3.18@sha256:bf6c61feabc1a1bd565065016abe77fa378500ec75efa67f5b04e5e5c4d447cd
WORKDIR /home/app
COPY package.json /home/app/
COPY . .
RUN npm install --only=production
COPY --from=cache /home/app/ /home/app/
EXPOSE 8080

ENTRYPOINT ["node", "server.js"]