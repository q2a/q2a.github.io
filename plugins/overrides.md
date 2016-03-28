---
layout: page
menu: plugins
title: "Question2Answer - Developers - Overrides"
---

# Implementing plugin overrides

Plugin overrides (requires Q2A 1.5+) can replace or wrap over 150 functions defined within the Q2A core. Overrides can be very powerful, but they run a risk of incompatibility with future versions of Q2A. If possible, it is recommended to use [modules](/plugins/modules/) or [layers](/plugins/layers/) instead. Nonetheless, some things can only be done via overrides, and future versions of Q2A will try not to break them.

Not all functions in Q2A can be overridden. To check a particular function, see whether its definition begins with:

`if (qa_to_override(__FUNCTION__))` ...

Functions are overridden by redefining them in a PHP file in your plugin directory, then calling `qa_register_plugin_overrides()` with the name of that file in `qa-plugin.php`. Here is a simple example of a PHP file which overrides `qa_retrieve_url()`:

```php
<?php

function qa_retrieve_url($url)
{
    // implement some specialized code for retrieving a URL's contents
}
```

In Q2A, overrides go beyond simple function replacement by allowing you to call through to the original Q2A function from within your own function. To call the original function, simple add `_base` to its name. For example:

```php
<?php

function qa_retrieve_url($url)
{
    if (substr($url, 0, 8)=='https://')
        // specialized code for retrieving secure pages
    else
        return qa_retrieve_url_base($url);
}
```

When overriding functions, you should call through to the `_base` function as much as possible. This allows you to deal with special cases and modify inputs and outputs without replacing a function in its entirety. If multiple plugins override the same function and call through to `_base`, Q2A will automatically build a calling chain of appropriately renamed functions, each of which calls the next. This process takes place in `qa_load_override_files()` in `qa-base.php` and is transparent to you as a plugin developer. Overall, using the `_base` function will maximize the chance of your plugin working well with other plugins, as well as future versions of Q2A.
