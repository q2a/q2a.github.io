---
layout: page
menu: install
title: "Question2Answer .htaccess file"
---

# Why is my .htaccess file not OK?

If you are running Question2Answer under the [Apache][1] web server, the `.htaccess` file serves a special purpose. It enables neat URLs to be used by automatically re-mapping incoming page requests to the `index.php` script in the main Question2Answer directory.

The successful operation of `.htaccess` depends on the setup of your server and site. If you are being told that neat URLs are not available in the administration center, you should review the solutions below.

## Possible reasons why .htaccess is not working

1. You are not running the [Apache][1] web server. In this case, you should read your web server's documentation on how to perform URL rewriting, and reproduce the behavior of `.htaccess` as appropriate.

2. You have not installed the `.htaccess` file, or it was accidentally renamed. Note that on Unix-based systems (Mac/Linux), files starting with a period are hidden by default. Check the settings in your file browser. On the command line you can use `ls -a` to view hidden files.

3. [Apache][1] has been configured to ignore `.htaccess` files in the directory where you installed Question2Answer. You can fix this in your Apache configuration or by asking your hosting provider. Specifically you want the directive `AllowOverride All` to be included in the appropriate `<Directory>` section of your Apache configuration file. Alternatively you can copy the contents of the `.htaccess` file to that section.

4. Question2Answer is accessed through a subdirectory on your website domain. Depending on your Apache configuration, you may need to uncomment the `RewriteBase /` directive inside the `.htaccess` file by removing the preceding `#`. You may also need to add the subdirectory name after the `/` slash in this directive. You can read [more about RewriteBase here](http://httpd.apache.org/docs/trunk/mod/mod_rewrite.html).

5. Apache's rewriting module has not been activated. Ensure that mod_rewrite is being loaded in Apache's configuration file.

If none of the above work, it might help to [search for `.htaccess`](http://www.question2answer.org/qa/search?q=htaccess) at the Question2Answer Q&A.


[1]: http://httpd.apache.org/
