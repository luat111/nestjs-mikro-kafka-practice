FROM node:16 as build

WORKDIR /app/spec-backend

COPY . .

RUN npm install && \
    npm run build


FROM alpine:3.16 as main

ENV NODE_VERSION 16.16.0

RUN apk update && \
    apk add nodejs \
    npm

COPY --from=build /app/spec-backend /

EXPOSE 3003

# npm run migration:create && \
CMD npm run migration:up && \
    npm start