---
layout: page
menu: plugins
title: "Question2Answer - Developers - Tutorial - Writing a Plugin"
---

# Tutorial: Writing a Question2Answer plugin

In this tutorial, we will create a Question2Answer (1.5+) [plugin](/plugins/) from scratch. Our plugin will allow descriptions to be added to tags on a Q2A site. These descriptions will be displayed and edited on the page listing recent questions for each tag. They will also be shown in a tooltip when users mouse over a tag. The Q2A administrator will be able to decide who can edit tag descriptions.

The tutorial will touch on each of the main areas of Q2A plugin `function`ality. Tag descriptions will be stored in the Q2A database, using Q2A's tag metadata table. The descriptions will be displayed on a tag's page using a [widget module](/plugins/modules-widget/). Tags will be edited on pages provided by a [page module](/plugins/modules-page/). An [override](/plugins/overrides/) will be used to show the tooltips, and then a [layer](/plugins/layers/) will allow us to do this with fewer database queries. An admin form for the plugin will be displayed in the 'Plugins' section of the admin panel, with the corresponding settings stored by Q2A's options mechanism. At the end of this process, we will see how to make the plugin localizable.

This tutorial assumes you are familiar with the [PHP](http://www.php.net/) programming language as well as some basic [HTML](http://en.wikipedia.org/wiki/HTML) and [MySQL](http://www.mysql.com/).


## 1\. Creating the plugin directory and `qa-plugin.php`

In this first step we will set up the directory for the plugin and create the crucial `qa-plugin.php` file within.

- Create a new empty directory `tag-descriptions` in Q2A's `qa-plugin` directory - see [here](/plugins/) for naming conventions.

- Create an empty `qa-plugin.php` file inside this directory. This file is the core of the plugin. It registers each of the plugin's elements with Q2A and contains meta information for display in Q2A's admin interface.

- Open the 'Plugins' page of your Q2A site admin panel. You should see the plugin listed as 'Unnamed Plugin'. If it is not there, please check you named `qa-plugin.php` correctly and have uploaded it to the right place on your server.

- Now let's add some basic meta information about the plugin, so it can be listed more informatively in the admin section. Open `qa-plugin.php` in your favorite text editor, paste in the following code, then save/upload the file:

    ```php
    <?php
    /*
      Plugin Name: Tag Descriptions Tutorial
      Plugin URI:
      Plugin Description: Allows tag descriptions to be displayed as tooltips
      Plugin Version: 1.0
      Plugin Date: 2016-01-02
      Plugin Author:
      Plugin Author URI:
      Plugin License: GPLv2
      Plugin Minimum Question2Answer Version: 1.5
      Plugin Update Check URI:
    */

    if (!defined('QA_VERSION')) { // don't allow this page to be requested directly from browser
      header('Location: ../../');
      exit;
    }
    ```

    See [here](/plugins/) for a detailed description of the metadata fields. The code below the metadata ensures that visitors to your Q2A site cannot request the `qa-plugin.php` page directly (even though doing so would cause no actual harm).

- Reopen the 'Plugins' page of your Q2A site admin panel and check that the listing has been updated. We're on our way!


## 2\. Creating a widget module

In this step we will create the initial version of the widget module which displays descriptions on tag pages.

- Create a new file named `qa-tag-desc-widget.php` in your plugin's `tag-descriptions` directory, and paste this in:

    ```php
    <?php

    class qa_tag_descriptions_widget {

        function allow_template($template)
        {
            return ($template=='tag');
        }

    }
    ```

    This is the beginning of the PHP class that will define the widget's functionality. The `allow_template()` function is one of three class functions required in a widget module ([more here](/plugins/modules-widget/)). It is called by Q2A to determine which types of pages the widget can be displayed on. In this case, the widget can only be displayed on pages listing recent questions for a tag, so the function only returns `true` if the `$template` parameter is `'tag'`.

- Add the following two additional functions **inside** the `class` definition in `qa-tag-desc-widget.php`:

    ```php?start_inline=1
    function allow_region($region)
    {
        return true;
    }

    function output_widget($region, $place, $themeobject, $template, $request, $qa_content)
    {
        echo 'just a test';
    }
    ```

    The `allow_region()` function allows the widget to restrict its display to specific areas of the page. In our case, we're not fussy, so we return `true` for any `$region` parameter. The `output_widget()` function tells our widget to actually display its content. For now, it will simply output a fixed test string.

- The skeleton of our widget module is now complete, and we need to activate it. Paste this at the end of `qa-plugin.php`:

    ```php?start_inline=1
    qa_register_plugin_module(
      'widget', // type of module
      'qa-tag-desc-widget.php', // PHP file containing module class
      'qa_tag_descriptions_widget', // module class name in that PHP file
      'Tag Descriptions' // human-readable name of module
    );
    ```

    Each parameter to `qa_register_plugin_module()` is explained by a comment in the code above - [more here](/plugins/).

- Now it's time to test out the widget. Ensure you have saved/uploaded the `qa-plugin.php` and `qa-tag-desc-widget.php` files. Then open the 'Layout' section of your Q2A site admin panel. The list of available widgets should include the name 'Tag Descriptions'. Click 'add widget' next to it, and choose to display the widget somewhere on tag pages. Note how the options shown in the admin panel reflect the widget module's responses from `allow_template()` and `allow_region()`.

- Check the widget is outputting its test string by visiting a tag page on your Q2A site. If it's there, well done!


## 3\. Creating the tag description editing page

In this step we will create the page module that allows tag descriptions to be edited.

- Create a new file named `qa-tag-desc-edit.php` in your `tag-descriptions` directory and paste this in:

    ```php
    <?php

    class qa_tag_descriptions_edit_page {

        function match_request($request)
        {
            $parts=explode('/', $request);

            return $parts[0]=='tag-edit';
        }

        function process_request($request)
        {
            return null;
        }

    }
    ```

    The `match_request()` function let a page module decide if it will process a particular web page request. The `$request` parameter is always slash-separated, independent of the URL structure used by a particular Q2A site - [more here](/plugins/modules-page/). We have decided that the URLs for our tag description editor will take the form `tag-edit/*` where `*` is the tag to be edited. For now, the `process_request()` function in the page module generates an empty page for these requests.

- Activate the page model within the plugin by pasting the following code at the end of your `qa-plugin.php` file:

    ```php?start_inline=1
    qa_register_plugin_module(
      'page', // type of module
      'qa-tag-desc-edit.php', // PHP file containing module class
      'qa_tag_descriptions_edit_page', // name of module class
      'Tag Description Edit Page' // human-readable name of module
    );
    ```

- Now save/upload all files and test the page module is working by clicking on a tag in your Q2A site, then replacing `tag` in the URL with `tag-edit`. An empty page should be generated, rather than a 'page not found' error.

- Now we will put something on the page. Replace the previous `process_request()` function with:

    ```php?start_inline=1
    function process_request($request)
    {
        $parts=explode('/', $request);
        $tag=$parts[1];

        $qa_content=qa_content_prepare();
        $qa_content['title']='Edit the description for '.qa_html($tag);

        return $qa_content;
    }
    ```

    As in `match_request()` above, the new `process_request()` function begins by examining the `$request` parameter to determine which tag is being edited. It then calls Q2A's `qa_content_prepare()` function to create the initial page description in `$qa_content`, including navigation and widgets. After assigning a title to the page it returns `$qa_content` as a result. Note that the `$tag` is HTML-escaped by `qa_html()` for use in `$qa_content`, since it could contain characters like < or >.

- Save/upload `qa-tag-desc-edit.php` then refresh the tag editing page. It should show a title and Q2A's navigation.


## 4\. Creating a working tag description editor

In this step we will get the tag description editing page up and working.

- Go back to `process_request($request)` in `qa-tag-desc-edit.php` and paste this code **before** the final `return...` line:

    ```php?start_inline=1
    require_once QA_INCLUDE_DIR.'qa-db-metas.php';

    $qa_content['form']=array(
        'tags' => 'METHOD="POST" ACTION="'.qa_self_html().'"',

        'style' => 'tall', // could be 'wide'

        'fields' => array(
            array(
                'type' => 'text',
                'rows' => 4,
                'tags' => 'NAME="tagdesc" ID="tagdesc"',
                'value' => qa_html(qa_db_tagmeta_get($tag, 'description')),
            ),
        ),

        'buttons' => array(
            array(
                'tags' => 'NAME="dosave"',
                'label' => 'Save Description',
            ),
        ),
    );

    $qa_content['focusid']='tagdesc';
    ```

    There is a lot happening here, so let's go through it step by step:

    - First, we include the Q2A core file `qa-db-metas.php`, since we will need use some of its functions to access the Q2A database table for tag meta information. (If necessary, modules can also create their own database tables by implementing the `init_queries()` function - [more here](/plugins/modules/)).

    - The main work consists of adding an element with key `'form'` to the `$qa_content` array. This element describes a form on the page, which is converted by the Q2A theme class into appropriate HTML code. (To add more forms to the page, more elements could be added with keys `'form2'`, `'form_extra'`, or anything else beginning with `'form'`.)

    - At the top level of the form array, the `'tags'` element contains HTML code to be inserted into the HTML `<FORM>` tag. As is usual, we ensure here that the form submits back as an HTTP POST request to the same page.

    - The `'style'` element set the form layout and which CSS classes it uses. The `'tall'` style uses one column, placing labels above their fields and errors/notes below. The `'wide'` style uses a table with three columns, placing labels to the left of fields and errors/notes to the right. See also the `qa-form-tall-*` and `qa-form-wide-*` classes in your theme's `qa-styles.css`.

    - The `'fields'` element is an array of arrays, each of which describes one field in the form to be displayed.

    - Our form has a single field of type `'text'`, four rows in height. Other possible values for `'type'` include `'static'`, `'number'`, `'checkbox'` and `'select'` - see the `form_field()` function in `qa-theme-base.php` for the full list. The `'tags'` element is included within the HTML element describing the field, e.g. `<INPUT>` or `<TEXTAREA>`.

    - The `'value'` element sets the field's current value to be displayed on the page. In our case, we retrieve the current description of the tag from Q2A's tag metadata table. We have chosen to store tag descriptions using the metadata label `'description'`. Note that we HTML-escape the current description using `qa_html()` before placing it in the form array since Q2A assumes that all elements and subelements within a `$qa_content` array are already HTML escaped.

    - The `'buttons'` element in the form definition is another array of arrays, each of which describes one button at the bottom of the form. Our form has a single button which allows the tag description to be saved.

    - As with fields, the `'tags'` element for a button contains HTML code to be inserted into the `<INPUT TYPE="submit">` tag. The `'label'` element sets the button text.

    - Finally, we ensure that the tag description field receives the focus when the page is loaded by setting `$qa_content['focusid']` to match the CSS ID of the field, as set in its `'tags'` string.

- Save/upload `qa-tag-desc-edit.php` and refresh the `tag-edit` page in your browser. The form should now be displayed, but it does not yet save information. This is because we have not yet written the code for processing input on this page.

- Go back again to the `process_request($request)` function in `qa-tag-desc-edit.php` and paste the following code immediately before the `$qa_content['form']` assignment:

    ```php?start_inline=1
    if (qa_clicked('dosave')) {
        require_once QA_INCLUDE_DIR.'qa-util-string.php';

        $taglc=qa_strtolower($tag);
        qa_db_tagmeta_set($taglc, 'description', qa_post_text('tagdesc'));
        qa_redirect('tag/'.$tag);
    }
    ```

    Let's go through this code step by step:

    - First, we check if the user clicked the `'dosave'` button on the form - recall that `'NAME="dosave"'` was used earlier as the `'tags'` string for the button.

    - If the button was clicked, we first convert the tag to lowercase for storing metadata in the database using the `qa_strtolower()` function from Q2A's `qa-util-string.php` file. By using the lowercase version of the tag, we will make life easier later on when retrieving the descriptions for many tags from the database in a single query.

    - We then retrieve the text entered in the `'tagdesc'` field on the form, and call `qa_db_tagmeta_set()` to store it in the database using the metadata label `'description'`.

    - Once the description is saved, the user is redirected back to the corresponding tag page, which will (once we're finished this step) display the updated tag description.

- Now open `qa-tag-desc-widget.php` and replace the previous `output_widget()` function with the following:

    ```php?start_inline=1
    function output_widget($region, $place, $themeobject, $template, $request, $qa_content)
    {
        require_once QA_INCLUDE_DIR.'qa-db-metas.php';

        $parts=explode('/', $request);
        $tag=$parts[1];

        $description=qa_db_tagmeta_get($tag, 'description');
        $editurlhtml=qa_path_html('tag-edit/'.$tag);

        if (strlen($description)) {
            echo qa_html($description);
            echo ' - <a href="'.$editurlhtml.'">edit</a>';
        } else
            echo '<a href="'.$editurlhtml.'">Create tag description</a>';
    }
    ```

    The `output_widget()` function now identifies which tag page is being requested, retrieves the appropriate tag description from the database, and displays it if it exists, after HTML escaping. An appropriate link to edit the description is also shown, using Q2A's `qa_path_html(...)` function to create an HTML-escaped relative URL to the tag editor page - [more here](/code/functions/).

- Save/upload as usual. If everything is in place, you should be able to view your descriptions on the tag page, click to edit them on a different page, and then click to save and view them back again on the tag page. Congratulations!


## 5\. Displaying tag descriptions in tooltips

In this step we will implement the tooltips which display tag descriptions when mousing over tags.

- Open the `qa-app-format.php` file in Q2A's `qa-include` directory and search for `function qa_tag_html`. This function generates the HTML to represent a tag on the page. The first line of the function contains `if (qa_to_override(...))`, which means the function can be overridden by a plugin. That is very helpful for us here.

- Create a new file `qa-tag-desc-overrides.php` in your plugin's `tag-descriptions` directory and paste the following:

    ```php
    <?php

    function qa_tag_html($tag, $microdata=false, $favorited=false)
    {
        return qa_tag_html_base('_'.$tag.'_', $microdata, $favorited);
    }
    ```

    This `qa_tag_html()` function will override the standard version of that function, which we saw just before. However our version makes uses of the standard function by calling it using the name `qa_tag_html_base()` - [more here](/plugins/overrides/). Instead of passing through the `$tag` as is, we add underscores before and after it, so that we can test that the override is working. Note that the optional `$favorited` parameter was added in Q2A 1.6, but this code will still work fine in Q2A 1.5.x, with PHP ignoring the extra unexpected parameter.

- Activate the function override by pasting the following line at the end of your plugin's `qa-plugin.php`:

    ```php?start_inline=1
    qa_register_plugin_overrides('qa-tag-desc-overrides.php');
    ```

    This simply tells Q2A to apply function overrides in the file `qa-tag-desc-overrides.php` in your plugin directory.

- Save/upload your files and view a question list or individual question with tags. You should see the underscores on either side of each tag name, and this means that the override is working.

- Go back to `qa-tag-desc-overrides.php` and replace the function with the following:

    ```php?start_inline=1
    function qa_tag_html($tag, $microdata=false, $favorited=false)
    {
        $taghtml=qa_tag_html_base($tag, $microdata, $favorited);

        require_once QA_INCLUDE_DIR.'qa-db-metas.php';

        $description=qa_db_tagmeta_get($tag, 'description');

        if (strlen($description)) {
            $anglepos=strpos($taghtml, '>');
            if ($anglepos!==false)
                $taghtml=substr_replace($taghtml, ' TITLE="'.qa_html($description).'"',
            $anglepos, 0);
        }

        return $taghtml;
    }
    ```

    Let's explain this function step by step:

    - First, we call the standard version of the function using `qa_tag_html_base()` and store the standard HTML to represent a tag in the variable `$taghtml`. By calling through to the base function rather than copying its code here, we protect ourselves better against changes in future versions of Q2A. We also enable multiple plugins to override the same function for different purposes, with Q2A building an appropriate chain of renamed functions that call each other in turn. If possible, it is always a good idea to do this when overriding a function - [more here](/plugins/overrides/).

    - We retrieve the description for `$tag` from the database, using `qa_db_tagmeta_get()` in the same way as before.

    - If a description was found, we need to insert it into `$taghtml`, while assuming as little as possible about the contents of `$taghtml`. So we insert our description in a `TITLE="..."` attribute before the first `>` symbol in `$taghtml`, i.e. within the first HTML element that `$taghtml` contains. Note the inclusion of a space before `TITLE`, to ensure we don't interfere with other attributes of the element, and the use of `qa_html(...)` to ensure the tag description is HTML escaped.

    - Finally, we return the (possibly modified) HTML code as the result of our `qa_tag_html()` function.

- Save/upload `qa-tag-desc-overrides.php`. Assuming you have added some tag descriptions previously, you should now be able to view these tag descriptions when mousing over a tag in a question list or question page.


## 6\. Reducing the number of database queries

_This step is advanced and can be skipped if you prefer._

While our override of `qa_tag_html()` works, it has a problem. Q2A has to make a separate database query for every tag on a page. This could drastically slow down page loading if the database and web servers are not running on the same physical computer. (You can see all the database queries used for a page by setting `QA_DEBUG_PERFORMANCE` to `true` in your `qa-config.php` file.)

We will solve this problem by inserting tag descriptions in two stages. For the first stage, our overriding `qa_tag_html()` function will not perform database queries. Instead, it will keep track of which tags are being used and insert a placeholder into `$taghtml`.

In the second stage, a layer will replace the `post_tag_item()` function in Q2A's base theme class. The first time our function is called, it will perform a single database query to retrieve all the necessary tag descriptions. In addition, every call to our `post_tag_item()` function will modify the HTML for the tag before calling through to the base theme class.

- Go back to `qa-tag-desc-overrides.php` and modify the function as follows:

    ```php?start_inline=1
    function qa_tag_html($tag, $microdata=false, $favorited=false)
    {
        global $plugin_tag_desc_list;

        $taghtml=qa_tag_html_base($tag, $microdata, $favorited);

        require_once QA_INCLUDE_DIR.'qa-util-string.php';

        $taglc=qa_strtolower($tag);
        $plugin_tag_desc_list[$taglc]=true;

        $anglepos=strpos($taghtml, '>');
        if ($anglepos!==false)
            $taghtml=substr_replace($taghtml, ' TITLE=",TAG_DESC,'.$taglc.',"', $anglepos, 0);

        return $taghtml;
    }
    ```

    Here's an explanation of what we're doing now:

    - We use Q2A's `qa_strtolower()` function to put a lower case version of the tag in `$taglc`. Normalizing all tags to lower case will help us later when mapping from tags to descriptions using data retrieved from the database.

    - We add `$taglc` to global `$plugin_tag_desc_list` array variable. Note how we name this global variable with a `$plugin_tag_desc_` prefix to avoid namespace clashes. We store tags in the keys of `$plugin_tag_desc_list` since this will automatically perform de-duplication if the same tag appears more than once on the page.

    - We insert a `TITLE` attribute into `$taghtml` containing the special string `,TAG_DESC,_taglc_,` where `_taglc_` denotes the lower case tag. This will later be replaced by the tag description retrieved from the database. Note that our special string uses commas as a delimiter because commas never appear within a tag.

- Now save/upload `qa-tag-desc-overrides.php`. Refresh a Q2A page showing some tags, and mouse over one of the tags. A tooltip should now appear with the special `,TAG_DESC,_taglc_,` string in it.

- Now it's time to create a layer which replaces the `post_tag_item()` function in Q2A's base theme class. Create a new file `qa-tag-desc-layer.php` in your plugin directory and paste in the following code:

    ```php
    <?php

    class qa_html_theme_layer extends qa_html_theme_base
    {

        function post_tag_item($taghtml, $class)
        {
            global $plugin_tag_desc_list;

            if (count(@$plugin_tag_desc_list)) {
                $tags=array_keys($plugin_tag_desc_list);
                echo '<H1>'.qa_html(implode(',', $tags)).'</H1>';
                $plugin_tag_desc_list=null;
            }

            qa_html_theme_base::post_tag_item($taghtml, $class);
        }

    }
    ```

    Let's see what we're doing in this `post_tag_item()` function:

    - We check if the global `$plugin_tag_desc_list` array variable contains any items. Note our use of the `@` sign to prevent PHP reporting an error if `$plugin_tag_desc_list` was never defined or does not contain an array.

    - We retrieve the list of tags from the **keys** of the `$plugin_tag_desc_list` array.

    - A list of these tags is output to the page within an HTML `<H1>` element, for debugging purposes.

    - Then `$plugin_tag_desc_list` is set to `null` so that this branch is skipped next time `post_tag_item(...)` is called.

    - Finally, we call through to the `post_tag_item()` function in Q2A's base theme class using PHP's double colon notation - [more here](/plugins/layers/). Note how base functions are called differently for overrides and for layers.

- As with modules and overrides, we need to activate the layer by adding this in our plugin's `qa-plugin.php` file:

    ```php?start_inline=1
    qa_register_plugin_layer(
      'qa-tag-desc-layer.php', // PHP file containing layer
      'Tag Description Layer' // human-readable name of layer
    );
    ```

- Save/upload all files and refresh the page showing some tags. You should now see a comma-separated list of tags to be retrieved from the database, immediately before the first tag on the page.

- Go back to `qa-tag-desc-layer.php` and replace `post_tag_item()` with the real version of the function:

    ```php?start_inline=1
    function post_tag_item($taghtml, $class)
    {
        global $plugin_tag_desc_list, $plugin_tag_desc_map;

        if (count(@$plugin_tag_desc_list)) {
            $result=qa_db_query_sub(
                'SELECT tag, content FROM ^tagmetas WHERE tag IN ($) AND title="description"',
                array_keys($plugin_tag_desc_list)
            );

            $plugin_tag_desc_map=qa_db_read_all_assoc($result, 'tag', 'content');
            $plugin_tag_desc_list=null;
        }

        if (preg_match('/,TAG_DESC,([^,]*),/', $taghtml, $matches)) {
            $taglc=$matches[1];
            $description=@$plugin_tag_desc_map[$taglc];
            $taghtml=str_replace($matches[0], qa_html($description), $taghtml);
        }

        qa_html_theme_base::post_tag_item($taghtml, $class);
    }
    ```

    Let's go through this one step at a time:

    - As before, we check if the global `$plugin_tag_desc_list` array variable contains any items, If so, we need to retrieve some tag descriptions from the database.

    - We retrieve all the tag descriptions in one database query. There is no function to retrieve metadata for multiple tags in `qa-db-metas.php`, so we write and run the query ourselves using Q2A's `qa_db_query_sub()` function. This substitutes `^` in the query string for the Q2A table prefix set in `qa-config.php`. It also substitutes `$` and `#` for any additional parameters passed, escaping them to ensure the SQL is secure - [more here](/code/functions/#database-access-in-qa-dbphp). In this case, the `$` symbol will be turning into a comma-separated list of tags in `array_keys($plugin_tag_desc_list)`.

    - The `$result` obtained from the database query is turned into a map from tags to descriptions using Q2A's `qa_db_read_all_assoc()` function - see the function's definition in `qa-db.php`. The map is stored in the global `$plugin_tag_desc_map` variable so that it is available every time our `post_tag_item()` function is called.

    - As before, `$plugin_tag_desc_list` is set to `null` so that the database will not be queried again. This marks the end of the part of our `post_tag_item()` function that only executes the first time it is called.

    - Now `preg_match()` is used to search for our special `,TAG_DESC,_taglc_,` string within `$taghtml`. The pattern fragment `[^,]*` to match `_taglc_` is in `()` brackets so that we can retrieve the lower case tag from `$matches[1]`.

    - If our special string is found, we use `str_replace()` to substitute it for the tag description retrieved from `$plugin_tag_desc_map[$taglc]`. Note again the use of `@` to ensure that PHP does not emit an error if there was no description for this tag - in those cases, an empty `TITLE=""` attribute will remain, and no tooltip will show.

    - Finally, as before, we call through to `post_tag_item()` in Q2A's base theme class to output the HTML for the tag.

- Save/upload `qa-tag-desc-layer.php` and refresh a Q2A page showing some tags. As before, you should see tag descriptions when mousing over. But this time, all of the descriptions were retrieved in a single database query. Much better!


## 7\. Adding options to control tag description display

In this step, we will add an options form to the plugin which controls how the tag descriptions are displayed.

- Open `qa-tag-desc-widget.php` and paste the following function **inside** the class declaration:

    ```php?start_inline=1
    function option_default($option)
    {
        if ($option=='plugin_tag_desc_max_len')
            return 250;

        if ($option=='plugin_tag_desc_font_size')
            return 18;

        return null;
    }
    ```

    Our plugin will use Q2A's options mechanism to store its settings. Each option has a name and value, which are stored in the `qa_options` table in the database. The `option_default()` function, which can be added to any module, allows defaults to be define for some Q2A options. In this case, we will use an option named `'plugin_tag_desc_max_len'` to set the maximum number of characters shown in a tag description tooltip, with a default of `250`. A second option named `'plugin_tag_desc_font_size'` sets the font size for the descriptions on tag pages, with a default of `18`.

- Paste this second function inside the widget module's class declaration:

    ```php?start_inline=1
    function admin_form(&$qa_content)
    {
        $saved=false;

        if (qa_clicked('plugin_tag_desc_save_button')) {
            qa_opt('plugin_tag_desc_max_len', (int)qa_post_text('plugin_tag_desc_ml_field'));
            qa_opt('plugin_tag_desc_font_size', (int)qa_post_text('plugin_tag_desc_fs_field'));
            $saved=true;
        }

        return array(
            'ok' => $saved ? 'Tag descriptions settings saved' : null,

            'fields' => array(
                array(
                    'label' => 'Maximum length of tooltips:',
                    'type' => 'number',
                    'value' => (int)qa_opt('plugin_tag_desc_max_len'),
                    'suffix' => 'characters',
                    'tags' => 'NAME="plugin_tag_desc_ml_field"',
                ),

                array(
                    'label' => 'Starting font size:',
                    'type' => 'number',
                    'value' => (int)qa_opt('plugin_tag_desc_font_size'),
                    'suffix' => 'pixels',
                    'tags' => 'NAME="plugin_tag_desc_fs_field"',
                ),
            ),

            'buttons' => array(
                array(
                    'label' => 'Save Changes',
                    'tags' => 'NAME="plugin_tag_desc_save_button"',
                ),
            ),
        );
    }
    ```

    The `admin_form()` function can also be added to any module, and enables that module to display a form on the 'Plugins' page of the Q2A admin panel. The function returns a Q2A form definition array for display on the page, after processing any appropriate user input. Most of this should be familiar from our earlier encounter with a Q2A form, but a few things are new:

    - We're using Q2A's `qa_opt()` function to both set and retrieve option values - [more here](/code/functions/).
    - An element `'ok'` is used to add a confirmation message at the top of the form.
    - An element `'suffix'` is used within field definitions to show some text after the field.

- Save/upload `qa-tag-desc-widget.php` and open the 'Plugins' section of your Q2A site's admin panel. There should be an 'options' link in the listing for 'Tag Descriptions' which take you to the form. The form should contain the correct default values, and you should be able to modify and save the settings naturally.

- Now it's time to apply these options in the rest of the plugin. If you skipped the previous step in this tutorial, open `qa-tag-desc-overrides.php` and focus on the function `qa_tag_html()`. Otherwise, open `qa-tag-desc-layer.php` and focus on the function `post_tag_item()`. In either case, paste the following at the start of the function:

    ```php?start_inline=1
    require_once QA_INCLUDE_DIR.'qa-util-string.php';
    ```

    We do this because we will be using a function defined in Q2A's `qa-util-string.php` file.

- Find the line in the same function which begins `$description=...` and paste the following line **immediately after**:

    ```php?start_inline=1
    $description=qa_shorten_string_line($description, qa_opt('plugin_tag_desc_max_len'));
    ```

    This line of code shortens `$description` to the number of characters in our option named `'plugin_tag_desc_max_len'`. (It is perfectly OK to call `qa_opt()` each time this function is called because option values are cached by Q2A.)

- Save/upload the file, then set the maximum length of tooltips to a small number. Refresh a page containing tags with descriptions and check that the tooltips are being shortened as expected.

- Now open `qa-tag-desc-widget.php` and **replace** the line containing `echo qa_html($description);` with:

    ```php?start_inline=1
    echo '<SPAN style="font-size:'.(int)qa_opt('plugin_tag_desc_font_size').'px;">';
    echo qa_html($description);
    echo '</SPAN>';
    ```

    This wraps the tag description in an HTML `<SPAN>` which sets the font size as appropriate.

- Save/upload `qa-tag-desc-widget.php` and confirm that tag descriptions now appear on tag pages in your chosen size.


## 8\. Controlling access to the tag description editor

In this step we will add an option allowing the Q2A admin to control who can edit tag descriptions.

- Open your `qa-tag-desc-widget.php` file, find the `admin_form()` function and paste this at the beginning:

    ```php?start_inline=1
    require_once QA_INCLUDE_DIR.'qa-app-admin.php';
    require_once QA_INCLUDE_DIR.'qa-app-options.php';

    $permitoptions=qa_admin_permit_options(QA_PERMIT_USERS, QA_PERMIT_SUPERS, false, false);
    ```

    This uses the `qa_admin_permit_options()` function from Q2A's `qa-app-admin.php` file to create an array of permission options in the variable `$permitoptions`. The parameters passed define the widest and narrowest permissions to include, based on constants defined in Q2A's `qa-app-options.php` file.

- Then, paste this inside the `'fields'` subarray in the same `admin_form()` function:

    ```php?start_inline=1
    array(
        'label' => 'Allow editing:',
        'type' => 'select',
        'value' => @$permitoptions[qa_opt('plugin_tag_desc_permit_edit')],
        'options' => $permitoptions,
        'tags' => 'NAME="plugin_tag_desc_pe_field"',
    ),
    ```

    This new field will control the permissions for editing tag descriptions. A Q2A form field of type `'select'` corresponds to an HTML `<SELECT>` menu, whose options are passed in the `'options'` subelement. Each `_code_ => _label_` in the `'options'` array is output as the HTML `<OPTION VALUE="_code_">_label_</OPTION>`. To specify the initial selection for the menu, set `'value'` to the corresponding `_label_` (rather than the `_code_`, as you might have expected).

- Add a line to store the setting in the same `admin_form()` function, within the `if (qa_clicked(...))` block:

    ```php?start_inline=1
    qa_opt('plugin_tag_desc_permit_edit', (int)qa_post_text('plugin_tag_desc_pe_field'));
    ```

- Finally, set a default value for this new option by pasting the following inside `option_default()`:

    ```php?start_inline=1
    if ($option=='plugin_tag_desc_permit_edit') {
        require_once QA_INCLUDE_DIR.'qa-app-options.php';
        return QA_PERMIT_EXPERTS;
    }
    ```

    This means that only experts or higher are permitted to edit tag descriptions by default.

- Save/upload `qa-tag-desc-widget.php` and check the new option is working in the 'Plugins' section of the admin panel.

- Now we need to enforce this setting on the tag description editing page. Open your `qa-tag-desc-edit.php` file and paste the following in the `process_request()` function after the `$qa_content['title']=...` line:

    ```php?start_inline=1
    if (qa_user_permit_error('plugin_tag_desc_permit_edit')) {
        $qa_content['error']=qa_lang_html('users/no_permission');
        return $qa_content;
    }
    ```

    This calls Q2A's function `qa_user_permit_error()` to check if the current user has permission, relative to the `'plugin_tag_desc_permit_edit'` option. The `qa_user_permit_error()` function also tests if the user or IP address has been blocked - see the function's documentation in Q2A's `qa-app-users.php` file. If the user does not have permission, an error will be displayed on the page using a pre-existing Q2A string, and the function returns so that no form is displayed.

- Save/upload `qa-tag-desc-edit.php` and try editing tag descriptions as an admin, then log out and try again.

- Finally, we don't want to display the link to create/edit tag descriptions on the tag page if the user does not have permission to do so. Open `qa-tag-desc-widget.php` and replace the last 7 lines of `output_widget()` with:

    ```php?start_inline=1
    $allowediting=!qa_user_permit_error('plugin_tag_desc_permit_edit');

    if (strlen($description)) {
        echo '<SPAN style="font-size:'.(int)qa_opt('plugin_tag_desc_font_size').'px;">';
        echo qa_html($description);
        echo '</SPAN>';
        if ($allowediting)
        echo ' - <a href="'.$editurlhtml.'">edit</a>';
    } elseif ($allowediting)
        echo '<a href="'.$editurlhtml.'">Create tag description</a>';
    ```

    Now we only show the link for creating or editing tag descriptions if the user has sufficient permission.

- Save/upload `qa-tag-desc-widget.php`. Check that the create/edit link on tag pages is displayed when you're logged in as the admin, and not when you are logged out. If so, congratulations - your plugin's functionality is now complete!


## 9\. Making your plugin localization-friendly

In this final step we will make your plugin ready for localization into different languages.

- Create a new file `qa-tag-desc-lang-default.php` in your plugin's `tag-descriptions` directory and paste the following:

    ```php
    <?php

    return array(
        'edit_desc_for_x' => 'Edit the description for ^',
        'save_desc_button' => 'Save Description',
        'create_desc_link' => 'Create tag description',
    );
    ```

    This file contains US English versions of your plugin's language strings, which will serve as the default.

- Paste the following in your plugin's `qa-plugin.php` file:

    ```php?start_inline=1
    qa_register_plugin_phrases(
        'qa-tag-desc-lang-*.php', // pattern for language files
        'plugin_tag_desc' // prefix to retrieve phrases
    );
    ```

    This sets up localization for your plugin. The `*` in the file name passed to `qa_register_plugin_phrases()` will be substituted for language codes such as `fr` or `ru`, or `default` to load the default phrases. The second parameter `'plugin_tag_desc'` sets the prefix for retrieving your language strings using Q2A's `qa_lang()` or `qa_lang_html()` functions - [more here](/plugins/).

- Find the line in `qa-tag-desc-widget.php` containing the phrase `Create tag description` and replace it with:

    ```php?start_inline=1
    echo '<a href="'.$editurlhtml.'">'.qa_lang_html('plugin_tag_desc/create_desc_link').'</a>';
    ```

    We have now substituted the previous hard-coded phrase for an HTML escaped version of the localized phrase. The function `qa_lang_html()` takes a single parameter with two parts, separated by a `/` slash. The first part is the language prefix, which matches that passed to `qa_register_plugin_phrases()` above. The second part is the keyin the corresponding language file (in our case, the last phrasse in `qa-tag-desc-lang-default.php`).

- Save/upload all files and go to a tag page with no description. Check that the 'Create tag description' link appears correctly. As an exercise, see what happens if you add a typo in the parameter passed to `qa_lang_html()`.

- Now let's use the other phrases. In `qa-tag-desc-edit.php`, replace the line `$qa_content['title']=...` with:

    ```php?start_inline=1
    $qa_content['title']=qa_lang_html_sub('plugin_tag_desc/edit_desc_for_x', qa_html($tag));
    ```

    This uses Q2A's `qa_lang_html_sub()` function which substitutes any `^` symbols in the localized phrase with the function's second parameter. The second parameter is treated as HTML and must already be escaped by the caller.

- Finally, replace the line in `qa-tag-desc-edit.php` containing `'Save Description'` with:

    ```php?start_inline=1
    'label' => qa_lang_html('plugin_tag_desc/save_desc_button'),
    ```

- Save/upload `qa-tag-desc-edit.php` and check that the tag description editing page is still labelled properly.

- Now let's add a localization for UK English. Create a file `qa-tag-desc-lang-en-GB.php` in your plugin directory and paste:

    ```php
    <?php

    return array(
      'edit_desc_for_x' => 'What ho, a jolly good description for the ^ tag',
    );
    ```

- Save/upload `qa-tag-desc-lang-en-GB.php`. Then switch the language of your Q2A site to 'English (UK)' in the 'General' panel of the admin section, and refresh the page for editing a tag description. You should see this UK English page title. Note that we only included one phrase in the UK English localization, so the defaults will be used for the other two.

- You or others can add any localizations to your plugin by creating an appropriate `qa-tag-desc-lang-*.php` file, where `*` is substituted for the language code. For non-English characters, ensure your text editor is set to UTF-8 without byte-order marks. A list of supported languages is in the `qa_admin_language_options()` function in Q2A's `qa-app-admin.php` file.


## 10\. Where to go from here

If you made it this far, congratulations! This completes the tutorial. To recap, here is what we've covered:

- Setting up the plugin's directory and `qa-plugin.php` file.
- Creating widget and page modules in the plugin.
- Some examples of Q2A form definition arrays.
- Using some of Q2A's string utility functions.
- Overriding functions in the Q2A core (but always calling through to `_base`!)
- Thinking about the database queries performed by your plugin.
- Creating a layer to modify the Q2A base theme class.
- Executing a query directly on the Q2A database.
- Creating an options form for your plugin.
- Using Q2A's options mechanism and setting defaults.
- Managing and verifying permissions.
- Localizing plugins into multiple languages.

To check you followed the instructions correctly, you can [download the completed plugin](http://www.question2answer.org/releases/q2a-tag-descriptions-tutorial.zip).

Now you can think about the plugin that **you** want to build and how to go about it. To get started, take a look at the different [types of module](/plugins/modules/) that Q2A supports - as of Q2A 1.5, there are ten available, and we only covered two in this tutorial. You should also take a look at this list of useful [Q2A functions](/code/functions/) and have a browse around the Q2A source code to learn about many more. Finally, take a look at the code of the [many plugins](/addons/) already developed for Q2A. Thank you and good luck!
