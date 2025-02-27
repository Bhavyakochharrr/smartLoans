const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('User Controller', () => {
  let userController;
  let mockUserService;
  let mockInjector;
  
  beforeEach(() => {
    // Create mock for userService with all required methods
    mockUserService = {
      createUser: sinon.stub().resolves(),
      getAllUsers: sinon.stub(),
      deleteUser: sinon.stub().resolves(),
      getAllBankers: sinon.stub(),
      addUserToRole: sinon.stub().resolves(),
      updateProfile: sinon.stub().resolves()
    };
    
    // Create mock for injector
    mockInjector = {
      getService: sinon.stub().returns(mockUserService)
    };
    
    // Create controller with mocked dependencies
    const userControllerFactory = proxyquire('../../src/controllers/user.controller', {
      'ca-webutils': { injector: mockInjector }
    });
    
    userController = userControllerFactory();
  });
  
  afterEach(() => {
    sinon.restore();
  });

  describe('Initialization', () => {
    it('should get userService from injector', () => {
      expect(mockInjector.getService.calledOnceWithExactly('userService')).to.be.true;
    });
    
    it('should return all the expected methods', () => {
      expect(userController).to.have.property('createCustomer').that.is.a('function');
      expect(userController).to.have.property('getAllCustomers').that.is.a('function');
      expect(userController).to.have.property('deleteCustomer').that.is.a('function');
      expect(userController).to.have.property('createBanker').that.is.a('function');
      expect(userController).to.have.property('getAllBankers').that.is.a('function');
      expect(userController).to.have.property('deleteBanker').that.is.a('function');
      expect(userController).to.have.property('addRole').that.is.a('function');
      expect(userController).to.have.property('updateProfile').that.is.a('function');
    });
  });
  
  describe('Customer methods', () => {
    describe('createCustomer', () => {
      it('should call userService.createUser with the request body', async () => {
        // Setup
        const requestBody = { name: 'John Doe', email: 'john@example.com' };
        
        // Execute
        const result = await userController.createCustomer({ body: requestBody });
        
        // Verify
        expect(mockUserService.createUser.calledOnceWithExactly(requestBody)).to.be.true;
        expect(result).to.deep.equal({ message: 'Customer created successfully' });
      });
    });
    
    describe('getAllCustomers', () => {
      it('should call userService.getAllUsers', () => {
        // Setup
        const expectedUsers = [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }];
        mockUserService.getAllUsers.returns(expectedUsers);
        
        // Execute
        const result = userController.getAllCustomers();
        
        // Verify
        expect(mockUserService.getAllUsers.calledOnce).to.be.true;
        expect(result).to.deep.equal(expectedUsers);
      });
    });
    
    describe('deleteCustomer', () => {
      it('should call userService.deleteUser with the provided id', async () => {
        // Setup
        const userId = '123';
        
        // Execute
        const result = await userController.deleteCustomer({ params: { id: userId } });
        
        // Verify
        expect(mockUserService.deleteUser.calledOnceWithExactly(userId)).to.be.true;
        expect(result).to.deep.equal({ message: 'Customer deleted successfully' });
      });
    });
  });
  
  describe('Banker methods', () => {
    describe('createBanker', () => {
      it('should call userService.createUser with the request body', async () => {
        // Setup
        const requestBody = { name: 'Jane Banker', email: 'jane@bank.com', role: 'banker' };
        
        // Execute
        const result = await userController.createBanker({ body: requestBody });
        
        // Verify
        expect(mockUserService.createUser.calledOnceWithExactly(requestBody)).to.be.true;
        expect(result).to.deep.equal({ message: 'Banker created successfully' });
      });
    });
    
    describe('getAllBankers', () => {
      it('should call userService.getAllBankers', () => {
        // Setup
        const expectedBankers = [{ id: 1, name: 'Banker 1' }, { id: 2, name: 'Banker 2' }];
        mockUserService.getAllBankers.returns(expectedBankers);
        
        // Execute
        const result = userController.getAllBankers();
        
        // Verify
        expect(mockUserService.getAllBankers.calledOnce).to.be.true;
        expect(result).to.deep.equal(expectedBankers);
      });
    });
    
    describe('deleteBanker', () => {
      it('should call userService.deleteUser with the provided id', async () => {
        // Setup
        const bankerId = '456';
        
        // Execute
        const result = await userController.deleteBanker({ params: { id: bankerId } });
        
        // Verify
        expect(mockUserService.deleteUser.calledOnceWithExactly(bankerId)).to.be.true;
        expect(result).to.deep.equal({ message: 'banker deleted successfully' });
      });
    });
  });
  
  describe('Role methods', () => {
    describe('addRole', () => {
      it('should call userService.addUserToRole with the request body', async () => {
        // Setup
        const requestBody = { userId: '123', roleId: '789' };
        
        // Execute
        const result = await userController.addRole({ body: requestBody });
        
        // Verify
        expect(mockUserService.addUserToRole.calledOnceWithExactly(requestBody)).to.be.true;
        expect(result).to.deep.equal({ message: 'Role added successfully' });
      });
    });
  });
  
  describe('Profile methods', () => {
    describe('updateProfile', () => {
      it('should call userService.updateProfile with the request body', async () => {
        // Setup
        const requestBody = { userId: '123', name: 'Updated Name' };
        const expectedResponse = { success: true };
        mockUserService.updateProfile.withArgs(requestBody).resolves(expectedResponse);
        
        // Execute
        const result = await userController.updateProfile({ body: requestBody });
        
        // Verify
        expect(mockUserService.updateProfile.calledOnceWithExactly(requestBody)).to.be.true;
        expect(result).to.deep.equal(expectedResponse);
      });
    });
  });
  
  describe('Error handling', () => {
    it('should propagate errors from the service layer', async () => {
      // Setup
      const error = new Error('Service error');
      mockUserService.createUser.rejects(error);
      const requestBody = { name: 'Test User' };
      
      // Execute and Verify
      try {
        await userController.createCustomer({ body: requestBody });
        // If we reach here, the test should fail
        expect.fail('Expected error was not thrown');
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
  });
});