console.log("the bot is starting");

var Twit = require('twit');
var config = require('./config');
var countriesB = require('country-list')();
var countries = countriesB.getNames();
var express = require('express');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var app = express();
var port = 8000;
//console.log(config);

var schedule;


var url = "http://twice.jype.com/schedule.asp"

request(url, function(err, resp, body){
	// pass in the entire page into cheerio
	var $ = cheerio.load(body);
	// standard jQuery call to grab an element, specifically class element
	var scheName = $('.sche-text');
	// we have to do this because chaning does not work (like if you put .text() in the above line
	schedule = scheName.text();
	console.log("scheName is " + scheName.text());

	console.log("schedule is " + schedule);
	// document.getElementById("demo").innerHTML = "wtf";
})

app.listen(port);
// console.log('server is listening on ' + port);





var T = new Twit(config); 

var country = [];

var params = {
	q: 'nayeon',
	count: 100
}

T.get('search/tweets', params, gotData);

function gotData(err, data, response) {
	var tweets = data.statuses;
	for (var i = 0; i < tweets.length; i++){
		for (var j = 0; j < countries.length; j++){
			var found = tweets[i].text.indexOf(countries[j]);
			if (found !== 1){
				//console.log("reached");
				var len = countries[j].length;
				country.push(tweets[i].text.substring(found, found + len));
			}
		}
		//console.log(tweets[i].text);
	}
}

// setInterval(tweetIt, 1000*20)

tweetIt();

function tweetIt(){

	var tweet = {
		status: 'next twice schedule is  ' + schedule
	}

	T.post('statuses/update', tweet, tweeted);

	console.log("tweet it schedule is " + schedule);
	function tweeted(err, data, response){
		if (err) {
			console.log(err);
		} else {
			console.log("It worked!");
		}
	}
}