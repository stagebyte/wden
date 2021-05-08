// call the express module
const express = require('express');
let fortune = require('./lib/fortune.js');
const app = express();

var tours = [
    { id: 0, name: 'Hood River', price: 99.99 },
    { id: 1, name: 'Oregon Coast', price: 149.95 },
];

let getWeatherData = function (){
    return {
        locations: [
            {
                name: 'Portland',
                forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
                weather: 'Overcast',
                temp: '54.1 F (12.3 C)',
            },
            {
                name: 'Bend',
                forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
                weather: 'Partly Cloudy',
                temp: '55.0 F (12.8 C)',
            },
            {
                name: 'Manzanita',
                forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
                iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
                weather: 'Light Rain',
                temp: '55.0 F (12.8 C)',
            },
        ],
    };
}

var getVal = {
    currency: {
    name: 'United States dollars',
    abbrev: 'USD',
    },
    tours: [
    { name: 'Hood River', price: '$99.95' },
    { name: 'Oregon Coast', price: '$159.95' },
    ],
    specialsUrl: '/january-specials',
    currencies: [ 'USD', 'GBP', 'BTC' ],
    first_name: 'Stanley',
    locations: [
        {
            name: 'Portland',
            forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
            iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
            weather: 'Overcast',
            temp: '54.1 F (12.3 C)',
        },
        {
            name: 'Bend',
            forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
            iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
            weather: 'Partly Cloudy',
            temp: '55.0 F (12.8 C)',
        },
        {
            name: 'Manzanita',
            forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
            iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
            weather: 'Light Rain',
            temp: '55.0 F (12.8 C)',
        },
    ],

}


// middleware to handle static page
app.use(express.static(__dirname + '/public'));

// enable view caching
//app.set('view cache', true);

//set handlebars engine
const handlebars = require('express-handlebars');
// to use hbs an a short form instead of handlebars
//const handlebars = require('express-handlebars').create({ extname: '.hbs' });

app.engine('handlebars', handlebars({
                            defaultLayout: 'main',
                            helpers: {
                                    section: function(name, options){
                                        if(!this._sections) this._sections = {};
                                        this._sections[name] = options.fn(this);
                                        return null;
                                    }
                                }
                        }));
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000)

// url for page testing & debugging
app.use(function(req, res, next){
    res.locals.showTests = app.get('env') !== 'production' &&
    req.query.test === '1';
    next();
    });
 
//Example 6-12. GET endpoint that returns JSON, XML, or text
app.get('/api/toursxp', function(req, res){
    var toursXml = '<?xml version="1.0"?><tours>' + tours.map(function(p){
    return '<tour price="' + p.price + '" id="' + p.id + '">' + p.name + '</tour>'}).join('') + '</tours>';
   
    var toursText = tours.map(function(p){
    return p.id + ': ' + p.name + ' (' + p.price + ')';
    }).join('\n');

    res.format({
        'application/json': function(){
            res.json(tours);
        },
        'application/xml': function(){
            res.type('application/xml');
            res.send(toursXml);
        },
        'text/xml': function(){
            res.type('text/xml');
            res.send(toursXml);
        },
        'text/plain': function(){
            res.type('text/plain');
            res.send(toursXml);
        }
    });

});

app.get('/nursery-rhyme', function(req, res){
    res.render('nursery-rhyme');
});

app.get('/data/nursery-rhyme', function(req, res){
    res.json({
        animal: 'squirrel',
        bodyPart: 'tail',
        adjective: 'bushy',
        noun: 'heck',
    });
});

app.get('/api/tours', function(req, res){
        res.json(tours);
});
// home page
app.get('/', (req, res) => {
    //res.type('text/plain');
    //res.send('Meadowlark Travel');
    res.render('home', getVal)
});

// about us page for the meadowlark.js
app.get('/about', (req, res) => {
    // generates random values
    //var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    //res.type('text/plain');
    //res.send('About Meadowlark Travel');
    //res.render('about', {fortune: randomFortune})
    res.render('about', {
                            fortune: fortune.getFortune(),
                            pageTestScript: '/qa/tests-about.js' 
                        })
})

// routes for tour section
app.get('/tours/hood-river', function(req, res){
    res.render('tours/hood-river');
});

app.get('/tours/request-group-rate', function(req, res){
    res.render('tours/request-group-rate');
});

// getting information about the headers
app.get('/headers', function(req,res){
    res.set('Content-Type','text/plain');
    var s = '';
    for(var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
    res.send(s);
});

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
    //res.status(500).render('500')
})

app.disable('x-powered-by');

app.listen(app.get('port'), function(){
    console.log( 'Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.' );
    });