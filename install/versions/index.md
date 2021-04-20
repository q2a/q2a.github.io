---
layout: page
menu: install
title: "Question2Answer - Version History"
---

# Version History

## Version 1.8.6 [Download](https://www.question2answer.org/releases/question2answer-1.8.6.zip)

Minor bug fixes, 20th April 2021.

- Prevent input fields being used in HTML posts.
- Fix various PHP notices/errors on PHP 7.4 and 8.0.
- Fix missing avatar with Wordpress integration.
- Use 404 instead of fatal error/stack trace for features unavailable with external user integration.

## Version 1.8.5 [Download](https://www.question2answer.org/releases/question2answer-1.8.5.zip)

Minor bug fixes, 15th July 2020.

- Prevent parsing links in code blocks.
- Fix SnowFlat comment vote buttons.
- Improve compact number display.
- Improve delete cache performance.
- Prevent use of `<style>` tag (PR #740 from @alacn1).
- Remove database entries where deleted user was favorited (PR #754 from @jairlopez).
- Fix database overflow issue with many repeated words (PR #758 from @pupi1985).
- Fix mismatch between Q2A and PHPMailer email validation (PR #773 from @pupi1985).
- Fix some PHP notices on PHP 7.4.
- Add 404 response for empty tag page.

## Version 1.8.4 [Download](https://www.question2answer.org/releases/question2answer-1.8.4.zip)

Security improvement and some bug fixes, 7th May 2020.

- Security fix: prevent use of `<embed>` and `<object>` tags.
- Treat blob ids as strings due to size limitations.
- Fix negative upvoteCount wrongly displayed.
- Fix file input field causing problems on SnowFlat theme.
- Avoid magic quotes deprecation notice on PHP 7.4.
- Prevent duplicated vote events.

## Version 1.8.3 [Download](https://www.question2answer.org/releases/question2answer-1.8.3.zip)

Minor bug fixes, 12th January 2019.

- Fix voting on follow-on question 'comments'.
- Fix selection of answers trying to close questions.
- Fix titles wrapping in SnowFlat theme.
- Fix cache trim function.
- Clear question cache when posts are hidden.
- Fix minimum tags error when using only categories.
- Fix MySQL reserved keyword clash.

## Version 1.8.2 [Download](https://www.question2answer.org/releases/question2answer-1.8.2.zip)

Several bug fixes, including improvements to the Schema.org Q&A microdata, 20th December 2018.

- Fix closed questions by selected answer not displayed as closed.
- Fix tag background color in Classic theme.
- Fix 'no permissions' message in WYSIWYG editor upload.
- Fix errors in structured data.
- Add ^site_url parameter to email notifications.
- Fix event logger issue with Unicode characters.
- Fix searching/indexing in Thai language.
- Add confirmation for email unsubscribe.
- Fix plugin version comparison (when plugin version is later than official release).
- Fix Q2A version comparison (for pre-release versions e.g. 1.8.0-beta vs 1.8.0).
- Fix Ubuntu font in SnowFlat theme on Windows.

## Version 1.8.1 [Download](https://www.question2answer.org/releases/question2answer-1.8.1.zip)

Many small bug fixes and improvements, 1st December 2018.

- Update cached tag count when deleting posts.
- Fix some scenarios where ^userpoints records are not present.
- Update hidden HTML to avoid mistakenly being detected as malware.
- Fix missing email confirmation link in user account.
- Revert to using PHPMailer autoloader.
- Prevent browser content encoding error in PHP 5.3.
- Fix anonymous user images not being displayed.
- Add placeholder text to search box.
- Fix various notices on PHP 7.2.
- Fix file uploads in CKEditor.
- Enlarge default CKEditor font size.
- Avoid sending emails to blocked and unapproved users.
- Correct protocol when generating the site URL.
- Fix PHP Notice with array URL parameters.
- Upgrade CKEditor (4.11.1), jQuery (3.3.1).

## Version 1.8.0 (release) [Download](https://www.question2answer.org/releases/question2answer-1.8.0.zip)

Final release of major feature upgrade, 8th February 2018.

- Fix missing function `qa_get_gravatar_url()` when using Wordpress integration.
- Added total unanswered questions to Admin > Stats.
- Fix MySQL query errors when using SQL mode `IGNORE_SPACE`.

## Version 1.8.0 beta 2 [Download](https://www.question2answer.org/releases/question2answer-1.8.0-beta-2.zip)

Second beta of major feature release, 23rd December 2017.

- Fixed errors with output buffering and gzip compression.
- Fixed non-ANSI group-by queries in MySQL 5.7.
- Fixed notices on PHP 7.2.
- Fixed points recalculation when converting answers to comments.
- Added generic `.qa-post-content` class to replace old `.entry-content` which was removed.
- Fixed non-unique cache keys.
- Reworked file cache to securely allow cache inside web root.
- Fixed issue with PHPMailer's autoloader on PHP 7.2.
- Removed (non-functional) clipboard from CKEditor.

## Version 1.8.0 beta 1 [Download](https://www.question2answer.org/releases/question2answer-1.8.0-beta-1.zip)

First beta of major feature release, 26th September 2017.

### New features

- Performance has been improved by around 20% on average (even more on questions with many answers).
- Added caching system. Currently caches question data, related questions and category list for anonymous users. Caches can be stored in files or in memory (requires Memcached PHP extension).
- Added comment voting. Comments may be voted up or down, and points may be given as with answers (default is no points).
- Added ability to enable/disable plugins. For backwards compatibility, by default plugins cannot be disabled (except by removing the plugin folder entirely). Plugin developers must "opt-in" to this feature using the `load_order` property in the plugin's `metadata.json`. See the [plugin documentation](https://docs.question2answer.org/plugins/#plugin-metadata).
- Added support for IPv6 addresses.
- Schema.org microdata is now used throughout Q2A.
- Number formatting characters (decimal point, thousands separator) can be specified in language files.
- Numbers (for votes, views etc) can be compacted e.g. 1.3k instead of 1300.
- Added option to block certain usernames.
- Out-of-the-box Joomla integration is now included.
- Changed the category naviation to a widget, so it can be moved to different positions.
- Widget plugins can now be placed on pages created by page plugins.
- Password security has been upgraded from `sha1` to use PHP's `password_hash` function where available.
- Password reset method has been greatly simplified.
- Questions are now checked for "double posting" when submitting.
- Added Newest users page, along with Permissions options for who can view the New or Special users pages.
- Simplified closing questions to use one field for closing with a note or as a duplicate.
- Added option to prevent users closing their own questions (i.e. limit to only admins/moderators).
- Anonymous user naming is now optional.

### Other notable changes

- Tested on PHP 7.0 and 7.1.
- Coding style has been improved and made consistent across the codebase.
- Forms on the question view page have been changed and reordered. Custom themes that override the `q_view_main`, `a_list_item`, `a_item_main`, `c_list_item`, `c_item_main` methods may need to make changes.
- 'Favorite' button on question pages moved outside `<h1>` tag. Themes may need to make changes.
- Upgraded CKEditor (4.7), jQuery (3.2), and other libraries. Custom jQuery code may need updating; see the [jQuery upgrade guide](https://jquery.com/upgrade-guide/3.0/).
- Hidden form fields can now be specified in a consistent way with regular fields (e.g. including extra attributes).
- Added date/time to user votes. This can be used by plugins to check things like voting history. Existing votes in the system are given the same date as the post during the database upgrade.
- Removed option "All new users must be approved" (`approve_user_required`) in favor of using the regular Permissions settings. Administrators relying on this option should update their Permissions settings to allow "Approved users only" where appropriate.
- Made improvements to hotness calculations, and added option to disable hotness calculation on every page view. (Slightly improves efficiency but hotness values may become out of date.)
- Separated out functions from `qa-include/qa-page.php` into `qa-include/app/page.php`. External code and Plugins can include only the latter file in order to use its functions.
- Update check in Admin panel uses latest Q2A version from GitHub rather than Q2A site.
- Added the HttpOnly flag to cookies.
- Used `hash_equals` to avoid timing attacks.
- Added meta description to category pages.
- Added theme-specific classes to `<body>` tag.
- Post character limit increased to 12000.
- JavaScript files have been combined into `qa-global.js`.
- Significantly reduced in-page JavaScript code duplication.
- Redirect to canonical question URL.
- Hidden posts now show hidden follow-on questions and questions shown as duplicates. This makes it clearer for Administrators why a post cannot be deleted.
- Added replyto support for `qa_send_email`.
- Allowed users to see their own private user fields.
- Added `'success'` key to `$qa_content` array for displaying success messages.
- Stopped logging security form violations unless in debug mode
- Adsense plugin has been updated to use responsive code.
- Improved avatar handling API.

### Bug fixes

- Selected answers are deselected when hidden.
- Fixed error with special characters in tags when using 'Index' URL Structure.
- Fixed error deleting questions where another is closed as a dupliate of it.
- Updated reCAPTCHA to use the site language.
- Changed Gravatar URLs to use HTTPS.
- Automatically redirect to external user login if used.
- Fixed PHP warnings on AJAX requests in some situations.
- Fixed unencoded URLs not being detected when closing questions.
- Fixed visibiliy of `option_allow_private_messages` in admin page.
- Better font sizing in Tag Cloud plugin.
- "Remove accents from question URLs" now removes all non-ASCII characters.
- Fixed `file_get_contents` usage on PHP 7.1.
- Fixed issue where `$qa_content['script']` was reset.
- Fixed widgets not appearing on user subpages (wall, activity etc).
- Fixed Facebook login issues with old API.
- Fixed integer handling on PHP 7.1.
- Fixed missing username in private messages when user is deleted.
- Removed self-reply buttons and reply buttons for deleted users on Private message pages.
- Improved navigation on Private message pages.
- Fixed miscellaneous invalid HTML.
- Various other minor theme/layout fixes.

### Key source code changes

#### Changed language keys

- `users/email_code_another` (renamed from `users/reset_code_another`)
- `users/email_code_emailed` (renamed from `users/reset_code_emailed`)
- `users/email_code_label` (renamed from `users/reset_code_label`)
- `users/email_code_wrong` (renamed from `users/reset_code_wrong`)
- `main/vote_disabled_hidden_post` (renamed from `main/vote_disabled_hidden_a` & `main/vote_disabled_hidden_q`)
- `main/vote_disabled_my_post` (renamed from `main/vote_disabled_my_a` & `main/vote_disabled_my_q`)
- `question/close_reason_title` (changed)
- `emails/confirm_body` (changed)
- `users/confirm_emailed` (changed)
- `users/send_password_button` (removed)
- `main/view_q_must_be_approved` (changed to add link)
- `profile/post_wall_must_be_approved` (changed to add link)
- `question/answer_must_be_approved` (changed to add link)
- `question/ask_must_be_approved` (changed to add link)
- `question/comment_must_be_approved` (changed to add link)

#### New events

- `c_vote_down`
- `c_vote_up`
- `c_vote_nil`

#### New CSS classes

- `.qa-success`
- `.qa-form-tall-help`, `.qa-form-wide-help`
- `.qa-c-list-item .qa-voting`
- `.qa-c-list-item .qa-vote-first-button`
- `.qa-c-list-item .qa-vote-second-button`
- `.qa-c-list-item .qa-vote-one-button`


## Version 1.7.5 [Download](https://www.question2answer.org/releases/question2answer-1.7.5.zip)

Important security fix and other minor improvements, 9th August 2017.

- Security fix - prevent creation of multiple users during installation.
- Use site language for reCAPTCHA.
- Add site language to HTML tag.
- Change from / reply-to for feedback form.
- Fix missing icon on private messages in SnowFlat theme.
- Fix users being unable to see all their own profile fields.
- Minor fixes to post validation.

## Version 1.7.4 [Download](https://www.question2answer.org/releases/question2answer-1.7.4.zip)

Admin security fix and other minor improvements, 14th March 2016.

- Various minor fixes to SnowFlat theme.
- Support Wordpress database port.
- Disable SSL checks in email if SMTP security is disabled.
- Only allow admins to check plugin versions.

## Version 1.7.3 [Download](https://www.question2answer.org/releases/question2answer-1.7.3.zip)

Many small bug fixes and improvements, 3rd February 2016.

- Fix missing error message when post content too short.
- Fix empty question title, answer or comment passing validation.
- Handle 4-byte Unicode characters (prevent blank usernames).
- Various minor fixes to SnowFlat theme.
- Fix error message during JavaScript recalc scripts.
- Remove link to hidden duplicate/follow-on questions.
- Fix private messages link being shown for SSO/Wordpress sites.
- Fix custom registration URLs with Wordpress integration.
- Increase default size of Facebook avatars.
- Fix slow query when migrating files to/from disk.
- Fix issues when uploaded files are missing from disk or database.

## Version 1.7.2 [Download](https://www.question2answer.org/releases/question2answer-1.7.2.zip)

Many small bug fixes and improvements, 17th November 2015.

- Fix warning under certain conditions on closed questions.
- Fix meta description not showing on re-routed home pages.
- Fix missing server-side check regarding `allow_multi_answers` option.
- Fix missing title errors when recategorizing questions.
- Fix database error when profile fields are missing.
- Fix incorrect link styling for categories privileges in user profile.
- Prevent blank paragraphs in CKeditor.
- Fix potential infinite loop in JavaScript from `qa_set_display_rules`.
- Change URL test string to avoid Apache mod_security issues.
- Various minor fixes to themes.
- Use local Ubuntu font by default.
- Fix reCAPTCHA dependency on `allow_url_fopen` configuration.
- Fix links/redirects to post anchors.
- Add highlight for answer/comment anchors.
- Allow PDFs to be displayed in-browser.
- Add filename for image downloads.
- Prevent usernames containing `.` or `..`
- Allow non-default port in MySQL connection.

## Version 1.7.1 [Download](https://www.question2answer.org/releases/question2answer-1.7.1.zip)

Many small bug fixes and improvements, 27th July 2015.

- Fixed errors with microformats.
- Fixed inconsistencies in SnowFlat theme between small screen responsive styles and mobile-detected styles.
- Fixed issue with multiple reCAPTCHAs per page.
- Fixed PHP notice when 'age of post' option is turned off.
- Fixed text direction on login forms for RTL themes.
- Allowed CKEditor config to be overriden more easily.
- Reinstates CKEditor smiley plugin and added an admin button to fix missing image links.
- Fixed upvote/downvote styles (when using separate counters) in SnowFlat theme.
- Various minor style/alignment fixes in SnowFlat theme.
- Improved the style of debug information.
- Fixed missing theme initialization calls in AJAX requests.
- Improved snippets in the mouseover-layer plugin.

## Version 1.7 (release) [Download](https://www.question2answer.org/releases/question2answer-1.7.zip)

Final release of first community-developed version, 7th January 2015.

- Updated reCAPTCHA plugin.
- Fixed some errors with microformats.
- Added confirmation dialog when resetting admin options.

## Version 1.7 beta 2 [Download](https://www.question2answer.org/releases/question2answer-1.7-beta-2.zip)

Minor improvements and fixes on the first beta, 7th December 2014.

### Changes

- Metadata for plugins, themes and languages can now be stored in a `metadata.json` file.
- Upgraded to [jQuery](https://jquery.com/) 1.11.
- Added an `initialize()` function to the theme class. Theme/plugin developers can use this for any initialization that needs to occur before content is output (previously many authors did this in the `doctype()` function). If this function is overridden, authors must call through to `parent::initialize()` so that all plugins/themes can run their initialization too.
- New DB function `qa_db_num_rows()` as a wrapper for `mysqli_result::num_rows`.
- Added a `.qa-warning` CSS class to all themes for plugins to use.
- Added option to hide post updates meta information.
- The 'selected' state of menu items is now determined in a different way: if the navigation subarray has the key `'selected_on'` then it will match the specified paths against the beginning of the requested URL. Otherwise it will look for an exact match with the array key. Example:

		$qa_content['navigation']['main']['tag']=array(
			'url' => qa_path_html('tags'),
			'label' => qa_lang_html('main/nav_tags'),
			'selected_on' => array('tags$', 'tag/'),
		);

### Bug Fixes

- Fixed issue where a plugin's `option_default` method was not being called.
- Fixed missing tables warning in installation.
- Fixed HTML output before session_start on install.
- Use password field on install.
- Plugins not sorted by name rather than directory name.
- Fixed various layout issues with SnowFlat theme.
- Fixed missing styles for custom sections in SnowFlat theme.
- Fixed issue with navigation items not being selected or multiple items being selected (see above change).
- Fixed front page URL not being properly mapped.

## Version 1.7 beta 1 [Download](https://www.question2answer.org/releases/question2answer-1.7-beta-1.zip)

First community-developed version of Question2Answer, 6th November 2014.

### New Features

- New responsive Snow theme.
- Private messages page, listing all PMs received and sent.
- Ability to add a required checkbox on registration form (e.g. for Terms &amp; Conditions acceptance).
- Switched to `mysqli` as the `mysql` library is deprecated.
- Include exact join date in user profiles.
- Added [closed] to closed questions where appropriate.
- Linked title on question page.
- Similar questions list (from Ask page) is now overridable in the theme (`q_ask_similar()` function). Default display is a list.
- New 'text direction' site option (only has an effect if the theme is built for it). Themes can also now access `$this->isRTL` to check if a site is using right-to-left text and act accordingly (e.g. include an alternate stylesheet).
- Users/Tags pages use a new "block layout" instead of the old nonsemantic table layout. Theme developers can activate this by setting the class member `$ranking_block_layout` to true. The Snow, Classic and Candy themes have this, but SnowFlat does not as yet.
- Language metadata can be stored in a `metadata.php` file (see `qa-lang/en-GB` for an example). Currently this only supports `display_name` as the language name, but will be improved and expanded to themes and plugins in the future.

### Other Notable Changes

- Minimum PHP 5.1.6+ requirement.
- Upgrade CKeditor plugin (v4.4).
- Various classes have been refactored for PHP 5 to include function and member visibility.
- Added some basic unit tests in the `qa-tests` folder (Github-only). See `qa-tests/README.md` for instructions.
- An 'autoloader' has been added to begin transition away from an include-oriented structure. (Currently only used for debug class.)
- The `qa-include` folder has been restructured, with related files moved to subfolders (`qa-app-*` to the `app` folder, modules to the plugins folder, etc).
- Select elements in forms can be given the `match_by` parameter to set the selected option using the array key instead of value.
- Better parsing of URLs in posts.
- Upgrade PHPMailer (v5.2.7).
- Pagination on blocked users page.

### Bug Fixes

- Added many missing button tooltips.
- Correct anchor links on comment edit/save buttons.
- Usernames with hash symbols now work on the Nginx server.
- Fixed issue that allowed a user to bypass a question's minimum length.
- Fixed issue with capitalized table prefixes in plugins.
- Fixed issue that allowed users to vote on posts before claiming them.
- Fixed issue that allowed users to favorite themselves.
- Show error when file uploads exceed the server's limits.

### Potentially Breaking Changes

- Q2A now requires PHP 5.1.6+.
- Plugin metadata must now be near the beginning of the file (within the first 8 kilobytes).
- The `init_queries` function in plugins is now passed the case-sensitive, canonical table names and not lowercased names. This means that string comparisons are now correct where site owners are using capitalized table prefixes (e.g. `QA_*`). However, it may potentially break a plugin in one situation: when a developer has manually called strtolower on the table they are checking against.
- `qa-class.phpmailer.php` and `qa-class.smtp.php` have been moved to `qa-include/vendor/PHPMailer/`. These files should not have been used directly by outside code - the built-in Q2A functions like `qa_send_email` should be used instead. If custom code is required, simply include `qa-include/vendor/PHPMailer/PHPMailerAutoload.php` and the required mail classes will be automatically loaded.

### New CSS Classes Required

- `.qa-q-title-list` (`<ul>`, basic question title list)
- `.qa-q-title-item` (`<li>`, question title list item)
- `.qa-ask-similar` (`<div>`, surrounding block for similar questions)
- `.qa-ranking-item` (`<span>`, for top users/tags pages; other related classes need replacing too)

### Deprecated Functions

- `qa-app-admin.php/qa_admin_addon_metadata`: use `qa_addon_metadata` instead.
- `qa-app-posts.php/qa_post_userid_to_handle`: use `qa_userid_to_handle` instead.
- `qa-app-format.php/qa_account_sub_navigation`: use `qa_user_sub_navigation` instead.
- `qa-app-limits.php/qa_limits_remaining`: use `qa_user_limits_remaining` instead.
- `qa-app-options.php/qa_options_set_pending`: no longer required.
- `qa-app-posts.php/qa_post_userid_to_handle`: use `qa_userid_to_handle` instead.
- `qa-theme-base.php/qa_html_theme_base`: PHP4-style constructor is no longer supported; please use `__construct` method instead.
- `qa-theme-base.php/post_avatar`: use `avatar` instead.
- `qa-theme-base.php/ranking_table`: table layout is no longer recommended.
- `qa-theme-base.php/ranking_table_item`: same as above.
- `qa-theme-base.php/ranking_spacer`: same as above.


## [Changelog for older versions](/install/versions/1/)
