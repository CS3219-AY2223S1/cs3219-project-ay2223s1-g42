FROM node:16-alpine
# FROM gcr.io/google-appengine/nodejs
# RUN install_node v16

# COPY ENV VARS HERE OR USE SECRETS MANAGER

WORKDIR /app
COPY . /app/
RUN yarn install
RUN yarn prisma generate && yarn clean:zod:index

EXPOSE 8080

CMD [ "node", "./dist/main.js" ]
