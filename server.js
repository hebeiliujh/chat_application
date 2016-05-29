var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};

/**
 * [send404]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
function send404(response){
	response.writeHead(404, {'Content-Type':'text/plain'});
	response.write('Error 404: resource not found.');
	response.end();
}

/**
 * [sendFile provide file data server]
 * @param  {[type]} response     [description]
 * @param  {[type]} filePath     [description]
 * @param  {[type]} fileContents [description]
 * @return {[type]}              [description]
 */
function sendFile(response, filePath, fileContents){
	response.writeHead(
		200, 
		{'Content-Type':mime.lookup(path.basename(filePath))}
	);
	response.end(fileContents);
}

/**
 * [serveStatic description] provide static file server
 * @param  {[type]} response [description]
 * @param  {[type]} cache    [description]
 * @param  {[type]} absPath  [description]
 * @return {[type]}          [description]
 */
function serveStatic(response, cache, absPath){
	if(cache[absPath]){
		sendFile(response, absPath, cache[absPath]);
	}else{
		fs.exists(absPath, function(exists){
			if (exists) {
				fs.readFile(absPath, function(err, data){
					if(err){
						//console.log(err);
						send404(response);
					}else{
						cache[absPath] = data;
						sendFile(response, absPath, data);
					}
				});
			}else{
				send404(response);
			}
		});
	}
}

/**
 * 创建HTTP服务器的逻辑
 * @param  {[type]} request   [description]
 * @param  {[type]} response) {	var        filePath [description]
 * @return {[type]}           [description]
 */
var server = http.createServer(function (request, response) {
	var filePath = false;
	//console.log(request.url);
	if(request.url == '/'){
		filePath = 'public/index.html';
	}else{
		filePath = 'public'+ request.url;
	}

	var absPath = './'+ filePath;
	serveStatic(response, cache, absPath);
});

server.listen(3000, function(){
	console.log("Server listening on port 3000");
})


var chatServer = require('./lib/chat_server.js');
chatServer.listen(server);




