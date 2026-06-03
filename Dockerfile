FROM dockerhub.datagrand.com/ci_runner/frontend_web:18.20.8

WORKDIR /app

COPY ./package.json ./.yarnrc ./yarn.lock /app/

RUN yarn config set registry https://registry.npmmirror.com/ \
    && yarn

COPY . /app/

RUN yarn build