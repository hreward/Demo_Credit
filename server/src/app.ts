// const express = require('express');
import express from "express";
import cors from "cors";

import AuthRouter from "./routes/auth.router";
import UserRouter from "./routes/user.router";
import WalletRouter from "./routes/wallet.router";
import TransactionRouter from "./routes/transaction.router";
import LoanRouter from "./routes/loan.router";

export let mapp = express();

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

mapp.use("/auth", AuthRouter);
mapp.use("/users", UserRouter);
mapp.use("/wallets", WalletRouter);
mapp.use("/transactions", TransactionRouter);
mapp.use("/loans", LoanRouter);
