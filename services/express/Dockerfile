FROM armdocker.rnd.ericsson.se/dockerhub-ericsson-remote/node:10.20.1-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install \
&& npm cache clean --force

RUN apk --update add --no-cache openssh bash \
  && apk --update add --no-cache sshpass

RUN apk --update add python

EXPOSE 3000

CMD ["npm", "run-script", "start-dev"]
