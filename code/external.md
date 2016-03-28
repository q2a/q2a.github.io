---
layout: page
menu: code
title: "Question2Answer - Developers - External Access"
---

# Accessing Question2Answer from external PHP code

Question2Answer provides a self-contained environment for your Q&A site. However you may wish to access parts of Q2A from other PHP code running on your server, e.g. to access the Q2A database, check if a Q2A user is logged in, or call [other functions](/code/functions/).

To access Q2A 1.3.2 or later from an external script, simply `require_once` the file `qa-include/qa-base.php` from Q2A's directory, along with any other Q2A files containing functions you need. You can then freely call any of the functions defined within these files. Each function is documented at the top of the function definition. (Note: Versions of Q2A prior to 1.3.2 also required you to define `QA_BASE_DIR` and call `qa_base_db_connect()` with a failure handler - see [here](http://www.question2answer.org/qa/4583/login-system-outside-q%26a-directory#a4608).)

Below is an example external script which outputs the username and email of the currently logged in Q2A user, if any:

```php
<?php
require_once '/PATH/TO/qa-include/qa-base.php';

require_once QA_INCLUDE_DIR.'qa-app-users.php';

if (qa_get_logged_in_userid() === null)
    echo 'not logged in';
else
    echo qa_get_logged_in_handle() . '<br>' . qa_get_logged_in_email();
```

Below is an another example external script which creates a question by the currently logged in Q2A user:

```php
<?php

require_once '/PATH/TO/qa-include/qa-base.php';

require_once QA_INCLUDE_DIR.'qa-app-users.php';
require_once QA_INCLUDE_DIR.'qa-app-posts.php';

$type = 'Q'; // question
$parentid = null; // does not follow another answer
$title = 'Why do birds sing?';
$content = 'And why do they fall in love?';
$format = ''; // plain text
$categoryid = null; // assume no category
$tags = array('birds', 'sing', 'love');
$userid = qa_get_logged_in_userid();

qa_post_create($type, $parentid, $title, $content, $format, $categoryid, $tags, $userid);
```
