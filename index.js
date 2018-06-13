'use strict'

const portal = require('wifi-on-ice-portal-client')
const {fetch} = require('fetch-ponyfill')({Promise: require('pinkie-promise')})

const endpoint = process.env.ENDPOINT
if (!endpoint) {
	console.error('Missing ENDPOINT env var.')
	process.exit(1)
}

const interval = parseInt(process.env.INTERVAL || '10')
if (Number.isNaN(interval) || interval <= 0) {
	console.error('Invalid INTERVAL env var.')
	process.exit(1)
}

const userAgent = 'https://github.com/derhuerst/ice-portal-mole'

const submit = () => {
	return Promise.all([
		portal.status(),
		portal.journey()
	])
	.then(([status, leg]) => ({
		when: Math.round(Date.now() / 1000),
		ok: status.ok,
		speed: status.speed,
		gpsOk: status.gpsOk,
		latitude: status.latitude,
		longitude: status.longitude,
		line: leg.line,
		traveledDistance: leg.traveledDistance,
		totalDistance: leg.totalDistance
	}))
	.then((data) => {
		return fetch(endpoint, {
			method: 'post',
			mode: 'cors',
			redirect: 'follow',
			headers: {
				'User-Agent': userAgent,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
	})
	.then((res) => {
		if (!res.ok) {
			const err = new Error(res.statusText)
			err.statusCode = res.status
			throw err
		}
	})
	.catch(console.error)
}

setInterval(submit, interval * 1000)
