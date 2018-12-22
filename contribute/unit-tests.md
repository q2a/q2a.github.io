---
layout: page
menu: contribute
title: "Question2Answer unit test guidelines"
---

# Writing unit tests for Question2Answer

Question2Answer has a (currently small) unit test suite. Unit tests check 'units' of code (functions) in isolation to ensure they all work as expected. We'd like to expand our test coverage as much as possible; here are a few tips for contributing.


## Running the unit tests

Testing requires [PHPUnit](https://phpunit.de/). The latest version of PHPUnit requires PHP 5.6 so most users will want v4.8 which supports PHP 5.3+. For Mac or Linux you can follow these steps:

1. Download [PHPUnit 4.8](https://phar.phpunit.de/phpunit-4.8.35.phar) (PHP archive file).
2. Mark it as executable using the command `chmod +x phpunit.phar`
3. Move it to your executable directory: `mv phpunit.phar /usr/local/bin/phpunit`
4. Navigate to the Question2Answer root directory.
5. Run `phpunit --bootstrap qa-tests/autoload.php qa-tests`

Windows users can find [detailed instructions here](https://phpunit.de/manual/current/en/installation.html).

Also check out the [PHPunit documentation](http://phpunit.de/getting-started.html) for more information about PHPUnit and unit testing in general.


## Writing tests

Unit tests are grouped according to the file in which the original functions reside. For example, tests for function from `qa-include/app/users.php` are in `AppUsersTest.php`. The file should contain a class of the same name, like this:

```php
<?php
require_once QA_INCLUDE_DIR.'app/users.php';

class AppUsersTest extends PHPUnit_Framework_TestCase
{
	// test functions go here
}
```

Note that we include the original `app/users.php` file so that we can call the functions.

The tests themselves should be named as `test__` followed by the original function name. For example, tests for `qa_permit_value_error` should be in a function `test__qa_permit_value_error`.

Optionally, multiple tests for the same function may be split into several test functions; each of these should have a suffix consisting of a double underscore and appropriate identifier. For example the tests for `qa_block_ip_match` are split into `test__qa_block_ip_match__ipv4` and `test__qa_block_ip_match__ipv6` for testing IPv4 and IPv6 values respectively.

Tests contain *assertions*, which are functions that compare the result you get from a function with your expected output. The main ones we use are `assertEquals` to check if two things are equal, `assertSame` to check they are equal and the same type, and `assertTrue`/`assertFalse` to check if a result is true/false. Here's an example from `UtilStringTest.php`:

```php
<?php
require_once QA_INCLUDE_DIR.'util/string.php';

class UtilStringTest extends PHPUnit_Framework_TestCase
{
	public function test__qa_tags_to_tagstring()
	{
		$test = qa_tags_to_tagstring(array('Hello', 'World'));
		$expected = 'Hello,World';

		$this->assertEquals($expected, $test);
	}
}
```

Take a look at the [PHPUnit docs](https://phpunit.de/manual/4.8/en/writing-tests-for-phpunit.html) and our existing tests to see more examples.


## Handling options

Tests must be able to run without the database, since of course everyone running the tests does not have the same database. One roadblock to this is Q2A's options, which are used by many different functions. However, we can make Q2A skip the database by manually setting up an options cache.

First we need to check which options the function we're testing uses. Then we add some test values to the `$qa_options_cache` variable. This also means we can test Q2A functions with different configurations of options. Here's an example from `AppUsersTest.php`:

```php?start_inline=1
public function test__qa_permit_value_error()
{
	// set options cache to bypass database
	global $qa_options_cache;
	$qa_options_cache['confirm_user_emails'] = '1';
	$qa_options_cache['moderate_users'] = '0';

	// run tests using those options...
}
```
