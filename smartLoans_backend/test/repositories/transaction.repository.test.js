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

const modelMock = { constructor: { name: 'TransactionModel' } };

const MongooseTransactionRepository = proxyquire('../../src/repositories/mongoose/transaction.repository', {
    'ca-webutils': { MongooseRepository: MongooseRepositoryMock }
});

describe('MongooseTransactionRepository', () => {
    let consoleLogStub;

    beforeEach(() => {
        consoleLogStub = sinon.stub(console, 'log');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should initialize and log model name', () => {
        const repository = new MongooseTransactionRepository(modelMock);
        expect(repository).to.be.instanceOf(MongooseRepositoryMock);
        expect(repository.model).to.equal(modelMock);
        expect(consoleLogStub.calledOnceWith('model', 'TransactionModel')).to.be.true;
    });

    it('should have _dependencies property set to ["transaction"]', () => {
        expect(MongooseTransactionRepository._dependencies).to.deep.equal(['transaction']);
    });
});
