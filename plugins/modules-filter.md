---
layout: page
menu: plugins
title: "Question2Answer - Developers - Filter Modules"
---

# Filter Modules

[« Back to modules](/plugins/modules/)

A filter module (requires Q2A 1.5+) enables plugins to validate and/or modify many different types of user input. This includes the content of posts as well as user information such as usernames and email addresses. Filter modules can also control whether or not the post is queued for moderation. Possible applications of filter modules include cleaning up user input, restricting users of a site, creating specialized Q&A applications, and advanced spam checking.

The PHP class for a filter module may contain the following functions (all are optional):

- **`filter_question(&$question, &$errors, $oldquestion)`**. The `$question` parameter contains an editable array of information about a question being asked or edited. If the question is being edited, `$oldquestion` will contain an array of the previous values, otherwise it will be `null`. The elements in these arrays are described in the table below - any element may be absent, so your function should check with `isset()` as appropriate.

	In the table, if an element is **Editable**, its value may be modified within the `$question` array. This will affect the information that is passed to other filter modules, displayed to the user, and stored in the database. If an element can have **Errors**, your function can declare its value invalid by adding a textual error report with the same key to the `$errors` array. This textual error will be displayed to the user, and the question will not yet be added or saved.

	<table class="parameters">
	<tbody>
		<tr class="titles">
			<td>Element key</td>
			<td>Description</td>
			<td>Editable</td>
			<td>Errors</td>
			<td>Questions</td>
			<td>As and Cs</td>
		</tr>
		<tr>
			<td>`'title'`</td>
			<td>Title of the question</td>
			<td>Yes</td>
			<td>Yes</td>
			<td>Maybe</td>
			<td>No</td>
		</tr>
		<tr>
			<td>`'editor'`</td>
			<td>The name of the [editor module](/plugins/modules-editor/) used</td>
			<td>No</td>
			<td>No</td>
			<td>Maybe</td>
			<td>Maybe</td>
		</tr>
		<tr>
			<td>`'content'`</td>
			<td>Main content of the post</td>
			<td>Yes</td>
			<td>Yes</td>
			<td>Maybe</td>
			<td>Maybe</td>
		</tr>
		<tr>
			<td>`'format'`</td>
			<td>Format of the content, e.g. `'html'` or `''` for text</td>
			<td>Yes</td>
			<td>No</td>
			<td>Maybe</td>
			<td>Maybe</td>
		</tr>
		<tr>
			<td>`'text'`</td>
			<td>Plain text rendering of content</td>
			<td>No</td>
			<td>No</td>
			<td>Maybe</td>
			<td>Maybe</td>
		</tr>
		<tr>
			<td>`'tags'`</td>
			<td>Array of question tags</td>
			<td>Yes</td>
			<td>Yes</td>
			<td>Maybe</td>
			<td>No</td>
		</tr>
		<tr>
			<td>`'categoryid'`</td>
			<td>Category ID for question</td>
			<td>Yes</td>
			<td>Yes</td>
			<td>Maybe</td>
			<td>No</td>
		</tr>
		<tr>
			<td>`'extra'`</td>
			<td>Custom extra information field</td>
			<td>Yes</td>
			<td>Yes</td>
			<td>Maybe</td>
			<td>No</td>
		</tr>
		<tr>
			<td>`'notify'`</td>
			<td>Notify author of responses (boolean)</td>
			<td>Yes</td>
			<td>No</td>
			<td>Maybe</td>
			<td>Maybe</td>
		</tr>
		<tr>
			<td>`'email'`</td>
			<td>Email address of author</td>
			<td>Yes</td>
			<td>Yes</td>
			<td>Maybe</td>
			<td>Maybe</td>
		</tr>
		<tr>
			<td>`'queued'`</td>
			<td>Queue for moderation (boolean)</td>
			<td>Yes</td>
			<td>No</td>
			<td>Maybe</td>
			<td>Maybe</td>
		</tr>
	</tbody>
	</table>

	In Q2A 1.5.x, the `'queued'` element was only present if a new post was being created, rather than an existing one being edited. As of Q2A 1.6, the element is present in either case, so a filter module can requeue a post for moderation after it is edited.

	As of Q2A 1.6, `filter_question()` will also be called when a hidden post is being reshown by its author. In this case, Q2A will ignore any changes made by filter modules to elements in the `$question` array except from `'queued'`. The value of `$question['queued']` will determine whether the post is reshown immediately, or else requeued for moderation.

