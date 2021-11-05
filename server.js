'use strict'

//import hapi module
const Path = require('path');
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const { path } = require('pdfkit');
//plugins software addon  for adding login,working with database, itis a module
//const plugin = require("plugin")   
//create a server object wrap in a function in async
const init = async () => {

    //create var server to create server
    const server = Hapi.Server({
        host: 'localhost',
        port: 1234, 
        routes: {
            files: {  
                relativeTo: Path.join(__dirname, 'static')
            }
        }
    });
    //use plugin 
    await server.register([{
        plugin: require('hapi-geo-locate'), options: {
            enabledByDefault: false
        }
    },

    {
        plugin: Inert  //return string html or any file form directory
    },
    {
        plugin:require('@hapi/vision')
    },



    ]);

    //takes a object key is host ,port
    //give a destination/Route server will reload
    //each route takes obj property method path hadler(response to user request)
    //parameter name can be anything
    //obejct detilas about user 
    // //another Route
    // //Route 2
    // server.route()
    // //Route 2 
    // //ROute 3 
    // // ?name = tom & lastname= barange is a query param
    // server.route()
    // //Route 3
    // //use Wild Card when path do not exist "/{any*}"
    // server.route()

    //
    server.views({
        engines: {
            hbs: require('handlebars')
        },
        
        path: Path.join(__dirname,'views'),layout:'default'
    });
    server.route([{
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            // request and h(response toolkit)
            //we can return html
            return `<h1>Hello Hapijs </h1>`
        }
    },
    {
        method: 'GET',
        path: '/welcome', //added parameter not mendatory use ?
        handler: (request, h) => {

            return h.redirect('/')
        }
    },

    {
        method: 'GET',
        path: '/users/{soccer?}', //added parameter not mendatory use ?
        handler: (request, h) => {
            return `<h1> THis is user${request.params.soccer} ${request.query.name}</h1>`

        }
    },
    //hapi-geo-locate plugin
    {
        method: 'GET',
        path: '/location',
        handler: (request, h) => {
            const location = request.location
            if (request.location.ip) {
                return h.view('location',{location:request.location})
            }
            else {
                return `<h1> Your Location By Default </h1>`
            }
            // use client location


        }
    },
    //we can load pages from staic /public folder html files using url change
    {
        method: 'GET',
        path: '/file',
        handler: (request,h)=>{
            return h.file('welcome.html')
        }
    },
    {
        method: 'GET',
        path: '/downloads',
        handler: (request,h)=>{
            return h.file(`welcome.html`,{mode:'attachment',filename:'welcome-download.html'});
        }
    },
    {
        method:"POST",
        path:'/login',
        handler: async (request,h)=>{
                  
            if (request.payload.username ==="manoj" && request.payload.password==="password") {
                console.log('you Loggedin');
            }
            else{
                console.log("Login Failed");
            }
            

           // request.payload.username;
           // request.payload.password;
        //    console.log(request.payload.username);
        //    console.log(request.payload.password);
           const data =  {username:request.payload.username,password:request.payload.password};
           console.log(data.username)
           return h.view('index',data)
        }
    },
    {
        method:'GET',
        path:'/dynamic',
        handler:(request,h)=>{
          const data = {
                  name:'manoj Barange'
            }
            return h.view('index',data)
        }
    },
    //wild card Route
    {
        method: 'GET',
        path: '/{any*}', //added parameter not mendatory use ?
        handler: (request, h) => {

            return "<h1>You Must Be Lost</h1>"
        }
    },


    ])

    //need to start server
    await server.start();
    console.log(`server started ${server.info.uri}`);
}
// if promise rejected  
//process is object provide info 
//about current node process is running.
//process start using outside functions
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
})
//process ends
init(); //this is async function returns promise. we can use .then .catch
