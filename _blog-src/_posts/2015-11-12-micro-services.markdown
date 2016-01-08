---
layout: post
title:  "The More You Know: apiman micro-services?"
date:   2015-11-12 13:30:00
author: eric_wittmann
categories: micro-services development
newUrl: 2015-11-12-micro-services-redux
---

Let's spend a little bit of time learning more about one of the newer ways you
can run apiman:  as a set of micro-services.

Running apiman in this way has several advantages, including (but not limited to):

* Fast startup time
* Fully decoupled
* Easily debuggable from an IDE
* Quick to test different configurations
* Independently scale (esp. via fabric8/openshift/kubernetes)

<!--more-->

On the other hand, breaking everything apart has some disadvantages as well.
Some of these include:

* Need to fire up multiple, separate Java processes
* No authentication integration with Keycloak out of the box

## What are they?
What do we mean by "apiman micro-services"?  Well, by default if you download 
apiman from the [project site](http://apiman.io/), you'll get everything delivered
to you in one convenient package.  This package extracts into an existing WildFly
installation, and thus everything runs as a web application within the application
server.  This is very convenient to evaluate the software, but it's not ideal for
development or for dockerizing.

In addition to our support for WildFly and EAP, we also now support simply running
the various components of apiman as standalone Java applications.  You can find 
the specific source modules that provide this functionality here:

* [API Manager Micro-Service (source)](https://github.com/apiman/apiman/tree/master/manager/api/micro)
* [API Gateway Micro-Service (source)](https://github.com/apiman/apiman/tree/master/gateway/platforms/war/micro)

These two modules provide Java classes which use an embedded version of Jetty to 
start up the API Manager and API Gateway as simple standalone Java processes.  Each
micro-service includes a Starter class with a Java main method.  Both micro-services
are designed to be easily extensible/customizable to fit whatever purpose or 
configuration is desired.

## How do I use them?
As I mentioned, the micro-services are intended to be extended and customized.  So
you could create a new maven project and add the specific apiman micro service
module as a dependency and then....

OK I probably lost you already.  It's actually not very hard, so here's a whole
github repository full of examples:

[https://github.com/apiman/apiman-servers](https://github.com/apiman/apiman-servers)

Each of the modules in there is a very simple pre-baked and configured micro-service
based on what apiman provides.  So for example, if you want to run an Elasticsearch
version of the API Gateway along with a Postgres version of the API Manager, you 
could follow these two sets of directions:

* [API Gateway micro-service with Elastic](https://github.com/apiman/apiman-servers/blob/master/gateway-es/README.md)
* [API Manager micro-service with Postgres](https://github.com/apiman/apiman-servers/blob/master/manager-postgres/README.md)

If you run both of these at the same time, you will end up with two entirely separate
Java processes running embedded Jetty and listening on different ports.

## What about the API Manager UI?
There are two ways you can access the API Manager User Interface.  The first is that
it's built into the API Manager micro-service!  Once you have the Manager micro-service
running, you should be able to go here:

* [http://localhost:8080/apimanui/](http://localhost:8080/apimanui/)

### Using gulp (development only)
If you're looking to use the micro-services to make it easier to do development
work on apiman, then you might find yourself needing to modify the User Interface.
You can do this by running "gulp" in the UI module of the apiman source tree:

{% highlight bash %}
$ cd ~/git/apiman/manager/ui/hawtio/
ewittman@falcon ~/git/apiman/apiman/manager/ui/hawtio
$ gulp
[14:56:29] Using gulpfile ~/git/apiman/apiman/manager/ui/hawtio/gulpfile.js
[14:56:29] Starting 'default'...
[14:56:29] Starting 'build'...
[14:56:29] Starting 'browserify'...
[14:56:29] Starting 'css'...
[14:56:29] Starting 'fonts'...
[14:56:29] Starting 'images'...
[14:56:29] Finished 'build' after 58 ms
[14:56:29] Starting 'watch'...
[14:56:29] Finished 'watch' after 10 ms
[14:56:29] Starting 'connect'...
[14:56:29] Finished 'connect' after 49 ms
[14:56:29] Finished 'default' after 126 ms
[14:56:29] Server started http://localhost:2772
[14:56:30] Finished 'css' after 589 ms
[14:56:37] Finished 'images' after 7.49 s
[14:56:41] Finished 'fonts' after 12 s
[14:56:41] Finished 'browserify' after 12 s
[14:56:41] Starting 'path-adjust'...
[14:56:41] Finished 'path-adjust' after 38 ms
[14:56:41] Starting 'clean-defs'...
[14:56:41] Finished 'clean-defs' after 7.87 ms
[14:56:41] Starting 'tsc'...
[14:56:45] Finished 'tsc' after 4.19 s
[14:56:45] Starting 'template'...
[14:56:45] Finished 'template' after 132 ms
[14:56:45] Starting 'concat'...
[14:56:45] Finished 'concat' after 72 ms
[14:56:45] Starting 'clean'...
[14:56:45] Finished 'clean' after 8.82 ms
{% endhighlight %}


Once you have the API Manager micro-service *and* gulp running, you should be
able to access the UI by going here:

* [http://localhost:2772/api-manager](http://localhost:2772/api-manager)

## Warning: Authentication
At the moment, the biggest problem with the micro-services is the issue of user
authentication.  Currently, only very simple BASIC authentication is supported.

> It's always tricky talking about authentication with apiman - but in this context
> I'm referring to authenticating into the apiman UI and REST services.  All of the
> authentication related *Policies* will work.

The micro-services allow you to specify your own users.list file, which should
include the static set of users you wish to allow access.  In the future, we will
be improving the micro-services to support other authentication mechanisms.  Note
that you can do this yourself by overriding this:

* [Gateway Micro-Service Authentication Handler+Filter](https://github.com/apiman/apiman/blob/master/gateway/platforms/war/micro/src/main/java/io/apiman/gateway/platforms/war/micro/GatewayMicroService.java#L319-L332)
* [Manager Micro-Service Authentication Handler+Filter](https://github.com/apiman/apiman/blob/master/manager/api/micro/src/main/java/io/apiman/manager/api/micro/ManagerApiMicroService.java#L192-L211)


Good luck and come find us on the mailing list or IRC if you have any trouble!

/post
