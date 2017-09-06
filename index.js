'use strict'

const portal = require('wifi-on-ice-portal-client')
const {fetch} = require('fetch-ponyfill')({Promise: require('pinkie-promise')})

const cfg = require('./package.json').config

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
		return fetch(cfg.cloud, {
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

setInterval(submit, cfg.interval * 1000)
