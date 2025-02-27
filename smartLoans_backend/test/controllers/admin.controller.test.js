const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('Admin Controller', () => {
  let adminController;
  let mockAdminService;
  let mockInjector;
  
  beforeEach(() => {
    // Create mock for adminService
    mockAdminService = {
      getAllLoans: sinon.stub(),
      deleteLoan: sinon.stub()
    };
    
    // Create mock for injector
    mockInjector = {
      getService: sinon.stub().returns(mockAdminService)
    };
    
    // Create controller with mocked dependencies
    const adminControllerFactory = proxyquire('../../src/controllers/admin.controller', {
      'ca-webutils': { injector: mockInjector }
    });
    
    adminController = adminControllerFactory();
  });
  
  afterEach(() => {
    sinon.restore();
  });
  
  describe('getAllLoans', () => {
    it('should call adminService.getAllLoans', () => {
      // Setup
      const expectedLoans = [{ id: 1 }, { id: 2 }];
      mockAdminService.getAllLoans.returns(expectedLoans);
      
      // Execute
      const result = adminController.getAllLoans();
      
      // Verify
      expect(mockAdminService.getAllLoans.calledOnce).to.be.true;
      expect(result).to.deep.equal(expectedLoans);
    });
  });
  
  describe('deleteLoan', () => {
    it('should call adminService.deleteLoan with the provided id', () => {
      // Setup
      const loanId = '123';
      const expectedResult = { success: true };
      mockAdminService.deleteLoan.withArgs(loanId).returns(expectedResult);
      
      // Execute
      const result = adminController.deleteLoan({ id: loanId });
      
      // Verify
      expect(mockAdminService.deleteLoan.calledOnceWithExactly(loanId)).to.be.true;
      expect(result).to.deep.equal(expectedResult);
    });
    
    it('should pass the id correctly when deleteLoan is called', () => {
      // Setup
      const loanId = '456';
      
      // Execute
      adminController.deleteLoan({ id: loanId });
      
      // Verify
      expect(mockAdminService.deleteLoan.firstCall.args[0]).to.equal(loanId);
    });
  });
  
  describe('Initialization', () => {
    it('should get adminService from injector', () => {
      // Already executed in beforeEach
      
      // Verify
      expect(mockInjector.getService.calledOnceWithExactly('adminService')).to.be.true;
    });
    
    it('should return the correct methods', () => {
      // Verify
      expect(adminController).to.have.property('getAllLoans').that.is.a('function');
      expect(adminController).to.have.property('deleteLoan').that.is.a('function');
    });
  });
});