---
layout: post
title:  "A great way to test your custom apiman policy!"
date:   2015-05-09 09:07:45
author: Eric Wittmann
categories: policy junit testing
---
If you have tried creating your own custom apiman policy, you may have had a little bit of 
difficulty creating useful junit tests for it.  Many policies require various apiman
runtime components to be available.  It can be super annoying trying to use something like
mockito to create mock versions of everything your policy needs.  Even for simple policies 
you really just want a quick and effective way to test the implementation within a 
reasonably "real world" harness.

Well you've probably guessed by now that I'm about to show you how it's done!  (OK fine,
how it *will* be done in the next release of apiman - 1.1.3.Final)

<!--more-->

In this post I'll explain (and show!) you how to write a unit test for your apiman
policy, using the new Policy Tester junit framework we've created.  

## First you need a custom policy!

If you haven't created a custom apiman policy yet, have a look at the 
[Developer Guide](http://www.apiman.io/latest/developer-guide.html#_plugins) to
learn how.

So for example, let's say you've created your own simple custom policy class and it
looks like this:

{% highlight java %}
public class MySimplePolicy implements IPolicy {

    @Override
    public Object parseConfiguration(String jsonConfiguration) throws ConfigurationParseException {
        return jsonConfiguration;
    }

    @Override
    public void apply(ServiceRequest request, IPolicyContext context, Object config,
            IPolicyChain<ServiceRequest> chain) {
        request.getHeaders().put("X-MTP-Header", "Hello World");
        if (request.getHeaders().get("X-Fail-Test") != null) {
            IPolicyFailureFactoryComponent failureFactory = context.getComponent(IPolicyFailureFactoryComponent.class);
            chain.doFailure(failureFactory.createFailure(PolicyFailureType.Other, 42, "Failure"));
        } else {
            chain.doApply(request);
        }
    }

    @Override
    public void apply(ServiceResponse response, IPolicyContext context, Object config,
            IPolicyChain<ServiceResponse> chain) {
        response.getHeaders().put("X-MTP-Response-Header", "Goodbye World");
        chain.doApply(response);
    }
}
{% endhighlight %}

## OK I've got a policy, how do I test it?

Now that you've got your policy, you need a quick and effective way to test it.  I also
think it's important for your test to run quickly and for you to be able to easily set
breakpoints to debug the code.  We explored using [Arquillian](http://arquillian.org/) 
to configure and publish a service with the custom policy to a running WildFly server.
It actually works remarkably well, but the overhead of firing up a WildFly server just
to test a single policy seemed excessive.  That work will likely lead into a separate
testing effort focused on testing larger integration scenarios.

OK enough - let's get to the test!  The first thing you need is to pull the Policy
Tester dependency into your project's pom.xml:

{% highlight xml %}
<dependency>
   <groupId>io.apiman</groupId>
   <artifactId>apiman-test-policies</artifactId>
   <version>1.1.2-SNAPSHOT</version>
   <scope>test</scope>
</dependency>
{% endhighlight %}

Great - now just create a new junit test and make sure it extends the `ApimanPolicyTest`
base test class.  In that junit test you'll need to sprinkle in a few annotations
provided by the apiman Policy Testing framework.  At a minimum you will need to
include the `@TestingPolicy` and `@Configuration` annotations.  Both of these annotations
can be specified at either the *Class* or *Method* level. The former tells the testing
framework which policy is being tested.  The latter describes the policy configuration
that should be used for the test.

Just look at the example, already:

{% highlight java %}
@TestingPolicy(MySimplePolicy.class)
public class MyTestPolicyTest1 extends ApimanPolicyTest {

    @Test
    @Configuration("{}")
    public void testGet() throws Throwable {
        // Send a test HTTP request to the service (resulting in executing the policy).
        PolicyTestResponse response = send(PolicyTestRequest.build(PolicyTestRequestType.GET, "/some/resource")
                .header("X-Test-Name", "testGet"));
                
        // Now do some assertions on the result!
        Assert.assertEquals(200, response.code());
        EchoResponse entity = response.entity(EchoResponse.class);
        Assert.assertEquals("GET", entity.getMethod());
        Assert.assertEquals("/some/resource", entity.getResource());
        Assert.assertEquals("testGet", entity.getHeaders().get("X-Test-Name"));
        // Assert the request header that was added by the policy
        Assert.assertEquals("Hello World", entity.getHeaders().get("X-MTP-Header"));
        // Assert the response header was added by the policy
        Assert.assertEquals("Goodbye World", response.header("X-MTP-Response-Header"));
    }

}
{% endhighlight %}

## So what's going on here?

Let me tell you!  For each test method in your junit test, we'll actually spin up a fully
functional apiman API Gateway.  We'll also publish a test service that's configured with
your custom policy (and using the policy configuration you specified in the `@Configuration`
annotation).  After that, it's a simple matter of sending one or more simulated HTTP 
requests to the gateway.  You do that by sending a `PolicyTestRequest` to the `send` method.
Easy peasy!

Note that it's pretty easy to create a `PolicyTestRequest` - there's a nice little fluent
builder you can use to create it.  The builder allows you to set the HTTP verb, the resource
path, and any HTTP headers.

## What about the back-end API/service?

Yeah that's a good point.  Assuming your policy doesn't produce a failure, the API Gateway
we're using for the test needs to "invoke" a back-end service and return the result.  We
simulate this rather than actually going out and making a REST request.  By default, we
create a simple Echo back-end service which bundles up all the information in the REST
request (including anything your policy may have added to the request) and builds a JSON
response that includes all that information.  This is handy because it allows you to 
verify that, for example, any HTTP headers your policy added to the request actually 
made it through to the back-end service.

Now are you ready for an advanced topic?  If not I understand, you can just hit the Back
button on your browser!

Still here?  Great!  Another thing you can do is actually provide your own simulated
back-end service.  This is necessary sometimes when your policy does something 
specific with, for example, the service response payload.  You may actually need your
test to respond in a certain way.  To accomplish this all you need to do is use the
`@BackEndService` annotation, providing a *Class* that implements the
`IPolicyTestBackEndService` interface.  You do that, and we'll use your simulated
back end service for the test instead of the echo service!  :)

What would that look like?  Something like this:

{% highlight java %}
@TestingPolicy(MySimplePolicy.class)
public class MyTestPolicyTest1 extends ApimanPolicyTest {

    @Test
    @Configuration("{}")
    @BackEndService(MyCustomBackEndServiceImpl.class)
    public void testGet() throws Throwable {
        // Send a test HTTP request to the service (resulting in executing the policy).
        PolicyTestResponse response = send(PolicyTestRequest.build(PolicyTestRequestType.GET, "/some/resource")
                .header("X-Test-Name", "testGet"));

        // Now do some assertions on the result!
        MyCustomBackEndServiceResponseBean entity = response.entity(MyCustomBackEndServiceResponseBean.class);
        
        // Do some more assertions here using the entity from above!
    }

}
{% endhighlight %}

Alright - if you made it this far thanks for reading!!

/post
