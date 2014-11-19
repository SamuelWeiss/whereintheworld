var app = require('express')();
var http = require("http").Server(app);
var mongo = requre("mongodb").MongoClient,
    assert = require("assert");

var url = "mongodb://localhost:27017/locations";

var expected_keys = ['login', 'lat', 'lng'];


app.all("/", function(req, res, next()){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
	//send back some html with all the logins
    });

mongo.connect(url, function(err, db) {
	assert.equal(null, err);
	console.log("connected to mongodb server");

	var location = []; //dummy

	insert_location(db, location,  function(){
		db.close();
	    });
    });

var insert_location = function(db, location, callback){
    var collection = db.collection('locations');
    collection.insert(location, function(err, result){
	    assert.equal(err, null);
	    console.log("inserted new location");
	    callback(result);
	});
};
    
var find_documents = function(db, callback){
    var collection = db.collection('locations');
    collection.find({}).toArray(function(err, docs){
	    assert.equal(err, null);
	    callback(docs);
	});
};



app.post("/sendLocation", function(req, res){
	//req.params has what we need, make sure it has everything we want
	if (Object.keys(req.params) != expected_keys){
	    return;
	}
	//make sure we have everything we need
	var loc = req.params;
	var current_time = new Date();
	loc.push({
		key: "created_at",
		value: current_time.now()
	});
	//store it if we do
	mongo.connect(url, function(err, db){
		assert.equal(err, null);
		insert_location(db, location, function(){
			db.close();
		    });
	    });
	//return some json with an empty character array and the lastest 100 checkins
	var output = {};
	var students =[];
	mongo.connect(url, function(err, db){
		assert.equal(err, null);
		
		var collection = db.collection('locations');
		collection.find().toArray(function(err, docs){
			assert.equal(err, null);
			var index;
			for(index=0; index < 100; index++){
			    students[students.length] = docs[index];
			}
		    });
		db.close();
	    });
	output.push{ key:"chatacters", value: []};
	output.push{ key:"students", value: students};
	res.send(JSON.stringify(output));
    });

app.get("/", function(req, res){
	var temp = [];
	mongo.connect(url, function(err, db){
		assert.equal(err, null);
		
		var collection = db.collection('locations');
		collection.find().toArray(function(err, docs){
			assert.equal(err, null);
			temp = docs;
		    });
		db.close();
	    });
	var output = "Users, locations, and times <p></p>";
	var index;
	for(index = 0; index < temp.length; index++){
	    output = output + "Name: " + temp[index].name;
	    output = output + "lat: " + temp[index].lat;
	    output = output + "long: " + temp[index].lng;
	    output = output + "time: " + temp[index].current_time;
	    output = output + "<p></p>";
	}
	res.send(output);
    });
	

app.get("/locations.json", function(req, res){
	var name = req.params['name'];
	if(!name){
	    res.send(JSON.stringify([]));
	    return;
	}
	//make sure req has a name in it
	//find all checkins under that name
	var output = [];
	mongo.connect(url, function(err, db){
		assert.equal(err, null);
		
		var collection = db.collection('locations');
		collection.find().toArray(function(err, docs){
			assert.equal(err, null);
			var index;
			for(index=0; docs.length; index++){
			    if(docs[index].name == name){
				output[output.length] = docs[index];
			    }
			}
		    });
		db.close();
	    });
	res.send(JSON.stringify(output);
	//return them
    });


app.get("/redline.json", function(req, res){
	//pull down the json from http://developer.mbta.com/lib/rthr/red.json and send it along

    });

http.listen(80, function(){
	console.log("Listening on port 80");
    });