- **`filter_answer(&$answer, &$errors, $question, $oldanswer)`**. This works very similarly to `filter_question()` described above. The `$answer` parameter contains an editable array of information about an answer being added, edited or (from Q2A 1.6) reshown. If the answer is being edited or reshown, `$oldanswer` will contain an array of the previous values, otherwise it will be `null`. The elements in these arrays work the same way as for `filter_question()` - see the **As and Cs** columns above to see which might be present. As with `filter_question()`, elements can be added to the `$errors` array to declare a value invalid. For your reference, the `$question` parameter contains an array of information about the question to which this answer belongs.

- **`filter_comment(&$comment, &$errors, $question, $parent, $oldcomment)`**. This works very similarly to `filter_question()` and `filter_answer()`. The `$comment` parameter contains an editable array of information about a comment being added, edited or (from Q2A 1.6) reshown. If the comment is being edited or reshown, `$oldcomment` will contain an array of the previous values, otherwise it will be `null`. The elements in these arrays work the same way as for `filter_question()` - see the **As and Cs** columns above to see which might be present. As with `filter_question()`, elements can be added to the `$errors` array to declare a value invalid. For your reference, the `$question` parameter contains an array of information about the question to which this comment belongs, and `$parent` contains an array about the comment's immediate parent (answer or question).

- **`filter_email(&$email, $olduser)`**. This allows a filter module to validate and/or modify email addresses for new or existing Q2A user accounts. The `$email` parameter contains the email address entered, and may be modified in place to change the email. The function can also declare the email invalid by returning a textual error, otherwise it should return `null`. For your reference, if the email is for an existing user, `$olduser` will contain an array of information about the user, including their previous email in `$olduser['email']`. If the email is for a new user, `$olduser` will be `null`.

- **`filter_handle(&$handle, $olduser)`**. This works very similarly to `filter_email()`, but for handles/usernames instead of email addresses. The `$handle` parameter contains the handle entered, and may be modified in place to change the handle. The function can also declare the handle invalid by returning a textual error, otherwise it should return `null`. For your reference, if the handle is for an existing user, `$olduser` will contain an array of information about the user, including their previous handle in `$olduser['handle']`. If the handle is for a new user, `$olduser` will be `null`.

- **`filter_profile(&$profile, &$errors, $user, $oldprofile)`**. This allows a filter module to validate and/or modify information entered into the user profile fields for display on a user's page. The `$profile` parameter contains an array of entered profile information, with keys corresponding to the `fieldid` column in the `qa_userfields` table in the database. Elements of `$profile` can be modified in place to change their values. The function can also declare a field value invalid by adding a textual error report with the same key as the field to the `$errors` array. This textual error will be displayed to the user, and the corresponding part of the profile will not yet be saved. If the profile of an existing user is being edited, `$user` contains an array of information about the user, and `$oldprofile` contains the previous profile of the user, with the same keys as `$profile`. If the profile is for a new user who is currently registering, both `$user` and `$oldprofile` will be `null`.

- **`validate_password($password, $olduser)`**. This allows a filter module to validate an entered password for new or existing Q2A user accounts. The `$password` parameter contains the password entered. Note than unlike other filter module functions, `validate_password()` cannot modify a password, but rather only validate it. The function can declare the pssword invalid by returning a textual error, otherwise it should return `null`. For your reference, if the password is for an existing user, `$olduser` contains an array of information about the user, but this will not contain the user's previous password, since Q2A doesn't store passwords in their original form. If the password is for a new user, `$olduser` will be `null`.

[« Back to modules](/plugins/modules/)
