const { expect } = require('chai');
const sinon = require('sinon');
const { NotFoundError } = require('ca-webutils/errors');
const UserService = require('../../src/services/user.service');

describe('UserService', () => {
  let userService;
  let mockUserRepository;
  
  beforeEach(() => {
    // Create mock for userRepository with all required methods
    mockUserRepository = {
      create: sinon.stub(),
      findAll: sinon.stub(),
      deleteById: sinon.stub(),
      findByIdAndUpdate: sinon.stub(),
      findByIdAndDelete: sinon.stub(),
      update: sinon.stub(),
      findOne: sinon.stub()
    };
    
    // Create instance of UserService with mocked repository
    userService = new UserService(mockUserRepository);
  });
  
  afterEach(() => {
    sinon.restore();
  });

  describe('constructor', () => {
    it('should set userRepository property', () => {
      expect(userService.userRepository).to.equal(mockUserRepository);
    });
    
    it('should have correct dependencies defined statically', () => {
      expect(UserService._dependencies).to.deep.equal(['userRepository']);
    });
  });
  
  describe('Customer methods', () => {
    describe('createUser', () => {
      it('should call userRepository.create and return the created user', async () => {
        // Setup
        const userDetails = { name: 'John Doe', email: 'john@example.com' };
        const createdUser = { id: '1', ...userDetails };
        mockUserRepository.create.withArgs(userDetails).resolves(createdUser);
        
        // Execute
        const result = await userService.createUser(userDetails);
        
        // Verify
        expect(mockUserRepository.create.calledOnceWithExactly(userDetails)).to.be.true;
        expect(result).to.deep.equal(createdUser);
      });
    });
    
    describe('getAllUsers', () => {
      it('should call userRepository.findAll and return users', async () => {
        // Setup
        const mockUsers = [
          { id: '1', name: 'User 1', email: 'user1@example.com' },
          { id: '2', name: 'User 2', email: 'user2@example.com' }
        ];
        mockUserRepository.findAll.resolves(mockUsers);
        
        // Execute
        const result = await userService.getAllUsers();
        
        // Verify
        expect(mockUserRepository.findAll.calledOnce).to.be.true;
        expect(result).to.deep.equal(mockUsers);
      });
      
      it('should return empty array when no users exist', async () => {
        // Setup
        mockUserRepository.findAll.resolves([]);
        
        // Execute
        const result = await userService.getAllUsers();
        
        // Verify
        expect(result).to.be.an('array').that.is.empty;
      });
    });
    
    describe('deleteUser', () => {
      it('should call userRepository.deleteById with correct id', async () => {
        // Setup
        const userId = '1';
        const deletedUser = { id: userId, name: 'John Doe', deleted: true };
        mockUserRepository.deleteById.withArgs(userId).resolves(deletedUser);
        
        // Execute
        const result = await userService.deleteUser(userId);
        
        // Verify
        expect(mockUserRepository.deleteById.calledOnceWithExactly(userId)).to.be.true;
        expect(result).to.deep.equal(deletedUser);
      });
    });
  });
  
  describe('Banker methods', () => {
    describe('createBanker', () => {
      it('should call userRepository.create and return the created banker', async () => {
        // Setup
        const bankerDetails = { name: 'Jane Banker', email: 'jane@bank.com', roles: ['banker'] };
        const createdBanker = { id: '1', ...bankerDetails };
        mockUserRepository.create.withArgs(bankerDetails).resolves(createdBanker);
        
        // Execute
        const result = await userService.createBanker(bankerDetails);
        
        // Verify
        expect(mockUserRepository.create.calledOnceWithExactly(bankerDetails)).to.be.true;
        expect(result).to.deep.equal(createdBanker);
      });
    });
    
    describe('getAllBankers', () => {
      it('should call userRepository.findAll with roles filter and return bankers', async () => {
        // Setup
        const mockBankers = [
          { id: '1', name: 'Banker 1', roles: ['banker'] },
          { id: '2', name: 'Banker 2', roles: ['banker'] }
        ];
        mockUserRepository.findAll.withArgs({ roles: "banker" }).resolves(mockBankers);
        
        // Execute
        const result = await userService.getAllBankers();
        
        // Verify
        expect(mockUserRepository.findAll.calledOnceWithExactly({ roles: "banker" })).to.be.true;
        expect(result).to.deep.equal(mockBankers);
      });
    });
    
    describe('updateBankerRole', () => {
      it('should call userRepository.findByIdAndUpdate with correct parameters', async () => {
        // Setup
        const bankerId = '1';
        const role = 'senior-banker';
        const updatedBanker = { id: bankerId, role };
        mockUserRepository.findByIdAndUpdate.withArgs({ id: bankerId, role }).resolves(updatedBanker);
        
        // Execute
        const result = await userService.updateBankerRole(bankerId, role);
        
        // Verify
        expect(mockUserRepository.findByIdAndUpdate.calledOnceWithExactly({ id: bankerId, role })).to.be.true;
        expect(result).to.deep.equal(updatedBanker);
      });
    });
    
    describe('deleteBanker', () => {
      it('should call userRepository.findByIdAndDelete with correct id', async () => {
        // Setup
        const bankerId = '1';
        const deletedBanker = { id: bankerId, deleted: true };
        mockUserRepository.findByIdAndDelete.withArgs({ id: bankerId }).resolves(deletedBanker);
        
        // Execute
        const result = await userService.deleteBanker(bankerId);
        
        // Verify
        expect(mockUserRepository.findByIdAndDelete.calledOnceWithExactly({ id: bankerId })).to.be.true;
        expect(result).to.deep.equal(deletedBanker);
      });
    });
  });
  
  describe('Role methods', () => {
    describe('addUserToRole', () => {
      it('should call userRepository.update with correct parameters', async () => {
        // Setup
        const email = 'user@example.com';
        const role = 'admin';
        const updateResult = { modified: 1 };
        mockUserRepository.update.withArgs({ email }, { $push: { roles: role } }).resolves(updateResult);
        
        // Execute
        const result = await userService.addUserToRole({ email, role });
        
        // Verify
        expect(mockUserRepository.update.calledOnceWithExactly({ email }, { $push: { roles: role } })).to.be.true;
        expect(result).to.deep.equal(updateResult);
      });
    });
  });
  
  describe('Profile methods', () => {
    describe('updateProfile', () => {
      it('should update user profile when account number is valid', async () => {
        // Setup
        const profileData = { 
          name: 'Updated Name', 
          email: 'updated@example.com', 
          accountNumber: '12345' 
        };
        
        const mockUser = {
          name: 'Original Name',
          email: 'original@example.com',
          accountNumber: '12345',
          save: sinon.stub().resolves({ 
            name: profileData.name, 
            email: profileData.email, 
            accountNumber: profileData.accountNumber 
          })
        };
        
        mockUserRepository.findOne.withArgs({ accountNumber: profileData.accountNumber }).resolves(mockUser);
        
        // Execute
        const result = await userService.updateProfile(profileData);
        
        // Verify
        expect(mockUserRepository.findOne.calledOnceWithExactly({ accountNumber: profileData.accountNumber })).to.be.true;
        expect(mockUser.name).to.equal(profileData.name);
        expect(mockUser.email).to.equal(profileData.email);
        expect(mockUser.save.calledOnce).to.be.true;
      });
      
      it('should throw error when user with account number is not found', async () => {
        // Setup
        const profileData = { 
          name: 'Updated Name', 
          email: 'updated@example.com', 
          accountNumber: 'invalid' 
        };
        
        mockUserRepository.findOne.withArgs({ accountNumber: profileData.accountNumber }).resolves(null);
        
        // Execute and Verify
        try {
          await userService.updateProfile(profileData);
          expect.fail('Expected error was not thrown');
        } catch (err) {
          expect(err.message).to.equal('User not found');
        }
      });
    });
  });
  
  describe('Error handling', () => {
    it('should propagate repository errors', async () => {
      // Setup
      const error = new Error('Repository error');
      mockUserRepository.findAll.rejects(error);
      
      // Execute and Verify
      try {
        await userService.getAllUsers();
        expect.fail('Expected error was not thrown');
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
    
    it('should handle NotFoundError from repository', async () => {
      // Setup
      const error = new NotFoundError('User not found');
      mockUserRepository.findOne.rejects(error);
      
      // Execute and Verify
      try {
        await userService.updateProfile({ name: 'Test', email: 'test@example.com', accountNumber: '12345' });
        expect.fail('Expected error was not thrown');
      } catch (err) {
        expect(err).to.be.instanceOf(NotFoundError);
        expect(err.message).to.equal('User not found');
      }
    });
  });
});