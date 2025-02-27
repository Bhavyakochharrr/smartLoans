const { expect } = require('chai');
const sinon = require('sinon');
const { NotFoundError } = require('ca-webutils/errors');
const AdminService = require('../../src/services/admin.service');

describe('AdminService', () => {
  let adminService;
  let mockLoanRepository;
  
  beforeEach(() => {
    // Create mock for loanRepository
    mockLoanRepository = {
      findAll: sinon.stub()
    };
    
    // Create instance of AdminService with mocked repository
    adminService = new AdminService(mockLoanRepository);
  });
  
  afterEach(() => {
    sinon.restore();
  });

  describe('constructor', () => {
    it('should set loanRepository property', () => {
      expect(adminService.loanRepository).to.equal(mockLoanRepository);
    });
    
    it('should have correct dependencies defined statically', () => {
      expect(AdminService._dependencies).to.deep.equal(['loanRepository']);
    });
  });
  
  describe('getAllLoans', () => {
    it('should call loanRepository.findAll and return loans', async () => {
      // Setup
      const mockLoans = [
        { id: '1', amount: 5000, status: 'active' },
        { id: '2', amount: 10000, status: 'pending' }
      ];
      mockLoanRepository.findAll.resolves(mockLoans);
      
      // Execute
      const result = await adminService.getAllLoans();
      
      // Verify
      expect(mockLoanRepository.findAll.calledOnce).to.be.true;
      expect(result).to.deep.equal(mockLoans);
    });
    
    it('should propagate errors from the repository', async () => {
      // Setup
      const error = new NotFoundError('Loans not found');
      mockLoanRepository.findAll.rejects(error);
      
      // Execute and Verify
      try {
        await adminService.getAllLoans();
        // If we reach here, the test should fail
        expect.fail('Expected error was not thrown');
      } catch (err) {
        expect(err).to.equal(error);
      }
    });
    
    it('should return empty array when no loans exist', async () => {
      // Setup
      mockLoanRepository.findAll.resolves([]);
      
      // Execute
      const result = await adminService.getAllLoans();
      
      // Verify
      expect(result).to.be.an('array').that.is.empty;
    });
  });
  
  describe('error handling', () => {
    it('should handle repository connection errors', async () => {
      // Setup
      const connectionError = new Error('Database connection failed');
      mockLoanRepository.findAll.rejects(connectionError);
      
      // Execute and Verify
      try {
        await adminService.getAllLoans();
        expect.fail('Expected error was not thrown');
      } catch (err) {
        expect(err.message).to.equal('Database connection failed');
      }
    });
  });
  
  describe('_dependencies static property', () => {
    it('should include all required dependencies', () => {
      expect(AdminService._dependencies).to.include('loanRepository');
    });
  });
});