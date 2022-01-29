# First, we build our app to be compiled as Javascript
FROM node:16.9.1-alpine as build-container
WORKDIR /usr/app
COPY ["package.json", "package-lock.json", "tsconfig.json", "./"]
RUN npm ci
COPY . .
RUN npm run build

# Now, we create a secondary container, to be used in production
FROM nginx as production-container
COPY nginx_config/nginx.conf /etc/nginx/nginx.conf
COPY nginx_config/default.conf /etc/nginx/conf.d/default.conf
WORKDIR /var/www/html
COPY --from=build-container /usr/app/dist .
RUN chown nginx:nginx /var/www/html
COPY ./env.sh /var/www/html/src/
COPY ./entrypoint.sh /var/www/html
RUN ["chmod", "+x", "./entrypoint.sh"]
CMD ["./entrypoint.sh"]
