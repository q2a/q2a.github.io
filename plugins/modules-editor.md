---
layout: page
menu: plugins
title: "Question2Answer - Developers - Editor Modules"
---

# Editor Modules

[« Back to modules](/plugins/modules/)

An editor module implements a web interface for editing the content of questions, answers and comments. The module controls the HTML field which is displayed for editing, and converts the input from that field into data for storage in Q2A's database.

For example, the default editor module in `qa-editor-basic.php` displays a simple text field and generates text content for storage. The WYSIWYG Editor plugin included with Q2A wraps [CKEditor](http://ckeditor.com/) and generates text or HTML content for storage. Your editor can also store content in a format other than text or HTML, but a [viewer module](/plugins/modules-viewer/) will be required to render that content for Q2A.

The PHP `class` for an editor module must contain the following functions (all are **required**):

- **`calc_quality($content, $format)`** should return a numerical value indicating your editor's compatibility with the supplied content, as retrieved from Q2A's database. If `$format` is `''`, then `$content` contains plain text in UTF-8 encoding. If `$format` is `'html'`, then `$content` contains HTML with UTF-8 encoding. Other values of `$format` are also possible, depending on the editor modules installed. You should return `1.0` to indicate perfect compatibility, and `0.0` for complete incompatibility. If an editor has been selected as the default in Q2A's admin panel, it will be used if its `calc_quality()` function returns `0.5` or more for the given content. Otherwise, the editor returning the highest value will be used. For your reference, Q2A's basic text editor returns `1.0` for plain text and `0.2` for HTML, and the WYSIWYG Editor plugin returns `1.0` for HTML and `0.8` for plain text.

- **`get_field(&$qa_content, $content, $format, $fieldname, $rows)`** should return an HTML-based field for your editor. The `$content` and `$format` parameters specify the content that needs editing or `null` if new content is being created. The `$fieldname` parameter contains the HTML element name that you should use - if your editor outputs multiple HTML elements, use `$fieldname` as a prefix. The `$rows` parameter indicates a suggested height for your editor, in lines of text. To output custom HTML for your editor, return `array('type' => 'custom', 'html' => '[the html]')` from this function. You can also return an array representing any standard Q2A form field and inject elements (such as Javascript) into the `$qa_content` array - see `qa-editor-basic.php` and `qa-wysiwyg-editor.php` for some examples, or [ask here](http://www.question2answer.org/qa/).

- **`read_post($fieldname)`** should retrieve the content from your editor, as POSTed from the user's web browser, and convert it for storage in Q2A's database. The `$fieldname` parameter matches the value that was previously passed to `get_field()`. To store plain text, return `array('format' => '', 'content' => '[text in UTF-8]')` from this function. To store HTML, return `array('format' => 'html', 'content' => '[html in UTF-8]')`. **If you are storing HTML as submitted by the user's browser, you must sanitize it using `qa_sanitize_html()` to prevent Javascript injection and other security issues.** Aside from plain text and HTML, your `read_post()` function can store any other type of content in Q2A's database, by supplying an appropriate `'format'` (up to 20 ASCII characters in length) and corresponding `'content'`. In this case, a [viewer module](/plugins/modules-viewer/) will be required to render the stored content as plain text or HTML.

In addition, the following **optional** functions may also be defined (all require Q2A 1.5+):

- **`focus_script($fieldname)`** can return a Javascript that brings the editor field into focus (requires Q2A 1.5+). In simple cases this might return `"document.getElementById('".$fieldname."').focus();"`. Note that this function replaces the deprecated `$autofocus` parameter passed to `get_field()` in earlier versions of Q2A.

- **`load_script($fieldname)`** can return a Javascript that finishes loading the editor (requires Q2A 1.5+). This can be used to save page complexity and loading time by only loading the editor once it is displayed to the user.

- **`update_script($fieldname)`** can return a Javascript that prepares the editor content for submission via the enclosing form (requires Q2A 1.5+). If your editor manipulates content outside the form's field, e.g. in an iframe, this allows it to update the field content immediately before the form is submitted.

[« Back to modules](/plugins/modules/)
