'use strict'

const got = require('got')
const cfg = require('./package.json').config

setInterval(() => {
	Promise.all(
		got(cfg.portal + '/api1/rs/status', {json: true})
		got(cfg.portal + '/api1/rs/tripInfo', {json: true})
	).then([status, trip] => {
		got.post(cfg.cloud, {body: {
			  when: Math.round(Date.now() / 1000)
			  connected: status.body.connection
			, speed: status.body.speed
			, latitude: status.body.latitude
			, longitude: status.body.longitude
			, train: [trip.body.trainType, trip.body.vzn]
			, traveledDistance: trip.body.actualPosition
			, totalDistance: trip.body.totalDistance
		}}).catch(console.error)

	}, console.error)
}, cfg.interval * 1000)
