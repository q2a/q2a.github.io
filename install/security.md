---
layout: page
menu: install
title: "Question2Answer - Optimization"
---

# Making Question2Answer extra secure

So long as your web server is configured correctly, Question2Answer will not reveal anything inappropriate to visitors of the site, or compromise your data. It prevents [SQL injection](http://en.wikipedia.org/wiki/SQL_injection), [cross-site scripting](http://en.wikipedia.org/wiki/Cross-site_scripting) (XSS), [cross-site request forgery](http://en.wikipedia.org/wiki/Cross-site_request_forgery) (CSRF) and form spoofing attacks by checking and/or escaping all user input as appropriate. In order to be extra secure, you may wish to take the following additional steps after installation:

1. Upgrade to the latest version of PHP. Newer versions may contain security fixes that have not been backported to older, unsupported versions.

2. Remove the `qa-install.php` file inside the `qa-include` directory of your Question2Answer installation. If for some reason your MySQL database is lost or corrupted, this prevents normal users from being able to create a new database or repair tables.

3. Move the `qa-config.php` file to a location which is outside any directory served by your web server. Then create a new `qa-config.php` file in its place which references the old file using the [require](http://php.net/manual/en/function.require.php) PHP function. If your web server were to become misconfigured and start serving the raw code in `.php` files, this would ensure that your MySQL details remain hidden.

4. Set up a regular backup schedule for the MySQL database used by Question2Answer. This will enable you to recover your site's content if the database becomes corrupted, e.g. due to a catastrophic disk failure. To save space and time, you need not back up the following tables:

        qa_cache
        qa_contentwords
        qa_iplimits
        qa_posttags
        qa_sharedevents
        qa_tagwords
        qa_titlewords
        qa_userevents
        qa_userlimits
        qa_words

    These contain information which is temporary or which can be recalculated from other tables in the database. After restoring from a backup, Q2A will automatically offer to recreate these tables, after which you should click each of the 'Recalculate'-style buttons at the bottom of the 'Stats' page of the 'Admin' panel.
