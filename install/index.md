---
layout: page
menu: install
title: "Install Question2Answer"
---

# Question2Answer takes 5 minutes <span class="highlight">(or less!)</span> to install.

In most cases, installing Question2Answer for your website should be dead easy. Please follow the steps below.

## Before you install Question2Answer

Make sure you have:

- A web server which you can access via [FTP](http://en.wikipedia.org/wiki/File_Transfer_Protocol) or [SFTP](http://en.wikipedia.org/wiki/SSH_file_transfer_protocol).
- A [text editor](http://en.wikipedia.org/wiki/Text_editor).
- A web browser.

And make sure your web server is running:

- Web serving software such as [Apache](http://httpd.apache.org/) or [Nginx](http://nginx.org/).
- [PHP](http://www.php.net/) 5.2 or later, with the [MySQLi](http://en.wikipedia.org/wiki/MySQLi) extension.
- [MySQL](http://www.mysql.com/) 4.1 or later, MySQL 5.x for best performance.

If you are not sure about this, please check with your web hosting provider.

## Installing Question2Answer for the first time (without single sign-on)

The instructions below are for installing Question2Answer where it manages user accounts and logins for you. If you would like Question2Answer to integrate with your existing user database and account system, see the instructions for [single sign-on](/install/single-sign-on/) installation. From version 1.4, Question2Answer also offers easy [integration with a WordPress 3.x](/install/wordpress/) site and user database.

1. Download the [latest version of Question2Answer](https://github.com/q2a/question2answer/releases) to your computer or web server (also available [on GitHub](https://github.com/q2a/question2answer)).

2. Unzip the download using a tool such as [WinZip](http://www.winzip.com/) (or `unzip` in the Unix shell).

3. If you want to run a non-English site, check if the appropriate [language file](/addons/) is available. If so, download and install it in the `qa-lang` folder. If not, it's simple to [translate](/translate/) Question2Answer for yourself.

4. Create a MySQL database, and a MySQL user with full permissions for that database.
    <small>If you're interested, the [privileges](http://dev.mysql.com/doc/mysql/en/privilege-system.html) actually needed are: CREATE, ALTER, DELETE, INSERT, SELECT, UPDATE, LOCK TABLES</small>

5. Note down the MySQL details: username, password, database name and server host name. If MySQL is running on the same server as your website, the server host name is likely to be `127.0.0.1` or `localhost`.

6. Find `qa-config-example.php` and `.htaccess-example` in the unzipped `question2answer` folder, and rename them to `qa-config.php` and `.htaccess`, respectively.

7. Open `qa-config.php` in your text editor, insert the MySQL details at the top, and save the file. Do not use a word processor such as Microsoft Word for this, but rather Notepad or another appropriate [text editing program](http://en.wikipedia.org/wiki/List_of_text_editors).

8. Place all the Question2Answer files in the appropriate location on your web server:
    - To serve Question2Answer at the root of a domain (e.g. `http://www.mysite.com/`), move or upload all the contents of the unzipped `question2answer` folder into the root directory for that domain on your web server.
    - To serve Question2Answer in a subdirectory of a site (e.g. `http://www.mysite.com/qa/`), create the subdirectory inside the root directory for the site, then move or upload all the contents of the unzipped `question2answer` folder into this subdirectory.

9. Open the appropriate web page for Question2Answer in your web browser, for example:
    - If you installed Question2Answer at the root of a domain, `http://www.mysite.com/`
    - If you installed Question2Answer in a subdirectory, `http://www.mysite.com/qa/`

10. Follow the on-screen instructions to set up your database and administrator account. That's it!

See also: [Upgrading Question2Answer](/install/upgrade/)

## Add-Ons

See the [add-ons](/addons/) page for language files, themes and plugins created by Question2Answer users.
