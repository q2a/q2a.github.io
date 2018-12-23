---
layout: page
menu: code
title: "Question2Answer - Developers - Q2A code structure"
---

# Question2Answer application structure

Below is an overview of the structure of the Q2A application and how requests are handled.


## Request structure

All HTTP requests for Q2A are routed through the root `index.php` file. This file sets the core `QA_BASE_DIR` constant, then includes `qa-include/qa-index.php` which handles the request at a high level. There we branch off for certain types of requests:

- **AJAX** --- aynschronous requests from a page, such as voting or adding answers/comments.
- **Images** --- requests for image files uploaded (e.g. avatars). Handles resizing and caching.
- **Blobs** --- downloadable files such as PDFs.
- **Installation** --- handles set-up the first time Q2A is run, and any upgrade queries in a new version.
- **URL test** --- a special route, used in the Admin area. It displays "OK" if the URL structure used works fine with your server setup.
- **RSS feed** --- generates an XML document in RSS format, listing recent questions etc.
- **Page** --- all other page requests, including page plugins.

For the latter four types above, we include `qa-include/qa-base.php` which initializes the PHP environment, various constants and settings, and then connects to the database. It also defines an autoloader (from v1.7+) which automatically loads core classes of a specific format:

1. From Q2A 1.9 namespaces are used. The main core namespace is `Q2A` which maps to the `qa-src/` directory. So a class of the form `\Q2A\Storage\FileCacheDriver` will automatically load the file `qa-src/Storage/FileCacheDriver.php`. See the [coding style](/contribute/coding-style/#new-autoloaded-classes) page for full details.
2. In Q2A 1.7-1.8, classes of the form `Q2A_Util_Usage` map to files in the `qa-include/Q2A/` directory, e.g. `qa-include/Q2A/Util/Usage.php`. These are being phased out in favor of namespaces.

Here we "normalize" the request, which converts the URL from one of multiple formats (parameters or SEO-friendly) into a standard format such as `/activity` or `/question/1234/title`.


## Page requests

Pages make up the bulk of Q2A. The file `qa-include/qa-page.php` handles these. The main function of concern is `qa_get_request_content` which matches the URL to a page script in `qa-include/pages/`. Those page scripts are where the action happens. Data is fetched and then a special `$qa_content` array is returned, containing all the information needed to display a page.

That's returned back to `qa-page.php` which then calls `qa_output_content` with the data to do some final processing and load the theme for final output of the HTML.

From Q2A 1.9 instead of raw page scripts, a **controller** system is used. Controllers are classes with functions that handle each type of page. For example `Q2A\Controllers\User\UsersList` handles the pages showing lists of users by points, blocked users, etc.


## Theme output

As described above, the `$qa_content` variable is sent to the theme class, and the theme outputs HTML based on that. The base class is in `qa-include/qa-theme-base.php` - custom themes may override this to modify HTML output, but most themes do not need to. Each element in the `$qa_content` array corresponds to a different type of HTML - metadata, scripts, styles, forms, navigation, questions and more.

Documentation coming soon.
