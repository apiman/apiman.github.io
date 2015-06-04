---
layout: post
title:  "Keycloak and dagger: Securing your services with OAuth2"
date:   2015-06-04 18:50:45
author: Marc Savy
categories: gateway security oauth2 keycloak authentication authorization
---
One great advantage of API Management is centralising auth concerns, thereby avoiding burdensome reimplementation issues and streamlining your security processes. The good news is that you can easily configure apiman to handle many common auth use-cases, such as OAuth2 with our popular Keycloak OAuth2 policy which I'll outline in this blogpost.

<!--more-->

## Preparation

For this example, let's assume we're using apiman's [quickstart](http://www.apiman.io/latest/download.html) setup:

```ShellSession
mkdir ~/apiman-1.1.3.Final
cd ~/apiman-1.1.3.Final
wget http://download.jboss.org/wildfly/8.2.0.Final/wildfly-8.2.0.Final.zip
wget http://downloads.jboss.org/overlord/apiman/1.1.3.Final/apiman-distro-wildfly8-1.1.3.Final-overlay.zip
unzip wildfly-8.2.0.Final.zip
unzip -o apiman-distro-wildfly8-1.1.3.Final-overlay.zip -d wildfly-8.2.0.Final
cd wildfly-8.2.0.Final
./bin/standalone.sh -c standalone-apiman.xml
```

## Installing the Plugin

Those amongst you with some experience of apiman may have noticed that the OAuth2 policy doesn't appear in the standard list of policies in the manager UI; that's because the OAuth2 policy is an example of an **apiman plugin**, all of which are shipped separately from apiman, but are trivially easy to install. All you need to know is the GAV of the plugin, which in this case is:

|   Elem  |           Value                    |
|---------|:-----------------------------------|
| Group   |io.apiman.plugins                   |
| Artifact|apiman-plugins-keycloak-oauth-policy|
| Version |1.1.3.Final (use version corresponding to your release of apiman)                         |

