---
layout: post
title:  "The JBoss apiman API Manager REST API"
date:   2015-05-19 11:00:00
author: len_dimaggio
categories: rest api automation
oldUrl: 2015-05-19-rest-api
---

In this, the third article in our series on apiman, JBoss' new open source API Management framework, we'll examine apiman’s API Manager REST API. apiman’s Management UI utilizes this API in the implementation for all of its user-visible features, and you can also use the same API to automate tasks with apiman.

<!--more-->

## Introduction

 It's inevitable that, after you work with a product's UI for a while that you encounter tasks that are better suited to a scripting or batch interface. For example, if you have to perform a similar task for a large of related data items, the time that it can require to perform these tasks through an interactive UI can be prohibitive. Also, it's easy for repetitive tasks to become error prone as you can lose focus, even if you are working in a well designed and easy to use interface such as apiman.

One solution to this problem is to augment the UI with a command line or scripting interface. This can lead to a whole separate set of issues if the new interface is built on a different set of underlying routines than the UI. A better approach to allow access to the same routines in which the UI is constructed. This approach removes any duplication, and also enables you to replicate manual UI based tasks with automated or scripted tools.  

JBoss apiman follows this second approach with its REST interface.  All the services provided by apiman in its Management UI are directly supported in the API Manager REST API. You can also directly access these same services through the REST API.

## Prerequisites

Like a lot of things with JBoss open source software, installing the REST API is easy. In fact, if you have apiman installed, then you already have the REST API installed. (You can’t get much easier than that!)

