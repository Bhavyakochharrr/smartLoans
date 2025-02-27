const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const proxyquire = require('proxyquire');

// Mocking MongooseRepository from ca-webutils
class MongooseRepositoryMock {
    constructor(model) {
        this.model = model;
    }
}

const modelMock = { constructor: { name: 'LoanModel' } };

const MongooseLoanRepository = proxyquire('../../src/repositories/mongoose/loan.repository', {
    'ca-webutils': { MongooseRepository: MongooseRepositoryMock }
});

describe('MongooseLoanRepository', () => {
    let consoleLogStub;

    beforeEach(() => {
        consoleLogStub = sinon.stub(console, 'log');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should initialize and log model name', () => {
        const repository = new MongooseLoanRepository(modelMock);
        expect(repository).to.be.instanceOf(MongooseRepositoryMock);
        expect(repository.model).to.equal(modelMock);
        expect(consoleLogStub.calledOnceWith('model', 'LoanModel')).to.be.true;
    });

    it('should have _dependencies property set to ["loan"]', () => {
        expect(MongooseLoanRepository._dependencies).to.deep.equal(['loan']);
    });
});