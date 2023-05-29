FROM node:18.2.0-buster-slim
LABEL maintainer="Jefri Herdi Triyanto jefriherditriyanto@gmail.com"

# RUN apk add git
# RUN git config --global url."https://".insteadOf git://

WORKDIR /app 
COPY . .

# === BASIC ENVIRONMENT === #
ENV CI_CD=true

# 🌊 Install Dependencies
RUN yarn install
# RUN yarn install:fe

# ⚒️ Build
# RUN yarn build:fe

# 💯 Last Configuration
RUN sed -i 's/localhost/host.docker.internal/g' .env

# 🚀 Finish !!
EXPOSE 5000
ENV NODE_ENV=development
CMD ["yarn", "start"]