#!/usr/bin/env node
'use strict';

const streamToPromise = require('stream-to-promise');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

// Parses the XML into a JS structure that's easier to work with
const parse = require('./lib/parse');
// Takes a list of events grouped by language and turns it into awful HTML
const Template = require('./lib/template');

const program = require('commander');

function logExamples() {
	console.log('  Examples:');
	console.log('');
	console.log('     $ curl https://events.ccc.de/congress/2017/Fahrplan/schedule.xml | c3t-pad-markdown');
	console.log('     $ c3t-pad-markdown -o myoutdir/ < schedule.xml');
	console.log('');
}
const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json')));
program.version(packageJson.version)
	.description(`Turns conference schedule XML into HTML for translation angels' Etherpads`)
	.option('-o, --output-dir <dir>', 'Specify a different output directory', 'output/')
	.option('-r, --rooms <list>', 'Restrict rooms processed to a comma-separated list', '')
	.option('-R, --room-list <filename>', 'Take list of rooms to process from a line-separated file', '')
	.on('--help', logExamples)
	.parse(process.argv);

if (program.rooms && program.roomList) {
	console.error('Please do not supply -r and -R at the same time.');
	process.exit(1);
}
if (program.rooms) {
	program.rooms = program.rooms.split(',');
} else if (program.roomList) {
	program.rooms = fs.readFileSync(program.roomList, 'UTF-8')
		.split(/[\r\n]+/)
		.filter(string => string.length);
}

if (process.stdin.isTTY) {
	console.error(`Please pipe a congress schedule XML into c3t-pad.\n`);
	logExamples();
	process.exit(1);
}

streamToPromise(process.stdin)
	.then((xml) => parse(xml, program.rooms))
	.then(({ title, version, days, acronym, baseUrl }) => {
		// Find the most common event type.
		// It will get ignored in the template (this is useful because
		// nearly all events at CCC are set to "lecture").
		const mostCommonEventType = _(days)
			.map(d => d.events)
			.flatten()
			.countBy('type')
			.toPairs()
			.maxBy(1)[0];

		// Initialise the template
		const dayTemplate = Template({ ignoreEventTypes: [ mostCommonEventType ], title, version, acronym, baseUrl });

		try {
			fs.mkdirSync(program.outputDir);
		} catch (e) {
			if (e.code !== 'EEXIST') throw e;
		}

		days.forEach((day) => {
			// Events are grouped by language and sorted by time first, room second
			const eventsByTime = _(day.events)
				.sortBy('room')
				.sortBy('date')
				.value()

			eventsByTime.forEach((event, i) => { event.sequentialNumber = i + 1 })

			const eventsByLanguage = _(eventsByTime)
				.groupBy('language')
				.map((events, language) => ({ events, language }))
				.sortBy('language')
				.value()

			const outputPath = path.join(program.outputDir, `day${day.index}.md`);
			fs.writeFileSync(outputPath, dayTemplate({ eventsByTime, eventsByLanguage }));
		})

	})
	.catch(e => console.error(e.stack))
