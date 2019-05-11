---
layout: page
menu: plugins
title: "Question2Answer - Developers - Event Modules"
---

# Event Modules

[« Back to modules](/plugins/modules/)

An event module (requires Q2A 1.4+) is notified when something important happens within Q2A. It can be used to react to this event in any way it wishes. The PHP class for an event module must contain the following function to react to events:

- **`process_event($event, $userid, $handle, $cookieid, $params)`**. The `$event` parameter is a string defining the type of event that happened - see the list below. The `$userid`, `$handle` and `$cookieid` parameters identify the user that caused the event to take place - some or all may be `null` if the user is not logged in or does not have an identifying browser cookie. Depending on the event that occurred, the `$params` array may contain additional relevant information.

Below is a list of possible values for `$event` and the event that each value describes. You can also use the Event Logger plugin that comes with Q2A to log all events that occur, and then read over these logs to see all elements in `$params`.

- `'q_post'`, `'a_post'` or `'c_post'` when a new question, answer or comment is created. The `$params` array contains full details about the new post, including its ID in `$params['postid']` and textual content in `$params['text']`. If the post was queued for moderation, this event will only be sent once it is approved.

- `'q_queue'`, `'a_queue'` or `'c_queue'` when a new question, answer or comment is queued for moderator approval. The `$params` array is identical to that for the corresponding `'q_post'`, `'a_post'` or `'c_post'` event. From Q2A 1.5+.

- `'q_edit'`, `'a_edit'` or `'c_edit'` when a question, answer or comment is modified. The `$params` array contains information about the post both before and after the change, e.g. `$params['content']` and `$params['oldcontent']`.

- `'q_close'` or `'q_reopen'` when a question is closed or reopened for new answers. The ID of the question is in `$params['postid']`. For `'q_close'` events, `$params['reason']` will be either `'duplicate'` or `'other'`, to explain why the question is being closed. For `$params['reason']='duplicate'`, the ID of the other question will be in `$params['originalid']`. For `$params['reason']='other'`, the textual description of the reason will be in `$params['note']`. From Q2A 1.5+.

- `'a_select'` or `'a_unselect'` when an answer is selected or unselected as the best answer for its question. The IDs of the answer and its parent question are in `$params['postid']` and `$params['parentid']` respectively.

- `'q_flag'`, `'a_flag'`, `'c_flag'`, `'q_unflag'`, `'a_unflag'`, `'c_unflag'` when a question, answer or comment is flagged or unflagged. The ID of the post is in `$params['postid']`.

- `'q_clearflags'`, `'a_clearflags'`, `'c_clearflags'` when the flags are cleared for a question, answer or comment. The ID of the appropriate post is in `$params['postid']`.

- `'q_hide'`, `'a_hide'`, `'c_hide'`, `'q_reshow'`, `'a_reshow'` or `'c_reshow'` when a question, answer or comment is hidden or shown again after being hidden. The ID of the post is in `$params['postid']`.

- `'q_approve'`, `'a_approve'`, `'c_approve'`, `'q_reject'`, `'a_reject'` or `'c_reject'` upon acceptance or rejection of a post which was queued for moderation. The ID of the post is in `$params['postid']`. If the post was approved, the appropriate `'q_post'`, `'a_post'` or `'c_post'` event will also be sent immediately afterwards. From Q2A 1.5+.

- `'q_requeue'`, `'a_requeue'` or `'c_requeue'` when a question, answer or comment is placed back into the moderation queue, after being previously displayed or hidden. The ID of the post is in `$params['postid']`. From Q2A 1.6+.

- `'q_delete'`, `'a_delete'`, `'c_delete'` when a question, answer or comment is permanently deleted (after being hidden). The ID of the appropriate post is in `$params['postid']`.

- `'q_claim'`, `'a_claim'`, `'c_claim'` when an anonymous question, answer or comment is claimed by a user with a matching cookie clicking 'I wrote this'. The ID of the post is in `$params['postid']`.

- `'q_move'` when a question is moved to a different category, with more details in `$params`.

- `'a_to_c'` when an answer is converted into a comment, with more details in `$params`.

- `'q_vote_up'`, `'q_vote_down'`, `'q_vote_nil'`,  when a question is upvoted, downvoted or unvoted by a user. The ID of the post is in `$params['postid']`.

- `'a_vote_up'`, `'a_vote_down'`, `'a_vote_nil'`, when an answer is voted on, as above.

- `'c_vote_up'`, `'c_vote_down'`, `'c_vote_nil'`, when a comment is voted on, as above.

- `'q_favorite'` and `'q_unfavorite'` when a question is favorited or unfavorited by a user. The ID of the question is in `$params['postid']`. From Q2A 1.5+.

- `'cat_new'` and `'cat_edit'` when a category is created or edited. From Q2A 1.9+.

- `'u_register'` when a new user registers. The email is in `$params['email']` and the privilege level in `$params['level']`.

- `'u_login'` and `'u_logout'` when a user logs in or out of Q2A.

- `'u_confirmed'` when a user successfully confirms their email address, given in `$params['email']`.

- `'u_reset'` when a user successfully resets their password, which was emailed to `$params['email']`.

- `'u_save'` when a user saves (and has possibly changed) their Q2A account details.

- `'u_password'` when a user sets (and has possibly changed) their Q2A password.

- `'u_edit'` when a user's account details are saved by someone other than the user, i.e. an admin. Note that the `$userid` and `$handle` parameters to the `process_event()` function identify the user performing the action, not the user who is affected. Details of the user affected are in `$params['userid']` and `$params['handle']`.

- `'u_message'` when a private message is sent from one user to another. See `'u_edit'` above for how the two users are identified. The message sent is in `$params['message']`.

- `'u_wall_post'` when one user writes a post on another user's wall. See `'u_edit'` above for how the two users are identified. The raw wall post is provided in `$params['content']` and `$params['format']`, with textual rendition in `$params['text']`. From Q2A 1.6+.

- `'u_wall_delete'` when a wall post is deleted. Information about the message deleted is in `$params['message']`. From Q2A 1.6+.

- `'u_level'` when a user's privilege level is changed by a different user. See `'u_edit'` above for how the two users are identified. The old and new levels are in `$params['level']` and `$params['oldlevel']`.

- `'u_block'` and `'u_unblock'` when a user is blocked or unblocked by another user. See `'u_edit'` above for how the two users are identified.

- `'u_delete_before'` and `'u_delete'` when a user is about to be deleted and once the user has been deleted by another user. See `'u_edit'` above for how the two users are identified. `'u_delete'` from Q2A 1.5+. `'u_delete_before'` from Q2A 1.8.4+.

- `'u_favorite'` and `'u_unfavorite'` when a user is favorited or unfavorited by another user. The ID of the user being favorited or unfavorited is in `$params['userid']`. From Q2A 1.5+.

- `'ip_block'` and `'ip_unblock'` when the IP address in `$params['ip']` is blocked or unblocked from the IP address page.

- `'tag_favorite'`, `'tag_unfavorite'`, `'cat_favorite'` and `'cat_unfavorite'` when a tag or category is favorited or unfavorited by a user. Tags are identified by `$params['wordid']`, which references the `wordid` column in the database's `qa_words` table. Categories are identified by `$params['categoryid']`, which contains the category's ID. From Q2A 1.5+.

- `'feedback'` when a message is sent via the Q2A feedback form, with more details in `$params`.

- `'search'` when a search is performed. The search query is in `$params['query']` and the start position in `$params['start']`.

[« Back to modules](/plugins/modules/)
