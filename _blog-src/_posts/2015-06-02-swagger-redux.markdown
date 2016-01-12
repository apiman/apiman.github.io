---
layout: post
title:  "We got the moves like swagger!"
date:   2015-06-02 09:04:45
author: eric_wittmann
categories: api-manager swagger api ui
oldUrl: 2015-06-02-swagger
---

One of the weaknesses we've had in apiman until now is that API providers didn't have
any way to document how to consume their APIs.  Well that has all changed with version
1.1.3.Final.  Now you can upload a Swagger spec document for your API.  If you do,
consumers will be able to browse your API documentation directly in the apiman UI.

I think we can all agree that this is a welcome change and really improves the usability
of the system, particularly from the perspective of the client app developer (aka the
API consumer).

<!--more-->

## Adding an API Definition
As an API provider, the only thing you need to do is add an API definition to your
API.  This is simple - just navigate to the new "Definition" tab in your API.
There you will be able to copy/paste or drag/drop a Swagger spec.  Make sure you set the
definition type to Swagger (JSON), and don't forget to click Save!

## What is a Swagger spec?
So maybe not everyone knows what Swagger is.  Swagger is a way to formally describe a
RESTful API.  A Swagger spec is a JSON document that describes everything
about your RESTful API, including (but not limited to):

* API meta-data such as Name and Description
* Resource Paths and the Operations/Methods they support
* Input/Output types

For more information I recommend navigating to the [Swagger Project](http://swagger.io/).

## How does this help my consumers?
Once you've got a Swagger spec created and added to your API, your API
consumers will be able to browse live documentation right from the apiman UI.  This
information will be available via a new "View API Definition" link available on
the consumer's "API Details" page (the same page that consumers are shown when
they have searched for an API).  Here's an example:

![API Details](/blog/images/2015-06-02/api-details.png)

An API consumer can see that there is an API definition they can click on, which
will give them a ton of information about how to use the API.  In the future, we
plan to allow consumers to do all sorts of interesting things with the Swagger spec.
For example, we can help consumers generate a client SDK in a variety of languages.
We can also allow them to simulate API calls right from the apiman UI - so they can
see what to expect.  But for right now, we simply show live documentation about the
API as described by the Swagger spec definition:


![API Definition](/blog/images/2015-06-02/api-definition.png)


As always, thanks for making it to the end of my ramblings!

/post
