const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const proxyquire = require('proxyquire');
const { NotFoundError, ValidationError } = require("ca-webutils/errors");

const loanRepositoryMock = {
    findAll: sinon.stub(),
    findOne: sinon.stub(),
};

const emiRepositoryMock = {
    create: sinon.stub(),
};

const axiosMock = {
    get: sinon.stub(),
};

const BankerService = proxyquire('../../src/services/banker.service', {
    'axios': axiosMock,
});

describe('BankerService', () => {
    let bankerService;
    
    beforeEach(() => {
        bankerService = new BankerService(loanRepositoryMock, emiRepositoryMock);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should fetch all loans', async () => {
        const mockLoans = [{ id: 1, amount: 1000 }, { id: 2, amount: 2000 }];
        loanRepositoryMock.findAll.resolves(mockLoans);

        const loans = await bankerService.getAllLoans();
        expect(loans).to.deep.equal(mockLoans);
    });

    it('should throw NotFoundError if loan does not exist when approving', async () => {
        loanRepositoryMock.findOne.resolves(null);
        
        try {
            await bankerService.approveLoan({ loanId: 123, remarks: 'Approved' });
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError);
        }
    });

    it('should throw ValidationError if loan is already processed when rejecting', async () => {
        loanRepositoryMock.findOne.resolves({ status: 'Approved' });
        
        try {
            await bankerService.rejectLoan({ loanId: 123, remarks: 'Rejected' });
        } catch (error) {
            expect(error).to.be.instanceOf(ValidationError);
        }
    });

    it('should fetch CIBIL score', async () => {
        axiosMock.get.resolves({ data: { cibil_score: 750 } });
        const score = await bankerService.getCibil('PAN123');
        expect(score).to.equal(750);
    });

    it('should fetch ITR value', async () => {
        axiosMock.get.resolves({ data: { annualIncome: 500000 } });
        const itr = await bankerService.getItr('PAN123');
        expect(itr).to.equal(500000);
    });
});
