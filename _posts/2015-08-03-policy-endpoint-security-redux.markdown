---
layout: post
title:  "apiman Policy and Endpoint Security"
date:   2015-08-03 11:00:00
author: len_dimaggio
tags: security
---

In this, the fifth article in the series on apiman, JBoss’ new API Management framework, we’ll examine how apiman enables you to provide security for your managed APIs at the policy level, and and at the endpoint level for its managed and unmanaged endpoints.

<!--more-->

## Unintentionally Insecure?

If you read the first article in this series closely (https://dzone.com/articles/impatient-new-users) you might have noticed that in the course of creating an API whose endpoint was managed by the apiman API Gateway, we also inadvertently left that API in a very insecure state as unauthorized client apps could bypass the gateway and access the API directly.  We discussed how to configure authentication in a policy for the managed API endpoint in the most recent post in this series (https://dzone.com/articles/adding-basic-authentication). This authentication policy provides username/password security for clients as they access the managed API through the API Gateway, but it does not protect the API from unauthorized access attempts that bypass the Gateway completely. To make the API secure from unauthorized client apps, endpoint level security should also be configured.

In this article, we’ll examine both apiman policy level and endpoint level security, how they compare, and how they differ.

## Complementary Types of Security Provided by apiman

The best way to start our discussion of the different, but complementary types of security that we’ll examine in this article is with a diagram. The nodes involved are the client apps that will access our APIs, the apiman API Gateway, and the servers that host our APIs:

![apiman logo](/blog/images/2015-08-03/apiman_security-redux.png)

 Let’s work our way through the diagram from left to right and start by taking a look at Policy Level Security.

## Policy Level Security

apiman includes several pre-defined policies OOTB. The policies provide support for controlling access to APIs based on the rate at which the APIs are invoked, the IP address of the client apps that access the APIs, authorization, and authentication. In the most recent article in this series, we showed how to configure an authentication policy. To keep things simple, we chose BASIC authentication. This BASIC Authentication policy provides security for the communication channel between the client apps and the apiman API Gateway. An incoming request to the API Gateway from a client initiates the policy chain, the policy is applied and the client is requested to supply a username and password.  The level of security provided by this policy can be enhanced if the policy is configured with SSL encryption.

But, this policy level security only secures the left side of the diagram, that is the communication channel between the client apps and the API Gateway. In this communication channel, the client apps play the role of the client, and the API Gateway plays the role of the server.

We also want to secure the right side of the diagram, where the API Gateway plays the role of a client, and the APIs play the role of the servers.

(It’s also worth noting that while policy security protects the managed API, it does nothing to protect the unmanaged API as this API can be reached directly, without going through the API Gateway. This is illustrated by the red line in the diagram. So, while access to the managed API through the apiman API Gateway is secure, policy security does not secure the unmanaged API endpoint.)

## Endpoint Level Security

In contrast to policy level security, with endpoint security we are securing the right side of the diagram.

 A recent post by Marc Savy to the apiman blog [https://www.apiman.io/blog/gateway/security/mutual-auth/ssl/mtls/2015/06/16/mtls-mutual-auth.html](https://www.apiman.io/blog/gateway/security/mutual-auth/ssl/mtls/2015/06/16/mtls-mutual-auth.html) described how to configure Mutually Authenticated TLS (Transport Layer Security) between the API Gateway and the managed APIs. With Mutual TLS, bi-direction authentication is configured so that the identities of both the client and server are verified before a connection can be made.

In setting up Mutual TLS, keystores, containing a node’s private key, and truststores, containing public certificates to govern the other nodes that the node should trust, were created. The API Gateway was configured in its apiman.properties file to reference the keystores and truststores.  The API was configured with mutual authentication by setting the API Security dropdown in the Implementation tab to MTLS/Two-Way-SSL. Finally, the API was programmed with mutual authentication enabled. With Mutual TLS configured, the communication channel on the right side of the diagram, from the API Gateway to the APIs, was made secure.

We should also note that, unlike policy security, endpoint security also secures the APIs from attempts to bypass the API Gateway. With Mutual TLS, a two-way trust pattern is created. The API Gateway trusts the APIs and the APIs trust the API Gateway. The APIs, however, do not trust the client apps. As is shown by the large “X” character that indicates that a client app cannot bypass the API Gateway and access the APIs directly.

One last point that is important to remember is that the endpoint level of security applies to all requests made to the APIs, regardless of whatever policies are configured.

## Compare and Contrast

To summarize, the differences between policy level security and endpoint level security are:

| Policy Level Security        | End Point Level Security     |
| ------------------------     | ------------------------     |
| Secures communications between the client apps (clients) and API Gateway (server) | Secures communications between the API Gateway (client) and APIs (servers) |
| Configured in an API Gateway policy | Configured for the API Gateway as a whole in apiman.properties and with key/certificates infrastructure |
| Applied by the policy at runtime | Applied for all API requests, regardless of the policies configured for an API |
| Does not secure the unmanaged API from access by unauthorized clients | Secures the unmanaged API endpoints from access by unauthorized clients |


## Author Acknowledgements

 As always, the author would like to acknowledge Marc Savy, Eric Wittmann, and the apiman team for their review comments and suggestions on writing this article!

## References
* [https://www.apiman.io/blog/gateway/security/mutual-auth/ssl/mtls/2015/06/16/mtls-mutual-auth.html](https://www.apiman.io/blog/gateway/security/mutual-auth/ssl/mtls/2015/06/16/mtls-mutual-auth.html) (written by Marc Savy)
* https://dzone.com/articles/adding-basic-authentication
