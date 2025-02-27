const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;

// Mocking ca-webutils injector
const injector = {
    getService: sinon.stub()
};

// Mock loanService
const loanServiceMock = {
    getLoansList: sinon.stub(),
    applyLoan: sinon.stub(),
    uploadMiddleware: sinon.stub()
};

injector.getService.withArgs('loanService').returns(loanServiceMock);

// Mocking require for injector
const proxyquire = require('proxyquire');
const loanController = proxyquire('../../src/controllers/loan.controller', { 'ca-webutils': { injector } });

describe('Loan Controller', () => {
    beforeEach(() => {
        sinon.restore();
    });

    it('should get all loans', async () => {
        const query = { status: 'approved' };
        const mockLoans = [{ id: 1, amount: 5000 }, { id: 2, amount: 10000 }];
        loanServiceMock.getLoansList.resolves(mockLoans);

        const result = await loanController().getAllLoans({ query });
        expect(result).to.deep.equal(mockLoans);
        expect(loanServiceMock.getLoansList.calledOnceWith(query)).to.be.true;
    });

    it('should apply for a loan', async () => {
        const requestData = { body: { amount: 5000 }, files: ['file1', 'file2'] };
        loanServiceMock.applyLoan.resolves({ success: true });

        const result = await loanController().applyLoan({ request: requestData });
        expect(result).to.deep.equal({ success: true });
        expect(loanServiceMock.applyLoan.calledOnceWith(requestData.body, requestData.files)).to.be.true;
    });

    it('should have an upload middleware', () => {
        const result = loanController().uploadMiddleware;
        expect(result).to.equal(loanServiceMock.uploadMiddleware);
    });
});
