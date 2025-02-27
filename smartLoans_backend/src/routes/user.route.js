const express= require('express');
const {expressx} = require('ca-webutils');
const userController = require('../controllers/user.controller')
const {authorize,authenticate} = require('ca-webutils/jwt');

const createRouter = ()=>{

    const router = express.Router();
    
    let {routeHandler}=expressx;
    
    let controller = userController();

         
    router
        .route('/customers')
        .get(authorize('admin'),routeHandler(controller.getAllCustomers))
        .post(authorize('admin'),routeHandler(controller.createCustomer))
    router
        .route('/customers/:id')
        .delete(authorize('admin'),routeHandler(controller.deleteCustomer))

    router  
        .route('/addRole')
        .post(authorize('admin'),routeHandler(controller.addRole))
    router
        .route('/update')
        .post(authorize('admin'),routeHandler(controller.updateProfile))


    router
        .route('/bankers')
        .post(authorize('admin'),routeHandler(controller.createBanker))
        .get(authorize('admin'),routeHandler(controller.getAllBankers))
    router
        .route('/bankers/update-role/:id')
        .patch(authorize('admin'),routeHandler(controller.updateBankerRole))

    router
        .route('/bankers/:id')
        .delete(authorize('admin'),(controller.deleteBanker))
        
    
    return router;

}


module.exports= createRouter;