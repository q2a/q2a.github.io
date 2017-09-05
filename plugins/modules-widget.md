---
layout: page
menu: plugins
title: "Question2Answer - Developers - Widget Modules"
---

# Widget Modules

[« Back to modules](/plugins/modules/)

A widget module (requires Q2A 1.4+) displays some extra HTML content on one or more of Q2A's pages. The widget specifies which types of pages ("templates") it can be displayed on, and where it can be displayed on the page. The Q2A site admin then chooses exactly where and when the widget is shown, out of those options that the widget makes available.

The PHP class for a widget module must contain the following functions (all are **required**):

- **`allow_template($template)`** should return `true` or `false` to indicate whether the widget can be displayed on pages of type `$template`. The parameter `$template` can take one of the following values:
    - `'account'` - user's 'My Account' page
    - `'activity'` - recent activity
    - `'admin'` - admin pages
    - `'ask'` - ask a question page
    - `'categories'` - list of categories
    - `'custom'` - custom or plugin pages
    - `'favorites'` - user's 'My Favorites' page
    - `'feedback'` - feedback form
    - `'hot'` - hot questions page
    - `'ip'` - page showing activity for an IP address
    - `'login'` - login page
    - `'message'` - private message page
    - `'qa'` - recent questions and answers (also home page if a custom home page is not being used)
    - `'question'` - individual question pages
    - `'questions'` - questions list
    - `'register'` - register page
    - `'search'` - search results page
    - `'tag'` - recent questions for a tag
    - `'tags'` - most popular tags
    - `'unanswered'` - recent questions without answers
    - `'updates'` - user's 'My Updates' page
    - `'user'` - individual user pages
    - `'users'` - top scoring usersNew values for `$template` may be added in future, so you should return `false` for unrecognized values unless your widget will not have a problem being displayed on any possible type of page.

- **`allow_region($region)`** should return whether the widget can be displayed in the (horizontal) part of the page indicated by `$region`, which can take one of the following values:

    - `'main'` - the area showing the page's main content, excluding the side panel. In the themes that come with Q2A, widgets in this region will have at least 728 pixels of width available, and no limit on height.
    - `'side'` - the side panel, at least 160 pixels wide in Q2A's built-in themes, with no height limit.
    - `'full'` - the full width of the main area and side panel, at least 900 pixels wide in Q2A's themes, with no height limit.New values for `$region` may be added in future, so you should return `false` for unrecognized values unless your widget is happy to be displayed in any area, no matter how narrow or wide.

- **`output_widget($region, $place, $themeobject, $template, $request, $qa_content)`** instructs your widget to output its HTML to the page. Your widget's HTML will be wrapped within a `<DIV>` which has a fixed pixel width (and unspecified height) in Q2A's built-in themes, so you can use CSS to position content within. The parameters passed are as follows:

    - `$region` - where your widget is being displayed (horizontally) on the page. It takes the values `'main'`, `'side'` or `'full'`, with meanings as for `allow_region()`.
    - `$place` - where your widget is being displayed (vertically) within `$region`. It takes the values `'top'`, `'high'`, `'low'` or `'bottom'`. Try adding a widget in the admin interface to see what these mean for each `$region`.
    - `$themeobject` - the instantiated theme class. This allows you to call any of the functions implemented in `qa-theme-base.php`. For example, `$themeobject->output('<DIV>', 'test', '</div>')` will output 3 lines of HTML.
    - `$template` - the type of page your widget is being displayed on, with meanings as for `allow_template()`.
    - `$request` - the Q2A request that generated the page, e.g. `'user/John Doe'`. The `$request` uses slash as a separator, independent of the type of URLs a particular Q2A site is using.
    - `$qa_content` - the nested Q2A array containing the full content for the page being displayed, as it was passed to the theme object. Use PHP's `print_r()` function to see what's inside and find any bits you need.

[« Back to modules](/plugins/modules/)
