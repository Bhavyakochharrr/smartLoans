const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;

// Mocking ca-webutils injector
const injector = {
    getService: sinon.stub()
};

// Mock emiService
const emiServiceMock = {
    processEMIPayment: sinon.stub(),
    getEMIHistory: sinon.stub()
};

injector.getService.withArgs('emiService').returns(emiServiceMock);

// Mocking require for injector
const proxyquire = require('proxyquire');
const emiController = proxyquire('../../src/controllers/emi.controller', { 'ca-webutils': { injector } });

describe('EMI Controller', () => {
    beforeEach(() => {
        sinon.restore();
    });

    it('should process EMI payment', async () => {
        const paymentData = { loanId: 1, amount: 5000 };
        emiServiceMock.processEMIPayment.resolves({ success: true });

        const result = await emiController().processEMIPayment({ body: paymentData });
        expect(result).to.deep.equal({ success: true });
        expect(emiServiceMock.processEMIPayment.calledOnceWith(paymentData)).to.be.true;
    });

    it('should get EMI history for a loan', async () => {
        const loanId = 1;
        const mockHistory = [{ emiId: 101, amount: 5000, status: 'paid' }];
        emiServiceMock.getEMIHistory.resolves(mockHistory);

        const result = await emiController().getEMIHistory({ loanId });
        expect(result).to.deep.equal(mockHistory);
        expect(emiServiceMock.getEMIHistory.calledOnceWith(loanId)).to.be.true;
    });
});
