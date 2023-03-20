const express = require('express');
const cors = require("cors");
const {saveSession} = require("./helper")
const session = require("express-session");

const {router: AuthRouter} = require("./routes/auth.router");
const {router: UserRouter} = require("./routes/user.router");
const {router: CoopRouter} = require("./routes/coop.router");

const mapp = express();

var whitelist = ['http://example1.com', 'http://example2.com'];
var corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true)
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	}
}
mapp.use(cors());
mapp.use(express.json());

//get and work with headers
// mapp.use((request, response, next)=>{
// 	apikeyauth(request.headers.authorization, (auth)=>{
// 		if(auth instanceof Error){
// 			return response.status(401).json({
// 				status: false,
// 				success: false,
// 				message: auth.message
// 			});
// 		}
// 		next();
// 	});
// });

mapp.use(session({
	secret: "ypooc-aa",
	resave: false,
	saveUninitialized: true,
	cookie: {expires: new Date("2023-05-02")},
	name: "user"
}));

mapp.use((request, response, next)=>{
	saveSession(request.session);
	next();
});

//setting user for this request
// mapp.use((request, response, next)=>{
// 	//mask api key
// 	let maskedapi = request.headers.authorization.split("-", 2)[1];
// 	maskedapi = `${maskedapi.substr(0,4)}********${maskedapi.substr(-4)}`
// 	setUser(`${bus_details.name} - ${bus_details.bid} - ${maskedapi}`);
// 	next();
// });

mapp.use("/auth", AuthRouter);
mapp.use("/user", UserRouter);
mapp.use(express.urlencoded({
    extended: true,
}));
mapp.use("/coop", CoopRouter);


module.exports = {mapp};