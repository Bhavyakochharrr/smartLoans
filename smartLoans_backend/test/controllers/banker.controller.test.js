const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;

// Mocking ca-webutils injector
const injector = {
    getService: sinon.stub()
};

// Mock bankerService
const bankerServiceMock = {
    getAllLoans: sinon.stub(),
    approveLoan: sinon.stub(),
    rejectLoan: sinon.stub(),
    updateScores: sinon.stub()
};

injector.getService.withArgs('bankerService').returns(bankerServiceMock);

// Mocking require for injector
const proxyquire = require('proxyquire');
const bankerController = proxyquire('../../src/controllers/banker.controller', { 'ca-webutils': { injector } });

describe('Banker Controller', () => {
    beforeEach(() => {
        sinon.restore();
    });

    it('should get all loans', async () => {
        const mockLoans = [{ id: 1, amount: 5000 }, { id: 2, amount: 10000 }];
        bankerServiceMock.getAllLoans.resolves(mockLoans);

        const result = await bankerController().getAllLoans();
        expect(result).to.deep.equal(mockLoans);
        expect(bankerServiceMock.getAllLoans.calledOnce).to.be.true;
    });

    it('should approve a loan', async () => {
        const loanData = { loanId: 1, status: 'approved' };
        bankerServiceMock.approveLoan.resolves({ success: true });

        const result = await bankerController().approveLoan({ body: loanData });
        expect(result).to.deep.equal({ success: true });
        expect(bankerServiceMock.approveLoan.calledOnceWith(loanData)).to.be.true;
    });

    it('should reject a loan', async () => {
        const loanData = { loanId: 1, status: 'rejected' };
        bankerServiceMock.rejectLoan.resolves({ success: true });

        const result = await bankerController().rejectLoan({ body: loanData });
        expect(result).to.deep.equal({ success: true });
        expect(bankerServiceMock.rejectLoan.calledOnceWith(loanData)).to.be.true;
    });

    it('should update scores', async () => {
        const scoreData = { loanId: 1, newScore: 750 };
        bankerServiceMock.updateScores.resolves({ success: true });

        const result = await bankerController().updateScores({ body: scoreData });
        expect(result).to.deep.equal({ success: true });
        expect(bankerServiceMock.updateScores.calledOnceWith(scoreData)).to.be.true;
    });
});
