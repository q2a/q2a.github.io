---
layout: page
menu: plugins
title: "Question2Answer - Developers - Process Modules"
---

# Process Modules

[« Back to modules](/plugins/modules/)

A process module (requires Q2A 1.5+) can perform any task at specific stages of Q2A's response processing. For example, process modules could provide logging, implement a page cache, change database settings, or perform extra user authentication.

The PHP `class` for a process module can define one or more of the following functions (all are optional):

- **`init_ajax()`** will be called at the start of an Ajax request, immediately after Q2A has initialized.

- **`init_blob()`** will be called at the start of a request to retrieve a binary object, immediately after Q2A has initialized.

- **`init_feed()`** will be called at the start of a request for an RSS feed, immediately after Q2A has initialized.

- **`init_image()`** will be called at the start of a request for an image/avatar, immediately after Q2A has initialized.

- **`init_install()`** will be called at the start of the install process, due either to a database error or a manual request.

- **`init_page()`** will be called at the start of a request for a web page, immediately after Q2A has initialized. Note plugins initialized using the `after_db_init` load order (see metadata.json file) will not have this function called

- **`plugins_loaded()`** will be called immediately after all plugins are loaded, including the ones that are initialized with the `after_db_init` load order (see metadata.json file)

- **`db_connected()`** will be called immediately after Q2A connects to the database for the first time. Note plugins initialized with the `after_db_init` load order (see metadata.json file) will not have this function called

- **`db_disconnect()`** will be called immediately before Q2A disconnects from the database.

- **`shutdown($reason)`** will be called at the end of Q2A's response processing. The `$reason` parameter will be `'error'` if an error occurred, `'redirect'` if there was a redirection, otherwise it will be `null`. More values may be added in future.

[« Back to modules](/plugins/modules/)
