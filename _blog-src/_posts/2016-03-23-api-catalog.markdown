---
layout: post
title:  "Import APIs Into Apiman (API Catalog)"
date:   2016-03-23 10:30:00
author: eric_wittmann
categories: apiman 1.2.x manager catalog
---
One of the less enjoyable aspects of apiman is the manual addition of an API
that you wish to manage.  And if you have a bunch of APIs you want to manage,
you can either use the apiman REST interface to script the creation of them,
or else you're stuck manually entering them into the UI.

However, if you take advantage of the new API Catalog feature, things might
get a lot easier!

<!--more-->

## Why Import an API?
By using the new API Manager to import an API rather than manually creating it
(typically via the "New API" button in the UI) you can more quickly and 
accurately add an API to apiman.  Importing an API from the API Catalog means
that it will be created in apiman pre-configured with the endpoint information
and some other relevant details.  This can obviously save you some time, and 
make the process of managing your APIs a bit more streamlined.

## Browsing the API Catalog
The long-term goal for importing APIs is to be able to import from multiple 
different sources, including:

* Swagger
* WADL
* RAML

However, we currently only support importing APIs from an apiman API Catalog.
I'll talk more about how to configure the API Catalog later in this post.
First, let's focus on how to use the API Catalog.

The most user-friendly way to use the API Catalog is to browse it!  This can
easily be done by clicking the "Browse available/importable APIs" link on the
API Manager's dashboard page.

![Image: Dashboard - Browse APIs](/blog/images/2016-03-23/dash-catalog.png)

Once you click that link, you'll be taken to the (very nice!) API Catalog
Browser UI page.  Have a look, it's actually pretty slick:

![Image: API Catalog Browser](/blog/images/2016-03-23/api-catalog.png)

From this UI, you can filter the APIs available to be imported, find the
one you want, and easily Import it into one of your Organizations.  You can
easily filter by name, type, or tag - the hope is that you can quickly find
the API you want to import.  Once you are ready, simply click the *Import*
button on the API card, which will result in the following dialog:

![Image: Import API](/blog/images/2016-03-23/import-api.png)

After completing the information in the dialog, the API will be imported
and you will be redirected to the newly imported API.

## Importing Multiple APIs
Another way to import APIs from the API Catalog is to use the Import API(s)
Wizard interface.  You can access the Import API(s) Wizard by clicking on the
*Import API(s)* button from within a particular Organization:

![Image: Import APIs](/blog/images/2016-03-23/import-apis-btn.png)

This wizard will allow you to import multiple APIs into a single Organization.
Follow the wizard's steps to find the APIs, choose them, configure some
settings, and then import them.  Here are some screenshots, since pictures
are more powerful than words (although the pictures do contain some words):

![Image: Import APIs](/blog/images/2016-03-23/import-api-wizard-1.png)

![Image: Import APIs](/blog/images/2016-03-23/import-api-wizard-2.png)

![Image: Import APIs](/blog/images/2016-03-23/import-api-wizard-3.png)

![Image: Import APIs](/blog/images/2016-03-23/import-api-wizard-4.png)

As you can see, the Import APIs Wizard is a nice way to find and import
multiple APIs all at the same time, all into the same Organization.

## Customizing the API Catalog
At this point you may be asking yourself how *your* APIs might come to be
listed in the API Catalog, rather than Flickr and Facebook.  That's a great
question, and we actually have two answers to it.  First, you can provide
a simple JSON file that contains all of the APIs in your enterprise (along
with optionally any other external APIs you might want to potentially 
import).  Second, you can actually provide a fully custom implementation of
the apiman *IApiCatalog* java interface and contribute it via an apiman
plugin!

### Providing a Custom API Catalog File
The easiest way to include your own APIs into the catalog is to provide 
your own custom API Catalog JSON file.  The default API Catalog implementation
simply reads the API information from a JSON file (with a custom format
specific to apiman).  An example of the format of this file can be found
here:

https://raw.githubusercontent.com/apiman/apiman-api-catalog/master/catalog.json

Once you create your own file, you will need to make it available to apiman
by configuring it in the *apiman.properties* file:

```
apiman-manager.api-catalog.type=io.apiman.manager.api.core.catalog.JsonApiCatalog
apiman-manager.api-catalog.catalog-url=https://rawgit.com/apiman/apiman-api-catalog/master/catalog.json
```

Simply update the *apiman-manager.api-catalog.catalog-url* property to provide
a URL to your custom file.

### Implementing Your Own API Catalog Plugin
Providing your own JSON file is fine, but it's very static and doesn't work
well if you are often introducing new APIs.  Instead, you may want to implement
your own API Catalog implementation and bundle it up into an apiman plugin.
This approach will let you return the list of APIs from dynanmic sources such
as API Registries (e.g. UDDI or perhaps something more platform-specific like
kubernetes).

To do this, it's probably best to read up on the existing apiman documentation
about how to create and contribute a plugin:

* [Developer Guide: Creating a Plugin](http://www.apiman.io/latest/developer-guide.html#_creating_a_plugin)
* [Developer Guide: Contributing a Core Component](http://www.apiman.io/latest/developer-guide.html#_contributing_a_core_component)

The component you will want to customize is *IApiCatalog*, which can be found here:

[IApiCatalog Java Interface](https://github.com/apiman/apiman/blob/master/manager/api/core/src/main/java/io/apiman/manager/api/core/IApiCatalog.java)

Create an implementation of that interface, bundle it up in your custom plugin,
and then configure apiman to use your implementation by modifying the right 
properties in the *apiman.properties* file:

```
apiman-manager.api-catalog.type=plugin:GROUP_ID:ARTIFACT_ID:VERSION/org.example.apiman.plugins.catalog.MyCustomApiCatalog
apiman-manager.api-catalog.my-property=value-1
```

## Conclusion
The API Catalog is a great way to make it easier for your API Providers to quickly
and accurately get APIs added to apiman, without using the apiman REST interface to
do it programmatically.  There is a tremendous opportunity to integrate the API
Catalog with your API registry, if you have one, or to simply provide a JSON file 
with information about all your deployed APIs!

This feature will be introduced as of version *1.2.3.Final*, which should be released
tomorrow!

/post
