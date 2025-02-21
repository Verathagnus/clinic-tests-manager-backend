FROM node:lts-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn run build && \
    yarn cache clean
EXPOSE 3000
CMD ["node", "dist/main"]