const {MongooseRepository} = require('ca-webutils')

class MongooseUserRepository extends MongooseRepository {
    constructor(model){
        super(model);
        console.log('model',model.constructor.name);
        
    }

    async deleteById(id) {
        return this.model.findByIdAndDelete(id);
    }

    async findAll(filter = {}) {
        return this.model.find(filter);
    }
}

MongooseUserRepository._dependencies =['user']

module.exports = MongooseUserRepository;
