---
layout: page
title: "Question2Answer - Developers - Translation / Localization"
---

# Translating Question2Answer into another language

Question2Answer fully supports non-English languages and is easy to translate. Before proceeding, it's worth [checking here](/addons/translations/) to see if a translation is already available. You may be able to use this immediately, or only have to add some missing phrases.


## Creating a new translation

To create a new Question2Answer translation from scratch, follow the steps below:

1. Open the file `admin.php` inside Question2Answer's `qa-include/app` directory and look at the function `qa_admin_language_options()`. This contains an array which maps abbreviated language codes to their corresponding languages. For example, the abbreviation for Russian is `ru`. Note down the abbreviation for your language. If your language is not in the array, you may add it, but please also [tell us](http://www.question2answer.org/feedback.php) so we can include it in future versions.

2. Create a subdirectory inside Question2Answer's `qa-lang` directory, and name the subdirectory with the abbreviation for your language, keeping the original capitalization.

3. **Copy** (don't move!) all of the `qa-lang-*.php` files in Question2Answer's `qa-include` directory to the new language directory you created. This is currently a total of 8 files.

4. Log in to your Question2Answer site as an administrator, open the Admin panel, select your language, and click to save.

5. Now you can translate each of the copied `qa-lang-*.php` files that you created. To translate each file:
    - Open the file in a text editor using **UTF-8 encoding** and ensure you do not add a BOM (byte order mark).
    - In each line of the file, translate the phrase **after** the `=>` symbol to your language.
    - Pay attention to substitution points, which use the hat symbol (`^`). These can be moved but not removed. In some cases, the `^` symbol is followed by a number or word, such as `^1` or `^site_title`, and this should also be preserved.
    - If you are not sure how a phrase is used, you may search for its key in the Question2Answer source code. The key is the string in quotes before `=>` on each line.
    - To leave a particular phrase in US English, you may remove its line from the file. You may also choose to remove the files `qa-lang-admin.php` and `qa-lang-options.php` - these are only used for the admin interface and do not contain any phrases which are visible to normal users of Q2A.

6. As you proceed with the translation, you can check your work by saving the `qa-lang-*.php` file you are working on, then viewing or refreshing the appropriate pages in your browser.

7. **`qa-check-lang.php` is your friend!** As you work, use your web browser to view the `qa-include/qa-check-lang.php` page within your Question2Answer site. This will check your language files for any omitted phrases or substitutions.

8. Please consider sending us your translation or making it available online, so that we can [link to it here](/addons/translations/).


## Updating an existing translation

An incomplete Question2Answer translation may be available for your language, for example because it has not been updated for the latest version of Q2A. To update a translation for the version you are running, follow the steps below:

1. Download and install the language by placing its directory (such as `fr` or `ru`) in Q2A's `qa-lang` directory.

2. Log in to your Question2Answer site as an administrator, open the Admin panel, select your language, and click to save.

3. **`qa-check-lang.php` is your best friend!** Use your web browser to view the `qa-include/qa-check-lang.php` page within your Question2Answer site. This will check your language files for errors and auto-generate the PHP code for missing phrases.

4. For each `qa-lang-*.php` file that needs attention:
    - Open the file in a text editor using **UTF-8 encoding** and ensure you do not add a BOM (byte order mark).
    - Copy and paste the appropriate PHP code from `qa-include/qa-check-lang.php` into the middle of this file.
    - For each line that you pasted, translate the phrase **after** the `=>` symbol to your language.
    - Pay attention to substitution points, which use the hat symbol (`^`). These can be moved but not removed.

5. As you work, refresh `qa-include/qa-check-lang.php` in your web browser and ensure that you resolve all issues shown. You can also browse around your Q2A site to see how the translated phrases are used in context.

6. Please consider sending us your translation or making it available online, so that we can [link to it here](/addons/translations/).


## Customizing selected URLs or phrases

From version 1.4, it is possible to modify some of the URLs used within a Q2A site. For example, `http://mysite.com/questions` could be replaced with `http://mysite.com/proposals`. To do this, look for the commented `$QA_CONST_PATH_MAP` definition in `qa-config.php`. This shows an example of how to define a PHP array which modifies the standard URLs used.

Starting in version 1.5, it is also possible to customize specific language phrases for your Q2A site without installing a full translation. To customize a particular phrase, follow the steps below:

1. Search the `qa-include/qa-lang-*.php` files to find the file and line containing the phrase.

2. Create a `qa-lang-*.php` file in Q2A's `qa-lang/custom` directory, with the same name as the file that you found in the previous step, and paste in the following code:

    ```php
    <?php

    return array(
        // custom phrases go here...
    );
    ```

3. Copy the line containing your phrase from Q2A's `qa-lang-*.php` file into the middle of the `array( )` in your new file.

4. Change the text that comes after the `=>` symbol to suit your requirements. Pay attention to substitution points, which use the hat symbol (`^`). For non-English languages, ensure your text editor is using UTF-8 encoding without a BOM (byte order mark).

Below is an example `qa-lang/custom/qa-lang-main.php` file which modifies the 'Hello [username]' and 'My Account' phrases:

```php
<?php

return array(
    'logged_in_x' => 'Welcome, ^!',
    'nav_account' => 'My Settings',
);
```
