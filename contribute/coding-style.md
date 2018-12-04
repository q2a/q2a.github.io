---
layout: page
menu: contribute
title: "Question2Answer Coding Style guidelines"
---

# Question2Answer Coding Style guidelines

From 1.7 onwards a new coding style has been implemented that is more in line with other projects. All PHP code should use these guidelines:

- PHP code should start with `<?php` (almost always the very first line). The closing tag `?>` should be omitted to avoid accidental output.
- PHP files should use UTF-8 encoding without BOM (this is usually default in most text editors).
- Trailing whitespace (tabs or spaces at the end of lines) should not be present. Any advanced text editor should be able to do this automatically when saving. (For Sublime Text you can add the option `"trim_trailing_white_space_on_save": true` to your preferences. In Notepad++ you can press Alt+Shift+S.)
- Use tabs for indenting. Each file should start at level 0 (i.e. no indentation).
- Functions should use a DocBlock-style comment.
- Operators (`=`, `+`, `=>` etc) should have a space either side.
- Control structure keywords (`if`, `else`, `foreach` etc) should have a space between them and the opening parenthesis.
- Opening braces for classes and functions should be on the next line.
- Opening braces for control structures should be on the same line. All control structures should use braces.

If in doubt, follow the style of the surrounding code. The Q2A repository includes a set of rules in the test directory for use with [PHP CodeSniffer](https://github.com/squizlabs/PHP_CodeSniffer) (PHPCS) which checks several aspects of the coding style (some are currently omitted as we migrate the old style to new). It can be run using this command from the repository root:

	php /path/to/phpcs.phar --report=emacs --extensions=php --standard=qa-tests/phpcs/ruleset.xml .

If nothing comes up, the coding style is good to go!


### Examples

Here is an example of the coding style.

```php?start_inline=1
foreach ($thingList as $thing) {
	if (isset($thing['id'])) {
		if (strpos($thing['id'], 'Hello') === 0) {
			$newThing = 'Goodbye';
		} elseif ($thing['id'] === 'World') {
			$newerThing = 'Galaxy';
		}
	} else {
		return null;
	}
}
```

Here is a class example showing the placement of braces, operators, and a DocBlock comment.

```php?start_inline=1
class ExampleThing
{
	/**
	 * Adds 1 to the supplied number.
	 * @param int $number The number to increment.
	 * @return int Returns the new number.
	 */
	public function addOne($number)
	{
		$result = $number + 1;

		return $result;
	}
}
```


## New autoloaded classes

From version 1.9 namespaces are being used for new code, following the [PSR-4](https://www.php-fig.org/psr/psr-4/) standard. This allows classes to be 'auto-loaded' without needing to use `require_once` everywhere. This is being done slowly and carefully to maintain backwards compatibility, and does not apply to plugins, themes, nor most of the core for that matter.

Namespaced classes live in the `qa-src` directory, with each sub-directory coresponding to a sub-namespace. For example, the file `qa-src/Storage/FileCacheDriver.php` is in the namespace `\Q2A\Storage`; the class can be loaded with `\Q2A\Storage\FileCacheDriver`.

Q2A versions 1.7-1.8 used the old PSR-0 standard, with classes in the `qa-include/Q2A` directory. Classes are mapped to PHP files with the underscores converted to directory separators. So for example the `Q2A_Util_Debug` class is in the file `qa-include/Q2A/Util/Debug.php`.
