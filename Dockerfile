FROM ubuntu:20.04 AS package-json

RUN apt update -qy && apt install -qy jq

COPY package.json /root/package.original.json
RUN jq -rSc '{ dependencies: .dependencies, devDependencies: .devDependencies}' /root/package.original.json > /root/package.json

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 


FROM node:12.13.1-alpine AS middle-end

ARG REPO_USER

ARG REPO_TOKEN

RUN apk add --update --no-cache \
      g++ \
      make \
      git \
      python

RUN git config --global url.https://$REPO_USER:$REPO_TOKEN@gitlab.com/.insteadOf git://gitlab.com/ && \
    git config --global url.https://$REPO_USER:$REPO_TOKEN@gitlab.com/cgps.insteadOf git@gitlab.com:cgps && \
    git config --global url.https://$REPO_USER:$REPO_TOKEN@gitlab.com/cgps/.insteadOf ssh://git@gitlab.com/cgps/ && \
    git config --global url.https://$REPO_USER:$REPO_TOKEN@gitlab.com/cgps/.insteadOf https://gitlab.com/cgps/

WORKDIR /pathogenwatch/

COPY yarn.lock /pathogenwatch/yarn.lock
COPY --from=package-json /root/package.json package.json

RUN yarn --production

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 

FROM middle-end AS front-end

RUN yarn # installs dev dependencies

COPY . /pathogenwatch/

RUN yarn build # runs webpack build

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 

FROM node:12.13.1-alpine

WORKDIR /pathogenwatch/

ENV NODE_PATH=/pathogenwatch/src \
    NODE_ENV=production

COPY . /pathogenwatch/

COPY --from=middle-end /pathogenwatch/node_modules /pathogenwatch/node_modules

COPY --from=front-end /pathogenwatch/public /pathogenwatch/public
COPY --from=front-end /pathogenwatch/assets.json /pathogenwatch/assets.json

CMD [ "node", "start.js", "--seneca.log.quiet" ]
