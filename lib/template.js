'use strict';

const _ = require('lodash');

module.exports = function Template(options) {
	const o = Object.assign({}, {
		ignoreEventTypes: [],
		title: 'Unknown event',
		version: new Date().toString(),
		acronym: options.title || '?',
	}, options);

	function escape(text) {
		return text.replace(/[*_#]/g, "\\$&").replace(/([A-Za-z0-9])([@.])([A-Za-z])/g, '$1<span>$2</span>$3');
	}

	// Level one
	return function template({ eventsByLanguage, eventsByTime }) {
		const { day } = eventsByTime[0];
		const events = `## Talks\n` + _(eventsByTime).map(eventTemplate).join('');
		const header = `# Translations for ${o.acronym} · Day ${day}\n\n<small>Version ${escape(o.version)}</small>\n\n`;
		const tableOfContents = `\n## Overview by language\n\n` + _(eventsByLanguage).map(eventsByLanguageTemplate).join('');
		return header + events + tableOfContents;
	}

	// Level two
	// Generates the heading for language groups and hands the events
	// down to the next level
	function eventsByLanguageTemplate({ events, language }) {
		const title = ({
			de: 'de → en',
			en: 'en → de',
		})[language] || language;

		return `### ${title} (${events.length})\n\n${events.map(tocTemplate).join('')}\n`;
	}

	// Level three a
	// Generates the listing for each individual event
	function eventTemplate(event) {
		const { title, room, start, duration, id, language, sequentialNumber, guid } = event;
		const speakers = event.persons.map(p => escape(p.name)).join(', ');
		const type = o.ignoreEventTypes.includes(event.type) ? '' : ` (${_.upperFirst(event.type)})`;
		const url = event.url || `${options.baseUrl}events/${id}.html`;

		const targetLanguages = ({
			en: '→ de: ',
			de: '→ en: ',
		})[language] || '→ ';

		return `\n### #${sequentialNumber}  \n[${language}] **${start}** +${duration}, ${room}  \n**${escape(title)}**${type}  \n${speakers}  \nFahrplan: ${url}  \nSlides (if available): https://speakers.c3lingo.org/talks/${guid}/  \n${targetLanguages}\n\n`;
	}

	// Level three b
	// Generates the listing for the table of contents
	function tocTemplate(event) {
		const { start, duration, title, sequentialNumber } = event;
		return `**${start}** +${duration} #${sequentialNumber} ${escape(title)}  \n`;
	}
}
