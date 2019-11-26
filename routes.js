
const { exec } = require('child_process')

var fs = require('fs')

var request = require('request')

///////////////////////////////////////////////////

module.exports = function (app) {

	app.post('/apply', function(req, res, next) {

		console.log("the request body is: ")
		console.dir(req.body)

		// I've checked for the presence of all values
		// on the front-end

		check_api_key(req, res, function(err) {
			if (err) {
				console.log(err)

				var error_obj = {}

				error_obj.error = 'api_token_error'
				error_obj.error_msg = 'something went wrong testing the url + API token combination, so we haven\'t tried to do anything with terraform.',
				error_obj.url = 'https://' + req.body.okta_org_name + '.' + req.body.okta_base_url
				error_obj.okta_api_token = req.body.okta_api_token.substr(0, 3) + '...'

				res.json(error_obj)

				return
			}

			var options = {
				uri: process.env.TF_BACKEND + '/apply',
				method: 'POST',
				json: req.body
			}

			request(options, function (error, response, body) {

				console.dir(response)

				if (!error && response.statusCode == 200) {

					// var response_obj = {}

					// response_obj.msg = 'terraform_success'
					// response_obj.body = body

					res.json(body)

					return
				}
				else {

					console.dir(error)

					var error_obj = {}

					error_obj.error = 'terraform_error'
					error_obj.error_msg = 'something went wrong with the terraform operation'

					res.json(error_obj)

					return
				}
			})
		})
	})
}

function check_api_key(req, res, callback) {

	var url = 'https://' + req.body.okta_org_name + '.' + req.body.okta_base_url

	var options = {
		method: 'GET',
		url: url + '/api/v1/meta/schemas/user/default',
		headers: {
			Authorization: 'SSWS ' + req.body.okta_api_token,
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	}

	request(options, function (error, response, body) {
		if (error) throw new Error(error)

		console.log("the statusCode is: " + response.statusCode)

		if (response.statusCode === 200) {
			return callback(null)
		}
		else {
			var obj = {
				error: "api_token_error",
				error_msg: "something went wrong testing the url + API token combination, so we haven't tried to do anything with terraform.",
				url: url,
				api_token: req.body.okta_api_token.substring(0,4) + "..."
			}

			return callback(obj)
		}
	})
}
