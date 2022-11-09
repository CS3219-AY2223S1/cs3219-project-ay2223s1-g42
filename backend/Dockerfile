FROM node:16-alpine

# Secrets
# Ensure that backend/.env is populated correctly

WORKDIR /app
COPY . /app/
RUN yarn install
RUN yarn prisma generate

EXPOSE 5000

CMD [ "node", "./dist/backend/src/main.js" ]
