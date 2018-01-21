const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const promisify = require('es6-promisify');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const routes = require('./routes/index');
const helpers = require('./helpers');
const errorHandlers = require('./handlers/errorHandlers');
//The require function is pretty straight forward. It's a built-in Node function that imports an object (module.exports) from another file or module.
//The basic functionality of "require" is that it reads a javascript file, executes the file, and then proceeds to return the exports object (module.exports).
//The main object exported by the "require" module is a function. When node invokes that "require()" function with a local file path as the exported
//function's only argument, Node goes through the following sequence of steps:
  //1.RESOLVING: To find the absolute path of the file.
  //2.LOADING: To determine the type of the file content.
  //3.WRAPPING: To give the file its private scope. This is what makes both the "require" and "module" objects local to every file we require.
  //4.EVALUATING: This is what the VM eventually does with the loaded code.
  //5.CACHING: So that when we require this file again, we do not go over all the steps another time.

//In the node.js module system, each file is treated as a separate module. Consider modules to be the same as Javascript libraries. A set of functions you
//want to include in your application.

//Node modules have a one-to-one relation with files on the file-system. Before we can load the content of a file into the memory, we need to find the absolute 
//location to that file. In each module, the "module" free variable is a reference to the object representing the current module. For convenience, 
//"module.exports" is also accessible via the "exports" module-global. "module" is not actually a global but rather local to each module.

//The "exports" variable is available within a module's file-level scope, and is assigned the value of "module.exports" before the module is evaluated.
//When the "exports" property is being completely replaced by a new object (meaning, if you do : exports = {}, it no longer references the "module.exports" object),
//it is must to also reassign "module.exports": module.exports = function() { ... }.

const app = express();
//The app object is instantiated on creation of the express server. The "app" object conventially indicates
//the express application. We create it by calling the top-level "express()" function exported by the Express Module.

//Every single request that goes through the application will run through the global middleware before it even 
//gets to the router. This is generally where we introduce any application wide functionality, features or plugins or anything 
//that needs to happen like that. And where does that happen, well that is what most of the "app.js" is. Anywhere where we see 
//"app.use", that means that we are using this global middleware or the "Application-level middleware." 

//We can bind application-level middleware to an instance of the "app object" by using the "app.use()" function or 
//we can  mount the specified middleware function or functions at the specified path by using the "app.METHOD()" function,
//where METHOD is the HTTP method of the request that the middleware function handles (such as GET, PUT or POST) in
//lowercase. The middleware function is executed when the base of the requested path matches path.

//To setup your middleware, you can invoke "app.use(<middleware-layer>)" for every middleware layer that you want to add 
//)it can be generic to all paths, or triggered only on specific path(s) your server handles), and it will add onto 
//your Express middleware stack. Middleware layers can be added one by one in multiple invocations of "app.use()"
// or even all at once in series with one invocation.

//A route will match any path that follows its path immediately with a "/". Since path defaults to "/", middleware
// mounted without a path will be executed for every request to the app.



app.set('views', path.join(__dirname, 'views')); // this is the folder where we keep our pug files
app.set('view engine', 'pug'); // we use the engine pug, mustache or EJS work great too
//The above 2 lines set the views folder and the view engine.
//template engine, you must replace Jade with Pug in your app.

//To render template files, set the following application setting properties, in app.js file:
  //1.views, the directory where the template files are located. Eg: app.set('views', './views'). 
  //  This defaults to the views directory in the application root directory.
  //2.view engine, the template engine to use. For example, to use the Pug template engine: app.set('view engine', 'pug').

//After the view engine is set, you don’t have to specify the engine or load the template engine module in your app; Express loads the module.
//  Note: The view engine cache does not cache the contents of the template’s output, only the underlying template itself. 
//        The view is still re-rendered with every request even when the cache is on.

//The global variable "__dirname" which is the same as the path.dirname() function of the "__filename", will always give you the
//directory in which the currently executing file is located. So if you typed "__dirname" into "d1/d2/myscript.js",
//the value would be "/d1/d2".

