const chai = require("chai");
const sinon = require("sinon");
const LoanService = require("../../src/services/loan.service");

const { expect } = chai;

describe("LoanService", function () {
    let loanRepositoryMock;
    let loanService;

    beforeEach(() => {
        loanRepositoryMock = {
            create: sinon.stub().resolves({
                loanId: "LN123456789",
                status: "Pending",
                suretyDetails: {
                    guarantorName: "John Smith",
                    guarantorIncome: 60000,
                    relationship: "Brother"
                } // ✅ Ensure this is included in the mock response
            })
        };
        loanService = new LoanService(loanRepositoryMock);
    });
    

    it("should create a loan successfully", async function () {
        const loanData = {
            customerName: "John Doe",
            phoneNumber: "9876543210",
            email: "john@example.com",
            panNumber: "ABCDE1234F",
            aadharNumber: "123456789012",
            loanAmount: 50000,
            interestRate: 5,
            loanDuration: 12,
            loanType: "Personal Loan",
            employmentType: "Govt", // Ensure this is "Govt" or add valid guarantor details
            accountNumber: "1234567890",
            remainingEmi: 12,
            paymentDate: "2025-03-10",
            purpose: "Medical expenses"
        };

        const response = await loanService.applyLoan(loanData, []);

        expect(response).to.have.property("message", "Loan application successful");
        expect(response.loan).to.have.property("loanId").that.includes("LN");
    });

    it("should require guarantor details for non-government employees", async function () {
        const loanData = {
            customerName: "Jane Doe",
            phoneNumber: "9876543210",
            email: "jane@example.com",
            panNumber: "ABCDE1234F",
            aadharNumber: "123456789012",
            loanAmount: 50000,
            interestRate: 5,
            loanDuration: 12,
            loanType: "Personal Loan",
            employmentType: "Private", // This will trigger the guarantor requirement
            accountNumber: "1234567890",
            remainingEmi: 12,
            paymentDate: "2025-03-10",
            purpose: "Education"
        };

        try {
            await loanService.applyLoan(loanData, []);
            throw new Error("Expected ValidationError but none was thrown");
        } catch (error) {
            expect(error.message).to.equal("Guarantor details required for non-government employees");
        }
    });

    it("should create a loan with a guarantor for private employees", async function () {
        const loanData = {
            customerName: "Jane Doe",
            phoneNumber: "9876543210",
            email: "jane@example.com",
            panNumber: "ABCDE1234F",
            aadharNumber: "123456789012",
            loanAmount: 50000,
            interestRate: 5,
            loanDuration: 12,
            loanType: "Personal Loan",
            employmentType: "Private", // Non-government, so guarantor is required
            guarantorName: "John Smith",
            guarantorIncome: 60000,
            relationship: "Brother",
            accountNumber: "1234567890",
            remainingEmi: 12,
            paymentDate: "2025-03-10",
            purpose: "Education"
        };

        const response = await loanService.applyLoan(loanData, []);

        expect(response).to.have.property("message", "Loan application successful");
        expect(response.loan).to.have.property("suretyDetails").that.is.an("object");
        expect(response.loan.suretyDetails).to.include({
            guarantorName: "John Smith",
            guarantorIncome: 60000,
            relationship: "Brother"
        });
    });
});
