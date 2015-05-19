
# The apiman Blog How-To

## What is it?

The apiman blog is just a static set of HTML pages produced by jekyll:

http://jekyllrb.com/

## Creating a Post

All you need to do is create your blog post as a single file in the _posts
directory.  Multiple formats are supported, but we typically stick to 
markdown or asciidoc.

Follow the pattern of existing file names:

YYYY-mm-dd-shortname.markdown

At the top of your blog post, make sure to include the basic post meta-data
such as title, date, and author.  For example:

    ---
    layout: post
    title:  "Authorization: good god, what is it good for?"
    date:   2015-05-08 13:15:15
    author: Eric Wittmann
    categories: authorization authentication policy
    ---

Each blog post should have an 'excerpt' so that the feed and the summary
page can use it.  The excerpt is just the first paragraph or two of your
post.  More specifically, it's everything between the meta-data section 
and the separator:

    <!--more-->

## Testing Your Blog Post

As your write your post, you probably want to see how it looks in the blog.
To do that, you must have jekyll installed.  You can run this from the 
_blog-src directory:

    jekyll serve

This will start up jekyll and serve the blog content on port 4000.  Once
that's running, you can test it by pointing your browser here:

http://localhost:4000/blog/

## Generating the Blog

Once everything is good, you can regenerate the blog by running jekyll
like this:

    jekyll build


