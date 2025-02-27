const { NotFoundError, ValidationError, AuthenticationError,AuthorizationError } = require("ca-webutils/errors");

class UserService{
    constructor(userRepository){
        this.userRepository = userRepository;
    }

    //Customers
    async createUser(user){
        const customer = await this.userRepository.create(user);
        return customer;
    }
    async getAllUsers(){
        const customers=await this.userRepository.findAll();
        return customers;
    }
    async deleteUser(id){
        const deletedCustomer = await this.userRepository.deleteById(id);
        return deletedCustomer;
    }
    //bankers

    async createBanker(banker){
        const bankers=await this.userRepository.create(banker);
        return bankers;
    }
    async getAllBankers(){
        const bankers = await this.userRepository.findAll({
            roles: "banker"
        });
        return bankers;
    }
    async updateBankerRole(id,role){
        const updatedBanker=await this.userRepository.findByIdAndUpdate({id,role});
        return updatedBanker;
    }
    async deleteBanker(id){
        const deletedBanker=await this.userRepository.findByIdAndDelete({id});
        return deletedBanker;
    }
    //update-role
    async addUserToRole({ email, role }) {
        return await this.userRepository.update({ email }, { $push: { roles: role } });
    }
    async updateProfile({ name, email, accountNumber }) {
        const user = await this.userRepository.findOne({ accountNumber });
        console.log("user",user);
        if (!user) {
            throw new Error("User not found");
        }
    
        user.name = name;
        user.email = email;
    
        return await user.save();
    }
}

UserService._dependencies =[ 'userRepository' ];

module.exports = UserService;

