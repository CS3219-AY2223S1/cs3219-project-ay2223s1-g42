FROM node:16-alpine

# COPY ENV VARS HERE OR USE SECRETS MANAGER

WORKDIR /app
COPY . /app/
RUN yarn install
RUN yarn prisma generate

EXPOSE 8080

CMD [ "node", "./dist/backend/src/main.js" ]
