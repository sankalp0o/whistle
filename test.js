var request = require("request")

/*request.post({url:'http://localhost:3000/api/users/', form: {name:'Sankalp'}}, function(err,httpResponse,body){
	console.log(body)
})*/

request.post({url:'http://localhost:3000/api/users/', form: {name:'Sankalp2'}}, function(err,httpResponse,body){
	console.log(body);
	console.log(httpResponse.headers);
})


/*
request.get({url:'http://localhost:3000/api/users/'}, function(err,httpResponse,body){
	console.log(err);
	console.log((JSON.parse(body))[0].name);
})
*/