---
layout: page
menu: plugins
title: "Question2Answer - Developers - Plugin Modules"
---

# Page Modules

[« Back to modules](/plugins/modules/)

A page module adds one or more new pages to a Q2A installation. In Q2A, every page displayed has a corresponding `$request` string. For example, the `$request` for Q2A's page for user John Doe is `'user/John Doe'`. Page modules are able to control the output for particular `$request` strings in the same way. (Depending on the chosen URL structure for a Q2A installation, `$request` can be represented in different ways on the actual URL - you need not worry about this, nor should you make any assumptions.)

The PHP `class` for a page module can contain the following functions (all are optional):

- **`match_request($request)`** should return `true` if your page module will respond to Q2A page `$request`.

- **`suggest_requests()`** should return an array of suggested pages for your module. These suggestions will be displayed within the Q2A admin interface. Each element for a page in the array is itself an array, containing the following elements:

    - `title` contains a human-readable title used to describe the page, e.g. `'More Stats'`.
    - `request` contains the Q2A `$request` string for the page, e.g. `'stats/more'`. Your `match_request()` function should of course return `true` for this string.
    - `nav` contains a suggestion about where this page should be linked in the navigation menus. This is only a hint and can easily be changed by the site's administrator. Use `'M'` for after the main menu, `'B'` for before the main menu, `'O'` for opposite the main menu, `'F'` for the footer, or `null` for no navigation element.

- **`process_request($request)`** allows your page module to respond for a particular `$request`. This function should perform any necessary processing based on user inputs, and return information about the page to be displayed in a nested Q2A content array, named `$qa_content` by convention. (If your function outputs some special content such as XML, return `null` to prevent Q2A displaying anything further.) It is beyond the scope of this documentation to describe `$qa_content` in detail - there are many examples in the `qa-page-*.php` files and the page plugins that come with Q2A. You can also see how `$qa_content` is picked apart at the end of `qa-page.php` and in `main()` in `qa-theme-base.php`. Some particular points to note:

    - Always start by assigning `$qa_content=qa_content_prepare();` to include navigation menus and the like.
    - All elements within the nested `$qa_content` array should be made HTML safe - use `qa_html()` as appropriate.
    - Use `$qa_content['title']` and `$qa_content['error']` to display a page title or error message respectively.
    - To add some custom HTML to the page, add an element to `$qa_content` whose key begins with `custom`, e.g. `$qa_content['custom']` or `$qa_content['custom_2']`. The value of the element should contain the actual HTML.
    - To add a Q2A-style form to the page, add an element to `$qa_content` whose key begins with `form`, e.g. `$qa_content['form']` or `$qa_content['form_2']`. The value of the element should contain a Q2A form array, whose definition is also beyond the scope of this documentation, although see the [comments here](/plugins/modules/).
    - Other possible types of structured content in `$qa_content` are question lists (keys starting `q_list`), question views (`q_view`), answer lists (`a_list`) and rankings (`ranking`). Look through the `qa-page-*.php` files for examples.
    - The elements in `$qa_content` are displayed in array order, with a few exceptions such as page titles and errors.

[« Back to modules](/plugins/modules/)
