---
layout: page
menu: plugins
title: "Question2Answer - Developers - Layers Modules"
---

# Implementing plugin layers

A plugin layer can modify the HTML output for any part of a page by overriding functions in `qa_html_theme_base`, the base theme class defined in `qa-theme-base.php`. The layer is implemented as a PHP file containing the following fixed declaration:

```php
<?php

class qa_html_theme_layer extends qa_html_theme_base
{
}
```

Layers work similarly to [advanced themes](/themes/), except multiple layers can be installed simultaneously via their respective plugins. The PHP code for each layer is automatically modified at runtime (by `qa_load_theme_class()` in `qa-app-format.php`) to build an inheritance chain of appropriately renamed classes. This process is transparent to you as a layer developer. If you wish to use non English characters in your layer, ensure your text editor is using UTF-8 encoding without a BOM (byte order mark).

For more information on how to override theme functions in your layer class declaration, **start at step 3** of the documentation for [advanced themes](/themes/). When overriding functions in your layer, you should use PHP's double colon (`::`) notation to call through to the parent class as much as possible. This will maximize the chance of your layer working well with advanced themes, layers in other plugins, and future versions of Question2Answer.

Within a plugin's layer PHP file, the following pseudo-constants (substituted for strings at runtime) might prove useful:

1. `QA_HTML_THEME_LAYER_DIRECTORY` contains the full local path of the plugin directory. This can be used as a prefix for `include` statements within the layer's code.
2. `QA_HTML_THEME_LAYER_URLTOROOT` contains the URL of the plugin directory, relative to the current page request. If the layer outputs HTML that references other files (such as images) within the plugin directory, this prefix should be used for the corresponding URLs.

Below is an example layer which makes four changes to the standard theme. First, it removes the login and register links if they are to be displayed. Second, it includes a Javascript file from the plugin's directory on question pages. Third, it displays all question tags in alphabetical order. Fourth, it shows the usernames of specifically priviliged users in italics.

```php
<?php

class qa_html_theme_layer extends qa_html_theme_base
{
    function nav_list($navigation, $navtype, $level = null) // remove login and register links
    {
        if ($navtype=='nav-user') {
            unset($navigation['login']);
            unset($navigation['register']);
        }

        qa_html_theme_base::nav_list($navigation, $navtype, $level);
    }

    function head_script() // add a Javascript file from plugin directory
    {
        if ($this->template=='question') // check it's a question page
            $this->content['script'][]='<SCRIPT src="'.
            qa_html(QA_HTML_THEME_LAYER_URLTOROOT.'my-script.js').
            '" TYPE="text/javascript"></SCRIPT>';

        qa_html_theme_base::head_script();
    }

    function post_tag_list($post, $class) // show tags in alphabetical order
    {
        sort($post['q_tags'], SORT_STRING);

        qa_html_theme_base::post_tag_list($post, $class);
    }

    function post_meta_who($post, $class) // show usernames of privileged users in italics
    {
        require_once QA_INCLUDE_DIR.'qa-app-users.php'; // for QA_USER_LEVEL_BASIC constant

        if (isset($post['raw']['opostid'])) // if item refers to an answer or comment...
            $level=@$post['raw']['olevel']; // ...take the level of answer or comment author
        else
            $level=@$post['raw']['level']; // otherwise take level of the question author

        if ($level>QA_USER_LEVEL_BASIC) // if level is more than basic user...
            $post['who']['data']='<I>'.@$post['who']['data'].'</I>'; // ...add italics

        qa_html_theme_base::post_meta_who($post, $class);
    }
}
```
