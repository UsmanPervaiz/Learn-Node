const mongoose = require('mongoose');

// Make sure we are running node 7.6+

// const [major, minor] = process.versions.node.split('.').map(parseFloat);
// if (major < 7 || (major === 7 && minor <= 5)) {
//   console.log('🛑 🌮 🐶 💪 💩\nHey You! \n\t ya you! \n\t\tBuster! \n\tYou\'re on an older version of node that doesn\'t support the latest and greatest things we are learning (Async + Await)! Please go to nodejs.org and download version 7.6 or greater. 👌\n ');
//   process.exit();
// }

require('dotenv').config({ path: 'variables.env' });
//Import environmental variables from our variables.env file.
//Environment variables are local variables that are made available to an application. Creating these variables is made easy with a tool like dotenv. 
//This module loads environment variables from a ".env" file that you create and adds them to the process.env object that is made available to the application.
//As early as possible in your application, require and configure dotenv "require('dotenv').config()" and then Create a .env file in the root directory of 
//your project. 

//Add environment-specific variables on new lines in the form of NAME=VALUE. Finally, add ‘.env’ to your ‘.gitignore’ file so that Git ignores it 
//and it never ends up on GitHub. process.env now has the keys and values you defined in your .env file.

//config will read your .env file, parse the contents, assign it to process.env, and return an Object (object { USERNAME : 'deusman' }) with a parsed key 
//containing loaded content or an error key if it failed. You can additionally, pass options to config, such as: 1.path - You can specify a custom path if 
//your file containing environment variables is named or located differently "require('dotenv').config({path: '/custom/path/to/your/env/vars'})",
//2.parse - The engine which parses the contents of your file containing environment variables is available to use. It accepts a String or Buffer and will 
//return an Object with the parsed keys and values.
//Example: 
		//var dotenv = require('dotenv');
		//var buf = new Buffer('BASIC=basic');
		//var config = dotenv.parse(buf) // will return an object;
		//console.log(typeof config, config) // object { BASIC : 'basic' };
		//BASIC=basic becomes {BASIC: 'basic'}


// Connect to our Database and handle any bad connections
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});

// READY?! Let's go!


// Start our app!
const app = require('./app');
app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
