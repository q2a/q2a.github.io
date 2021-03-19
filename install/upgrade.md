---
layout: page
menu: install
title: "Upgrading Question2Answer"
---

# Upgrading to the latest version of Question2Answer

Question2Answer regularly has [new releases](/install/versions/) that fix bugs and add new features. Updating your Q2A site is usually a simple process of uploading the new files and visiting your site to check for any database upgrades. Instructions in more detail:

1. Before upgrading, it is recommended to make a backup of your website, and of your MySQL database using `mysqldump` or a similar tool.

2. If you have modified any core Q2A files, make a copy of your whole Q2A directory, to help reapply your changes after upgrading.

3. Download the [latest version of Question2Answer](https://github.com/q2a/question2answer/releases) to your computer or web server (also available [on GitHub](https://github.com/q2a/question2answer)).

4. Unzip the download using a tool such as [WinZip](http://www.winzip.com/) (or `unzip` in the Unix shell).

5. Turn on maintenance mode in your Q2A admin panel (General section). This will help prevent any errors showing to users while files are being uploaded.

6. Replace all the Question2Answer files and directories on your web server with the new ones, via (S)FTP or whatever deployment strategy you use.
      - Your custom `qa-config.php` and `.htaccess` files will not be affected, nor will your `qa-external` directory.
      - You may need to reapply any other changes and reinstall any themes, languages or plugins as appropriate.

7. Open your Question2Answer site in your browser, and go to the admin center. If appropriate, you will be prompted to upgrade the database, so follow the on-screen instructions.

8. Once the upgrade is complete, **don't forget to turn off mainenance mode** so visitors can see the site again. You've now successfully upgraded - congratulations!


## For larger sites (advanced)

Larger websites with a lot of traffic may wish to follow a slightly different process. Due to the way Q2A handles errors, visitors to your site may see the database upgrade screen after you've uploaded your files. To solve this problem we can temporarily serve a 503 Service Not Available error to the visitors, while allowing the site administrator to view the site and run the upgrade.

The upgrade process then works as above, except that between steps 5 and 6 we turn on the 503 response as described below, then turn it off again after step 8.

Here's how to set it up on different servers. In the following examples, replace `/503.html` with your own error page if you have one (otherwise omit those lines for the default server page), and replace `127.0.0.1` with your IP address so you can access the site yourself. You can find your IP by [searching Google](https://www.google.com/search?q=what+is+my+ip).

### Apache

Add the following to your `.htaccess` file (or the appropriate `<Directory>` block within your Virtual Host server config).

```conf
<IfModule mod_rewrite.c>
ErrorDocument 503 /503.html
RewriteEngine On
RewriteCond 1 0
RewriteCond %{REMOTE_ADDR} !^127.0.0.1$
RewriteCond %{REQUEST_URI} !^/503.html$
RewriteRule .* - [R=503]
</IfModule>
```

Now the 503 response can be toggle by changing `RewriteCond 1 0` to `RewriteCond 1 1`

### Nginx

First add the following to the `http {}` section in `nginx.conf`.

```nginx
geo $maintenance {
    default         0;
    127.0.0.1       0;
}
```

If you have your own 503 error page then add this line (with the appropriate URL) in the `server {}` block for your site:

```nginx
error_page 503 /503.html;
```

Next, in the site's location block in `server {}` add this:

```nginx
if ($maintenance) {
    return 503;
}
```

For example a Q2A site at the root of the domain may look like this

```nginx
location / {
    if ($maintenance) {
        return 503;
    }
    try_files $uri /index.php?$request_uri;
}
```

Now the 503 response can be toggled by changing the value of `default` from `0` to `1` in `nginx.conf` and restarting Nginx. Of course, put it back to `0` to turn it off.