When logged into [the apiman manager UI](http://localhost:8080/apimanui/) as an administrator (for the quickstart that's u:`admin`, p:`admin123!`), navigate to the **manage plugins** page:

![System Administration](/blog/images/2015-06-03/sysadmin-manage-plugins.png)

Select **add plugin**, fill in the details as above, and **add plugin**. That's it!

## Setting Up

There are two essential components to our system. First, is the [Keycloak server](http://keycloak.jboss.org), an all-in-one [SSO](https://en.wikipedia.org/wiki/Single_sign-on) and [IdM](https://en.wikipedia.org/wiki/Identity_management); we'll configure it to be our identity source and handle the issuance of OAuth2 bearer tokens. Second, is the apiman OAuth2 policy; we'll set it up to validate the tokens precisely to our requirements.

### Keycloak Server

There are a huge number of configuration permutations with Keycloak, and the most suitable approach will vary according to your requirements. It is highly recommended to consult the [Keycloak guides](http://keycloak.jboss.org/docs.html) to determine your optimal setup, as for the sake of brevity we're only going to cover a couple of trivial preconfigured scenarios.

Let's assume we're going to protect a very simple **echo service**, which echoes back to the requestor the details of any request made to it. It is located at `http://localhost:8080/services/echo`.

First, log into the [Keycloak server](http://localhost:8080/auth/admin). If you're following our walkthrough, the log-in details are identical to those mentioned earlier (`admin`, `admin123!`).

You can see that there is already an **apiman** realm defined, but we're going to create a new one, so navigate to **Add Realm** (top right), and import and upload [this demonstration realm definition](/blog/resources/2015-06-04/stottie.json); it provides an extremely simple setup where we have:

- A realm: `stottie`
- A single user: `rincewind`, with password: `apiman` and a realm role: `echomeister`
- And, a client: `apiman`, which is allowed direct grants via Keycloak's [RESTful Direct Access Grants API](https://keycloak.github.io/docs/userguide/html/direct-access-grants.html).

Let's quickly test getting ourselves an OpenID Connect OAuth2 token:

```ShellSession
curl -X POST http://127.0.0.1:8080/auth/realms/stottie/protocol/openid-connect/token  -H "Content-Type: application/x-www-form-urlencoded" -d "username=rincewind" -d 'password=apiman' -d 'grant_type=password' -d 'client_id=apiman'
```

This should return some JSON similar to the following:

```json
{
    "access_token": "eyJhbGciOiJSUzI1NiJ9...<SNIP>",
    "expires_in": 300,
    "refresh_expires_in": 1800,
    "refresh_token": "eyJhbGcg...<SNIP>",
    "not-before-policy": 0,
    "session-state": "69974623-be8b-49d7-840a-0330c6bdde21"
}
```

Notice that the OAuth2 token we're interested in is contained within the `access_token` field, with useful ancillary information about token validity and refreshing. If we base64 decode the token, we can see a lot interesting information, including the `echomiester` role defined on `rincewind`:

```json
{
    "jti": "c89b8cf7-84ef-4f02-9954-f8d3d4321473",
    "exp": 1433414538,
    "nbf": 0,
    "iat": 1433414238,
    "iss": "http://127.0.0.1:8080/auth/realms/stottie",
    "aud": "apiman",
    "sub": "de4af322-85b2-4dbe-8d53-6a2ee29e4080",
    "azp": "apiman",
    "session_state": "69974623-be8b-49d7-840a-0330c6bdde21",
    "client_session": "b5bd36a0-d576-4593-be7b-4648612c25b8",
    "allowed-origins": [],
    "realm_access": {
        "roles": [
            "echomeister"
        ]
    },
    "resource_access": {
        "account": {
            "roles": [
                "view-profile",
                "manage-account"
            ]
        }
    },
    "name": "",
    "preferred_username": "rincewind"
}
```

This demonstrates one of the most useful attributes of OAuth2: all of the information required to validate a request is contained within the token itself.

### Apiman OAuth2 Policy

First, log into apiman, and **Create a New Organization**; let's call it _Newcastle_. Select the **Services** tab, and add a **New Service**; we'll name this one **EchoService** and then **Create Service**.

Select the **Implementation** tab, and set the endpoint to our echo service, `http://localhost:8080/services/echo`. Save and move onto the **Plans** tab, where you should opt to **Make this service public**. After saving, we can move onto the **Policies** tab, where the interesting stuff starts.

Navigate to **Add Policy**, and select **Keycloak OAuth Policy** from the drop-down list. A substantial set of options are available for your perusal, but for the purposes of this blog demo we'll set the following:


| Option                     | Value   | Details                          |
|----------------------------|---------|----------------------------------|
| Realm                      | http://127.0.0.1:8080/auth/realms/stottie | The path to our realm. Note that in older versions of Keycloak (pre 1.2.0), the realm will just be the **stottie** (no path).  
| Keycloak Realm Certificate | B64 encoded cert  | Paste your [Keycloak realm certificate](http://localhost:8080/auth/admin/master/console/#/realms/stottie/keys-settings).
| Forward Authorization Roles| Forward Realm Roles (Set to true) | If we decide to use the authorization policy later, we'll forward the realm roles contained within the token (i.e. `echomeister`). If we don't need the granularity of roles, you can still just validate the token. |

Select **Add Policy**, and then **Publish** the service. You can see its endpoint information in the **Endpoint** tab, it should be similar to:

https://localhost:8443/apiman-gateway/Newcastle/EchoService/1.0

## Testing Authentication

Let's test our setup with cURL to see whether our request is _denied_ if we don't use a token:

```
[msavy@mmbp tmp]$ curl -k  https://127.0.0.1:8443/apiman-gateway/Newcastle/EchoService/1.0
{"type":"Authentication","failureCode":11005,"responseCode":401,"message":"OAuth2 'Authorization' header or 'access_token' query parameter must be provided.","headers":{}}
```

Excellent, it all seems to be working! Notice that we're using self-signed certificates for this demo, so the `-k` flag will skip certificate validation.

Next, let's do a request with a token. There are two ways to attach your bearer token to a request. Either:

- `Authorization` header, as `Authorization: Bearer <token>`
- `access_token` query parameter, as `http://example.org/the/path/?access_token=<token>`

First, let's retrieve a fresh token, and extract the `access_token` field

```
curl -X POST http://127.0.0.1:8080/auth/realms/stottie/protocol/openid-connect/token  -H "Content-Type: application/x-www-form-urlencoded" -d "username=rincewind" -d 'password=apiman' -d 'grant_type=password' -d 'client_id=apiman' | jsawk 'return this.access_token'
```

Second, we'll take the token and attach it to our request to the service

```
[msavy@mmbp tmp]$ curl -k -H "Authorization: Bearer eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJiNDY1YW..." https://127.0.0.1:8443/apiman-gateway/Newcastle/EchoService/1.0
{
  "method" : "GET",
  "resource" : "/services/echo",
  "uri" : "/services/echo",
  "headers" : {
    "Authorization" : "Bearer eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJiNDY1YWMzNi1hMTczLTRjOWMtYWJjZS00MzE2MJ...",
    "Host" : "127.0.0.1:8080",
    "User-Agent" : "curl/7.37.1",
    "Accept" : "*/*",
    "Connection" : "keep-alive",
    "Cache-Control" : "no-cache",
    "Pragma" : "no-cache"
  },
  "bodyLength" : null,
  "bodySha1" : null,
  "counter" : 1
}
```

Great, it worked! We can see EchoService has now been reached, meaning our OAuth2 token was validated successfully, and it sent us back a response which includes the bearer token we used (you can strip this out in the options).

## Adding Authorization

We're going to develop our example a little bit further. At present, we simply have a binary approach where we either allow or disallow based upon which realm the token was issued from. If we want a more granular approach where we can discriminate upon roles, then we need to add another element: **Authorization**.

The more observant readers will note that we have already added two of the required elements when we imported the realm into Keycloak; namely, a user `rincewind` and a realm role `echomeister`.

If we navigate back to the **EchoService** service in the apiman UI, we can create a **New Version**. We'll call it __2.0__ and clone the previous configuration. Moving over to the **Policies** tab again, we **Add Policy** and select **Authorization Policy** from the drop-down.

We're going to add two rules:

| To access resource       | using verb/action   | the user must have role |
|--------------------------|---------------------|-------------------------|
|/rincewind/.*             | *                   | echomeister
|/secret/.*                | *                   | overlord

Our example user has the first role, but not the second. **Add** the policy and **Publish** the service again. Our endpoint will now reflect the changed version.

You will probably need to issue a new bearer token, which you can achieve by repeating the previous shell command.

```ShellSession
[msavy@mmbp tmp]$ curl -k -H "Authorization: Bearer eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJmODAyZjFmMy1kN2JmLTQ0YjQtODA2N..." \
 https://127.0.0.1:8443/apiman-gateway/Newcastle/EchoService/2.0/rincewind/wizard
{
  "method" : "GET",
  "resource" : "/services/echo/rincewind/wizard",
  "uri" : "/services/echo/rincewind/wizard",
  "headers" : {
    "Authorization" : "Bearer eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJmODAyZjFmMy1kN2JmLTQ0YjQtODA2N...",
    "Host" : "127.0.0.1:8080",
    "User-Agent" : "curl/7.37.1",
    "Accept" : "*/*",
    "Connection" : "keep-alive",
    "Cache-Control" : "no-cache",
    "Pragma" : "no-cache"
  },
  "bodyLength" : null,
  "bodySha1" : null,
  "counter" : 19
}
```

As our user `rincewind` has the role `echomeister`, his request went through successfully.

However, if we try to access a resource for which he doesn't hold the appropriate role, we see an error message:

```ShellSession
[msavy@mmbp tmp]$ curl -k -H "Authorization: Bearer eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJmODAyZjFmMy1kN2JmLTQ0YjQtODA2N..." \
 https://127.0.0.1:8443/apiman-gateway/Newcastle/EchoService/2.0/secret/not/allowed

{
    "type": "Authorization",
    "failureCode": 10009,
    "responseCode": 0,
    "message": "The user is not authorized to make this request (a required role is missing).",
    "headers": {}
}
```

## In Conclusion...

We protected an apiman service using OAuth2; with examples of both simple authentication and role-based authorization. It should be easy to design your own role-based auth setups in combination with Keycloak.
