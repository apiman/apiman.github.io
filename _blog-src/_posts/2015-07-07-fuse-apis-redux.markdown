---
layout: post
title:  "Manage Fuse APIs with apiman"
date:   2015-07-07 15:15:15
author: sbunciak
categories: api management jboss fuse
oldUrl: 2015-07-07-fuse-apis
---

This article aims to provide a short guide on how to get API Management capabilities provided by apiman to work with JBoss Fuse, a lightweight, flexible, integration platform that is based on [Apache Camel](http://camel.apache.org), an implementation of many of the most commonly used enterprise integration patterns (EIP).

<!--more-->

Creating API provider in JBoss Fuse
====================================

The following few steps should quickly get you started with deploying applications into JBoss Fuse. For demonstration purposes I'm using a sample REST application (quickstart) shipped along with Fuse installation. For more information about developing applications for JBoss Fuse inspect the [developer materials](http://www.jboss.org/products/fuse/developer-materials/#!project=fuse) and other [resources](http://www.jboss.org/products/fuse/resources/) at jboss.org.

### Installation 
To obtain a distribution of JBoss Fuse please visit the JBoss Fuse [download page](http://www.jboss.org/products/fuse/download/).
Installation of JBoss Fuse is very simple, as the only thing you need to do is to unzip the distribution, e.g. 

{% highlight sh %}
unzip jboss-fuse-full-6.2.0.redhat-133.zip
{% endhighlight %}

You might also want to enable the default admin user by uncommenting the last line in `<fuse_dir>/etc/users.properties`. Without a user configured you won't be able to log into Fuse management console.

### Server startup

To start Fuse simply execute the following command from `<fuse_dir>/bin`:

{% highlight sh %}
./fuse
{% endhighlight %}

Once JBoss Fuse is loaded proceed by creating a new Fuse Fabric instance. To do that execute `fabric:create` command from Fuse CLI:

{% highlight sh %}
JBossFuse:karaf@root> fabric:create
{% endhighlight %}

After Fuse Fabric is up and running, log into Hawt.io management console, it should be by default available at [http://localhost:8181](http://localhost:8181). 
In Fabric perspective, under Containers tabs click on the _Create_ button to open the _Create New Container form_. 

![List of Fabric containers](/blog/images/2015-07-07/fabric.png)

On the _Create New Container_ page fill in the name you wish to use for your container (e.g. my-rest-container) and be sure to select the 'rest' profile for it. This will ensure that Fabric pickups the REST Quickstart and deploys it to this container. Finish the operation by hitting the _Create and start container_ button.

![Create Fabric Container](/blog/images/2015-07-07/container.png)

The container should start automatically right after it has been created and the REST endpoint should become available. If not, select the appropriate container and hit Start. 
You can inspect all the APIs deployed to your Fuse Fabric instance by clicking on _APIs_ section under the _APIs_ tab. 
Note the _Location_ field - that's the **base url** the for endpoint implementation. We will use it later in the apiman manager.

![APIs deployed to Fuse Fabric](/blog/images/2015-07-07/services.png)

There is a default user preconfigured so you can verify if the application was successfully deployed. It's available at `<location>/customerservice/customers/123` (e.g. [http://localhost:8182/cxf/crm/customerservice/customers/123](http://localhost:8182/cxf/crm/customerservice/customers/123))

{% highlight xml %}
[sbunciak@sbunciak ~]$ http http://localhost:8182/cxf/crm/customerservice/customers/123
HTTP/1.1 200 OK
Content-Type: application/xml
Date: Tue, 07 Jul 2015 22:17:13 GMT
Server: Jetty(8.1.17.v20150415)
Transfer-Encoding: chunked

<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ns0:Customer xmlns:ns0="http://rest.fabric.quickstarts.fabric8.io/">
    <ns0:id>123</ns0:id>
    <ns0:name>John</ns0:name>
</ns0:Customer>
{% endhighlight %}

Configure apiman to manage Fuse endpoint
========================================

To install the latest version of apiman follow this [guide](http://www.apiman.io/latest/download.html). The installation process is again very simple, all you need to do is to extract the apiman overlay zip on top of [Wildly 8](http://www.wildfly.org/) server.

After completing the installation, start apiman by executing the following command from `<wildfly>/bin` folder:

{% highlight sh %}
./standalone.sh -c standalone-apiman.xml
{% endhighlight %}

### Quick public API setup

For demonstration purposes I'll be creating a Public API, however in real life you might want to configure different plans, various contracts, etc. 
Please consult the apiman [user guide](http://www.apiman.io/latest/user-guide.html) for more details.

In order to manage APIs in apiman you need to create a new Organization to which your APIs will belong. 
You can do that easily in apiman manager, typically available at: [http://localhost:8080/apimanui](http://localhost:8080/apimanui).

Once logged into the apiman manager, locate the Organizations sections on the initial page, select _Create a New Organization_ link, provide a name and hit _Create Organization_ button. This will take you to organization details page where you can create a new API by clicking on _New API_ button under _APIs_ tab:

![Image: Create API](/blog/images/2015-07-07/API.png)

You will be asked to provide a name and a version for this API. Once the API is successfully created there are few things remaining before you can publish and start using it. 
First, you need to provide an implementation base url on the _Implementation_ tab. Use the base URL of the REST Quickstart and save your changes:

![Image: Provide Endpoint Implementation](/blog/images/2015-07-07/implementation.png)

Second, you may want to apply some policies to this Public API. To do that, go to the Policies tab and configure a policy of your choice. 
I used the Rate Limiting policy to limit usage of this API to 5 per minute:

![Image: Assign policy](/blog/images/2015-07-07/policy.png)

Now you are all set to make the API public by checking _Make this API public_ under _Plans_ tab, saving the changes and clicking the _Publish_ button (which should be now enabled).

![Image: Publish API](/blog/images/2015-07-07/publish.png)

After you have published the API, have a look at the _Endpoint_ tab to look up the URL to be used to invoke this public API:

![Image: Managed API Endpoint](/blog/images/2015-07-07/endpoint.png)

Testing your setup
==================

Depending on which policy you assinged to the Public API you might experience different behavior. However, if you followed the tutorial and assigned the Rate Limiting policy after reaching the maximum number of allowed requests you will get an output similar to:

* First request should succeed:

{% highlight xml %}
[sbunciak@sbunciak ~]$ http https://localhost:8443/apiman-gateway/CustomerOrganization/CrmRestApi/1.0/customerservice/customers/123 --verify=no
HTTP/1.1 200 OK
Connection: keep-alive
Content-Type: application/xml
Date: Tue, 07 Jul 2015 21:01:02 GMT
Server: Jetty(8.1.17.v20150415)
Transfer-Encoding: chunked
X-Powered-By: Undertow/1
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 4
X-RateLimit-Reset: 57

<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ns0:Customer xmlns:ns0="http://rest.fabric.quickstarts.fabric8.io/">
    <ns0:id>123</ns0:id>
    <ns0:name>John</ns0:name>
</ns0:Customer>
{% endhighlight %}

* Executing 5 consecutive requests should fail with `HTTP 429 Too Many Requests`:

{% highlight sh %}
[sbunciak@sbunciak ~]$ http https://localhost:8443/apiman-gateway/CustomerOrganization/CrmRestApi/1.0/customerservice/customers/123 --verify=no
HTTP/1.1 429 Too Many Requests
Connection: keep-alive
Content-Length: 176
Content-Type: application/json
Date: Tue, 07 Jul 2015 21:00:51 GMT
Server: WildFly/8
X-Policy-Failure-Code: 10005
X-Policy-Failure-Message: Rate limit exceeded.
X-Policy-Failure-Type: Other
X-Powered-By: Undertow/1
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 8

{
    "failureCode": 10005, 
    "headers": {
        "X-RateLimit-Limit": "5", 
        "X-RateLimit-Remaining": "0", 
        "X-RateLimit-Reset": "8"
    }, 
    "message": "Rate limit exceeded.", 
    "responseCode": 429, 
    "type": "Other"
}
{% endhighlight %}
