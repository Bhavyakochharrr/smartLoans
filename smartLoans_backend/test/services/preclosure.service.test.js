const { expect } = require("chai");
const sinon = require("sinon");
const PreclosureService = require("../../src/services/preclosure.service");
const { NotFoundError } = require("ca-webutils/errors");

describe("PreclosureService", function () {
  let loanRepository, transactionRepository, preclosureService;

  beforeEach(() => {
    loanRepository = {
      findOne: sinon.stub(),
    };
    transactionRepository = {
      create: sinon.stub(),
    };
    preclosureService = new PreclosureService(loanRepository, transactionRepository);
  });

  describe("getPreclosureDetails", function () {
    it("should throw NotFoundError if loan does not exist", async function () {
      loanRepository.findOne.resolves(null);

      try {
        await preclosureService.getPreclosureDetails("123");
        throw new Error("Expected error was not thrown");
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundError);
        expect(error.message).to.equal("Loan 123 does not exist");
      }
    });

    it("should return correct preclosure details", async function () {
      const mockLoan = {
        loanId: "123",
        remainingPrincipal: 5000,
        interestAmount: 1000,
        interestRate: 10,
        nextEmiDate: "2025-03-01",
      };
      loanRepository.findOne.resolves(mockLoan);

      const result = await preclosureService.getPreclosureDetails("123");
      expect(result).to.deep.equal({
        outstandingAmount: 5000,
        amount: 5000,
        interestSavings: 500,
        dueDate: "2025-03-01",
      });
    });
  });

  describe("processPreclosurePayment", function () {
    it("should throw NotFoundError if loan does not exist", async function () {
      loanRepository.findOne.resolves(null);

      try {
        await preclosureService.processPreclosurePayment("123", { amount: 5000, paymentMethod: "UPI", paymentDetails: "test123" });
        throw new Error("Expected error was not thrown");
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundError);
        expect(error.message).to.equal("Loan 123 does not exist");
      }
    });

    it("should process preclosure payment successfully", async function () {
      const mockLoan = {
        loanId: "123",
        remainingPrincipal: 5000,
        status: "Active",
      };
      loanRepository.findOne.resolves(mockLoan);
      transactionRepository.create.resolves({ _id: "txn_123" });

      const result = await preclosureService.processPreclosurePayment("123", {
        amount: 5000,
        paymentMethod: "UPI",
        paymentDetails: "test123",
      });

      expect(result).to.deep.include({ success: true, message: "Preclosure completed successfully" });
      expect(result.transactionDetails).to.include({
        paymentMethod: "UPI",
        totalPaid: 5000,
      });
      expect(result.loanStatus).to.include({ status: "Completed", preclosureAmount: 5000 });
    });
  });
});
