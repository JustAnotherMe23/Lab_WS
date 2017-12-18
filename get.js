/* Notes:
In terminal/bash enter: node get.js
This will output to the terminal to see results
To output to file enter: node get js > output.txt
This makes a file called output.txt however overwrites any existing file
To append an existing file enter: node get js >> output.txt
*/

"use strict";

var request = require("request");
var fs = require("fs");
var beep = require("beepbeep");

/** http://rest.ensembl.org/variation/human/rs56116432?content-type=application/json **/

var urlBeg = "http://rest.ensembl.org/variation/human/";
var urlEnd = "?content-type=application/json";

var filename = "snpLoci2.txt";
var data = [];

var url;
inputFile();

var len = data.length;
var res = "";
var num = 103; //Set num to len for the wholw set(never works) or to smaller value. Generally about 100,000
for(let i = 0; i < num; i++) { //Set i to the starting point
    let a = i + 1
    setTimeout(function() {
    	url = urlBeg + data[i] + urlEnd;
    	request.get(url, function(error, response, body) {
    		if(error) {
    			console.log("error1: " + a);
    		} else {
    			try {
    				var parsedData = JSON.parse(body);
    				console.log(parsedData["mappings"][0]["location"] + "\t" + data[i]);
    			} catch(err) {
    				console.log("error2: " + a);
    			}
    			
    		}
    	});
    }, 100 * i);//Adjust wait time here. Longer wait == more succesfull requests
}


/******************************************************************************/

function inputFile() {
	var contents = fs.readFileSync(filename, "utf8")
	var remainder = contents;
	var valid = true;
	var runs = 0;
	while(valid) {
		var pos = remainder.indexOf("\n");
		runs = runs + 1;

		if(pos != -1) {
			var pick = remainder.slice(0, pos);
			remainder = remainder.slice(pos + 1);
			data.push(pick);
		} else {
			data.push(remainder);
			valid = false;
		}
	}
}