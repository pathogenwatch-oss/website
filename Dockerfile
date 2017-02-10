FROM node:7.4.0-alpine

COPY ./node_modules/mash-node-native/scripts /tmp/
RUN sh /tmp/install-build-dependencies.sh && \
    sh /tmp/install-dependencies-alpine.sh && \
    sh /tmp/remove-build-dependencies.sh

COPY . /opt/wgsa/middle-end

WORKDIR /opt/wgsa/middle-end
RUN apk add --no-cache --virtual couchbase-deps \
      python \
      && \
    sh /tmp/install-build-dependencies.sh && \
    npm rebuild && \
    sh /tmp/remove-build-dependencies.sh && \
    apk del --purge couchbase-deps && \
    rm -r /tmp

ENV NODE_PATH=/opt/wgsa/middle-end/src \
    NODE_ENV=production
CMD [ "node", "start.js" ]
