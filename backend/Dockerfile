FROM node:16-alpine

# COPY ENV VARS HERE OR USE SECRETS MANAGER

WORKDIR /app
COPY . /app/
RUN yarn install
RUN yarn prisma generate && yarn clean:zod:index

EXPOSE 5000

CMD [ "node", "./dist/main.js" ]
