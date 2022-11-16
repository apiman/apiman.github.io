---
layout: post
title:  "3scale and apiman - Part Deux"
date:   2016-08-19 11:00:00
author: eric_wittmann
tags: apiman 3scale
---

It's been almost two months since Red Hat announced it was acquiring 3scale Technologies and turning 
the 3scale API Management solution into a Red Hat supported product.  In that time, we've been trying 
to figure out some stuff for the apiman community.  Here some of the things we wanted to suss out:

* How the apiman development team can best focus its efforts, now that 3scale will be the basis for Red Hat's API Management technology.
* How to best support the existing apiman community going forward, given the restrictions on continued development of the apiman API Management solution.
* How can existing apiman users transition to a Red Hat supported API Management solution.

It doesn't sound like much, but it actually really is.  We've made some preliminary decisions, and 
because we want to be as transparent and upfront as possible, read on to find out what they are!

<!--more-->

I know everyone in the apiman community probably has a lot of questions, so let's dive right in (with 
the most important questions first).  Please note that none of this is written in stone - software 
development in general, and this situation in particular, is often very fluid.  I'm saying we reserve 
the right to change our minds!  But this post represents the best information we have right now - and 
we like to keep the apiman community in the loop as much as possible.

Of course, if you have questions that aren't covered by this post (very likely!) you can always find 
us on IRC or send questions to the mailing list.  Links to both can be found up above in the "Get 
Involved" menu.


## What will happen to the current apiman API Management solution?
We discussed a number of options, but we think it's best for everyone if we put the full apiman API 
Management solution into maintenance mode.  What does this mean?  Well, it means that we will address 
critical bugs and any issues that are trivial to implement/fix.  Of course, we will continue to accept 
community contributions, making sure that they meaningfully improve the overall solution.  This will 
allow anyone using a current version of apiman to continue using it, without worrying about the 
community edition disappearing.  However, it DOES mean that you should not expect significant new 
features to be added (unless they are contributed by the larger apiman community).

It should be noted that apiman continues to be extremely extensible - so there's nothing stopping 
individual users from implementing their own core apiman components and/or custom policies.  While 
we would prefer it if custom components and policies developed by users were contributed back to 
the project, we understand that it's often either not appropriate or not possible.

We explored the idea of donating the apiman project to a popular open source software foundation 
(e.g. apache or eclipse) but decided that it was premature.  The idea hasn't been ruled out for 
the future, but for now we're going to keep apiman right where it is.


## What is the migration path from apiman to Red Hat's 3scale-based API Management product?
Obviously not all of our users were specifically looking for a Red Hat supported version.  It's 
certainly the case that many are perfectly happy using the community edition.  That said, many of 
you may be wondering what the migration path will be from the apiman community edition to Red Hat's 
API Management solution.  

There are actually several aspects to this problem, and we won't be able to solve them all.  Ultimately 
the answer is that there won't be any sort of automatic migration from an apiman configuration to a 3scale 
one.

*However*, we will be updating apiman's API Gateway to work with the 3scale solution (acting as an optional 
replacement for e.g. the 3scale NGINX-based gateway) while also supporting all existing apiman policies.  
Effectively, this will result in an API Gateway that will implement the 3scale gateway functionality *and* 
the apiman gateway functionality (including custom policies!) in one neat package.  For those of you in 
the community who have invested time and effort into creating your own custom policies, this will allow 
you to continue using them!  Not only that, but you will continue to have access to all of the policies 
that exist today in apiman (along with any new ones we might release in the future).

Additionally, we will be releasing a standalone community version of this new API Gateway - a version that 
can be configured and can operate without any additional components (3scale or otherwise).  At the same 
time, we will have a version that works in conjunction with the current 3scale platform (again, as an 
alternative to the 3scale NGINX- based gateway).


## Will the apiman team be working on the 3scale API Management product?
Other than creating and maintaining the already mentioned Java-based API Gateway, the apiman team will not 
be contributing significantly to the 3scale API Management product/platform at this time.  There are a 
number of reasons for this, but the primary issue is that apiman and 3scale have chosen very different 
languages and technologies as the basis for our respective solutions.  We don't have any experience/expertise 
in the technologies that make up the 3scale platform, and vice versa.

