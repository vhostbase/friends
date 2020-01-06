var http = require('http')
var url = require('url')
var fs = require('fs')
var path = require('path')
var baseDirectory = __dirname+'/public'   // or whatever base directory you want
var port = 8080
http.createServer(function (request, response) {
    try {
		var requestUrl = url.parse(request.url);
		if(request.method === 'POST'){
		}else{
			var mimeType = 'text/html';
			if('/' === requestUrl.pathname || '/index.html' === requestUrl.pathname)
				requestUrl.pathname = '/index.html';
			if(requestUrl.pathname.indexOf('.css') > -1)
				mimeType = 'text/css';
			// need to use path.normalize so people can't access directories underneath baseDirectory
			var fsPath = baseDirectory+path.normalize(requestUrl.pathname)
			var fileStream = fs.createReadStream(fsPath)
			fileStream.pipe(response)
			fileStream.on('open', function() {
				 response.writeHead(200, 'text/html')
			})
			fileStream.on('error',function(e) {
				 response.writeHead(404)     // assume the file doesn't exist
				 response.end()
			})
		}
   } catch(e) {
        response.writeHead(500)
        response.end()     // end the response so browsers don't hang
        console.log(e.stack)
   }
}).listen(port)
console.log(__dirname);
console.log("listening on port "+port)