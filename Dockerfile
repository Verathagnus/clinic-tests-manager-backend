FROM node:lts-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn build && \
    yarn cache clean
EXPOSE 3000
CMD ["node", "dist/main"]
