# MitMaro's Gulp Babel Mocha Task

A reusable gulp task for a Babel Mocha.

## Usage

    var gulp = require('gulp');
    var buildBabel = require('@mitmaro/gulp-babel-mocha');
    
    var options = {
        coverage: false,
        bail: false
    };
    
	gulp.task('test', babelMocha(options));

## Options


Option | Type | Default | Description
---|---|---|---
coverage|boolean|false|Enable coverage report generation
bail|boolean|false|Stop running tests on first failure
files|string &#124; string[]||Files or directories to find tests

## License

This project is released under the ISC license. See [LICENSE](LICENSE).
