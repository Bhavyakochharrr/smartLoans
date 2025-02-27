const { expect } = require("chai");
const EMIService = require("../../src/services/emi.service");
const { NotFoundError, ValidationError } = require("ca-webutils/errors");

describe("EMIService", () => {
    let emiService, loanRepository, emiRepository, transactionRepository;

    beforeEach(() => {
        loanRepository = {
            findOne: async () => null,
            save: async () => { },
        };
        emiRepository = {
            create: async () => ({ _id: "emi123" }),
            findAll: async () => [],
        };
        transactionRepository = {
            create: async () => ({ _id: "txn123", amount: 5000 }),
            findAll: async () => [],
        };

        emiService = new EMIService(loanRepository, emiRepository, transactionRepository);
    });

    describe("processEMIPayment", () => {
        it("should throw NotFoundError if loan does not exist", async () => {
            try {
                await emiService.processEMIPayment({ loanId: "123", amount: 5000 });
            } catch (err) {
                expect(err).to.be.instanceOf(NotFoundError);
                expect(err.message).to.equal("Loan 123 does not exist");
            }
        });

        it("should throw ValidationError if loan is already completed", async () => {
            loanRepository.findOne = async () => ({ loanId: "123", status: "Completed" });
            try {
                await emiService.processEMIPayment({ loanId: "123", amount: 5000 });
            } catch (err) {
                expect(err).to.be.instanceOf(ValidationError);
                expect(err.message).to.equal("Loan 123 is already completed");
            }
        });

        it("should throw ValidationError for invalid loan details", async () => {
            loanRepository.findOne = async () => ({
                loanId: "123", status: "Approved", remainingPrincipal: null
            });
            try {
                await emiService.processEMIPayment({ loanId: "123", amount: 5000 });
            } catch (err) {
                expect(err).to.be.instanceOf(ValidationError);
                expect(err.message).to.equal("Invalid loan details");
            }
        });
    });

    describe("getEMIHistory", () => {
        it("should throw NotFoundError if loan does not exist", async () => {
            try {
                await emiService.getEMIHistory("123");
            } catch (err) {
                expect(err).to.be.instanceOf(NotFoundError);
                expect(err.message).to.equal("Loan 123 does not exist");
            }
        });
        it("should return a pending EMI entry if no payments are made", async () => {
            loanRepository.findOne = async () => ({
                loanId: "123",
                status: "Approved",
                paidEmis: 0,
                emiAmount: 5000,
                remainingPrincipal: 100000,
                interestRate: 10,
                nextEmiDate: new Date(),
            });
        
            const emiHistory = await emiService.getEMIHistory("123");
        
            expect(emiHistory).to.be.an("array").with.lengthOf(1);
            expect(emiHistory[0]).to.include({ status: "Pending", canPay: true });
        });
        
    });
});
