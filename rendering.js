const express = require('express');

const app = express();

//Example 6-1. Basic usage
// basic usage
app.get('/about', function (req, res) {
    res.render('about');
})

//Example 6-2. Response codes other than 200
app.get('/errors', function (req, res) {
    res.status('500')
    res.render('error');

});
// no lines
app.get('/errors', function (req, res) {
    res.status('500').render('error');

})

//Example 6-3. Passing a context to a view, including querystring, cookie, and session values
app.get('/greeting', function (req, res) {
    res.render('about', {
        message: 'welcome',
        style: req.query.style,
        userId: req.cookie.userId,
        username: req.session.username
    })
})

//Example 6-4. Rendering a view without a layout
// the following layout doesn't have a layout file, so views/no-layout.handlebars
// must include all necessary HTML
app.get('/no-layouts', function (req, res) {
    res.render('no-layout', {layout: null})
    
})

//Example 6-5. Rendering a view with a custom layout
// the layout file views/layouts/custom.handlebars will be used
app.get('/custom-layout', function (req, res) {
    res.render('custom-layout', {layout: 'custom'})
});

//Example 6-6. Rendering plaintext output
app.get('/test', function (req, res) {
    res.type('text/plain');
    res.send('this is a test')
})

//Example 6-7. Adding an error handler
// this should appear AFTER all of your routes
// note that even if you don't need the "next"
// function, it must be included for Express
// to recognize this as an error handler
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).render('error')
})

//Example 6-8. Adding a 404 handler
// this should appear AFTER all of your routes
app.use(function (req, res) {
    res.status(404).render('not-found')    
});

// Example 6-9. Basic form processing
// body-parser middleware must be linked in
app.post('/process-contact', function (req, res) {
    //console.log('Received contact from ' + req.body.name + '<' + req.body.email + '>');
    console.log(`Received contact from  ${req.body.name} <${req.body.email}>`);
    // save to database
    // send an email - option / fire any other event
    res.redirect(303, '/thank-you')
})

//Example 6-10. More robust form processing
// body-parser middleware must be linked in
app.post('/process-contact', function (req, res) {
    console.log(`Received contact from  ${req.body.name} <${req.body.email}>`);
    try{
       // save to database
      // send an email - option / fire any other event 
      return res.xhr ? res.render({ success:true }) : res.redirect(303, '/thank-you')

    }catch(ex){
        return res.xhr ? res.json({error: 'Database error.' }) : res.redirect(303, '/database-error');
    }
})

var tours = [
    { id: 0, name: 'Hood River', price: 99.99 },
    { id: 1, name: 'Oregon Coast', price: 149.95 },
];

//Example 6-11. Simple GET endpoint returning only JSON
app.get('/api/tours', function(req, res){
    res.json(tours);
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

//Example 6-13. PUT endpoint for updating
// API that updates a tour and returns JSON; params are passed using querystring
app.put('/api/tours/:id', function (req, res) {
    var p = tours.some(function (p) {  return p.id === parseInt(req.params.id) });
    if(p){
        if(req.query.name) p.name = req.query.name;
        if(req.query.price) p.name = req.query.price;
        res.json({success: true});
    } else {
        res.json({error: 'no such tours exists'});
    }
    
});

// Method two
router.put('/:id', (req, res) => {
    const found = tours.some(p => p.id === parseInt(req.params.id));
   // res.send(req.params.id);
   if(found) {
        const updMember = req.body
        tours.forEach(p => {
             if(p.id === parseInt(req.params.id)) {
                  p.name = updMember.name ? updMember.name : p.name;
                  p.email = updMember.email ? updMember.email : p.email;

              res.json({ msg: 'Member updated', member : member});
             }
        });
   } else {
        res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
   }
   
});

//Example 6-14. DEL endpoint for deleting
// API that deletes a product
app.delete('/api/tour/:id', function(req, res){
    var i;
    for( var i=tours.length-1; i>=0; i-- )
        if( tours[i].id == req.params.id ) break;
    if( i>=0 ) {
        tours.splice(i, 1);
        res.json({success: true});
    } else {
        res.json({error: 'No such tour exists.'});
    }
});
// Method two
app.delete('/api/tour/:id', function(req, res){
    const found = tours.some(p => p.id === parseInt(req.params.id));

    if(found) {
        res.json({ msg: 'Member deleted', tours :tours.filter(p => p.id !== parseInt(req.params.id))})
   } else {
        res.status(400).json({ msg: `No member with the id of ${req.params.id}` });
   }
})