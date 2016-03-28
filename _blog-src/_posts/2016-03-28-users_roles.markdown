---
layout: post
title:  "Apiman 1.2 - Introduction to User Roles in apiman"
date:   2016-03-28 07:00:00
author: len_dimaggio
categories: apiman introduction overview users roles
---

In this post, we’ll examine apiman user roles. In the apiman data model, all data elements exist in the context of the organization. The same holds true for user memberships as users can be members of multiple organizations. Permissions in apiman are role based. The actions that a user is able to perform are dependent on the roles to which the user is assigned when a user is added as a member of an organization.

<!--more-->

Let’s start by looking at the roles that are preconfigured in apiman.

### Understanding OOTB apiman user roles

In apiman, each role defines a set of permissions granted by that role. When a user is made a member of an organization, that user must be assigned to a role. A role definition consists of a name and description, and, most importantly, a set of permissions that govern the user’s ability to view, edit, and administer the organization itself, as well as the organization’s plans, APIs, and applications.

Roles are managed in the Roles section of the apiman System Administration form in the Management UI. 

Apiman is preconfigured with the following roles:

- Organization Owner
- API Developer
- Client App Developer

These role names are self-explanatory. For example, a user assigned the Application Developer role is able to manage the organization’s applications but is blocked from managing its APIs or plans.

The full set of permissions provided in apiman by these preconfigured roles are:

Preconfigured apiman Role: Client App Developer  
Who Should be Assigned this Role: Users responsible for creating and managing client apps
Permissions Granted to this Role: 
- Client App View
- Client App Edit
- Client App Admin

| Preconfigured apiman Role    | Who Should be Assigned this Role    | Permissions Granted to this Role     |
| :--------------------------- |:-----------------------------------:| :-----------------------------------:|
| Client App Developer         | Users responsible for creating and managing client apps | Client App View, Client App Edit, Client App Admin |
| Organization Owner           | Automatically granted to the user who creates an Organization |   All permissions = Client App View, Client App Edit, Client App Admin, Plan View, Plan Edit, Plan Admin, API View, API Edit, API Admin, Organization View, Organization Edit, Organization Admin |
| API Developer                | Users responsible for creating and managing APIs |  Plan View, Plan Edit, Plan Admin, API View, API Edit, API Admin |

Organization owners can assign roles to users through the “Manage Members” form in the apiman Management UI. Each user must be assigned at least one role, but users can also be assigned multiple roles. 

We’ll walk through an example of assigning a role to a user in a moment.

While apiman admin users can also modify the permissions as defined for these preconfigured roles, it can be easier to create new custom roles. We will also walk through an example of creating a new user role later in this post.

### Assigning/Revoking Roles for Organization Users

It’s worth repeating that all data elements in apiman exist in the context of an organization.  As a result, it is important to understand that users can only manage these elements if they have the appropriate role for the organization in which the elements exist.  Therefore, a user must be granted membership in an organization. 

It’s not possible for users to assign themselves roles. Roles must be assigned to a user by an organization owner. Assigning a role to a user is a straightforward task for an organization owner. 

First, the organization must search for the user:

![Image: Search for User](/blog/images/2016-03-28/roles_1.png)

And then, the organization owner can assign a role to the user from the existing set of roles:

![Image: Assign Role](/blog/images/2016-03-28/roles_2.png)

Revoking a role for a user is just as easy. The organization owner simply has to search for the user, and then deselect a role for the user.

The same approach for assigning/revoking a role for a user is followed for the standard roles that are preconfigured in apiman, and for custom roles that you create.

### Creating a New User Role/Defining the Role Permissions

In addition to providing a set of preconfigured roles, apiman also provides a means for apiman admin users to create new roles where you can define a custom set of permissions for each role. Custom roles give you the ability to exercise fine-grained control over the set of permissions granted to users. 

Let’s look at an example of a custom role. 

Imagine a situation where you have API developer users and application developer users. These sets of users can rely on apiman’s preconfigured roles. Let’s also imagine that you have a third set of user. You want these users to have read access to APIs and applications so that they can participate in a review/approval process. However, you do not want to give these users write access. For example, suppose you have to find a job for a certain relative of yours. He may be a thoroughly competent person, but you’d feel better if he didn’t have write access to anything valuable. A read-only role for your brother in law would look something like this:

![Image: Define New Role](/blog/images/2016-03-28/roles_3.png)

Once the “brother-in-law” role is created, you can assign it to other users in the same manner as any other role:

![Image: View the Roles](/blog/images/2016-03-28/roles_4.png)

### In Conclusion

A consistent pattern in apiman is a rich set of features provided OOTB, and a method for you to expand on these features by creating customizations. User roles enable you to assign users permissions based on the tasks that they perform. Apiman is preconfigured with a rich set of roles OOTB, and also enables you to create new, custom roles to handle additional types of users (even your brother-in-law).

/post
