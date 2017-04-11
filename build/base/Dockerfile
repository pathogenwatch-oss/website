FROM node:7.4.0-alpine

RUN apk add --update --no-cache --virtual build-deps \
      autoconf \
      automake \
      file \
      g++ \
      gcc \
      git \
      gsl-dev \
      libtool \
      linux-headers \
      make \
      python \
      zlib-dev && \
    git clone --depth 1 --branch alpine https://gitlab.com/cgps/mash/capnproto.git /capnproto && \
      cd /capnproto/c++ && \
      autoreconf -i && \
      ./configure --enable-shared CXXFLAGS=-fPIC && \
      make -j6 check && \
      make install && \
      cd / && \
      rm -rf /capnproto && \
    git clone --depth 1 --branch v1.1.1-patch https://gitlab.com/cgps/mash-original.git /mash-original && \
      cd /mash-original && \
      ./bootstrap.sh && \
      ./configure CXXFLAGS=-fPIC && \
      CPPFLAGS="-fPIC" make && \
      make install && \
    apk del --purge build-deps
