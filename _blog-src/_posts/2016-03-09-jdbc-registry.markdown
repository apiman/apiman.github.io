---
layout: post
title:  "Storing Your Gateway Config in a Database"
date:   2016-03-09 09:30:00
author: eric_wittmann
categories: apiman 1.2.x gateway jdbc registry
---

One of the strongest features of apiman, in general, is its excellent
extensibility.  Not only is it easy to add new policies, for example,
but many of its core components are also pluggable.  This includes, 
for example, the registry used by the API Gateway to store configuration
information published to it by the manager.  This blog post will detail
a new JDBC based implementation of that registry, explaining how you can
store that information in a Database instead of in Elasticsearch (the
default setting).

<!--more-->

## Why Use a Database Instead of Elastic?
You may or may not be wondering why this is important.  Some users may
not be comfortable storing persistent data in Elasticsearch.  Or perhaps
a user doesn't want to create a production deployment of Elasticsearch 
at all and would prefer alternatives for each of the various Gateway
components that currently uses it.  For these reasons (or others), we
now (as of version 1.2.2.Final) have a JDBC implementation of the 
API Gateway registry!

Read on to learn how to use it!

## Setting Up the Database
First it's important to note that the Gateway registry JDBC implementation
does *not* leverage JPA.  Instead we use JDBC directly (with a little 
help from Apache's dbutils library) to store the data in the database
and query it again.  For this reason, you will absolutely need to create
your database and then configure it using one of the provided DDLs.

You can find the DDLs included in the apiman distribution in the following
directory:

{% highlight text %}
$WILDFLY_ROOT/apiman/ddls/apiman-gateway*.ddl
{% endhighlight %}

We include DDLs for the following databases:

* MySQL
* PostgreSQL
* Oracle
* H2

Simply create a new database using tools that are appropriate to the
type you are using (e.g. you can use the MySQL Workbench).  Then execute
the DDL appropriate to your database type, so that all the correct 
tables and indexes are created.

## Configuring Apiman to Use It
Once the database is created, you will need to make some configuration
changes in apiman so that the Gateway will connect to the database and store
information there instead of Elasticsearch.  There are two files that need
to be created/modified to make this happen.

### Creating a Datasource
First, you will need to create a Datasource using whatever is appropriate
for the platform you are running apiman on.  This will differ, for example,
if you are running apiman on Tomcat rather than Wildfly or EAP.  Here are
some documentation resources that may be helpful when creating a Datasource
for your preferred runtime platform:

* [Wildfly 10](https://docs.jboss.org/author/display/WFLY10/DataSource+configuration)
* [Apache Tomcat 8](https://tomcat.apache.org/tomcat-8.0-doc/jndi-resources-howto.html#JDBC_Data_Sources)

Make sure you download and install the JDBC driver for your database, and
also make sure that you know the JNDI location of the datasource you wish
to use.

### Tweaking apiman.properties
Finally, you have everything you need to now configure apiman to use the
database.  You simply need to change some properties in *apiman.properties* 
and you'll be good to go!

Specifically, you need to change the configuration of the Gateway Registry.
The default settings in 1.2.2.Final for the Gateway Registry look like this:

{% highlight text %}
apiman-gateway.registry=io.apiman.gateway.engine.es.PollCachingESRegistry
apiman-gateway.registry.client.type=jest
apiman-gateway.registry.client.protocol=${apiman.es.protocol}
apiman-gateway.registry.client.host=${apiman.es.host}
apiman-gateway.registry.client.port=${apiman.es.port}
apiman-gateway.registry.client.initialize=true
apiman-gateway.registry.client.username=${apiman.es.username}
apiman-gateway.registry.client.password=${apiman.es.password}
apiman-gateway.registry.client.timeout=${apiman.es.timeout}
{% endhighlight %}

All of these properties can be replaced with the following settings:

{% highlight text %}
apiman-gateway.registry=io.apiman.gateway.engine.jdbc.PollCachingJdbcRegistry
apiman-gateway.registry.datasource.jndi-location=java:jboss/datasources/apiman-gateway
{% endhighlight %}

Please note that the *apiman-gateway.registry.datasource.jndi-location* should
be set to whatever value makes sense based on the deployment/configuration of
your actual datasource.

## Conclusion
Once you have configured the API Gateway to use a database to store your 
configuration info, apiman will no longer store this type of data in 
Elasticsearch.  This is perhaps one step closer to a world where you do
not need to maintain/manager a production Elasticsearch instance.

In future posts I will show you how you can swap out other Elasticsearch
components for alternatives (e.g. Rate Limiting, Caching, etc).

/post
