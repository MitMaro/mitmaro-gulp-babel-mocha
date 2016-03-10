import {spawn} from 'child_process';
import {log, colors} from 'gulp-util';

/**
 * Runs tests using Babel and Mocha using spawn
 *
 * @param {object} options The options object
 * @param {boolean} [options.coverage=false] Will generate a coverage report using babel-istanbul
 * @param {boolean} [options.bail=false] Will stop running tests on first failure
 * @param {string|string[]} [options.files=] Files or directories to find tests
 * @returns {function(done:function)} A gulp task function
 */
export default function(options = {}) {
	return function testTask(done) {
		let command;
		let args;
		let mocha;
		log(colors.blue('test: starting'));

		if (options.coverage) {
			command = 'node_modules/.bin/babel-node';
			args = [
				'node_modules/.bin/babel-istanbul', 'cover', 'node_modules/.bin/_mocha', '--'
			];
		}
		else {
			command = 'node_modules/.bin/mocha';
			args = [
				'--compilers', 'js:babel/register'
			];
		}

		// optional set bail flag to mocha
		if (options.bail) {
			args.push('--bail');
		}

		if (options.files) {
			let files;
			if (!Array.isArray(options.files)) {
				files = [options.files];
			}
			else {
				files = options.files;
			}
			args.push(...files);
		}

		mocha = spawn(command, args, {stdio: 'inherit'});
		mocha.on('exit', (code) => {
			log(colors.green('test: complete'));
			if (code) {
				return done(colors.red('test: mocha exited with code: ' + code));
			}
			return done();
		});
	};
};
