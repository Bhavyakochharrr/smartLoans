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

const modelMock = { constructor: { name: 'EMIModel' } };

const MongooseEMIRepository = proxyquire('../../src/repositories/mongoose/emi.repository', {
    'ca-webutils': { MongooseRepository: MongooseRepositoryMock }
});

describe('MongooseEMIRepository', () => {
    let consoleLogStub;

    beforeEach(() => {
        consoleLogStub = sinon.stub(console, 'log');
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should initialize and log model name', () => {
        const repository = new MongooseEMIRepository(modelMock);
        expect(repository).to.be.instanceOf(MongooseRepositoryMock);
        expect(repository.model).to.equal(modelMock);
        expect(consoleLogStub.calledOnceWith('model', 'EMIModel')).to.be.true;
    });

    it('should have _dependencies property set to ["emi"]', () => {
        expect(MongooseEMIRepository._dependencies).to.deep.equal(['emi']);
    });
});
