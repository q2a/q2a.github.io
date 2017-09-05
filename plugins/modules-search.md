---
layout: page
menu: plugins
title: "Question2Answer - Developers - Search Modules"
---

# Search Modules

[« Back to modules](/plugins/modules/)

A search module (requires Q2A 1.5+) enables plugins to create a custom index of the content in a Q2A site, including questions, answers, comments and custom pages. If a search module is selected by the site administrator, it can replace the default Q2A search results with its own, and optionally include pages from external websites in those results.

The PHP class for a search module may contain the following functions (all are optional):

- **`index_post($postid, $type, $questionid, $parentid, $title, $content, $format, $text, $tagstring, $categoryid)`**. If defined, this function is called when a post should be added to the search index, either because it is new, or because it has just been edited. The parameter `$postid` contains the `postid` from the database. The `$type` will be `'Q'` for questions, `'A'` for answers, `'C'` for comments or `'NOTE'` for a note (currently used for question closing explanations). The `$questionid` is the `postid` of the question to which the post belongs and the `$parentid` is the `postid` of its immediate parent, or `null` if it has none. For questions, `$title` contains the title in UTF-8 format, otherwise it is `null`. The `$content` and `$format` parameters describe the post's content. If `$format` is `''`, then `$content` contains plain text in UTF-8 encoding. If `$format` is `'html'`, then `$content` contains HTML with UTF-8 encoding. Other values of `$format` may be present if a non-standard [editor module](/plugins/modules-editor/) is installed. The `$text` parameter contains a UTF-8 plain text rendering of the post, which is particularly useful for building a search index. For questions, `$tagstring` contains a comma-separated list of tags, otherwise it is `null`. Finally, `$categoryid` contains the category ID of the post, or `null` if there is none. Note that `index_post()` is only called when a post has been made visible on the Q2A site - it is not called if a new post was marked for moderation.

- **`unindex_post($postid)`**. If defined, this function is called when a post should be removed from the search index, because it has been hidden, deleted, or is about to be edited (in which case `index_post()` will be called immediately after). Generally, the parameter `$postid` matches a value previously passed to `index_post()` when the post was indexed. However in some circumstances the `$postid` might never have been indexed, in which case the function should do nothing.

- **`move_post($postid, $categoryid)`**. If defined, this function is called when a post's category is changed. The parameter `$postid` is the post's `postid` from the database, and `$categoryid` is its new `categoryid`. Generally, the parameter `$postid` matches a value previously passed to `index_post()` when the post was indexed. However in some circumstances the `$postid` might never have been indexed, in which case the function should do nothing.

- **`index_page($pageid, $request, $title, $content, $format, $text)`**. If defined, this function is called when a custom page should be added to the search index, because it is new or has just been edited. The parameter `$pageid` contains the `pageid` from the database. The `$request` parameter contains the URL fragment used to view the page - this can be passed to `qa_path()` to generate a URL. The `$title` parameter contains the page's title in UTF-8 format. The `$content`, `$format` and `$text` parameters work the same as for `index_post()` above, but `$format` is currently always `'html'`.

- **`unindex_page($pageid)`**. If defined, this function is called when a custom page should be removed from the search index, because it has been delted or is about to be edited (in which case `index_page()` will be called immediately after). Generally, the parameter `$pageid` matches a value previously passed to `index_page()` when the page was indexed. However in some circumstances the `$pageid` might never have been indexed, in which case the function should do nothing.

- **`process_search($query, $start, $count, $userid, $absoluteurls, $fullcontent)`**. If defined, this function allows the search module to replace the default Q2A search results with its own, if the module is selected by the site administrator. The `$query` parameter contains the entered search query in UTF-8 encoding. The parameter `$userid` identifies the user performing the query, or `null` if no user is logged in. The `$absoluteurls` and `$fullcontent` parameters are explained below. The function should return a nested array of up to `$count` search results for this query, starting at position `$start>=0`. Each element of the outer array is itself an inner array, which can contain one or more elements with the following keys:
    - `'question_postid' =>` the `postid` of the matching question. Use this to indicate a question page in general.
    - `'match_postid' =>` the `postid` of a specific matching question, answer or comment.
    - `'page_pageid' =>` the `pageid` of a matching custom page.
    - `'title' =>` the title to display for the search result.
    - `'url' =>` the URL for the search result, which must be absolute if `$absoluteurls` is true.

    A search result can refer to an external website by using only the `'title'` and `'url'` elements in the result's array. However, if one or both of these elements are present along with `'question_postid'`, `'match_postid'` or `'page_pageid'`, then they are used to override the title or URL displayed for the question or page as appropriate.

    To save additional database queries, it is also possible to pass through more information about a matching question, post or page in `'question'`, `'match_type'` or `'page'` elements. This requires knowledge of Q2A's internals - see `qa-app-search.php` for more information on how these elements are used with the `$fullcontent` parameter.

[« Back to modules](/plugins/modules/)
