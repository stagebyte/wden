// call the express module
const express = require('express');
let fortune = require('./lib/fortune.js');
const app = express();


// middleware to handle static page
app.use(express.static(__dirname + '/public'));

//set handlebars engine
const handlebars = require('express-handlebars');

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000)

// home page
app.get('/', (req, res) => {
    //res.type('text/plain');
    //res.send('Meadowlark Travel');
    res.render('home')
})

// about us page for the meadowlark.js
app.get('/about', (req, res) => {
    // generates random values
    //var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    //res.type('text/plain');
    //res.send('About Meadowlark Travel');
    //res.render('about', {fortune: randomFortune})
    res.render('about', {fortune: fortune.getFortune() })
})

// custom 404 page
// 404 catch-all handler (middleware)
app.use((req, res)=>{
    //res.type('text/plain');
    res.status(404);
    //res.send('404 - Not found')
    res.render('404')
})

// custom 500 page
// 500 error handler (middleware)
app.use((err, req, res, next)=>{
    if(err) console.error(err.stack);
    //res.type('text/plain');
    res.status(500);
    //res.send('500 - Server Error');
    res.render('500')
})

app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
    });