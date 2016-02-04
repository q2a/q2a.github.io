[![Build Status](https://travis-ci.org/q2a/q2a.github.io.svg?branch=master)](https://travis-ci.org/q2a/q2a.github.io)
# Question2Answer Website

The website http://www.question2answer.org/ is hosted personally by Gideon Greenspan and includes the following items:
 * http://question2answer.org/qa/ -- A "meta" Q2A site to discuss using Q2A
 * http://question2answer.org/sites.php -- A list of large sites running Q2A
 * http://question2answer.org/addons.php -- Language packs (see https://github.com/q2a/question2answer/issues/343)
 * http://question2answer.org/ -- User and developer documentation for the Q2A project (should be removed, see https://github.com/q2a/question2answer/issues/374)

This repository holds the new site at https://q2a.github.io/ and generates it live using GitHub Pages. Everyone is welcome to contribute improvements.


## Project status

- [ ] Update `baseurl` and `url` in `_config.yml` to be `/` and `http://question2answer.org` or `https://question2answer.org`
- [ ] Set up DNS for question2answer.org to be a CNAME for q2a.github.io (see https://github.com/q2a/question2answer/issues/341#issuecomment-180067458)
- [ ] Link from question2answer.org to q2a.github.io (see https://github.com/q2a/question2answer/issues/374)
- [ ] Remove content from question2answer.org which is also on q2a.github.io (see https://github.com/q2a/question2answer/issues/374)
- [ ] Ensure all integration tests pass -- `htmlproof --disable-external _site/` or see Travis output


## How to Contribute

This site is created and hosted on GitHub pages, which is built on Jekyll. Documentation for creating a local development environment with these tools is at:

 - https://help.github.com/articles/using-jekyll-with-pages/

To run this site locally, type:

    bundle exec jekyll serve

To run the validation suite:

    jekyll build && htmlproof --disable-external --check-html _site/

Then access:

 > http://localhost:4000/question2answer.org/
