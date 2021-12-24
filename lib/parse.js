'use strict';

const cheerio = require('cheerio');

module.exports = function parse(xml, rooms) {
	const $ = cheerio.load(xml);

	const version = $('schedule version').text();
	const title = $('conference title').text();
	const acronym = $('conference acronym').text();
	const baseUrl = $('conference base_url').text();

	const filterRooms = rooms && rooms.length;

	const days = $('day').map((i, day) => {
		const $day = $(day);
		const events = $day.find('room').filter((i, room) => {
			const children = $(room).children();
			if (children.length == 0 || $(room).children()[0].tagName !== 'event') {
				return false;
			} else if (filterRooms) {
				return rooms.indexOf($(room).attr('name')) !== -1;
			} else {
				return true;
			}
		})
		.find('event')
		.map((i, event) => {
			const $event = $(event);
			const t = (selector) => $event.find(selector).text() || null;

			const obj = {
				guid: $event.attr('guid'),
				id: $event.attr('id'),
				date: new Date(t('date')),
				day: $(day).attr('index'),
				recording: {
					license: t('recording license'),
					optout: t('recording optout') !== 'false', // Treat anything as true that's not explicitly false
				},
				url: $event.find("url").text(),
				persons: $event.find('persons person').map((i, person) => ({
					id: $(person).attr('id'),
					name: $(person).text(),
				})).get(),
				links: $event.find('links link').map((i, link) => ({
					href: $(link).attr('href'),
					title: $(link).text() || null,
				})).get(),
				attachments: $event.find('attachments attachment').map((i, attachment) => ({
					href: $(attachment).attr('href'),
					title: $(attachment).text() || null,
				})).get(),
			}

			// These are just simple string values we can take from the event's
			// elements' text values
			const simpleValues = [
				'start', 'duration', 'room', 'slug', 'title', 'subtitle', 'track',
				'type', 'language', 'abstract', 'description', 'logo',
			]
			simpleValues.forEach(v => obj[v] = t(v));

			return obj;
		}).get();

		return {
			date: $day.attr('date'),
			index: $day.attr('index'),
			start: new Date($day.attr('start')),
			end: new Date($day.attr('end')),
			events,
		}
	}).get();

	return { days, title, version, acronym, baseUrl };
}
