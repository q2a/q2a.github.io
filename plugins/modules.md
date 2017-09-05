---
layout: page
menu: plugins
title: "Question2Answer - Developers - Plugin Modules"
---

# Implementing plugin modules

Plugin modules enable Question2Answer to be extended in specific ways. Each module is implemented as a PHP `class` with specific member functions. Some functions are relevant for all module types, as described below. Other functions are specific to a certain type of module, e.g. [page modules](/plugins/modules-page/) implement the functions `match_request()` and `process_request()`. If you wish to use non English characters in the PHP code for a module, ensure your text editor is using UTF-8 encoding without a BOM (byte order mark).

## Types of Module

Below is a list of the module types supported by Q2A - click for more information about each type:

- [**page**](/plugins/modules-page/) modules add a new type of page to a Q2A installation. The XML Sitemap plugin included with Q2A is an example.
- [**login**](/plugins/modules-login/) modules allow users to log in to Q2A via an external identity provider, like the Facebook Login plugin included with Q2A.
- [**editor**](/plugins/modules-editor/) modules provide a web interface for writing and editing posts. The WYSIWYG Editor included with Q2A is implemented via a plugin that registers an editor module.
- [**viewer**](/plugins/modules-viewer/) modules render content as HTML or text, and often work together with an editor module. Support for [Markdown](http://en.wikipedia.org/wiki/Markdown) or equations could be added via a plugin with both an editor and viewer module.
- [**event**](/plugins/modules-event/) modules (from Q2A 1.4+) are notified when something important happens, such as content being posted or voted on. They can be used for analytics, notifications or integrating with external services such as [Twitter](http://www.twitter.com/). The Event Logger plugin included with Q2A logs all events to a database table and/or log files.
- [**widget**](/plugins/modules-widget/) modules (from Q2A 1.4+) allow extra content to be shown on Q2A pages. The site admin can decide exactly where the widget is displayed. The Tag Cloud widget plugin that comes with Q2A is one example.
- [**filter**](/plugins/modules-filter/) modules (from Q2A 1.5+) can validate and/or modify many types of user input, including the content of posts. They can also mark whether a particular post should be queued for moderation.
- [**search**](/plugins/modules-search/) modules (from Q2A 1.5+) can implement a custom indexer and/or search engine for a Q2A site. They are given the opportunity to index posts and/or custom page content, and replace the default search results with their own.
- [**captcha**](/plugins/modules-captcha/) modules (from Q2A 1.5+) provide a web interface for human verification. The reCAPTCHA plugin that comes with Q2A provides an example, using the popular [reCAPTCHA](http://www.google.com/recaptcha) service.
- [**process**](/plugins/modules-process/) modules (from Q2A 1.5+) have the opportunity to run at specific stages of Q2A's response processing. They can be used for logging, analytics, additional authentication, caching, etc...

## Common module functions

Some functions are relevant for all module types, as listed below. You may also create a generic module which implements these functions by passing the type `'module'` when registering a module with `qa_register_plugin_module()`.

- **`load_module($directory, $urltoroot, $type, $name)`**. If a module defines this function, it is called by Q2A before the module is used. The `$directory` parameter contains the full local path of the module's plugin directory, which can be used as a prefix for `include` statements within the module. The `$urltoroot` parameter contains the URL of the plugin directory, relative to the current page request. If the module outputs HTML that references other files (such as images) which are part of the plugin, this prefix should be used for the corresponding URLs. The `$type` and `$name` parameters were added in Q2A 1.6 and contain the module type and name, as originally passed to `qa_register_plugin_module()`.

- **`option_default($option)`**. If a module defines this function, it is called by Q2A when an option's value is requested but the option has not yet been set (requires Q2A 1.4+). The `$option` parameter contains the name of the option whose default value is needed. If the module recognizes the option name, it should return the appropriate default value, otherwise it should return `null`. If no module returns a default value for an option, it will default to the empty string (`''`).

- **`admin_form(&$qa_content)`**. If defined, this function allows a module to include a form within Q2A's admin panel. This function should return a nested array defining a Q2A form, after processing any input from the form if it was just submitted. It may also modify the passed `$qa_content` structure, e.g. to add Javascripts to the page.

    It is beyond the scope of this documentation to describe `$qa_content` and Q2A form arrays in detail - you can find many examples by searching the Q2A code base for `$qa_content` or [ask here](http://www.question2answer.org/qa/). Some particular points to note:

    - All elements within the nested form array should be made HTML safe - use `qa_html()` as appropriate.
    - The `NAME=...` of all buttons and fields (within `tags` elements) should have a prefix which is unique to your plugin.
    - Use `qa_clicked()` and `qa_post_text()`, as described [here](/code/functions/), to check for button clicks and retrieve submitted fields.
    - Use `qa_opt()` to get or set an option that is stored in Q2A's options table. To prevent interference with Q2A or other plugins, any options should be named using a prefix which is unique to your plugin.

- **`init_queries($tableslc)`**. If a module requires some database initialization, e.g. to create its own table, it can define this function to integrate into Q2A's installation and updating process (requires Q2A 1.5+). For your convenience, `$tableslc` contains an array of lower case names of tables currently in the Q2A database. Your function should examine the `$tableslc` array and perform any other diagnostics in order to determine whether initialization is required. If so, return an array of one or more MySQL queries that should be run, otherwise return `null`. If you are creating a table with a `CREATE TABLE` query, you should add the appropriate prefix to the table name - see `qa_db_add_table_prefix()` in `qa-db.php` or use the `^` symbol before the table name. This will prevent clashes between separate Q2A installations sharing a database.

## Communication between modules

A module can define any additional functions for its own purposes, in the usual way for a PHP class. These functions can also be used for communication between modules, either within a plugin, or between different plugins. To call a function defined in a module, call [`qa_load_module()`](/code/functions/) to retrieve an object of the module's class, then call the object's function in the usual PHP way. Note that multiple calls to `qa_load_module()` will return the same object.
