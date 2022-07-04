---
layout: page
menu: code
title: "Question2Answer - Developers - Selected Functions"
---

# Selected functions in Question2Answer

Your external code and plugins are free to use any of the 700+ functions defined within Q2A. When developing new versions of Q2A, the utmost effort is made to keep its functions backwards compatible, so that code using these functions continues to work. For example, new parameters added to existing functions are always optional. Any breaks in backwards compatibility are documented in the [version history](https://github.com/q2a/question2answer/releases).

A selected of the most useful functions are described below, grouped by the PHP file in the `qa-include` directory in which they appear. With the exception of `qa-base.php`, which is loaded first, you must include a file as follows before using its functions:

```php?start_inline=1
require_once QA_INCLUDE_DIR.'qa-XYZ.php';
```

Many of these functions take optional additional parameters which are not shown here - please consult the source code for details. Functions which are not marked with a version number are available from Q2A 1.3 or later.

## General functions in qa-base.php

- **`qa_exit($reason)`** calls the `shutdown()` method of any installed [process modules](/plugins/modules-process/), passing the supplied `$reason`. Then it terminates execution of the PHP script with PHP's `exit;` command. Requires Q2A 1.5+.
- **`qa_fatal_error($message)`** outputs and logs `$message`, then calls `qa_exit('error');` to terminate execution.
- **`qa_list_modules($type)`** returns an array containing the names of all installed modules of type `$type`.
- **`qa_load_module($type, $name)`** returns an object belonging to the class defined in module `$name` of type `$type`, or `null` if it cannot be loaded. You can use this to communicate between multiple modules within a plugin, or between different plugins. Note that multiple calls to `qa_load_module()` with the same `$type` and `$name` will return the same object.
- **`qa_load_modules_with($type, $method)`** returns an array of objects for the installed modules of type `$type` which have `$method` defined. Requires Q2A 1.5+. For example, `$modules=qa_load_modules_with('page', 'match_request');`
- **`qa_html($string)`** returns `$string` escaped for output in HTML, e.g. mapping `"` to the `&quot;` entity. If the optional second parameter `$multiline` is set to `true`, newlines and tabs in `$string` are also converted to the appropriate HTML representation.
- **`qa_sanitize_html($html, $linksnewwindow)`** returns `$html` after ensuring it is clear of Javascript and other possible security issues. It should be used to make the HTML provided by one user (e.g. in an editor module) safe for display to other users. If `$linksnewwindow` is `true`, then any links in the HTML will be modified to open in a new window.
- **`qa_xml($string)`** returns `$string` escaped for output in XML. Requires Q2A 1.6+.
- **`qa_js($value)`** returns `$value` escaped for output in Javascript, including putting strings in quotes.
- **`qa_request()`** returns the Q2A page being requested, e.g. `'tag/urgent'`. It uses slash separators, independent of the URL scheme chosen. **`qa_request_part($part)`** divides the request using slashes, and returns the part indexed by `$part>=0`, or `null` if that part does not exist. **`qa_request_parts()`** returns an array of request parts. All require Q2A 1.5+.
- **`qa_get($field)`** returns the value of URL parameter `$field` (from `$_GET` in PHP) or `null` if it was not present.
- **`qa_post_text($field)`** returns the value of the POSTed `$field`, trimmed with `\n` line endings, or `null` if not present.
- **`qa_clicked($name)`** returns `true` if the form button named `$name` was clicked to POST a form.
- **`qa_remote_ip_address()`** returns the IP address making the current request, or `null` if unavailable. Requires Q2A 1.4.1+.
- **`qa_is_http_post()`** returns whether Q2A is currently responding to an HTTP POST request, e.g. a form submission.
- **`qa_is_https_probably()`** returns whether the current request is using the HTTPS protocol. It is hard to determine this absolutely.
- **`qa_is_human_probably()`** returns `true` if the current request appears to be from a person using a web browser, rather than a search engine bot or automated script. This assessment is based on the HTTP user agent containing a known string such as `MSIE` or `Firefox`. Note that it is perfectly possible for a malicious bot or script to masquerade as a web browser.
- **`qa_is_mobile_probably()`** returns `true` if the current request appears to be from a mobile phone. This assessment is based on the presence of mobile HTTP headers or the HTTP user agent containing a mobile identifying string. Requires Q2A 1.5+.
- **`qa_lang($identifier)`** and **`qa_lang_html($identifier)`** return a localized language phrase from the appropriate `qa-lang-*.php` file. For example, `qa_lang('main/cancel_button')` would return the phrase with key `'cancel_button'` from the file `qa-lang-main.php`. The phrase returned by `qa_lang_html()` is escaped for output in HTML. From Q2A 1.5+, language files can also be [registered by plugins](/plugins/) and then accessed via these functions.
- **`qa_path_to_root()`** returns the URL to the root of the Q2A site, relative to the currently requested page. Requires Q2A 1.5+.
- **`qa_path($request)`** returns the URL for Q2A page `$request`, relative to the currently requested page. You can also call **`qa_path($request, $params)`** to add GET-style parameters to the URL, where `$params` is an array of parameter name `=>` parameter value, not yet urlencoded. **To ensure compatibility with different Q2A URL structures, please use this (or a related `qa_path_*()` function to build URLs instead of hard-coding their structure.**
- **`qa_path_html($request)`** and **`qa_path_html($request, $params)`** return the URL for Q2A page `$request` (with optional `$params`), relative to the currently requested page, escaped for output in HTML. Usage example:

    `echo '<a href="'.qa_path_html('search', array('q' => 'reset password')).'">Resetting Password<A>';`
- **`qa_path_absolute($request)`** and **`qa_path_absolute($request, $params)`** return the absolute URL for Q2A page `$request` (with optional `$params`). Requires Q2A 1.6+.
- **`qa_q_path($questionid, $title, $absolute, $showtype, $showid)`** and **`qa_q_path_html(...)`** return the URL for question `$questionid` which has `$title` as its title. If `$absolute` is `true`, this will be an absolute URL, otherwise it will be relative to the currently requested page. To link to a particular answer or comment within that question page, pass `'A'` or `'C'` as the `$showtype` and the `postid` of the answer or comment in `$showid`. Otherwise, pass `null` or omit these last two parameters. The URL returned by `qa_q_path_html()` is escaped for output in HTML. Requires Q2A 1.5+.
- **`qa_self_html()`** returns the relative URL for the current Q2A page, preserving URL parameters, escaped for output in HTML. It is particularly useful for creating form tags, e.g. `echo '<FORM METHOD="POST" ACTION="'.qa_self_html().'">';`
- **`qa_redirect($request)`** and **`qa_redirect($request, $params)`** perform an HTTP redirect to a Q2A page, specified in the same way as the parameters to `qa_path()`.
- **`qa_redirect_raw($url)`** performs an HTTP redirect to `$url`, without processing the URL in any way. Generally you should use `qa_redirect()` however this function can be useful for [login modules](/plugins/modules-login/).
- **`qa_retrieve_url($url)`** returns the content of remote `$url`, using PHP's `file_get_contents()` or curl functions.
- **`qa_opt($name)`** gets the value of the option labelled `$name` from Q2A's internal options storage.
- **`qa_opt($name, $value)`** sets the option labelled `$name` to `$value` in Q2A's internal options storage. To prevent interference with Q2A or other plugins, your options should be named using a prefix which is unique to your plugin. Do not use this to store large pieces of content, since all options are retrieved for every Q2A page request - instead, look at `app/blobs.php`.
- **`qa_suspend_event_reports($suspend)`** suspends the reporting of events to event modules if `$suspend` is `true`, and reinstates it if `$suspend` is `false`. This might be useful if you are programmatically creating or modifying a lot of content or other database information, and want to prevent logging and other inappropriate responses to these events.
- **`qa_report_event($event, $userid, $handle, $cookieid, $params)`** reports an event to all event modules registered by plugins. The five parameters are passed straight through to the `process_event()` function in each event module.

## Database access in qa-db.php

- **`qa_db_connection()`** returns the connection to the Q2A database, for use with PHP's `mysql_query()` function and the like.
- **`qa_db_query_raw($query)`** runs the raw SQL in `$query` on the Q2A database and returns a PHP result resource. Note that if the query fails due to a MySQL error, Q2A will stop normal execution and start checking the database for problems.
- **`qa_db_escape_string($string)`** returns `$string` escaped for safe inclusion in raw SQL.
- **`qa_db_query_sub($query, ...)`** runs the SQL in `$query` on the Q2A database after substituting the symbols `^`, `#` and `$`, returning a PHP result resource. This function is the **recommended way to run queries on the Q2A database**, and automatically escapes all substituted parameters for safe SQL. The `^` symbol is substituted for the appropriate Q2A table prefix set in `qa-config.php`, which is `qa_` by default. The `#` and `$` symbols are substituted for numerical and UTF-8 string values respectively, where these values are taken in order from the additional parameters to the function. If you want to retrieve the text from UTF-8 encoded columns from the database, you should use the `BINARY` modifier in front of the column name in your SQL, since Q2A does not explicitly set the character set of the database connection. Note that if the query fails due to a MySQL error, Q2A will stop normal execution and start checking the database for problems.
- **`qa_db_single_select($selectspec)`** reads and returns data from the database based on the `$selectspec` parameter. The `$selectspec` parameter defines the columns to be retrieved, the source tables and constraints, arguments for substitution, and the ordering and formatting of the results. It is documented in full in `qa-db.php` and you can see many examples in `db/selects.php`.
- **`qa_db_multi_select($selectspecs)`** reads and returns data from the database for multiple `$selectspecs` simultaneously. Depending on the `QA_OPTIMIZE_*_DB` settings in `qa-config.php`, these may be executed as multiple SQL queries, or as a single query whose output is pulled apart within PHP. The keys of the data in the returned array match those of the `$selectspecs` parameter.
- **`qa_db_read_all_assoc($result)`** takes the PHP result resource `$result` returned from a database query, and returns all the resulting data in a nested array. The outer array contains one array element per data row, with keys numbered from zero. Each inner array contains one element per data column, with column names in the keys.
- **`qa_db_read_one_assoc($result, $allowempty)`** returns an array containing the first row in the PHP `$result` resource, with named columns. Set `$allowempty` to `true` if an empty result should not cause a fatal Q2A error.
- **`qa_db_read_all_values($result)`** returns an array containing the first column from each row in the PHP `$result` resource.
- **`qa_db_read_one_value($result, $allowempty)`** returns the first column of the first row in the PHP `$result` resource. Set `$allowempty` to `true` if an empty result should not cause a fatal Q2A error.
- **`qa_suspend_update_counts($suspend)`** suspends the updating of various cached counts in the database if `$suspend` is `true`, and reinstates it if `$suspend` is `false`. This might be useful if you are programmatically creating or modifying a lot of content or other database information, and want to speed up the process. Once you have finished with the database modifications, you should use the buttons at the bottom of the 'Stats' page of the 'Admin' panel to recalculate all counts.

## Cookie management in app/cookies.php

- **`qa_cookie_get()`** returns a string which identifies the user (not necessarily logged in) making the current Q2A request, if one is available from a browser cookie. Otherwise, it returns `null`.
- **`qa_cookie_get_create()`** works like `qa_cookie_get()`, but if a cookie is not available, a new one is created, set in the user's browser, and returned from the function.

## Sending notifications in app/emails.php

- **`qa_send_notification($userid, $email, $handle, $subject, $body, $subs)`** sends an email to user `$userid`. You can provide the user's `$email` and/or `$handle`, or pass `null` for Q2A to retrieve these from the database. Several substitutions are performed on the `$subject` and `$body`. For example `^site_title` will be replaced by the name of the Q2A site set in the admin interface, and `^handle` and `^email` will be replaced by the recipient's handle or email. You can also pass additional substitutions in the array parameter `$subs` - each key in `$subs` will be substituted for its corresponding value.
- **`qa_suspend_notifications($suspend)`** suspends the sending of notifications to users if `$suspend` is `true`, or reinstates it if `$suspend` is `false`. This might be useful if you are programmatically creating or modifying content or other database information and want to avoid sending inappropriate emails.
- **`qa_send_email($params)`** sends an email as specified by the array `$params` and returns whether the operation was successful from the server's perspective (this does not guarantee delivery). The `$params` array should contain the elements `'fromemail'` (sender email), `'fromname'` (sender name), `'toemail'` (recipient email), `'toname'` (recipient name), `'subject'` (subject line), `'body'` (UTF-8 encoded email body) and `'html'` (`true` if `$params['body']` is HTML-formatted, `false` otherwise).

## Option management in app/options.php

- **`qa_get_options($names)`** returns an array mapping all the options in the `$names` array to their values. This may be easier than calling `qa_opt()` from `qa-base.php` many times.
- **`qa_using_tags()`** and **`qa_using_categories()`** respectively return whether Q2A is using tags or categories to classify questions. Note that it is possible to use both tags and categories simultaneously, or to use neither.

## Post management in app/posts.php and app/post-create.php

Note that all `qa_post_...()` functions will send the appropriate email notifications and event reports, as well as update database indexes and counts. This can be prevented with the `qa_suspend...()` functions, described elsewhere on this page.

- **`qa_post_create($type, $parentpostid, $title, $content, $format, $categoryid, $tags, $userid)`** creates a new post in the database, and returns its `postid`. Set `$type` to `'Q'` for a new question, `'A'` for an answer, or `'C'` for a comment. To queue the post for moderation (requires Q2A 1.5+), set `$type` to `'Q_QUEUED'`, `'A_QUEUED'`, or `'C_QUEUED'`. For questions, set `$parentpostid` to the `postid` of the answer to which the question is related, or `null` if (as in most cases) the question is not related to an answer. For answers, set `$parentpostid` to the `postid` of the question being answered. For comments, set `$parentpostid` to the `postid` of the question or answer to which the comment relates. The `$content` and `$format` parameters go together - if `$format` is `''` then `$content` should be in plain UTF-8 text, and if `$format` is `'html'` then `$content` should be in UTF-8 HTML. Other values of `$format` may be allowed if an appropriate [viewer module](/plugins/modules-viewer/) is installed. The `$title`, `$categoryid` and `$tags` parameters are only relevant when creating a question - `$tags` can either be an array of tags, or a string of tags separated by commas. The new post will be assigned to `$userid` if it is not `null`, otherwise it will be anonymous. Additional optional parameters set notification, extra question fields and names on anonymous posts.
- **`qa_post_set_content($postid, $title, $content, $format, $tags)`** changes the data stored for post `$postid` based on any of the `$title`, `$content`, `$format` and `$tags` parameters passed which are not `null`. The meaning of these parameters is the same as for `qa_post_create()` above. Additional optional parameters allow changes to post notification, extra question fields, names on anonymous posts and can identify the user who made the change.
- **`qa_post_set_category($postid, $categoryid)`** changes the category of `$postid` to `$categoryid`. The category of all related posts (shown together on the same question page) will also be changed.
- **`qa_post_set_selchildid($questionid, $answerid)`** sets the selected best answer of `$questionid` to `$answerid` (or to none if `$answerid` is `null`).
- **`qa_post_set_closed($questionid, $closed, $originalpostid, $note)`** closes `$questionid` if `$closed` is true, otherwises it reopens it (requires Q2A 1.5+). If `$closed` is true, pass either the `$originalpostid` of the question that it is a duplicate of, or a `$note` to explain why it's closed. The other parameter should be set to `null`.
- **`qa_post_set_hidden($postid, $hidden)`** hides `$postid` if `$hidden` is `true`, otherwise it shows the post. If the post is waiting for moderator approval (Q2A 1.5+), `$hidden=true` rejects the post, and `$hidden=false` approves it.
- **`qa_post_set_status($postid, $status)`** changes the status of `$postid`, where `$status` is one of `QA_POST_STATUS_NORMAL`, `QA_POST_STATUS_HIDDEN` or `QA_POST_STATUS_QUEUED`. Requires Q2A 1.6+.
- **`qa_post_delete($postid)`** deletes `$postid` from the database, hiding it first if appropriate.
- **`qa_post_get_full($postid)`** retrieves the full information from the database for `$postid`, returning it in an array.
- **`qa_suspend_post_indexing($suspend)`** suspends the indexing (and unindexing) of posts in the database if `$suspend` is `true`, and reinstates it if `$suspend` is `false`. This might be useful if you are programmatically creating or modifying a lot of content, and want to speed up the process, leaving Q2A's search results out of date. Once you have finished with the database modifications, you should use the button at the bottom of the 'Stats' page of the 'Admin' panel to reindex all posts.

## User management in app/users.php

- **`qa_get_logged_in_userid()`** returns the userid of the currently logged in Q2A user, or `null` if no user is logged in.
- **`qa_get_logged_in_handle()`** returns the handle/username of the currently logged in user, or `null` if no user is logged in.
- **`qa_get_logged_in_email()`** returns the email address of the currently logged in user, or `null` if no user is logged in.
- **`qa_get_logged_in_flags()`** returns flags for the currently logged in user, or `null` if no user is logged in. The flag bit masks are defined in the `QA_USER_FLAGS_*` constants at the top of `app/users.php`. If the `QA_USER_FLAGS_USER_BLOCKED` or `QA_USER_FLAGS_MUST_CONFIRM` (Q2A 1.5+) or `QA_USER_FLAGS_MUST_APPROVE` (Q2A 1.6+) bit is set, the user should be prevented from performing any actions that modify information in the database.
- **`qa_get_logged_in_level()`** returns a number representing the privilege level of the currently logged in user, or `null` if no user is logged in. You can compare this against the `QA_USER_LEVEL_*` constants defined at the top of `app/users.php`.
- **`qa_get_logged_in_points()`** returns the points of the currently logged in user, or `null` if no user is logged in.
- **`qa_is_logged_in()`** returns `true` if a user is logged in, `false` otherwise. Requires Q2A 1.5+.
- **`qa_handle_to_userid($handle)`** returns the userid for the user identified by `$handle` or `null` if no user matches. This requires Q2A 1.6+, but see also `qa_handles_to_userids(...)` and `qa_userids_to_handles(...)` which were added in Q2A 1.5.
- **`qa_user_level_for_post($post)`** returns the privilege level of the current user for `$post`, which contains information about a post retrieved from the database (e.g. via `qa_post_get_full(...)` in `app/posts.php`). This can be higher than the level returned by `qa_get_logged_in_level(...)` if the user has special privileges in the post's category. Requires Q2A 1.6+.
- **`qa_user_moderation_reason()`** returns whether the current user should have their new content queued for moderation. If moderation is required, one of the strings `'login'`, `'approve'` (Q2A 1.6+), `'confirm'` or `'points'` will be returned, with meanings explained in the function's documentation. If moderation is not required, the function returns `false`. Requires Q2A 1.5+.
- **`qa_get_form_security_code($action)`** can be used to prevent cross-site request forgery (CSRF) attacks on your forms. Pass an arbitrary string specific to your form in `$action` and this function returns a code which should be placed in a hidden field in your form. Then call **`qa_check_form_security_code($action, $value)`** when your form is submitted, with the same `$action` as before, and the `$value` obtained from the hidden field. If `$value` is valid and the request is safe, the function returns `true`. Otherwise, it returns `false` and logs the reason for the mismatch in your server's `error_log` file, if the reason is suspicious. Requires Q2A 1.6+.
- **`qa_get_avatar_blob_url($blobId, $size, $absolute)`** returns the URL to the given `$blobId` constraining it in width and height to the given `$size`. Requires Q2A 1.8+.
- **`qa_get_gravatar_url($email, $size)`** returns the URL for the Gravatar corresponding to `$email`, constrained to the given `$size`. Requires Q2A 1.8+.
- **`qa_get_user_avatar_source($flags, $email, $blobId)`** returns where the avatar will be fetched from for the given user `$flags`. The possible return values are `'gravatar'` for an avatar that will be fetched from Gravatar, `'local-user'` for an avatar fetched locally from the user's profile, `'local-default'` for an avatar fetched locally from the default avatar blob ID, and `NULL` if the avatar could not be fetched from any of these sources. Requires Q2A 1.8+.
- **`qa_get_user_avatar_url($flags, $email, $blobId, $size, $absolute)`** returns the avatar URL, either from Gravatar or from the given `$blobId`, constrained to `$size` pixels. Requires Q2A 1.8+.

## Large object management in app/blobs.php

- **`qa_create_blob($content, $format)`** creates a new binary large object (BLOB) in the Q2A database or on disk and returns its `$blobid`, or `null` upon failure. The `$content` may contain up to 16 Mb of arbitrary data in any format, and the `$format` should contain the appropriate corresponding file extension, e.g. `'jpeg'`, `'gif'`, `'png'`, `'txt'`, `'doc'`, `'xls'`, `'pdf'`. This function was added in Q2A 1.6\. For earlier versions of Q2A, use `qa_db_blob_create(...)` in `db/blobs.php`.
- **`qa_read_blob($blobid)`** reads the object identified by `$blobid` from the database or disk and returns it in an array with the keys `'content'` and `'format'`. If the BLOB does not exist, it returns `null` instead. This function was added in Q2A 1.6\. For earlier versions of Q2A, use `qa_db_blob_read(...)` in `db/blobs.php`.
- **`qa_delete_blob($blobid)`** deletes the object identified by `$blobid` from the database, if it exists. This function was added in Q2A 1.6\. For earlier versions of Q2A, use `qa_db_blob_delete(...)` in `db/blobs.php`.
- **`qa_blob_exists($blobid)`** returns whether there is an object identified by `$blobid`. This function was added in Q2A 1.6\. For earlier versions of Q2A, use `qa_db_blob_exists(...)` in `db/blobs.php`.
- **`qa_get_blob_url($blobid, $absolute)`** returns a URL which can be used to view or download `$blobid`. If `$absolute` is `false`, this URL will be relative to the current Q2A page being requested, otherwise the URL will be absolute.

## Upload management in app/upload.php (Q2A 1.6+)

- **`qa_get_max_upload_size()`** returns the maximum size in bytes of a BLOB that can be uploaded by a user, taking into account database constraints and PHP's `upload_max_filesize` parameter.
- **`qa_upload_file($localfilename, $sourcefilename)`** allows a file to be uploaded into Q2A's BLOB (large object) storage. Pass the `$localfilename` where the file is currently stored on the server (temporarily) and the `$sourcefilename` of the original file on the user's computer. If you are using PHP's usual file upload mechanism, these are obtained from `$_FILES[..]['tmp_name']` and `$_FILES[..]['name']` respectively. Additional parameters allow the upload to be restricted by size or to images only, and for images to be scaled. If an error occurred, the function returns an array with key `'error'` containing the error string. Otherwise it returns an array with an element `'blobid'` containing the id of the BLOB created and `'bloburl'` containing the URL that can be used to view or download the blob.
- **`qa_upload_file_one()`** uploads a file into Q2A's BLOB (large object) storage, taking the first element of PHP's `$_FILES` array automatically. It returns the same array of elements as `qa_upload_file()`.

## Metadata management in db/metas.php (Q2A 1.5+)

- **`qa_db_usermeta_set($userid, $key, $value)`** sets metadata `$key` for user `$userid` to `$value`. Each user can only have a single piece of metadata with a particular key. Keys beginning with `qa_` are reserved for the Q2A core.
- **`qa_db_usermeta_clear($userid, $key)`** clears metadata `$key` for user `$userid`. An array of keys can also be passed in `$key`, in which case the metadata for every key is removed.
- **`qa_db_usermeta_get($userid, $key)`** returns the value of metadata `$key` for user `$userid`, or `null` if none exists. An array of keys can also be passed in `$key`, in which case an array is returned which maps metadata keys to values.
- The corresponding functions **`qa_db_postmeta_set($postid, $key, $value)`**, **`qa_db_postmeta_clear($postid, $key)`** and **`qa_db_postmeta_get($postid, $key)`** work the same way for metadata on individual posts.
- The functions **`qa_db_categorymeta_set($categoryid, $key, $value)`**, **`qa_db_categorymeta_clear($categoryid, $key)`** and **`qa_db_categorymeta_get($categoryid, $key)`** work the same way for metadata on categories.
- The functions **`qa_db_tagmeta_set($tag, $key, $value)`**, **`qa_db_tagmeta_clear($tag, $key)`** and **`qa_db_tagmeta_get($tag, $key)`** work the same way for metadata on tags, where `$tag` is the text of a tag.

## User notice management in db/notices.php (Q2A 1.5+)

- **`qa_db_usernotice_create($userid, $content, $format, $tags)`** creates a new notice to be displayed to user `$userid` and returns its `noticeid`. The notice will appear at the top of every page until the user dismisses it - this also deletes it from the database. The `$content` and `$format` parameters describe the content of the notice together - if `$format` is `''` then `$content` should be in plain UTF-8 text, and if `$format` is `'html'` then `$content` should be in UTF-8 HTML. You can use the `$tags` parameter to add some additional information to the notice which is stored in the database but not displayed to the user.
- **`qa_db_usernotice_delete($userid, $noticeid)`** deletes notice `$noticeid` for user `$userid`, if it exists in the database.
- **`qa_db_usernotices_list($userid)`** returns a nested array describing the notices which are being stored and displayed for user `$userid`. Each element in the returned array contains an array with three labelled values - `'noticeid'`, `'tags'` (as passed when the notice was created) and `'created'` (a Unix timestamp of the notice creation time).

## Array manipulation in util/sort.php

- **`qa_sort_by(&$array, $by1)`** sorts the nested array `$array` in place, by comparing the sub-element with key `$by1` of each inner array within `$array`. For example, if `$array=array(array('n'=>1,'w'=>'dog'), array('n'=>2,'w'=>'cat'))` then `qa_sort_by(&$array, 'n')` would leave `$array` unchanged, whereas `qa_sort_by(&$array, 'w')` would reverse its order. An additional parameter `$by2` can also be passed, to allow an additional comparison in cases where the first key matches.
- **`qa_array_insert(&$array, $beforekey, $addelements)`** inserts all the elements from the array `$addelements` into `$array`, preserving all keys in both arrays. The new elements are positioned together before key `$beforekey` in `$array` and their order is preserved. If `$beforekey` cannot be found in `$array`, the elements are appended at the end instead. Requires Q2A 1.4.2+.
- **`qa_array_reorder(...)`** allows some of the elements within an array to be moved together and/or reordered relative to each other. Please see the source code for documentation. Requires Q2A 1.6+.

## String manipulation in util/string.php

- **`qa_string_to_words($string)`** breaks `$string` up into words, and returns them in lower case in an array. The function contains several additional parameters that provide more control over this process - please see the source code.
- **`qa_string_remove_accents($string)`** returns `$string` with Roman accents removed, e.g. `mêlée` to `melee`. Requires Q2A 1.4+.
- **`qa_tags_to_tagstring($tags)`** takes an array of tags, and returns the string to be stored for those tags in the database.
- **`qa_tagstring_to_tags($tags)`** takes a list of tags from the database, and returns it as an array of tags.
- **`qa_shorten_string_line($string, $length)`** converts `$string` to a single line then removes words from the middle in order to make the total number of characters no more than `$length`. Useful for tooltips, etc...
- **`qa_block_words_replace($string, $wordspreg)`** replaces any words in `$string` censored by the site administrator with asterisks. Pass the output of `qa_get_block_words_preg()` (from `app/options.php`) in the `$wordspreg` parameter.
- **`qa_strlen($string)`**, **`qa_strtolower($string)`** and **`qa_substr($string, $start, $length)`** are wrappers for the standard and multibyte PHP string functions with similar names. If PHP was compiled with multibyte string support, PHP's `mb_*(...)` functions will be used with UTF-8 as the encoding for the `$string` parameter. Otherwise `$string` will be treated as ASCII.
