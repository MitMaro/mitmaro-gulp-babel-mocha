'use strict';

import sinon from 'sinon';
import gulpUtilStub from '@mitmaro/js-test-stubs/stubs/gulp/util';
import childProcessStub from '@mitmaro/js-test-stubs/stubs/node/childProcess';

describe('BabelMocha', () => {
	let mocha;
	let stubs;

	beforeEach(() => {

		stubs = {
			gulpUtil: gulpUtilStub(),
			childProcess: childProcessStub()
		};

		mocha = require('../../src/BabelMocha');

		mocha.__Rewire__('spawn', stubs.childProcess.spawn);
		mocha.__Rewire__('log', stubs.gulpUtil.log);
		mocha.__Rewire__('colors', stubs.gulpUtil.colors);
	});

	it('should run mocha without coverage', () => {
		let task = mocha();
		task();
		expect(stubs.childProcess.spawn).to.be.calledWith(
			'node_modules/.bin/mocha'
		);
	});

	it('should run mocha with coverage', () => {
		let task = mocha({
			coverage: true
		});
		task();
		expect(stubs.childProcess.spawn.firstCall.args[0]).to.eql('node_modules/.bin/babel-node');
		expect(stubs.childProcess.spawn.firstCall.args[1][0]).to.eql('node_modules/.bin/babel-istanbul');
		expect(stubs.childProcess.spawn.firstCall.args[1][1]).to.eql('cover');
	});

	it('should pass bail to mocha process', () => {
		let task = mocha({
			bail: true
		});
		task();
		expect(stubs.childProcess.spawn.firstCall.args[1]).to.include('--bail');
	});

	it('should finish without error on successful exit', (done) => {
		let task = mocha({
			bail: true
		});
		stubs.childProcess.spawn._process.on.callsArgWith(1, 0);

		task((err) => {
			expect(stubs.gulpUtil._log.lines[1]).to.equal('test: complete')
			expect(err).to.be.undefined;
			done();
		});
	});

	it('should finish with error on unsuccessful exit', (done) => {
		let task = mocha({
			bail: true
		});
		stubs.childProcess.spawn._process.on.callsArgWith(1, 24);

		task((err) => {
			expect(err).to.eql('test: mocha exited with code: 24');
			done();
		});
	});
});