//By contrast, "." gives you the directory from which you ran the node command in your terminal window (i.e. your current working directory).
//The exception is when you use "." with "require()". When using "require()", "./" is always translated to the directory of the file that 
//contains the call to "require()". In other words, it is always relative to the file containing the call to require().
  
  //Example: Executing a script within a directory other than the current directory:
    //- /tmp/myapp.js
      //console.log(__dirname)
      //console.log(process.cwd()) // process.cwd() returns the directory from which you ran node.
    //$ cd /tmp/subdir
    //$ node ../app.js
    ///tmp/myapp
    ///tmp/subdir

//What is "path.join(__dirname, 'views')"? The path.join() method joins the specified path segments into one path. You can specify as many path segments as you like.
//The specified path segments must be strings, separated by comma.
//Example: path.join('Users', 'Refsnes', 'demo_path.js'); will return: "Users\Refsnes\demo_path.js"
//So, in our case above : "path.join(__dirname, 'views')", it will return : "/Learn-Node/starter-files/views"

app.use(express.static(path.join(__dirname, 'public')));
//Static files are files that clients download as they are from the server.
//A template engine enables you to use static template files in your application. At runtime, the template engine replaces variables in a template file with 
//with actual values and transforms the template into an HTML file sent to the client. To serve static files such as images, CSS files, and JavaScript files, 
//use the express.static built-in middleware function in Express. Example: "app.use(express.static('public'))"

//The path that you provide to the express.static function is relative to the directory from where you launch your node process. If you run the express app 
//from another directory, it’s safer to use the absolute path of the directory that you want to serve (like above we):
  //app.use(express.static(path.join(__dirname, 'public'))); will return: "/Learn-Node/starter-files/public"


app.use(bodyParser.json());
//To handle HTTP POST request in Express.js version 4 and above, you need to install middleware module called body-parser.
//Body-parser does what it says it does: it parses the incoming HTTP request body in a middleware before your handlers. 
//This is usually necessary when you need to know more than just the URL being hit, more specifically in the context of 
//a POST, PATCH or PUT HTTP request where the information you want is contained in the body. body-parser extracts the entire 
//body portion of an incoming request stream and a new body object containing the parsed data is populated on the request 
//object (req.body) after the middleware. 

//app.use(bodyParser.json()) basically tells the system that you want json to be used, this provides support for 
//parsing of application/json type post data. It returns a function that acts as middleware. 
//The function listens for req.on(‘data’) and constructs req.body from the chunks of data it gets. 

//Using body parser allows you to access req.body from within your routes, and use that data for example to create a user in a database.

app.use(bodyParser.urlencoded({ extended: true }));
//Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST).
//A new body object containing the parsed data is populated on the request object after the middleware (i.e. req.body). T
//This object will contain key-value pairs, where the value can be a string or array (when extended is false), or any type (when extended is true).

//The extended option allows to choose between parsing the URL-encoded data with the querystring library (when false) or the qs library (when true). 
//The "extended" syntax allows for rich objects and arrays to be encoded into the URL-encoded format, allowing for a JSON-like experience with URL-encoded. 

app.use(expressValidator());
//Express-validator is a middleware for Express on Node.js that can help you validate user input. Used heavily on userController.validateRegister.
//Note that you should insert the new express-validator middleware directly after the json middleware.

app.use(cookieParser());
// populates req.cookies with any cookies that came along with the request

app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
// Sessions allow us to store data on visitors from request to request
// This keeps users logged in and allows us to send flash messages

app.use(passport.initialize());
app.use(passport.session());
//Passport JS is what we use to handle our logins

app.use(flash());
//The flash middleware let's us use req.flash('error', 'Shit!'), which will then pass that message to the next page the user requests

// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path;
  next();
});

// promisify some callback based APIs
app.use((req, res, next) => {
  req.login = promisify(req.login, req);
  next();
});

// After allllll that above middleware, we finally handle our own routes!
app.use('/', routes);

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

// done! we export it so we can start the site in start.js
module.exports = app;
