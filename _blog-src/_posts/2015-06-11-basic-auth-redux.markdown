---
layout: post
title:  "Adding a BASIC Authentication Policy to a Managed API in JBoss apiman"
date:   2015-06-11 11:00:00
author: len_dimaggio
categories: authentication policy
oldUrl: 2015-06-11-basic-auth
---

![apiman logo](/blog/images/2015-06-11/1-apiman_logo.png)

In this, the fourth article in the series on apiman, JBoss' new API Management framework, we'll examine how apiman enables you to not just manage APIs, but implement a layer of security to the APIs by adding an authentication requirement when client apps access a managed API.

<!--more-->

## Securing Client App Access to your Managed APIs

 As we've seen in the previous articles in this series, apiman enables you to govern the usage of the APIs that it manages by defining policies in the Managament UI that are then applied at runtime by the API Gateway. The apiman API Gateway applies the policy rules that you define to requests that it proxies to the managed API:

![apiman logo](/blog/images/2015-06-11/apiman-2.png)

The OOTB policies that are packaged with apiman enable you to apply a variety of types of controls, including rate limiting (where access to an API is assigned a usage threshold) and black/whitelisting by IP address (where the client app's IP address governs their access to the API). 

 However, managing an API with apiman does not automatically make that API secure. Happily, however, apiman provides a policy that enables you to easily set up authentication to control access to your managed API. (Note that this policy governs the client apps' authenticated access to the managed API, and not establishing a secure connection where apiman authenticates the back-end APIs. In other words, in this article, we're interested in adding authentication between the blue and pink boxes in the above diagram.)

## Adding a BASIC Authentication Policy to a Managed API

 apiman is packaged with multiple pre-configured policies:

* Authorization - Access to APIs' resources is controlled by user roles.
* BASIC Authentication - A username/password is required to access an API.
* Ignored Resources - Paths to APIs' resources that will not be accessible. Requests to these API resource paths return a 404 (not found) error.
* IP Blacklist - Client apps with specific IP address will be blocked from accessing an API.
* IP Whitelist - And, client apps with specific IP address will not  be blocked from accessing an API.
* Rate Limiting - Access to an API is limited by the number of requests in a defined time period. We demonstrated an example of a rate limiting policy in the first article in this series. 

 We're interested in the BASIC Authentication Policy. Let's take a closer look. The dialog to add a BASIC authentication policy to an API looks like this:

![apiman logo](/blog/images/2015-06-11/apiman-3.png)

In creating the BASIC policy, we define an Authentication Realm (think of this as an area to be protected, within which usernames and passwords exist) and an optional HTTP header. The optional HTTP header is used to optionally pass the user's principal to the back-end API through an HTTP header. This is useful if the back-end system needs to know the username of the user calling it (e.g. to do user-specific operation). The "Transport security required" checkbox, if enabled, will cause the policy to fail if a client app tries to connect to the API over http. The Policy will only accept credentials over https. 

 We'll keep the Identity Source simple and select "Static Identities" and then define a user. Note that while this static approach is fine for testing purposes, you will want use one of the other Identity Source options (JBDS or LDAP) for a production environment as they can better handle a large number of users.

 ![apiman logo](/blog/images/2015-06-11/apiman-4.png)

It's important to remember that, in BASIC authentication, one of the factors that makes this, well, basic in nature, is that the username/password that you define are encoded (this is unencrypted base64 encoded text) when they are sent to the server. Since the text is not encrypted, it's at risk of being copied and then used in an attack. For this reason, it's safer to select the transport security option to configure SSL encryption.

 To illustrate, here's Java code that can encode and then decode the username:password string:

{% highlight bash %}
 Base64.Encoder encoder = Base64.getEncoder();  
 String normalString = "user1" + ":" + "password1";  
 String encodedString = encoder.encodeToString(normalString.getBytes(StandardCharsets.UTF_8));  
 System.out.println ("The encoded string is: " + encodedString);  
             
 Decoder decoder = Base64.getDecoder();  
 byte[] unencodedStringArray = decoder.decode(encodedString);  
 String unencodedString = new String (unencodedStringArray);  
 System.out.println ("The unencoded string is: " + unencodedString);  
   
 The encoded string is: dXNlcjE6cGFzc3dvcmQx  
 The unencoded string is: user1:password1  
{% endhighlight %}

 So - unlike encrypted strings, your encoded username and password strings are not secure!

 ## When a Request is made to the API

It's interesting to see step-by-step what happens when a request is made to the API and the BASIC authentication policy is applied. Let's take a look at the request and the responses. I used the "HttpFox" http analyzer (https://addons.mozilla.org/en-us/firefox/addon/httpfox/) to "listen in" on the requests sent to the server and the responses sent back.

 Here's the first request made to the API, notice that a username/password is not included. 

{% highlight bash %}
 (Request-Line) GET /apiman-gateway/apiProducerOrg/echossl/1.0?apikey=6f8784cd-5754-47b0-9b8b-b2eb8c5b190f HTTP/1.1  
 Host     localhost:8443  
 User-Agent     Mozilla/5.0 (X11; Linux x86_64; rv:24.0) Gecko/20100101 Firefox/24.0  
 Accept     text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8  
 Accept-Language     en-US,en;q=0.5  
 Accept-Encoding     gzip, deflate  
 Cookie     __utma=111872281.1348865079.1409020839.1411395889.1419258109.7; __utmz=111872281.1409020839.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); s_fid=72CCAD206D09146C-233B60F47DBEA290  
 Connection     keep-alive  
{% endhighlight %}

The response, as we expected, shows that the request has triggered an authentication failure. This is due to the authentication requirement that we defined and is being applied by the API Gateway. Note the 401 error code and the reference to BASIC authentication:

{% highlight bash %}
 (Status-Line)     HTTP/1.1 401 Unauthorized  
 X-Powered-By     Undertow/1  
 Server     WildFly/8  
 X-Policy-Failure-Type     Authentication  
 Date     Wed, 03 Jun 2015 13:43:26 GMT  
 Connection     keep-alive  
 WWW-Authenticate     BASIC realm="myRealm"  
 X-Policy-Failure-Code     10004  
 Content-Type     application/json  
 Content-Length     165  
 X-Policy-Failure-Message     BASIC authentication failed.  
{% endhighlight %}

The browser then automatically pops up a dialog for us to enter the username and password:

![apiman logo](/blog/images/2015-06-11/apiman-5.png)


 A request is then sent that includes the username and password encoded into a string. In this request, the encoded (but not encrypted) username and password are included:

{% highlight bash %}
 (Request-Line)     GET /apiman-gateway/apiProducerOrg/echossl/1.0?apikey=6f8784cd-5754-47b0-9b8b-b2eb8c5b190f HTTP/1.1  
 Host     localhost:8443  
 User-Agent     Mozilla/5.0 (X11; Linux x86_64; rv:24.0) Gecko/20100101 Firefox/24.0  
 Accept     text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8  
 Accept-Language     en-US,en;q=0.5  
 Accept-Encoding     gzip, deflate  
 Cookie     __utma=111872281.1348865079.1409020839.1411395889.1419258109.7; __utmz=111872281.1409020839.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); s_fid=72CCAD206D09146C-233B60F47DBEA290  
 Connection     keep-alive  
 Authorization     Basic dXNlcjE6cGFzc3dvcmQx  
{% endhighlight %}   

And, then we get the successful return code of 200 in a response:

{% highlight bash %}
 (Status-Line)     HTTP/1.1 200 OK  
 Connection     keep-alive  
 X-Powered-By     Undertow/1  
 Server     WildFly/8  
 Content-Length     755  
 Content-Type     application/json  
 Date     Wed, 03 Jun 2015 13:43:34 GMT  
 {% endhighlight %}

## In Conclusion

 Just because an API is managed doesn't automatically make it secure. JBoss apiman provides you with multiple options to add an authentication requirement when client apps access your managed API. 

## Author's Acknowledgements

 As always, the author would like to acknowledge Eric Wittmann and the apiman team for their  review comments and suggestions on writing this post, and for adding new features to apiman!

## Links

apiman

* https://www.apiman.io

Previous articles in this series:

* https://java.dzone.com/articles/impatient-new-users
* https://java.dzone.com/articles/customizing-jboss-apiman
* https://java.dzone.com/articles/jboss-apiman-api-manager-rest

HTTP Authentication: Basic and Digest Access Authentication

* https://tools.ietf.org/html/rfc2617

