[![Build Status](https://travis-ci.org/q2a/q2a.github.io.svg?branch=master)](https://travis-ci.org/q2a/q2a.github.io)

# Question2Answer Website

Question2Answer.org is hosted by Gideon Greenspan and includes the following items:

* http://question2answer.org/ -- Home page
* http://question2answer.org/qa/ -- A "meta" Q2A site to discuss using Q2A
* http://question2answer.org/sites.php -- A list of large sites running Q2A
* http://question2answer.org/addons.php -- Language packs and Plugins

This repository holds the new site at [docs.question2answer.org](http://docs.question2answer.org/) and generates it live using GitHub Pages. Everyone is welcome to contribute improvements.


## Project status

- [ ] Redirect pages from question2answer.org to q2a.github.io (see https://github.com/q2a/question2answer/issues/374)


## How to Contribute

This site is created and hosted on GitHub pages, which is built on Jekyll. Documentation for creating a local development environment with these tools is at:

- https://help.github.com/articles/using-jekyll-with-pages/

To run this site locally, type:

    bundle exec jekyll serve

To run the validation suite:

    jekyll build && htmlproof --disable-external --check-html _site/

Then access:

 > http://localhost:4000/
