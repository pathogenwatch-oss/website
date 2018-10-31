FROM node:8.11.1-alpine

COPY . /opt/pathogenwatch/middle-end

RUN apk add --update --no-cache --virtual pathogenwatch-build-deps \
      g++ \
      make \
      python && \
    cd /opt/pathogenwatch/middle-end/ && \
      npm rebuild && \
    apk del --purge pathogenwatch-build-deps

ENV NODE_PATH=/opt/pathogenwatch/middle-end/src \
    NODE_ENV=production

WORKDIR /opt/pathogenwatch/middle-end

CMD [ "node", "start.js", "--seneca.log.quiet" ]
