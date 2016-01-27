
---
layout: post
title:  "Apiman 1.2.1 Export and Import"
date:   2016-01-26 20:30:00
author: len_dimaggio
categories: apiman
---

### The Question you Dread

If you use a computer at home or at work, you'll eventually find yourself in a situation where you lose some important data and, while you are trying to recover it, someone asks you a question that is simultaneously annoying and terrifying:

*"Did you make a backup?"*

Happily, the 1.2 release of apiman includes a new feature that enables you to export and import your apiman data and provides you with an easy means to create apiman data backups.  In this post,  we'll take a look at the new export/import feature, and how you can use it for a variety of tasks to protect your data, make your life easier, and enable you to avoid annoying and terrifying questions.

For test data, we'll use the same types of data (organizations, users, plans, policies, APIs and client apps), that we created in the initial post in this series. (  [The Impatient New User Guide to apiman](http://www.apiman.io/blog/introduction/overview/2015/01/09/impatient-new-user-redux.html) )

Note that since that post was written in January 2015, some of the names of the data elements have changed. You can either create the test data referred to in this post yourself, or you can import the data file attached to the post.

### Export/Import in apiman 1.2.1

The new export/import feature in apiman 1.2.1 enables you to export your apiman configuration data to a file, which can later be imported into an apiman system. Note that this feature follows an all-or-nothing approach in that is does not support incremental backup and restore of selected apiman data. 

The three main use cases that the export/import feature supports are:

- Backing up all your apiman data
- Upgrading to a newer version of apiman
- Migrating apiman data from a Test environment to a Production environment

The export/import operations are only available to Administrative users. The export/import feature is accessed through the admin operations menu:

![Image: Admin Choices](/blog/images/2016-01-26/export_import_1.png)

Once you select the **Export/Import** Data feature, this menu is displayed:

![Image: Export/Import Menu](/blog/images/2016-01-26/export_import_2.png)

One thing to keep in mind is that while you are importing or exporting data, no changes to data should be made or else the export/import may encounter an error, or may result in incomplete results. To be safe, you should disable user access to the API Manager, both the Management UI and its REST interface, for the duration of the import or export operation.

We'll look at exporting data first.

### Backing up apiman Data

To make a backup of all your apiman data, simply select the "Export All" button. The apiman data will be written to a file and downloaded by your browser. Your browser's settings will determine where the file is saved.

The apiman data is written to a file named: api-manager-export.json

As its name indicates, the apiman data is written in JSON form. This format provides us with  several advantages. First of all, it's the format in which apiman is able to import data. (We'll perform an import later in this post.) Secondly, it's a text file where the contents of the file are human readable. The content of the file is ALL the apiman data, both the data elements that you have created and the data elements with which apiman is preconfigured.

Reading this file can greatly increase your understanding of the elements that are defined in apiman. Let's take a look at the elements in the file:

- **Users** - The preconfigured "admin" user is defined here, as are the new users we create.
- **Gateways** - The preconfigured apiman Gateway is defined here.
- **Roles** - The preconfigured, permission-based roles, and new roles that we create, are defined here. For example, the "OrganizationOwner" role is shown to have these permissions: [ "apiAdmin", "orgAdmin", "apiView", "orgEdit", "clientEdit", "clientAdmin", "planView", "orgView", "planAdmin", "clientView", "planEdit", "apiEdit" ]
- **Policy Definitions** -  Next, the preconfigured policies, and new policies t2015-11-12-micro-services.markdownhat we create, are defined here. For example: the "RateLimitingPolicy" is described as "Enforces rate configurable request rate limits on an API.  This ensures that consumers can't overload an API with too many requests."
- The remainder of the file includes the elements that we create: **Organizations, Plans, APIs, and Client Apps**. For example, here is the definition of the "echo" API that we created:

