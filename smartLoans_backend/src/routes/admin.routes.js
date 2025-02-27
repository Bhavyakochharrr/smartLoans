const express= require('express');
const {expressx} = require('ca-webutils');
const bankerController = require('../controllers/banker.controller')
const {authenticate,authorize} = require('ca-webutils/jwt');

const createRouter = ()=>{

    const router = express.Router();
    
    let {routeHandler}=expressx;
    
    let controller = bankerController();
    
    router
        .route('/loans/all')
        .get(authorize('admin'),routeHandler(controller.getAllLoans));


    return router;
}


module.exports= createRouter;