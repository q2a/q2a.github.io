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

As described above, the `$qa_content` variable is sent to the theme class (accessible via `$this->content`), and the theme outputs HTML based on that. The base class is in `qa-include/qa-theme-base.php` - custom themes may override this to modify HTML output, but most themes do not need to. Each element in the content array corresponds to a different type of HTML - metadata, scripts, styles, forms, navigation, questions and more.

Below are the various elements that can be in the content array. A nested list element corresponds to a sub-array in `$qa_content`. Where we refer to a "split array", this means an array with three sub-elements, `prefix`, `data` and `suffix`, which are output in that order.

- `content_type` --- The Content-type as used in the HTTP response headerl typically `text/html; charset=utf-8`.
- `charset` --- The page encoding, usually `utf-8`.
- `language` --- The site lgnaueg code, e.g. `en` for English or `zh` for Chinese.
- `direction` --- The text direction, `ltr` for left-to-right (default), `rtl` for right-to-left.
- `options` --- An array of options that are useful for theme developers. Currently this includes `minify_html`.
- `site_title` --- The website title.
- `title` --- The page title.
- `description` --- Page meta description.
- `keywords` --- Page meta keywords.
- `html_tags` --- Attributes to be added to the `<html>` tag.
- `head_lines` --- Array of HTML to be added to the `<head>` tag.
- `canonical` --- The canonical URL for the page, for the relevant meta tag.
- `feed` --- Data for the RSS feed of the current page.
	- `url`
	- `label`
- `script` --- Array of HTML tags for JavaScript. This is combined from several `script_*` elements (below) prior to theme instantiation. So the below keys cannot be used in themes directly, but can be set from plugins of varying types.
- `script_var` --- Associative array of JavaScript variables to be set.
- `script_lines` --- Array of JavaScript lines of code.
- `script_rel` --- Array of relative links to JavaScript files.
- `script_src` --- Array of absolute links to external JavaScript files.
- `script_onloads` --- Array of JavaScript lines of code that should be executed on `window.load`. Uses jQuery's `.on('load', ...)` method.
- `wrapper_tags` --- Attributes to be added to the `.qa-body-wrapper` element.
- `logo` --- HTML for the site logo.
- `error` --- Page-level error message, for example when a page is not found or a user cannot view a page.
- `navigation` --- Array of different navigation elements:
	- `main` (top level menu)
	- `sub` (second level menu)
	- `user` (user links e.g. updates/logout)
	- `cat` (category links)
	- `footer` (footer links)
- `sidebar` --- HTML to show in the sidebar.
- `sidepanel`
- `widgets` --- Array of widget objects:
	- `full`
		- `top`, `high`, `low`, `bottom`
	- `side`
		- `top`, `high`, `low`, `bottom`
	- `main`
		- `top`, `high`, `low`, `bottom`
- `categoryids` --- Question categories.
- `search` --- Tags for the search field:
	- `form_tags`
	- `form_extra`
	- `title`
	- `field_tags`
	- `button_label`
- `favorite` --- Form tags for the favorite button.
- `loggedin` --- Split array for logged in message/user link.
- `page_links` --- Pagination data.
	- `label`
	- `items` - array of arrays, each containing `type` (one of: prev/jump/this/next), `label`, `page`, `ellipsis`, `url`
- `ranking` --- Used for users and tags pages.
	- `type` (one of: users/tags)
	- `items` (array of users/tags)
	- `rows` (deprecated: number of table rows when using old layout format)
	- `sort` (one of: points/date/level/count)
- `nav_list` --- List of categories for category page.
- `form` --- The main form for the page (see below).
- `q_list` --- A list of questions.
	- `form`
	- `qs` (array of questions)
- `q_view` --- The main array of data for a question, including its answers and comments (see below).
- `a_list` --- List of answers on a question.
	- `as` (array of answers)
	- `tags`
	- `title_tags`
	- `title`
- `a_form` --- Form tags for adding an answer (see below).

### Form array format

A form can be added to a page using the 'form' key. Additional forms can use incrementing keys like `form_2`, `form_3` and so on. Forms should contain these elements:

- `style` --- 'tall' or 'wide'
- `tags` --- attributes such as method/action
- `title`
- `fields` --- array of fields
- `buttons` --- array of buttons
- `hidden` --- associative array of hidden elements
- `id`
- `collapse`

### Question array format

Details for a question are stored in the `q_view` key. The sub-elements are:

- `raw` --- The plain data from the database without any formatting or modification. For example the post ID can be found in `$qa_content['q_view']['raw']['postid']`
- `hidden`
- `queued`
- `tags`
- `classes`
- `url`
- `title`
- `q_tags`
- `views_raw`
- `views`
- `where`
- `content`
- `upvotes_raw`
- `downvotes_raw`
- `netvotes_raw`
- `vote_view`
- `vote_on_page`
- `upvotes_view`
- `downvotes_view`
- `netvotes_view`
- `vote_tags`
- `vote_state`
- `vote_up_tags`
- `vote_down_tags`
- `meta_order`
- `what`
- `what_url`
- `what_url_tags`
- `when`
- `who`
- `avatar`
- `what_2`
- `when_2`
- `who_2`
- `main_form_tags`
- `voting_form_hidden`
- `buttons_form_hidden`
- `form`
- `c_form`
- `c_list`
