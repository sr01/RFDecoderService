import express from 'express';
import { Application } from 'express';
import * as Decoder from "../model/decoder";

// var express = require('express');
var router = express.Router();

export default router.get('/', function(req, res, next) {
    res.send(`Welocme to decoder !
    Decode request:
    POST / 
    body: { times : Array<number> } 
    `);
});

router.post('/', function(req, res, next) {
    console.log(req.body.times);
    let decodeResult = Decoder.decode(req.body.times, Decoder.Levels.Low, 50);
    res.send(decodeResult);
});

// module.exports = router;