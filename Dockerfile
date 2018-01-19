FROM node:8.9.4-alpine

COPY . /opt/wgsa/middle-end

RUN apk add --update --no-cache --virtual wgsa-build-deps \
      g++ \
      make \
      python && \
    cd /opt/wgsa/middle-end/ && \
      npm rebuild && \
    apk del --purge wgsa-build-deps

ENV NODE_PATH=/opt/wgsa/middle-end/src \
    NODE_ENV=production

WORKDIR /opt/wgsa/middle-end

CMD [ "node", "start.js", "--seneca.log.quiet" ]
