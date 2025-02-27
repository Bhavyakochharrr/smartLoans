const {injector} = require('ca-webutils')


const userController = ()=>{
    
    const userService = injector.getService('userService');

        //Customers

        const createCustomer = async ({ body }) => {
            await userService.createUser(body);
            return { message: "Customer created successfully" };
        };

        const getAllCustomers =()=> userService.getAllUsers();

        const deleteCustomer = async ({ params: { id } }) => {
            await userService.deleteUser(id);
            return { message: "Customer deleted successfully" };
        };

        //Bankers

        const createBanker=async({body})=>{
            await userService.createUser(body);
            return { message: "Banker created successfully"};
        };
        const getAllBankers = () => userService.getAllBankers();

        const deleteBanker =async({params: {id}})=>{
            await userService.deleteUser(id);
            return {message: "banker deleted successfully"};
        };
        const addRole = async ({ body }) => {
            await userService.addUserToRole(body);
            return { message: "Role added successfully" };
        };
        const updateProfile=async({body})=>await userService.updateProfile(body);

        return {
            createCustomer,
            getAllCustomers,
            deleteCustomer,
            createBanker,
            getAllBankers,
            deleteBanker,
            addRole,
            updateProfile
        }
    }

module.exports = userController;