```json
"Apis" : [ {
  "ApiBean" : {
  "id" : "echo",
  "name" : "echo",
  "description" : "The echo API",
  "createdBy" : "serprov",
  "createdOn" : 1453773184836,
  "numPublished" : 1
 },
 "Versions" : [ {
  "ApiVersionBean" : {
    "id" : 10,
    "status" : "Published",
    "endpoint" : "http://localhost:8080/apiman-echo",
    "endpointType" : "rest",
    "endpointContentType" : "json",
    "endpointProperties" : { },
    "gateways" : [ {
      "gatewayId" : "TheGateway"
    } ],
    "publicAPI" : false,
    "plans" : [ {
      "planId" : "gold",
      "version" : "1.0"
    } ],
    "version" : "1.0",
    "createdBy" : "serprov",
    "createdOn" : 1453773184845,
    "modifiedBy" : "serprov",
    "modifiedOn" : 1453773312563,
    "publishedOn" : 1453773327835
  },
  "Policies" : [ {
    "id" : 14,
    "type" : "Api",
    "organizationId" : "ACMEServices",
    "entityId" : "echo",
    "entityVersion" : "1.0",
    "name" : "BASIC Authentication Policy",
    "configuration" : "{\"realm\":\"Echo\",\"requireBasicAuth\":false,\"staticIdentity\":{\"identities\":[{\"username\":\"user1\",\"password\":\"admin123!\"}]}}",
    "createdBy" : "serprov",
    "createdOn" : 1453773312553,
     "modifiedBy" : "serprov",
     "modifiedOn" : 1453773312553,
     "definition" : {
      "id" : "BASICAuthenticationPolicy",
      "templates" : [ ],
      "deleted" : false
    },
    "orderIndex" : 1
  } ]
```

One thing to remember is that the exported data file represents ALL apiman data. It's not yet possible to perform incremental data backups in apiman. If you attempt to import the data from this file into the same apiman installation from which it was generated, you will see unique primary key violations as the import operation will attempt to create duplicate data elements.

OK, now that we have this exported data file, what can we do with it?

Well, obviously, if something goes wrong with your installation of apiman, you can start over with a clean installation, and instead of manually recreating your data, you can import the data. (Personal note from the author: I work in software test/QE. Part of our testing is always destructive in nature. As a result, we are always "messing up" test data. The export/import feature enables us to quickly reinstall apiman and recover a clean test environment.) To perform the import after a new installation of apiman, you simply select and upload  the exported data file:

![Image: Admin Choices](/blog/images/2016-01-26/export_import_3.png)

The Management UI displays the status of the import as the data is processed:

![Image: Admin Choices](/blog/images/2016-01-26/export_import_4.png)

How else can we use the exported data file?

### Upgrading to a Newer Version of apiman

One of the best aspects of open source projects is the rapid rate at which new features are implemented and new versions are released. It's exciting to watch projects quickly mature as features are added and bugs are fixed, and since the projects are open source, you can even make your own contributions. This has been the case with apiman over the past several months. New features have been added such as metrics and support for creating custom policies.

One downside to all the rapid change is that as new versions of apiman have been released, we've had to recreate all our apiman data as there was no way to migrate apiman data from one release to the next. The export/import feature now gives us a way to export apiman data from one apiman release and import it into a new apiman release.

NOTE: In cases where the apiman data model changes between versions, apiman will introduce tools to transform the JSON export file from an older format to the latest.  It has not yet been decided whether those tools will be built into the Import process, or released as a standalone utility.

### Migrating apiman Data from a *Test* Environment to a *Production* Environment

It's a common practice for organizations to maintain two separate installations of software releases:

A test environment, where the goal is to experiment with new features. This is typically an internal environment that gives up some measure of stability in exchange for the ability to "try out" new features as they become available. The rate of change for this environment is high as any disruption in service in this environment do not affect customers.
A production environment, where the goal is stability. This is the environment that supports your customers. Changes happen slowly in this environment and new features are only installed after they are carefully tested as disruptions in service in this environment do affect customers.

The new export/import feature in apiman 1.2 makes it possible for you to experiment with changes in your test environment, and, after the changes have been found to be stable, to easily migrate your test data from the test environment into your production environment. (You will, of course, create a backup of your production environment data before making any changes.  ;-)

### Migrating apiman from one storage solution to another

Finally, when apiman is first installed, you must make various decisions about its configuration.  One of these decisions is where to store configuration and data.  When you first install apiman, you might decide that MySQL is the right choice.  However, somewhere along the line you might change your mind - perhaps you want to switch to postgresql, or even more drastically you might switch to Elasticsearch!  The Export/Import process described here solves the problem of how to migrate all your data from one storage location to another.

The process is basically the same as upgrading to a newer version of apiman.  But instead you will be upgrading to the same version of apiman, but with a different configuration.  Because the exported data is in a neutral (JSON) format, we can easily import into the new configuration.  This will result in all your data being migrated from MySQL to Elasticsearch (for example).

### In Conclusion

The new export/import feature in apiman 1.2 provides an easy way to safeguard your apiman data and to make it possible to migrate your data between apiman releases and installations. In addition, since the exported data is human readable, it is a great resource for better understanding apiman data structures. And, it's easy to use too!

/post


