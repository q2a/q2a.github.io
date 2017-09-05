---
layout: page
menu: plugins
title: "Question2Answer - Developers - Captcha Modules"
---

# Captcha Modules

[« Back to modules](/plugins/modules/)

A captcha module (requires Q2A 1.5+) provides a web interface for verifying that a user is a human, rather than an automated script generating spam. The [captcha](http://en.wikipedia.org/wiki/CAPTCHA) should provide a challenge that is easy for humans but difficult for computers, such as reading some warped text or answering a common sense question.

The PHP `class` for a captcha module should contain the following functions (all except `allow_captcha()` are **required**):

- **`allow_captcha()`**. If defined, this function allows the captcha module to indicate whether it is ready to be used. For example, if the captcha requires some settings which have not yet been defined, it can return `false`. If the function is not defined, Q2A assumes that the captcha module is always ready.
- **`form_html(&$qa_content, $error)`**. This function returns the HTML form to be displayed for the captcha challenge. You can use hidden fields in this form to provide any information required by `validate_post()` - see below. If `$error` is not `null`, it contains an error message that should be displayed with the captcha, as passed out previously by your `validate_post()` function. You can also inject elements (such as Javascript) into the global `$qa_content` array for the page - see `qa-plugin/recaptcha-captcha/qa-recaptcha-captcha.php` for an example, or [ask here](http://www.question2answer.org/qa/). Note that if a captcha is required in multiple places on a web page, Q2A will only call `form_html()` once, and will take care of moving the captcha around the page as appropriate. This means your captcha must continue to work even if it was moved inside the [DOM](http://en.wikipedia.org/wiki/Document_Object_Model).
- **`validate_post(&$error)`**. This function returns whether the user responded to the captcha correctly. The function should retrieve the necessary form fields from PHP's `$_POST` array or Q2A's `qa_post_text()` function, and then perform the appropriate verification. Return `true` if the verification succeeded, otherwise `false`. If verification failed, you should also set `$error` to a textual error message which will passed back to `form_html()` for display to the user.

[« Back to modules](/plugins/modules/)
