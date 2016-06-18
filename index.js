'use strict'

const got = require('got')
const cfg = require('./package.json').config

setInterval(() => {
	got(cfg.portal, {json: true}).then((res) => {

		const data = Object.assign({when: Math.round(Date.now() / 1000)}, res.body)
		got.post(cfg.cloud, {body: data}).catch(console.error)

	}, console.error)
}, cfg.interval * 1000)
