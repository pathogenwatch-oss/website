FROM registry.gitlab.com/cgps/wgsa-middle-end/base:v2

RUN apk add --update --no-cache gsl

COPY . /opt/wgsa/middle-end

RUN apk add --update --no-cache --virtual build-deps \
      g++ \
      make \
      gsl-dev \
      python \
      zlib-dev && \
    cd /opt/wgsa/middle-end/ && \
      npm rebuild && \
    apk del --purge build-deps

ENV NODE_PATH=/opt/wgsa/middle-end/src \
    NODE_ENV=production

WORKDIR /opt/wgsa/middle-end

CMD [ "node", "start.js", "--seneca.log.quiet" ]
