FROM node:16-alpine

# COPY ENV VARS HERE OR USE SECRETS MANAGER

WORKDIR /app
COPY . /app/
RUN yarn install
RUN yarn prisma generate

EXPOSE 5000 
EXPOSE 8080 
EXPOSE 15316

CMD [ "node", "./dist/backend/src/main.js" ]
