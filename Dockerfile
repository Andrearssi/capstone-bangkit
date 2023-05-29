FROM node:18.2.0-buster-slim
LABEL maintainer="Andrea Rossi andrearssi@gmail.com"

# RUN apk add git
# RUN git config --global url."https://".insteadOf git://

WORKDIR /app 
COPY ./backend .
COPY ./frontend ./frontend
RUN mkdir public

# === BASIC ENVIRONMENT === #
ENV CI_CD=true

# 🌊 Install Dependencies & ⚒️ Build
RUN yarn install:fe
RUN yarn build:fe
RUN yarn install

# 💯 Last Configuration
RUN sed -i 's/localhost/host.docker.internal/g' .env

# 🚀 Finish !!
EXPOSE 5000
ENV NODE_ENV=development
CMD ["yarn", "start"]