We covered installing apiman in the first article in this series (see: http://java.dzone.com/articles/impatient-new-users), so we won't repeat that information here. A minimal set of install instructions are always available on the apiman site (http://www.apiman.io/latest/). The current set of instructions as of this writing are:

{% highlight bash %}
mkdir ~/apiman-1.1.2.Final  
cd ~/apiman-1.1.2.Final  
wget http://download.jboss.org/wildfly/8.2.0.Final/wildfly-8.2.0.Final.zip  
wget http://downloads.jboss.org/apiman/1.1.2.Final/apiman-distro-wildfly8-1.1.2.Final-overlay.zip  
unzip wildfly-8.2.0.Final.zip  
unzip -o apiman-distro-wildfly8-1.1.2.Final-overlay.zip -d wildfly-8.2.0.Final  
cd wildfly-8.2.0.Final  
./bin/standalone.sh -c standalone-apiman.xml  
{% endhighlight %}

Now that our apiman server is up and running, we can start to access the API Manager REST API. However, before we start placing calls to APIs through the REST API, let’s take a look at how the API is organized.

##The Organization of the API

The documentation for the apiman REST API is available (for free, of course), here: http://www.apiman.io/latest/api-manager-restdocs.html

The services and their endpoints represented in the API are divided into these groups:

* actions - The actions endpoint (http://localhost:8080/apiman/actions/) enables you to execute actions for apiman entities (such as plans, APIs, applications, etc.)

* system/status - The system/status endpoint (http://localhost:8080/apiman/system/status) enables you to query the current state of the apiman system.

* currentuser - The currentuser endpoint (http://localhost:8080/apiman/currentuser/info) enables you to obtain or update information about the current user. This information is related to the user’s applications, APIs, organizations, etc.

* gateways - The gateways endpoint (http://localhost:8080/apiman/gateways/) enables you to obtain information about an API Gateway, and to delete or create new gateways.

* organizations - The organizations endpoint (http://localhost:8080/apiman/organizations/) enables you to obtain information about existing organizations and to create new organizations.

* permissions - The permissions endpoint (http://localhost:8080/apiman/permissions/) enables you to obtain information about user’s permissions.

* plugins - The plugins endpoint (http://localhost:8080/apiman/plugins/) enables you to obtain information about installed plugins, and to install new plugins.

* policyDefs - The policyDefs endpoint (http://localhost:8080/apiman/policyDefs/) enables you to obtain information about existing policy definitions, and to define new policy definitions.

* roles - The roles endpoint (http://localhost:8080/apiman/roles/) enables you to obtain information about existing roles, update roles, and delete roles.

* search - The search endpoint (http://localhost:8080/apiman/search/) enables you to search for applications, organizations, or APIs.

* users - The users endpoint (http://localhost:8080/apiman/users/) enables you to search for information about users, including their applications and APIs.

Within each group, GET operations are defined to return information, and GET and POST operations are defined to make changes to apiman elements. Data passed to and returned from services through the API is in the form of JSON along with a return code.

##Accessing APIs in the API Manager REST API

 The best way to learn about the API Manager REST API is to see it in action. Since these are REST APIs, it’s easy to access them. For example, we should be able to access the system status service with a simple GET operation at this endpoint:

http://localhost:8080/apiman/system/status

Let’s try this with curl. If we execute the following command, we should see the current system status:

    curl -X GET http://localhost:8080/apiman/system/status

Well, that error is not exactly what we expected. There was no output.

What went wrong? What’s missing? The answer is that our call to the API was missing authorization. In the same way that a user must login and be authorized to use the apiman Management UI, calls to the REST API must be authorized.

For our example, we’ll keep things simple and stick to using basic authorization. (We’ll take a more extensive look at apiman and security in a later article in this series.)

In order to resolve this failure, we have to send a properly encoded basic authorization header with every request you make. In Java8, we can generate a key by base64 encoding this string for the OOTB admin username and password: admin:admin123! with this statememt:

    base64encode(concat('admin', ':', 'admin123!'))

This yields a key with a value of: YWRtaW46YWRtaW4xMjMh

Now, let’s try that curl command again, but this time, we’ll include the key in the authorization header:

    $ curl -H "Authorization: Basic YWRtaW46YWRtaW4xMjMh"
    http://localhost:8080/apiman/system/status

And the result is:

    {"up":true,"version":"1.1.2-SNAPSHOT"}

As we mentioned earlier in this article, the responses returned by calls to the REST API are in in the form of JSON. In the case of our call to the http://localhost:8080/apiman/system/status endpoint, the expected format of the response is:

{% highlight json %}
{
    version : string
    up : boolean
}
{% endhighlight %}

Let’s carry on by looking at a more extensive example, where we use the REST API to automate a task that would be tedious if performed in the apiman Management UI.

##A Larger Example

Let’s say that you want to create multiple new organizations. You could of course manually enter these into the apiman Management UI. But, if you have a large number of organizations, for example, one for each of the countries in the EU, or each of the states in the USA, this would be a tedious and error prone task. This is an ideal candidate task for automation with the REST API.

The coding for this example is simple. All you have to do is account for the encoding of the authorization to access the API Manager REST API, and pass the information related to each organization that you create to this endpoint: http://localhost:8080/apiman/organizations

Here’s an example program with an ice hockey flavor - the highlights are noted below:

{% highlight java linenos %}
package apimanExample;
import java.io.IOException;  
import java.io.OutputStreamWriter;  
import java.net.HttpURLConnection;  
import java.net.URL;  
import java.nio.charset.StandardCharsets;  
import java.util.Base64;  

public class SimplePutOrg {  

    public static void main(String[] args) throws Exception {  

        String [ ] [ ] originalSix = {  
            { "Boston", "Chicago", "Detroit", "Montreal", "New York", "Toronto"},  
            { "Bruins", "BlackHawks", "Red Wings", "Canadiens", "Rangers", "Maple Leafs"}  
        };
        for (int i = 0; i < 6; i++) {  
            System.out.println ("Creating new apiman org for: " + originalSix [0][i] + ":" + originalSix [1][i]);  
            System.out.println ("Return code = " + createNewOrg (originalSix [0][i], originalSix [1][i]));  
        }
    }  

    private static int createNewOrg (String newOrgName, String newOrgDescription) throws IOException {  
        URL url = new URL("http://localhost:8080/apiman/organizations");  
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();  

        Base64.Encoder encoder = Base64.getEncoder();  
        String normalString = "admin:admin123!";  
        String encodedString = encoder.encodeToString(normalString.getBytes(StandardCharsets.UTF_8));  

        connection.setRequestProperty("Authorization", "Basic "  + encodedString);  
        connection.setRequestMethod("POST");  
        connection.setDoOutput(true);  
        connection.setRequestProperty("Content-Type", "application/json");  
        connection.setRequestProperty("Accept", "application/json");  

        OutputStreamWriter osw = new OutputStreamWriter(connection.getOutputStream());  
        osw.write(String.format("{\"name\":\"" + newOrgName + " a new org\",\"description\":\"" + newOrgDescription + "\"}"));  
        osw.flush();  
        osw.close();  

        return connection.getResponseCode();
    }  
}
{% endhighlight %}

Code highlights:

* Lines 13-16: Here's where we define the test data. For this example, we'll use the National Hockey League's "original 6" teams.
* Line 24: Here's the URL for the service to which we'll connect to create the new organizations.
* Lines 27-29 - Here's where we set up the encoding for the BASIC authorization.
* Lines 31-35 - And here's where we create the HttpURLConnection that we will use to connect to the service.
* Line 32: Note that we will be performing a POST operation.
* Lines 37-40 - And finally, here's where we connect to the service and send our POST requests to create the new organizations.

When we run this example, the following output indicates that the calls to the service through the REST API were successful, based on the return code of 200:

    Creating new apiman org for: Boston:Bruins  
    Return code = 200  
    Creating new apiman org for: Chicago:BlackHawks  
    Return code = 200  
    Creating new apiman org for: Detroit:Red Wings  
    Return code = 200  
    Creating new apiman org for: Montreal:Canadiens  
    Return code = 200  
    Creating new apiman org for: New York:Rangers  
    Return code = 200  
    Creating new apiman org for: Toronto:Maple Leafs  
    Return code = 200  

And - here’s the server output that tracks the creation of the new organizations:

    21:17:53,205 INFO [stdout] (default task-19) Created organization Boston a new org: OrganizationBean [id=Bostonaneworg, name=Boston a new org, description=Bruins, createdBy=admin, createdOn=Sun May 17 21:17:53 GMT-05:00 2015, modifiedBy=admin, modifiedOn=Sun May 17 21:17:53 GMT-05:00 2015]  
    21:17:53,233 INFO [stdout] (default task-21) Created organization Chicago a new org: OrganizationBean [id=Chicagoaneworg, name=Chicago a new org, description=BlackHawks, createdBy=admin, createdOn=Sun May 17 21:17:53 GMT-05:00 2015, modifiedBy=admin, modifiedOn=Sun May 17 21:17:53 GMT-05:00 2015]  
    21:17:53,253 INFO [stdout] (default task-23) Created organization Detroit a new org: OrganizationBean [id=Detroitaneworg, name=Detroit a new org, description=Red Wings, createdBy=admin, createdOn=Sun May 17 21:17:53 GMT-05:00 2015, modifiedBy=admin, modifiedOn=Sun May 17 21:17:53 GMT-05:00 2015]  
    21:17:53,275 INFO [stdout] (default task-25) Created organization Montreal a new org: OrganizationBean [id=Montrealaneworg, name=Montreal a new org, description=Canadiens, createdBy=admin, createdOn=Sun May 17 21:17:53 GMT-05:00 2015, modifiedBy=admin, modifiedOn=Sun May 17 21:17:53 GMT-05:00 2015]  
    21:17:53,295 INFO [stdout] (default task-27) Created organization New York a new org: OrganizationBean [id=NewYorkaneworg, name=New York a new org, description=Rangers, createdBy=admin, createdOn=Sun May 17 21:17:53 GMT-05:00 2015, modifiedBy=admin, modifiedOn=Sun May 17 21:17:53 GMT-05:00 2015]  
    21:17:53,316 INFO [stdout] (default task-29) Created organization Toronto a new org: OrganizationBean [id=Torontoaneworg, name=Toronto a new org, description=Maple Leafs, createdBy=admin, createdOn=Sun May 17 21:17:53 GMT-05:00 2015, modifiedBy=admin, modifiedOn=Sun May 17 21:17:53 GMT-05:00 2015]  

And finally, here are the organizations as displayed in the apiman Management UI:

![new organizations](/blog/images/2015-05-19/new-organizations.png)

(It’s been a tough year for Boston Bruins’ fans. It’s nice to see the team listed first, even if it’s just an alphabetic list.  ;-)

##In Conclusion

The architecture of the apiman Management UI is that the UI is built on top of a REST API. This architecture makes it possible for you to directly access the services exposed by the API, and enables you to automate the tasks that you perform in the UI.
