---
layout: page
menu: install
title: "Question2Answer - Optimization"
---

# Optimizing the performance of Question2Answer

Question2Answer is built to run quickly and efficiently on your web and database servers. Nonetheless, if your Q2A site starts receiving a lot of traffic, you may wish to consider these additional steps to help it operate at maximum speed:

1.  Switch on the [query cache](http://dev.mysql.com/doc/refman/5.1/en/query-cache.html) in your MySQL server. This allows MySQL to store the results of Question2Answer's queries, instead of recalculating them each time. It's especially relevant if your site receives a lot more views than edits.
2.  Install a [PHP accelerator](http://en.wikipedia.org/wiki/PHP_accelerator) such as [Alternative PHP Cache (APC)](http://pecl.php.net/package/APC). This will cache the compiled bytecode for the Question2Answer PHP scripts on your web server, to avoid them being parsed and compiled for each page request.
3.  Question2Answer is engineered to minimize the number of MySQL queries used per page. This allows you to separate your database and web servers without suffering too much from [latency](http://en.wikipedia.org/wiki/Latency_(engineering)). The downside is that the resulting queries can be quite complex. If your database and web servers are running on the same box, latency is not an issue, so set `QA_OPTIMIZE_LOCAL_DB` to `true` in `qa-config.php`. This will uses many simple MySQL queries instead of fewer complex ones.
4.  Check the other settings and accompanying comments at the end of `qa-config.php`.
