import { Response, Request, NextFunction } from "express";
import { createLogger, transports, format } from "winston";
const { combine, timestamp, label, prettyPrint, printf, json } = format;
require('winston-daily-rotate-file');


export const checkRequiredParam = (paramName: string) => (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const param = req.body[paramName];
	if (!param) {
		return res.status(400).json({
		message: `${paramName} parameter is required`,
		});
	}
	next();
};


// //////////////////////////////////////////////
// `M.`MMMm                 ,M' .M.    MMMMMMM MMMMMMMMM
//  `M.`MMMm               ,M' .MMM.   MMMMMMM MMMMMMMMM
//   `M.`MMMm             ,M' :MMMMM.        M MMMM     
//    `M.`MMMm     .m    ,M' . `MMMMM.       M MMMM     
	// `M.`MMMm    MMm  ,M' .M. `MMMMM.      M MMMM     
	//  `M.`MMMm .`MMMm,M' .M`M. `MMMMM.     M MMMM     
	//   `M.`MMMmM.`MMMM' .M' `M. `MMMMM.    M MMMM     
	//    `M.`MMM`M.`MM' .M'   `M. `MMMMM.   M MMMM     
		// `M.`M' `M,`' .MMMMMMMMM. `MMMMM.  M MMMM     
		//  `M.`   `M' .M'       `M. `MMMMM. M MMMM     

//flw keys
/*
const flwkeys = {
	FLW_PUBLIC_KEY: "FLWPUBK_TEST-521f69e6532c0dfdfb48adddd876e21b-X",
	FLW_SECRET_KEY: "FLWSECK_TEST-a0a4ec03b5b6de01ae499be5802775c3-X",
	// FLW_SECRET_KEY: "FLWSECK-04fb62947f4ccd293d27bfc0986475ec-X"
}

const transport = new transports.DailyRotateFile({
	filename: 'app-%DATE%.jlog',
	dirname:'./logs',
	datePattern: 'YYYY-MM-DD',
	zippedArchive: true,
	maxSize: '20m',
	maxFiles: '90d'
});

var thisUser = {
	id:"",
	name:"Developer"
}

function setUser(name){
	thisUser.name = name;
	logger = createLogger({
		transports: [
			transport
		],
		format:combine(
				label({ label: thisUser.name }),
				timestamp(),
				myFormat
			)
		});
}

/////////////////////
/////APP GEN VAR/////
/////////////////////
const countryKeys = [ "NG", "GH", "KE", "UG", "ZA", "TZ" ];
const countryNamesKeys = {
	nigeria:"NG", ghana: "GH", kenya:"KE", uganda:"UG", "south africa":"ZA", tanzania:"TZ"
};
//supported currencies
const supportedCurrencies = ["NGN", "GHS"];
//supported countries
const supportedCountries = ["nigeria", "ghana", "kenya", "uganda", "south africa", "tanzania"];

const countrycurrency = {
	supportedCurrencies: supportedCurrencies,
	supportedCountries: supportedCountries,
	countryShortCode: function(countryName){
		if(supportedCountries.includes(countryName.toLowerCase())){
			return countryNamesKeys[countryName];
		} else {
			return false;
		}
	}
}


/////////////////////
////LOGGER///////////
/////////////////////
const myFormat = printf(({ level, message, label, timestamp }) => {
	// return `${timestamp} [${label}] ${level}: ${message}`;
	//return `{\n\ttimestamp:"${timestamp}"\n\tlabel:"${label}"\n\tlevel:"${level}"\n\nmessage:"${message}"\n}`;
return`{
	"timestamp":"${timestamp}",
	"label":"${label}",
	"level":"${level}",
	"message":"${message}"
}`;
});

transport.on('rotate', function(oldFilename, newFilename) {
	// do something fun
});

global.logger = createLogger({
	transports: [
		transport
	],
	format:combine(
			label({ label: thisUser.name }),
			timestamp(),
			myFormat
		)
	});


function getOffset(currentPage = 1, listPerPage) {
	return (currentPage - 1) * listPerPage;
}

function emptyOrRows(rows) {
	if (! rows) {
		return [];
	}
	return rows;
}

global.bus_details;
function apikeyauth(apikey, callback) {
	const con = require("../src/models/dbconnect");
	//check for empty api key
	if(!apikey || apikey === null || apikey.trim() === ""){
		return callback(new Error("unauthorised request"));
	}

	//split api key string
	const apikeys = apikey.split(" ",2);

	//continue if Bearer is in api string
	if(apikeys[0] === "Bearer"){
		//be careful here.
		//for now we are only using secret key
		var seckey = apikeys[1].split("-", 2)[1];
		let query = {
			string:'SELECT * FROM api_keys WHERE sec_key = ? LIMIT 1',
			params: [
				seckey
			]
		}
		
		//fetch api key
		con.query(query.string, query.params, function (error, result){
			if (error) {
				// throw error;
				return callback(new Error("api internal error"));
			}
			result = emptyOrRows(result[0]);
			if(result.length === 0){
				return callback(new Error(`unauthorised request`));
			} else {
				let query = {
					string:"SELECT * FROM businesses WHERE bid = ? LIMIT 1",
					params: [
						result.bid
					]
				}

				// fetch business details of api key
				con.query(query.string, query.params, function (buserror, busresult){
					if (buserror) {
						//throw error;
						return callback(new Error("internal error"));
					}
					busresult = emptyOrRows(busresult[0]);
					if(busresult.length === 0){
						return callback(new Error(`internal error fetching business`));
					} else {	
						bus_details = {
							bid: busresult.bid,
							email: busresult.email,
							name: busresult.name,
							phone: busresult.phone,
							address: busresult.address,
							identifier: busresult.business_identifier,
							logo: busresult.logo,
							created_at: busresult.created_at,
							delete_status: busresult.delete_status
						}
						if(bus_details.delete_status === "true"){
							return callback(new Error(`business is not active`));
						}
						return callback(bus_details);
					}
				});
			}
		});
	} else {
		return callback(new Error("unauthorised request")); 
	}
}


global.userSession;
function saveSession(reqSession){
	global.userSession = reqSession;
}

module.exports = {
	// logger,
	countrycurrency,
	setUser,
	getOffset,
	emptyOrRows,
	flwkeys,
	apikeyauth,
	global,
	saveSession,

}

*/