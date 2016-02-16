---
layout: post
title:  "Plugins - Not Just For Policies Anymore"
date:   2015-07-24 14:10:10
author: eric_wittmann
categories: api-manager api-gateway plugins development maven
newUrl: 2015-07-24-plugin-components-redux
---

As you may know, apiman has long supported custom policies provided by users.  If you
aren't familiar with apiman plugins, you can find more about them by [clicking here](http://www.apiman.io/blog/plugins/policies/development/maven/2015/03/06/custom-policies.html).

As of version 1.1.5.Final, plugins are now even more useful.  You can provide custom
implementations of various core apiman system components via plugins.  This allows users
to customize apiman easily, without any changes to the classpath and without rebuilding
the core apiman application.

In this blog post I'll explain how it works.

<!--more-->

## Review: What is a plugin?
First, here are some good resources you can use to learn more about apiman plugins:

* [Customizing JBoss apiman Through Policy Plugins](http://www.apiman.io/blog/plugins/policies/development/maven/2015/03/06/custom-policies.html)
* [apiman Developer Guide: Plugins](http://www.apiman.io/latest/developer-guide.html#_plugins)

No patience to read those links?  That's OK - I'll give you a quick breakdown.

An apiman plugin is basically a WAR file with one additional required file.  The additional
file is `META-INF/apiman/plugin.json` and it contains some meta-data about the plugin.  An
example of a plugin.json file (from the JSONP policy plugin):

{% highlight json %}
{
  "frameworkVersion" : 1.0,
  "name" : "JSONP Policy Plugin",
  "description" : "This plugin turns an endpoint into a JSONP compatible endpoint.",
  "version" : "1.1.5.Final"
}
{% endhighlight %}

We chose WAR as the plugin format because it allows all of the file types we need, it
is a well-known structure, and it's easy to create (e.g. via maven).

When contributing a custom apiman component via a plugin, all you need is the `plugin.json`
file and the java class file(s) that implement the appropriate component interface.  Of
course, because a plugin is a WAR, you can also include any library dependencies your 
component might need.


## What are these components are you talking about?
apiman is made up of a number of components that work together to accomplish the goal of
API Management.  There are two primary pieces of the apiman story:

* API Manager
* API Gateway

Each of these consists of its own components.  For example, the API Manager is made up of
the following (not necessarily an exhaustive list):

* Storage Component
* Query Component
* IDM Component
* Metrics Accessor Component (consumes metrics data)

On the other hand, the API Gateway consists of a separate set of components, such as:

* Configuration Registry
* Rate Limiting Component
* Shared State Component
* Metrics Component (produces metrics data)

By default, the apiman quickstart uses default values for all of these, resulting in
a stable, working system with the following characteristics:

* Stores API Manager data in a JDBC database
* Records and queries metrics data via Elasticsearch
* Stores Gateway configuration information in Infinispan
* Uses infinispan to share rate limiting state across gateway nodes

There are alternative configurations of apiman that you can use without needing to
resort to plugins.  For example, we provide Elasticsearch implementations of many of
the components mentioned above.  So you could easily switch from Infinispan to ES in
the Gateway, if you wanted.  However, if you wish to provide a custom implementation
of something, plugins are now the way to go!


## Example Scenario
There is a lot you can do now that we support plugin components.  But it's probably
easiest to explain and understand if we take a simple example scenario.

### Use mongodb to store Gateway configuration information
If you download the apiman quickstart, the default configuration is to use the built
in WildFly 8 infinispan subsystem to store the API Gateway configuration info.  This
includes all services published to the Gateway, and all applications registered with
it as well.  Perhaps you would rather that data be stored in mongodb?  Since we don't
have a mongodb implementation of the Gateway Registry, you'll need to implement it
yourself and bundle it up into a plugin!

### Create a apiman-gateway-mongodb plugin
I won't go through the entire process of creating an apiman plugin here, since it is
already well documented (and linked above).  You'll need a WAR maven project with a
`plugin.json` file in the right place, which might look something like this:
 
{% highlight json %}
{
  "frameworkVersion" : 1.0,
  "name" : "mongodb plugin",
  "description" : "This plugin provides a mongodb implementation of the Gateway registry.",
  "version" : "1.0"
}
{% endhighlight %}

You will also need an implementation of the Gateway's `io.apiman.gateway.engine.IRegistry`
interface.  Let's call it `MongoDbRegistry.java`:

{% highlight java %}
package org.example.apiman.gateway;

import io.apiman.gateway.engine.async.IAsyncResultHandler;
import io.apiman.gateway.engine.beans.Application;
import io.apiman.gateway.engine.beans.Service;
import io.apiman.gateway.engine.beans.ServiceContract;
import io.apiman.gateway.engine.beans.ServiceRequest;

import java.util.Map;

/**
 * An implementation of the {@link IRegistry} interface using mongodb.
 */
public class MongoDbRegistry implements IRegistry {

    /**
     * Constructor.
     * @param config
     */
    public MongoDbRegistry(Map<String, String> config) {
        super(config);
    }

    /**
     * @see io.apiman.gateway.engine.IRegistry#getContract(io.apiman.gateway.engine.beans.ServiceRequest, io.apiman.gateway.engine.async.IAsyncResultHandler)
     */
    @Override
    public void getContract(ServiceRequest request, IAsyncResultHandler<ServiceContract> handler) {
        // TODO Auto-generated method stub
    }

    /**
     * @see io.apiman.gateway.engine.IRegistry#publishService(io.apiman.gateway.engine.beans.Service, io.apiman.gateway.engine.async.IAsyncResultHandler)
     */
    @Override
    public void publishService(Service service, IAsyncResultHandler<Void> handler) {
        // TODO Auto-generated method stub
    }

    /**
     * @see io.apiman.gateway.engine.IRegistry#retireService(io.apiman.gateway.engine.beans.Service, io.apiman.gateway.engine.async.IAsyncResultHandler)
     */
    @Override
    public void retireService(Service service, IAsyncResultHandler<Void> handler) {
        // TODO Auto-generated method stub
    }

    /**
     * @see io.apiman.gateway.engine.IRegistry#registerApplication(io.apiman.gateway.engine.beans.Application, io.apiman.gateway.engine.async.IAsyncResultHandler)
     */
    @Override
    public void registerApplication(Application application, IAsyncResultHandler<Void> handler) {
        // TODO Auto-generated method stub
    }

    /**
     * @see io.apiman.gateway.engine.IRegistry#unregisterApplication(io.apiman.gateway.engine.beans.Application, io.apiman.gateway.engine.async.IAsyncResultHandler)
     */
    @Override
    public void unregisterApplication(Application application, IAsyncResultHandler<Void> handler) {
        // TODO Auto-generated method stub
    }

    /**
     * @see io.apiman.gateway.engine.IRegistry#getService(java.lang.String, java.lang.String, java.lang.String, io.apiman.gateway.engine.async.IAsyncResultHandler)
     */
    @Override
    public void getService(String organizationId, String serviceId, String serviceVersion,
            IAsyncResultHandler<Service> handler) {
        // TODO Auto-generated method stub
    }
}
{% endhighlight %}

Obviously you will want to include any mongodb client libraries you need, and then
implement the actual functionality of the class.  I leave that as an exercise for the
reader.  Note that most of the Gateway components have asynchronous APIs.  If possible
you should attempt to use asynchronous techniques when providing implementations.

### Switching to your custom implementation in apiman.properties
Now you've got a component you want to use, and it's all nicely wrapped up in a shiny
new plugin.  Your next step is to actually use it!  Using a custom component is as
simple as referencing it in the `apiman.properties` file.  You'll need to remove
this line first:

{% highlight text %}
apiman-gateway.registry=io.apiman.gateway.engine.ispn.InfinispanRegistry
{% endhighlight %}

and then add something like this:

{% highlight text %}
apiman-gateway.registry=plugin:GROUP_ID:ARTIFACT_ID:VERSION/org.example.apiman.gateway.MongoDbRegistry
{% endhighlight %}

The format of the value of `apiman-gateway.registry` is very important - when 
using a plugin you must specify the maven information of your plugin so that 
apiman can locate and download it.  See the apiman documentation for additional
details about how plugins are loaded.

Note that you can also provide configuration parameters to your component.  That
will obviously be helpful since it will probably need connection details.  So 
really your configuration might look something like this:

{% highlight text %}
apiman-gateway.registry=plugin:GROUP_ID:ARTIFACT_ID:VERSION/org.example.apiman.gateway.MongoDbRegistry
apiman-gateway.registry.mongo.host=localhost
apiman-gateway.registry.mongo.port=27017
apiman-gateway.registry.mongo.username=sa
apiman-gateway.registry.mongo.password=sa123!
apiman-gateway.registry.mongo.database=apiman
{% endhighlight %}

These configuration options will be passed to your component in its constructor if
your class has a `Map<String,String>` constructor.


## Conclusion
This is a powerful new feature for extending and customizing apiman to better suit
your needs.  Of course we will want to continue offering the most popular component
implementations as a core part of apiman.  However there will always be many more
options than we can easily implement and support.  For this reason we wanted to 
provide an easy way for users (and the apiman community at large) to contribute.

/post
