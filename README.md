[![Build Status](https://travis-ci.org/fulldecent/question2answer.org.svg?branch=gh-pages)](https://travis-ci.org/fulldecent/question2answer.org)

# Question2Answer Website

RIGHT NOW, the http://www.question2answer.org/ site is hosted personally by Gideon Greenspan. This project proposes to replace that website with something that is easier for the public to share in maintaining and improving. Otherwise, changes during the transition are minimized.

YOU CAN PREVIEW THIS NEW WEBSITE AT https://fulldecent.github.io/question2answer.org/ WHICH IS GENERATED, LIVE, FROM THIS SOURCE IN THIS REPOSITORY.

Benefits of this candidate to replace the current website:

 * Changes are *very* simple for casual contributors
 * Authority to accept updates may be delegated (accept pull requests)
 * The website can be updated immediately when changes are approved
 * Continuous integration testing provided by Travis CI
 * Jekyll is the most popular tool for documentation / website generation on GitHub projects


## Project status

This project is **currently in BETA status**. Please leave issues or pull requests for anything you would like to improve. SCOPE OF THIS PROJECT AT THIS TIME IS TO REPLACE http://www.question2answer.org/, PLEASE SAVE MORE AMBITIOUS PLANS (RETHEMING, UPDATING CONTENT, ETC.) UNTIL AFTER THE SWITCHOVER.

Following are items not yet completed:

 - [ ] Ensure all integration tests pass -- `htmlproof --disable-external _site/` or see Travis output
 - [x] Copy all pages:
    - [x] http://www.question2answer.org
    - [x] http://www.question2answer.org/addons.php
    - [x] http://www.question2answer.org/addons.php?old=1
    - [x] http://www.question2answer.org/bot.php
    - [x] http://www.question2answer.org/developers.php
    - [x] http://www.question2answer.org/external.php
    - [x] http://www.question2answer.org/feedback.php
    - [x] http://www.question2answer.org/functions.php
    - [x] http://www.question2answer.org/install.php
    - [x] http://www.question2answer.org/layers.php
    - [x] http://www.question2answer.org/license.php
    - [x] http://www.question2answer.org/modules.php
    - [x] http://www.question2answer.org/developers-modules-captcha
    - [x] http://www.question2answer.org/developers-modules-editor
    - [x] http://www.question2answer.org/developers-modules-event
    - [x] http://www.question2answer.org/developers-modules-filter
    - [x] http://www.question2answer.org/developers-modules-login
    - [x] http://www.question2answer.org/developers-modules-page
    - [x] http://www.question2answer.org/developers-modules-process
    - [x] http://www.question2answer.org/developers-modules-search
    - [x] http://www.question2answer.org/developers-modules-viewer
    - [x] http://www.question2answer.org/developers-modules-widget
    - [x] http://www.question2answer.org/optimize.php
    - [x] http://www.question2answer.org/overrides.php
    - [x] http://www.question2answer.org/plugins-tutorial.php
    - [x] http://www.question2answer.org/plugins.php
    - [x] http://www.question2answer.org/secure.php
    - [x] http://www.question2answer.org/services.html
    - [x] http://www.question2answer.org/single-sign-on.php
    - [x] http://www.question2answer.org/sites.php
    - [x] http://www.question2answer.org/developers-themes.html
    - [x] http://www.question2answer.org/translate.php
    - [x] http://www.question2answer.org/versions.php
    - [x] http://www.question2answer.org/wordpress.php
 - [x] Fix redirects from old URLs -- see https://github.com/jekyll/jekyll-redirect-from/issues/92 -- FAIL: it is not possible for GitHub pages to redirect from the old *.php URLs, there will be a few broken URLs and there is nothing we can do about this
 - [x] Validate all HTML
 - [x] Add sub-nav for INSTALL PAGES, etc.
 - [x] https://stackoverflow.com/questions/34568526/php-built-in-webserver-with-extensionless-urls
 Check that all links works and are relative where appropriate


## How to Contribute

This site is created and hosted on GitHub pages, which is built on Jekyll. Documentation for creating a local development environment with these tools is at:

 - https://help.github.com/articles/using-jekyll-with-pages/

To run this site locally, type:

    bundle exec jekyll serve

To run the validation suite:

    jekyll build && htmlproof --disable-external --check-html _site/

Then access:

 > http://localhost:4000/question2answer.org/


## Deployment

When this project is ready for release, the following steps will complete the deployment:

 - [ ] Create **sites.question2answer.org** server and move `sites.php` to there (https://github.com/q2a/question2answer/issues/344)
 - [ ] Create **qa.question2answer.org** server and move `/qa/` to there (https://github.com/q2a/question2answer/issues/345)
 - [ ] Add all third-party language packs to the GitHub release, they should not be stored on this server (https://github.com/q2a/question2answer/issues/343)
 - [ ] Move this repository to https://github.com/q2a/question2answer.org this will cause this website to be built at https://q2a.github.io/question2answer.org/ (temporarily) and it will allow GitHub servers to respond to HTTP requests for question2answer.org
 - [ ] Add a public email address for contact at http://codelair.com/ (GitHub pages does not allow PHP contact forms, we are referencing this contact information from feedback.md) (https://github.com/q2a/question2answer/issues/346)
 - [ ] Update `baseurl` and `url` in `_config.yml` to be `/` and `http://question2answer.org` or `https://question2answer.org`
 - [ ] Set up DNS for question2answer.org to be a CNAME for q2a.github.io (see https://help.github.com/articles/tips-for-configuring-a-cname-record-with-your-dns-provider/)

After these deployment steps are complete, a new project will exist at https://github.com/q2a/question2answer.org. Then the scope of this project will change to include material updates to the website (spelling/grammar fixes, documentation content, new content, updated theme, etc.)