Fortunately, 3scale already has a superb team of engineers, testers, and designers.  I'm quite certain that 
the future of Red Hat's API Management technology is very bright!


## So what cool new projects will the apiman team be working on?
Well we've already mentioned the new (repurposed?) API Gateway that will go a long way to bring together the 
3scale and apiman technologies.  In addition to that, we have a few new things in the pipeline.

One additional API Management related mini-project that we've already put together is a standalone Rate 
Limiting [Micro-]Service.  The goal of "apiman-rls" is to create a specially designed server that can manage 
large numbers of rate limits in an efficient and accurate way.  A new github repository has already been 
created and we've already got a prototype implementation, which you can find here:

[https://github.com/apiman/apiman-rls](https://github.com/apiman/apiman-rls)

Additionally, we're exploring a number of other new projects, although it's too early to talk about them
yet (no final decisions have been made).  Keep your eye on this space for future announcements!


## Conclusion/Final Thoughts
As always, thanks for reading this blog post.  And of course, thank you to the entire apiman community 
for your interest, support AND for being awesome!  Of course we would have preferred to see the apiman 
project continue to be Red Hat's commercial API Management solution.  That wasn't in the cards, but I 
know that we and the newly acquired 3scale team will do their damndest to push out the best API Management 
solution possible!

Finally, here are some takeaways from this post, just to reinforce them.

* Apiman is staying right where it is, but will be put into "maintenance" mode - we'll only be working on critical bugs and easy-to-implement issues.
* We'll be releasing a new version of the API Gateway that works with the 3scale technology, but ALSO functions in a standalone community mode.
* All existing apiman policies will be ported to the new API Gateway.
* Custom apiman policies will be trivial to modify such that they work in the new API Gateway.
* New apiman branded project:  Rate Limiting [Micro-]Service (apiman-rls)


## Our contributors

### Core team:
* Eric Wittmann [https://github.com/EricWittmann](https://github.com/EricWittmann)
* Marc Savy [https://github.com/msavy](https://github.com/msavy)
* Rachel Yordán [https://github.com/kahboom](https://github.com/kahboom)

### Thank you to our community contributors, in commit order:
* Gary Brown [https://github.com/objectiser](https://github.com/objectiser)
* Brett Meyer [https://github.com/brmeyer](https://github.com/brmeyer)
* Rubén Romero Montes [https://github.com/ruromero](https://github.com/ruromero)
* Kurt Stam [https://github.com/kurtstam](https://github.com/kurtstam)
* Jorge Morales Pou [https://github.com/jorgemoralespou](https://github.com/jorgemoralespou)
* Jakub Cechacek [https://github.com/jcechace](https://github.com/jcechace)
* Brandon Gaisford [https://github.com/bgaisford](https://github.com/bgaisford)
* eprogramming
* Alexandre Kieling [https://github.com/alexkieling](https://github.com/alexkieling)
* Kevin Horvatin [https://github.com/KevinHorvatin](https://github.com/KevinHorvatin)
* Ton Swieb [https://github.com/tonswieb](https://github.com/tonswieb)
* Charles Moulliard [https://github.com/cmoulliard](https://github.com/cmoulliard)
* Boris Korogvich [https://github.com/VEINHORN](https://github.com/VEINHORN)
* Pete Cornish [https://github.com/outofcoffee](https://github.com/outofcoffee)
* Andrea Rizzini
* Wojciech Trocki [https://github.com/wtrocki/](https://github.com/wtrocki/)
* Santiago
* Nick Cross [https://github.com/ncross](https://github.com/ncross)
* Bram Vonk [https://github.com/bramvonk](https://github.com/bramvonk)
* Ayman Abdelghany
* Paul Semprini [https://github.com/Semprini](https://github.com/Semprini)
* Bennet Schulz [https://github.com/bennetelli](https://github.com/bennetelli)

/post
