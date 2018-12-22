---
layout: page
menu: plugins
title: "Question2Answer - Developers - Login Modules"
---

# Login Modules

[« Back to modules](/plugins/modules/)

A login module enables users to log in to Q2A via an external identity provider, such as [Open ID](http://openid.net/). The module can display some HTML alongside Q2A's login and register links in the navigation menu, and/or on Q2A's login and register pages. This HTML can use a variety of methods to obtain the user's credentials, such as linking to a separate form or showing a pop-up via Javascript.

When your plugin logs in a user for the first time, a normal Q2A account is created for the user, and the user's profile will be prepopulated using information you supply. This Q2A account is permanently connected to the external identity you supply, so that the user can log in using the same external identity in future. The user will also be able to log into their Q2A account using the standard Q2A login form, but only once they have set a password in their 'My Account' page.

In order to log in a user, your plugin calls function `qa_log_in_external_user()` at the appropriate time. The same call is used whether the user is registering for the first time or logging in to an existing account. Q2A takes care of handling each case as appropriate. The function `qa_log_in_external_user()` takes the following parameters in order:

1. A `$source` string uniquely identifying your login method, such as `'facebook'` or `'openid'`, up to 16 ASCII characters in length.

2. An `$identifier` for the user supplied by the external identity provider, up to 1024 bytes in length, which will always be the same for that user. Generally this will be a numerical user ID, but it can also be a URL or any other unique identifier.

3. An array `$fields` of optional additional information about the user, which can contain any of the following elements:

    - `$fields['email']` for the user's email address. Beginning in Q2A 1.5.4, this will be ignored if there is already a user in the database with the same email address.
    - `$fields['confirmed']` can be `true` to indicate that the user has confirmed their email address.
    - `$fields['handle']` for a suggested username. Q2A will modify this sensibly if it clashes with another user.
    - `$fields['level']` for the user's privilege level. Use one of the `QA_USER_LEVEL_*` constants defined at the top of `qa-app-users.php`, e.g. `QA_USER_LEVEL_MODERATOR`. If omitted, `QA_USER_LEVEL_BASIC` is assumed.
    - `$fields['name']`, `$fields['location']`, `$fields['website']` and `$fields['about']` for the user's profile.
    - `$fields['avatar']` for the user's avatar picture. This should contain the raw JPEG/GIF/PNG image data. If necessary you can obtain this data from a URL using Q2A's `qa_retrieve_url()` function.

Each time you call `qa_log_in_external_user()` for a particular user, you should pass the exact same values for `$source` and `$identifier`. This enables Q2A to determine whether the user already has an account - if so, `$fields` will be ignored.

The PHP `class` for a login module can contain the following functions (all are optional):

- **`check_login()`** is called early on during every page request if a user is not currently logged in. This gives your module the opportunity to log in a user based on a browser cookie (like Facebook) or a parameter on the URL.

- **`match_source($source)`** should return `true` if your module uses `$source` in calls to `qa_log_in_external_user()`.

- **`login_html($tourl, $context)`** allows your module to display some HTML for connecting with your external identity provider. For example, you could show an image which links to a login form. The Facebook Login plugin included with Q2A displays a login button using the Facebook Javascript API. However you choose to implement the login process, you should redirect the user to `$tourl` once the login is complete. The $context parameter tells you where the HTML will be displayed - `'menu'` for the top right menu, `'login'` for Q2A's login page, and `'register'` for Q2A's register page.

- **`logout_html($tourl)`** allows your module to display some HTML for logging out the user, to be displayed in the top right menu. Your `logout_html()` function is only called if the current Q2A user was logged in via `qa_log_in_external_user()` and your `match_source()` function returns `true` for the `$source` value that was used. The `$tourl` parameter contains the URL of the Q2A logout page, to which you **must** redirect the user once your own logout process is complete.

You may choose to request the user's external login credentials on a page which is served by Q2A. In this case you would include both a login module and a [page module](/plugins/modules-page/) in your plugin. The HTML displayed by the login module would link to your custom page, and the page module would display the appropriate form and call `qa_log_in_external_user()` when the form was submitted.

[« Back to modules](/plugins/modules/)
