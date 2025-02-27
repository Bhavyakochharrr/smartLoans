const {injector} = require('ca-webutils');
const { AuthenticationError } = require('ca-webutils/errors');
const fs = require('fs');

const path = require('path');
//const privateKey = fs.readFileSync(path.join(process.cwd(),'jwt.private'),'utf-8');
const privateKey = fs.readFileSync(path.join(process.cwd(),'keys','jwt.private.key'),'utf-8');


const userController = ()=>{
    
    const userService = injector.getService('userService');
    const jwt = injector.getService('jwt');
    
    const getAllUsers = ()=> userService.getAllUsers();

    const activateUser= (({body,email})=> userService.activateUser(email, body.active))

    const registerUser = ({body})=> userService.register(body);
    
    const login = async ({body})=>{

        let user = await userService.login(body);

       //CREATE JWT TOKEN USING PRIVATE KEY

        if(body.aud)
            user.aud=body.aud;

        if(body.sub)
            user.sub=user[body.sub];
        


       let token = await jwt.createToken(user,privateKey,{algorithm: 'RS256'},body.claims);

       return {token,user}

    }
    const addRole=async ({body})=>await userService.addUserToRole(body);

    const validateOtp=async({body})=>await userService.validateOtp(body);
    const resetPassword=async({body})=>await userService.resetPassword(body);
    const resetOtp=async({body})=>await userService.resetOtp(body);
    const updateProfile=async({body})=>await userService.updateProfile(body);
    const changePassword=async({body})=>await userService.changePassword(body);
    const currentUserInfo = async ({request})=>{        
        return request.token;
    }
    const forgotPassword=async({body})=>{
        return userService.forgotPassword(body);
    }
    return {
        getAllUsers,
        registerUser,
        login,
        activateUser,
        currentUserInfo,
        forgotPassword,
        validateOtp,
        resetPassword,
        resetOtp,
        addRole,
        updateProfile,
        changePassword
    }
}

module.exports = userController;

