const { expect } = require('chai');
const sinon = require('sinon');
const { MongooseRepository } = require('ca-webutils');
const MongooseUserRepository = require('../../src/repositories/mongoose/user.repository');

describe('MongooseUserRepository', () => {
  let userRepository;
  let mockUserModel;
  
  beforeEach(() => {
    // Create mock for the Mongoose model
    mockUserModel = {
      find: sinon.stub(),
      findById: sinon.stub(),
      findByIdAndUpdate: sinon.stub(),
      findByIdAndDelete: sinon.stub(),
      findOne: sinon.stub(),
      create: sinon.stub(),
      constructor: {
        name: 'MockUserModel'
      }
    };
    
    // Stub console.log to prevent test output pollution
    sinon.stub(console, 'log');
    
    // Create instance of MongooseUserRepository with mocked model
    userRepository = new MongooseUserRepository(mockUserModel);
  });
  
  afterEach(() => {
    sinon.restore();
  });

  describe('constructor', () => {
    it('should call the parent constructor with the model', () => {
      const constructorSpy = sinon.spy(MongooseRepository.prototype, 'constructor');
      
      // Create a new instance to trigger the constructor
      const newRepository = new MongooseUserRepository(mockUserModel);
      
      // Verify model is set (can't directly verify super call)
      expect(newRepository.model).to.equal(mockUserModel);
      expect(console.log.calledWith('model', 'MockUserModel')).to.be.true;
    });
    
    it('should inherit from MongooseRepository', () => {
      expect(userRepository instanceof MongooseRepository).to.be.true;
    });
    
    it('should have correct dependencies defined statically', () => {
      expect(MongooseUserRepository._dependencies).to.deep.equal(['user']);
    });
  });
  
  describe('deleteById', () => {
    it('should call model.findByIdAndDelete with the provided id', async () => {
      // Setup
      const userId = '507f1f77bcf86cd799439011';
      const deletedUser = { _id: userId, name: 'Test User' };
      mockUserModel.findByIdAndDelete.withArgs(userId).resolves(deletedUser);
      
      // Execute
      const result = await userRepository.deleteById(userId);
      
      // Verify
      expect(mockUserModel.findByIdAndDelete.calledOnceWithExactly(userId)).to.be.true;
      expect(result).to.deep.equal(deletedUser);
    });
    
    it('should return null when user with id does not exist', async () => {
      // Setup
      const nonExistentId = '507f1f77bcf86cd799439999';
      mockUserModel.findByIdAndDelete.withArgs(nonExistentId).resolves(null);
      
      // Execute
      const result = await userRepository.deleteById(nonExistentId);
      
      // Verify
      expect(result).to.be.null;
    });
    
    it('should propagate errors from the model', async () => {
      // Setup
      const userId = '507f1f77bcf86cd799439011';
      const error = new Error('Database error');
      mockUserModel.findByIdAndDelete.withArgs(userId).rejects(error);
      
      // Execute and Verify
      try {
        await userRepository.deleteById(userId);
        expect.fail('Expected error was not thrown');
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });
  
  describe('findAll', () => {
    it('should call model.find with empty filter by default', async () => {
      // Setup
      const users = [
        { _id: '1', name: 'User 1' },
        { _id: '2', name: 'User 2' }
      ];
      mockUserModel.find.withArgs({}).resolves(users);
      
      // Execute
      const result = await userRepository.findAll();
      
      // Verify
      expect(mockUserModel.find.calledOnceWithExactly({})).to.be.true;
      expect(result).to.deep.equal(users);
    });
    
    it('should call model.find with provided filter', async () => {
      // Setup
      const filter = { roles: 'admin' };
      const users = [
        { _id: '1', name: 'Admin 1', roles: ['admin'] }
      ];
      mockUserModel.find.withArgs(filter).resolves(users);
      
      // Execute
      const result = await userRepository.findAll(filter);
      
      // Verify
      expect(mockUserModel.find.calledOnceWithExactly(filter)).to.be.true;
      expect(result).to.deep.equal(users);
    });
    
    it('should return empty array when no users match filter', async () => {
      // Setup
      const filter = { roles: 'nonexistent' };
      mockUserModel.find.withArgs(filter).resolves([]);
      
      // Execute
      const result = await userRepository.findAll(filter);
      
      // Verify
      expect(result).to.be.an('array').that.is.empty;
    });
    
    it('should propagate errors from the model', async () => {
      // Setup
      const error = new Error('Database connection error');
      mockUserModel.find.rejects(error);
      
      // Execute and Verify
      try {
        await userRepository.findAll();
        expect.fail('Expected error was not thrown');
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });
  
  describe('inherited methods', () => {
    it('should inherit create method from parent class', () => {
      // Verify that the method exists on the repository instance
      expect(userRepository.create).to.be.a('function');
    });
    
    it('should inherit update method from parent class', () => {
      expect(userRepository.update).to.be.a('function');
    });
    
    it('should inherit findOne method from parent class', () => {
      expect(userRepository.findOne).to.be.a('function');
    });
  });
});