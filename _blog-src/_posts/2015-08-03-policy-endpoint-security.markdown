---
layout: post
title:  "apiman Policy and Endpoint Security"
date:   2015-08-03 11:00:00
author: len_dimaggio
categories: security
---

In this, the fifth article in the series on apiman, JBoss’ new API Management framework, we’ll examine how apiman enables you to provide security for your managed services at the policy level, and and at the endpoint level for its managed and unmanaged endpoints. 

<!--more-->

##Unintentionally Insecure?

If you read the first article in this series closely (https://dzone.com/articles/impatient-new-users) you might have noticed that in the course of creating a service whose endpoint was managed by the apiman API Gateway, we also inadvertently left that service in a very insecure state as unauthorized client applications could bypass the gateway and access the service directly.  We discussed how to configure authentication in a policy for the managed service endpoint in the most recent post in this series (https://dzone.com/articles/adding-basic-authentication). This authentication policy provides username/password security for clients as they access the managed service through the API Gateway, but it does not protect the service from unauthorized access attempts that bypass the Gateway completely. To make the service secure from unauthorized client applications, endpoint level security should also be configured.

In this article, we’ll examine both apiman policy level and endpoint level security, how they compare, and how they differ. 

##Complementary Types of Security Provided by apiman

The best way to start our discussion of the different, but complementary types of security that we’ll examine in this article is with a diagram. The nodes involved are the client applications that will access our services, the apiman API Gateway, and the servers that host our services:

![apiman logo](/blog/images/2015-08-03/apiman_security.png)
 
 Let’s work our way through the diagram from left to right and start by taking a look at Policy Level Security.

##Policy Level Security

apiman includes several pre-defined policies OOTB. The policies provide support for controlling access to services based on the rate at which the services are invoked, the IP address of the client applications that access the services, authorization, and authentication. In the most recent article in this series, we showed how to configure an authentication policy. To keep things simple, we chose BASIC authentication. This BASIC Authentication policy provides security for the communication channel between the client applications and the apiman API Gateway. An incoming request to the API Gateway from a client initiates the policy chain, the policy is applied and the client is requested to supply a username and password.  The level of security provided by this policy can be enhanced if the policy is configured with SSL encryption.

But, this policy level security only secures the left side of the diagram, that is the communication channel between the applications and the API Gateway. In this communication channel, the applications play the role of the client, and the API Gateway plays the role of the server.

We also want to secure the right side of the diagram, where the API Gateway plays the role of a client, and the services play the role of the servers. 

(It’s also worth noting that while policy security protects the managed service, it does nothing to protect the unmanaged service as this service can be reached directly, without going through the API Gateway. This is illustrated by the red line in the diagram. So, while access to the managed service through the apiman API Gateway is secure, policy security does not secure the unmanaged service endpoint.)

##Endpoint Level Security

In contrast to policy level security, with endpoint security we are securing the right side of the diagram. 

 A recent post by Marc Savy to the apiman blog [http://www.apiman.io/blog/gateway/security/mutual-auth/ssl/mtls/2015/06/16/mtls-mutual-auth.html](http://www.apiman.io/blog/gateway/security/mutual-auth/ssl/mtls/2015/06/16/mtls-mutual-auth.html) described how to configure Mutually Authenticated TLS (Transport Layer Security) between the API Gateway and the managed services. With Mutual TLS, bi-direction authentication is configured so that the identities of both the client and server are verified before a connection can be made.

In setting up Mutual TLS, keystores, containing a node’s private key, and truststores, containing public certificates to govern the other nodes that the node should trust, were created. The API Gateway was configured in its apiman.properties file to reference the keystores and truststores.  The service was configured with mutual authentication by setting the API Security dropdown in the Implementation tab to MTLS/Two-Way-SSL. Finally, the service was programmed with mutual authentication enabled. With Mutual TLS configured, the communication channel on the right side of the diagram, from the API Gateway to the services, was made secure. 

We should also note that, unlike policy security, endpoint security also secures the services from attempts to bypass the API Gateway. With Mutual TLS, a two-way trust pattern is created. The API Gateway trusts the services and the services trust the API Gateway. The services, however, do not trust the client applications. As is shown by the large “X” character that indicates that an application cannot bypass the API Gateway and access the services directly.

One last point that is important to remember is that the endpoint level of security applies to all requests made to the services, regardless of whatever policies are configured. 

##Compare and Contrast

To summarize, the differences between policy level security and endpoint level security are:

| Policy Level Security        | End Point Level Security     |
| ------------------------     | ------------------------     | 
| Secures communications between the applications (clients) and API Gateway (server) | Secures communications between the API Gateway (client) and services (servers) |
| Configured in an API Gateway policy | Configured for the API Gateway as a whole in apiman.properties and with key/certificates infrastructure |
| Applied by the policy at runtime | Applied for all service requests, regardless of the policies configured for a service |
| Does not secure the unmanaged service from access by unauthorized clients | Secures the unmanaged service endpoints from access by unauthorized clients |


##Author Acknowledgements

 As always, the author would like to acknowledge Marc Savy, Eric Wittmann, and the apiman team for their review comments and suggestions on writing this article!

## References
* [http://www.apiman.io/blog/gateway/security/mutual-auth/ssl/mtls/2015/06/16/mtls-mutual-auth.html](http://www.apiman.io/blog/gateway/security/mutual-auth/ssl/mtls/2015/06/16/mtls-mutual-auth.html) (written by Marc Savy)
* https://dzone.com/articles/adding-basic-authentication



