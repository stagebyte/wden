const http = require('http');
fs = require('fs');

/** // create a simple server
http.createServer(function(req,res){
res.writeHead(200, { 'Content-Type': 'text/plain' });
res.end('Hello world!');
}).listen(3000, () => console.log("server port started on 3000"));
*/

/** 
 * create a route to serve plain text
http.createServer(function(req, res){
 
     // Normailize url by removing querystring, optional
     // trailing slash, and making it lowercase

     var path = req.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase();
    switch(path){
        case '':
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Homepage');
            break;
        case '/about':
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('About');
            break;
        default:
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
            break;
    }
}).listen(3000)
console.log('Server started on localhost:3000; press Ctrl-C to terminate....');
*/

// create a route that serve static files in public folder
function serveStaticFile(res, path, contentType, responseCode) {
    if(!responseCode) responseCode = 200;
    
    fs.readFile(__dirname + path, function (err, data) {
        if(err) {
            res.writeHead(500, {'Content-Type': 'text/html'});
            res.end('500 - internal error');
        } else {
            res.writeHead(responseCode, { 'Content-Type': contentType });
            res.end(data);
        }
    })
}

http.createServer(function(req, res){
     
    // Normailize url by removing querystring, optional
    // trailing slash, and making it lowercase

     var path = req.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase();

     switch(path){
         case '':
             serveStaticFile(res, '/public/home.html', 'text/html');
             break;
         case '/about':
             serveStaticFile(res, '/public/about.html', 'text/html');
             break;
        case '/img/logo.jpg':
            serveStaticFile(res, '/public/img/logo.jpg', 'image/jpeg');
            break;
        default:
            serveStaticFile(res, '/public/notfound.html', 'text/html', 404);
            break;
     }
}).listen(3000, () => console.log("server port started on 3000"));


