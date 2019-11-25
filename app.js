///////////////////////////////////////////////////
// Okta terraform frontend

require('dotenv').config()

var bodyParser = require('body-parser')

const express = require('express')

///////////////////////////////////////////////////

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(express.static('public'))

require('./routes.js')(app)

var port = process.env.PORT

app.listen(port, function () {
	console.log('App listening on port ' + port)
})
