---
layout: page
menu: contribute
title: "Question2Answer Jekyll docs"
---

# Contributing to the Q2A documentation

The Question2Answer docs are built with the Jekyll static site generator. They are composed of text files written in the Markdown format and converted to HTML on Github Pages. Here's how to contribute.


## Installing Jekyll

Jekyll requires Ruby - the [official Ruby site](https://www.ruby-lang.org/en/downloads/) has instructions for installation. Jekyll is installed using this command in the terminal:

	gem install jekyll bundler

Next you'll need to clone the [Github repository](https://github.com/q2a/q2a.github.io) to your machine. 

```git clone https://github.com/q2a/q2a.github.io.git```

From the root directory install all the dependencies with:

	bundle install

And then run Jekyll with:

	bundle exec jekyll serve

The site can now be accessed from `http://localhost:4000/` in your web browser.

To run the validation suite:

	bundle exec jekyll build && htmlproofer --disable-external --check-html ./_site
