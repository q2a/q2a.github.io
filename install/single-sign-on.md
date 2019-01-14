---
layout: page
menu: install
title: "Question2Answer - Single Sign-On Integration"
---

# Installing Question2Answer with single sign-on

Question2Answer is designed to integrate with websites which have an existing user database and management system. If your site is running WordPress 3.x, you should follow the instructions for [WordPress integration](/install/wordpress/). To implement single sign-on for other sites, a small amount of PHP programming is required. Please follow the instructions below:

1. Download the [latest version of Question2Answer](https://github.com/q2a/question2answer/releases) to your computer or web server (also available [on GitHub](https://github.com/q2a/question2answer)).

2. Unzip the download using a tool such as [WinZip](http://www.winzip.com/) (or `unzip` in the Unix shell).

3. Set up a MySQL database and user for Question2Answer:
    - If your website already uses a MySQL database, Question2Answer can share it. Simply ensure that the MySQL user you use has at least these [privileges](http://dev.mysql.com/doc/mysql/en/privilege-system.html): CREATE, ALTER, DELETE, INSERT, SELECT, UPDATE, LOCK TABLES.
    - Otherwise, create a new MySQL database and a MySQL user with the privileges: CREATE, ALTER, DELETE, INSERT, SELECT, UPDATE, LOCK TABLES.

4. Find `qa-config-example.php` and `.htaccess-example` in the unzipped `question2answer` folder, and rename them to `qa-config.php` and `.htaccess`, respectively.

5. Open `qa-config.php` in the text editor you use for PHP programming. Insert the MySQL details at the top, then scroll down and set `QA_EXTERNAL_USERS` to `true`, then save the file.

6. Find the `qa-external-example` subfolder in the unzipped `question2answer` folder, and rename it to `qa-external`.

7. In the `qa-external-users.php` file in the `qa-external` folder, modify the `qa_get_mysql_user_column_type()` function to return the appropriate [MySQL column type](http://dev.mysql.com/doc/mysql/en/data-types.html) for your user identifiers. For example, if you use textual identifiers, return `[VARCHAR(x)](http://dev.mysql.com/doc/mysql/en/char.html)`, where `x` is the maximum length. If you use numerical identifiers, return the appropriate [numeric type](http://dev.mysql.com/doc/mysql/en/numeric-types.html), such as `INT UNSIGNED` or `BIGINT`. Ensure you get this right because it will be used in many of Question2Answer's MySQL tables.

8. Place all the contents of the `question2answer` folder (**including .htaccess and your changes**) in the appropriate location on your web server.

9. Open the web page corresponding to this location in your web browser.

10. Follow the on-screen instructions to set up your database with single sign-on integration.

11. Now go back to `qa-external-users.php` and read it through in full. You will need to modify several functions in order to complete the single sign-on integration. Everything is explained in this file, and lots of examples are included.
