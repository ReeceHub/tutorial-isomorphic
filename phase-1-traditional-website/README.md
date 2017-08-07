# Phase 1 - Build a traditional website

## Getting started

As in every phase we will use this directory as working directory.
We're going to create a docker compose file and the minimal folder structure.

### Create the host folder for our project

``` shell
# execute on the host
mkdir frontend
```
I plan to use multiple docker containers and this will be our frontend
application container.


### Create Docker file
[reference](https://docs.docker.com)

Create a file called `frontend/Dockerfile`.

``` Dockerfile
FROM node:alpine

ENV SRC_PATH=/usr/src/frontend
ENV BUILD_PATH=/var/lib/frontend
ENV EXPOSED=8080
EXPOSE $EXPOSED

RUN mkdir -p $SRC_PATH
RUN mkdir -p $BUILD_PATH
RUN ln -s $SRC_PATH/node_modules/ $BUILD_PATH/node_modules

WORKDIR $SRC_PATH

CMD ["ash"]
```

### Create Docker Compose file

[reference](https://docs.docker.com/compose/)

Create a docker compose file: `docker-compose.yml`

``` yaml
version: "3"
services:
  tutorial-frontend:
    container_name: tutorial-frontend
    image: tutorial-frontend
    build:
      context: frontend/
    ports:
      - "8080:8080"
    volumes:
      - "data:/usr/src/frontend/node_modules"
      - "./frontend:/usr/src/frontend"
volumes:
  data:
```

### Build our very first image

``` shell
# execute on the host
docker-compose build
```

### Start our container

``` shell
# execute on the host
docker-compose run --service-ports --rm tutorial-frontend ash
```

At this point we have an up and running node environment.
Let's test the following commands just to understand which version of
NodeJS we have.

``` bash
# execute inside the container
node --version
# output: v8.1.3

npm --version
# output: 5.0.3
```

If you see a version which is older than those, please pull the
latest `alpine:node` and build your `tutorial-frontend` image again.

``` bash
# execute on the host
docker pull node:alpine
```

Every command from this point will be executed inside the docker container
that we've just started.

### Create our project

In this section we will create a `package.json` file which contain information
about our project including the dependencies.

With the following command you can create the `package.json`. If you omit the
`-y` flag `npm` will ask a few question about the project.

``` bash
# execute inside the container
npm init -y
```

Since we've mapped our local folder to the working directory inside our
container we can see and edit the files outside.

## Create a static website

In this section we are going to create a simple
(Express)[https://expressjs.com/] web server which only suppose to serve
our static HTML files and the related resources.

### Install express js via npm

``` bash
# execute inside the container
npm install --save express
```
The command above install the web application framework and also save
the dependency in our project `package.json` file.

### Build our first website

First thing to do is create a folder our publicly available files and copy
those resources there.

``` bash
# execute on the host

# Create a folder for public files
mkdir -p frontend/public

cp -R ../html/* frontend/public/
```

Now we are going to create the server code.

``` bash
# execute on the host
mkdir -p frontend/server
```

Create a file inside our `server` folder, called `serve.js`.

``` javascript
const express = require('express');
const app = express();

app.use(express.static('public'));

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
});
```

### Let's do a manual test

``` bash
# execute inside the container
node server/serve.js
```

Click on the following link: http://localhost:8080/

That's great that works ;)

The last missing step which come very handy later is tweak our `package.json`
to manage the application startup. Replace the dummy test script with
something more useful (at the moment)

``` diff
  "scripts": {
-    "test": "echo \"Error: no test specified\" && exit 1"
+    "start": "node server/serve.js"
  },

```

Repeat our manual test:

``` bash
# execute inside the container
npm run start
```

## Use greater JavaScript

Let's modify our javascript server code a bit.

``` diff
- const express = require('express');
+ import express from 'express';
+
const app = express();

app.use(express.static('public'));

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
});
```

if we restart our server application it will fail to start.

``` bash
# execute inside the container
npm run start
```

### Install babel to compile our code

[Babel](http://babeljs.io) is a pluggable javascript compiler.
You could read more [about babel plugins](http://babeljs.io/docs/plugins/).

``` shell
# execution inside the container
npm install --save babel-cli babel-preset-env babel-preset-stage-0
```

If we change the `package.json` file again, we can use babel.


``` diff
  "scripts": {
-    "start": "node server/serve.js"
+    "start": "babel-node server/serve.js"
  },
```

Start the server again and see what we have on http://localhost:8080/

``` bash
# execute inside the container
npm run start
```

However it's already good enough, we have to make sure we can use every
feature that we want. So add a babel configuration to our project
configuration.

"babel": {"presets": ["env", "stage-0"]}
``` diff
  "scripts": {
    "start": "babel-node server/serve.js"
  },
+  "babel": {"presets": ["env", "stage-0"]},
```

We will improve that configuration later.




**FROM THIS POINT HAVE TO BE REORDERED**



We have to install [Babel](http://babeljs.io) to be able to compile our code.

## Create the working environment

### We would like to use the latest javascript features, so install babel

[Babel](http://babeljs.io) is a pluggable javascript compiler.
You can read more [about babel plugins](http://babeljs.io/docs/plugins/).

``` shell
# execution inside the container
npm install --save babel-cli babel-preset-env babel-preset-stage-0
```

The command above puts all of those dependencies to our `package.json` file.
Through the tutorial we will install more babel plugins, but this will
be enough to start our project.

Add a new section into `package.json` which will contain our babel
configuration.

``` json
"babel": {"presets": ["env", "stage-0"]}
```

_Note:_ You should be careful heavily rely on `stage-0` preset as it is very
unstable, and it is likely to change in the future.

### Install Webpack

In this tutorial I use [Webpack](https://webpack.js.org)
to build each small code fragments together. Webpack use different loaders
and plugins to collect files and place to their destination bundled.

``` shell
# execution inside the container
npm install --save webpack babel-loader
```


## Make our website

### Create the project folder structure

``` shell
# execute on the host

# Create a folder for support files
mkdir frontend/develop

# Create a folder for the server side code
mkdir frontend/server

# Create a folder for public files
mkdir frontend/public
```

Copy everything from the [html](../html) folder to our public directory.

``` shell
# execute on the host
cp -R ../html/* frontend/public/
```

### Create our server

Create a file inside the server folder: `start.js`

``` javascript

```

