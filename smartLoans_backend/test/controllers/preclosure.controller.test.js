const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;

// Mocking ca-webutils injector
const injector = {
    getService: sinon.stub()
};

// Mock preclosureService
const preclosureServiceMock = {
    getPreclosureDetails: sinon.stub(),
    processPreclosurePayment: sinon.stub()
};

injector.getService.withArgs('preclosureService').returns(preclosureServiceMock);

// Mocking require for injector
const proxyquire = require('proxyquire');
const preclosureController = proxyquire('../../src/controllers/preclosure.controller', { 'ca-webutils': { injector } });

describe('Preclosure Controller', () => {
    beforeEach(() => {
        sinon.restore();
    });

    it('should get preclosure details', async () => {
        const loanId = 1;
        const mockDetails = { loanId: 1, amountDue: 10000, status: 'pending' };
        preclosureServiceMock.getPreclosureDetails.resolves(mockDetails);

        const result = await preclosureController().getPreclosureDetails({ loanId });
        expect(result).to.deep.equal(mockDetails);
        expect(preclosureServiceMock.getPreclosureDetails.calledOnceWith(loanId)).to.be.true;
    });

    it('should process preclosure payment', async () => {
        const loanId = 1;
        const paymentData = { amount: 10000 };
        preclosureServiceMock.processPreclosurePayment.resolves({ success: true });

        const result = await preclosureController().processPreclosurePayment({ loanId, body: paymentData });
        expect(result).to.deep.equal({ success: true });
        expect(preclosureServiceMock.processPreclosurePayment.calledOnceWith(loanId, paymentData)).to.be.true;
    });
});
