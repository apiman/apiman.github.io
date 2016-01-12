---
layout: post
title:  "apiman Limiting Policies"
date:   2015-08-17 11:00:00
author: len_dimaggio
categories: policies
oldUrl: 2015-08-17-limiting-policies
---

In this, the sixth article in the series on apiman, JBoss’ new API Management framework, we’ll examine how apiman enables you to govern access to managed APIs through the use of rate limiting policies.

The runtime core of apiman is the API Gateway and the policies that it applies to incoming requests to APIs. apiman is configured out of the box with a variety of policies that can be used to govern access to APIs managed by the API Gateway based on IP address, user authentication, and usage levels. From its first release, apiman has supported rate limiting policies, where the upper limit for use of an API could be governed by a policy. In its new 1.1.6 release, apiman has expanded this support to include quota based limiting policies. 

<!--more-->

##Types of Limiting Policies

As of release 1.1.6, apiman supports these types of limiting policies:

* Rate Limiting - This policy type governs the number of times requests are made to an API within a specified time period. The requests can be filtered by user, client app, or API and can set the level of granularity for the time period to second, minute, hour, day, month, or year. The intended use of this policy type is for fine grained processing (e.g., 10 requests per second).
* Quota - This policy type performs the same basic functionality as the Rate Limiting policy type., however, the intended use of this policy type is for less fine grained processing (e.g., 10,000 requests per month).
* Transfer Quota - In contrast to the other policy types, Transfer Quota tracks the number of bytes transferred (either uploaded or downloaded) rather than the total number of requests made. 

Each of these policies, if used singly, can be effective in throttling requests. apiman, however, adds an additional layer of flexibility to your use of these policy types by enabling you to use them in combinations. Let's look at a few examples.

##Combinations of Limiting Policies = Flexibility

Limiting the total number of API requests within a period of time, is a straightforward task as this can be configured in a quota policy. This policy, however, may not have the desired effect as the quota may be reached early in the defined time period. If this happens, the requests made to the API during the remainder of the time period will be blocked by the policy. A better way to deal with a situation like this is to implement a more flexible approach where the monthly quota policy is combined with a fine grained rate limiting policy that will act as a throttle on the traffic. 

To illustrate, there are about 2.5 million seconds in a month. If we want to set the API request quota for a month to .5 million, then we can also set a rate limit policy to a limit of 5 requests per second to ensure that API requests are throttled and the API can be accessed throughout the entire month.

Here’s a visual view of a rate limiting policy based on a time period of one week. If we define a weekly quota, there is no guarantee that users will not consume that quota before the week is over. This will result in an API requests being denied at the end of the week:

![rate limit coarse grain](/blog/images/2015-08-17/rate_limit1-redux.png)
 
In contrast, if we augment the weekly quota with a more fine grained policy, we can maintain the API’s ability to respond to requests throughout the week:

![rate limit fine grain](/blog/images/2015-08-17/rate_limit2-redux.png)
 
The ability to throttle API requests based on API request counts and bytes transferred provides even greater flexibility in implementing policies. APIs that transfer larger amounts of data, but rely on fewer API requests can have that data transfer throttled on a per byte basis. For example, an API that is data intensive, will return a large amount of data in response to each API request. The API may only receive a request a few hundreds of times a day, but each request may result in several megabytes of data being transferred. Let's say that we want to limit the amount of data transferred to 6GB per hour. For this type of API, we could set a rate limiting policy to allow for one request per minute, and then augment that policy with a transfer quota policy of 100Mb per hour.

##Summary

When you configure limiting policies with apiman, it's important to remember that the limits you set can not only function as hard limits for API requests, they can also be used to throttle API requests. This throttling gives you the flexibility to control the level of incoming API requests over a period of time that you designate in the policies without blocking all incoming API requests. The flexibility that apiman provides you in configuring limiting policies is further enhanced by its support for you to create combinations of limiting policies. These combined policies work together to give you both coarse grained and fine grained control over incoming API requests.  

##Author Acknowledgements

As always, the author would like to acknowledge Eric Wittmann, and the apiman team for their review comments and suggestions on writing this article!




