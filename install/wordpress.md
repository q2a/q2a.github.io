---
layout: page
menu: install
title: "Question2Answer - WordPress Integration"
---

# Installing Question2Answer with WordPress integration

From version 1.4, Question2Answer offers out-of-the-box integration with your [WordPress](http://wordpress.org/) 3+ site and user database. To install Question2Answer as part of your WordPress site, please follow the instructions below:

1. Download the [latest version of Question2Answer](https://github.com/q2a/question2answer/releases) to your computer or web server (also available [on GitHub](https://github.com/q2a/question2answer)).

2. Unzip the download using a tool such as [WinZip](http://www.winzip.com/) (or `unzip` in the Unix shell).

3. Find `qa-config-example.php` and `.htaccess-example` in the unzipped `question2answer` folder, and rename them to `qa-config.php` and `.htaccess`, respectively.

4. Open `qa-config.php` in a text editor and insert the following line next to another `define(...)` in the file:

    `define('QA_WORDPRESS_INTEGRATE_PATH', '/PATH/TO/WORDPRESS');`

    Replace `/PATH/TO/WORDPRESS` in the example with the full path to the WordPress directory on your server, i.e. the directory which contains `wp-load.php`. You do not need to set your MySQL database details in `qa-config.php` since these are imported from WordPress automatically. Q2A and WordPress will use separate tables within the same MySQL database.

5. Place all the Question2Answer files in the appropriate location on your web server:
    - To serve Question2Answer in a subdirectory of a site (e.g. `http://www.mysite.com/qa/`), create the subdirectory inside the root directory for the site, then move or upload all the contents of the unzipped `question2answer` folder into this subdirectory.
    - To serve Question2Answer at the root of a domain (e.g. `http://qa.mysite.com/`), move or upload all the contents of the unzipped `question2answer` folder into the root directory for that domain on your web server.

6. Ensure that WordPress authentication cookies and redirections are compatible with Question2Answer, as follows:
    - If Question2Answer is in a subdirectory of your WordPress site (e.g. `http://www.mysite.com/qa/` under `http://www.mysite.com/`) then nothing needs to be done.
    - If Question2Answer is on the same domain but not in a subdirectory (e.g. `http://www.mysite.com/qa/` and `http://www.mysite.com/blog/`), then add the following line at the **start** of the WordPress `wp-config.php` file:
        `define('COOKIEPATH', '/');`
    - If Question2Answer is on a different subdomain from your WordPress site (e.g. `http://qa.mysite.com/` and `http://blog.mysite.com/`) then it's a little more complicated. First add the following lines at the **start** of the WordPress `wp-config.php` file, replacing `.mysite.com` with a period (.) followed by the partial domain name which is shared by both sites:

        ```php?start_inline=1
        define('COOKIEPATH', '/');
        define('COOKIE_DOMAIN', '.mysite.com');
        ```

        Then add the following lines at the **end** of the WordPress `wp-config.php` file, replacing `qa.mysite.com` with the full domain name for your Q2A site:

        ```php?start_inline=1
        /* To allow redirection from WordPress login to Question2Answer */
        add_filter('allowed_redirect_hosts', 'qa_wordpress_redirect_hosts');
        function qa_wordpress_redirect_hosts($content) {
            $content[] = 'qa.mysite.com';
            return $content;
        }
        ```

7. Open the appropriate web page for Question2Answer in your web browser, for example:
    - If you installed Question2Answer in a subdirectory, `http://www.mysite.com/qa/`
    - If you installed Question2Answer at the root of a domain, `http://qa.mysite.com/`

8. Follow the on-screen instructions to set up your database and Question2Answer functionality.

9. You can now integrate the styling of Question2Answer with your WordPress site by [creating a Question2Answer theme](/themes/).
