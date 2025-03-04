import axios from "axios";

export const fetchLoanDetailsService = async (accountNumber) => {
  try {
    const response = await axios.get("http://localhost:2000/api/loan", {
      params: { accountNumber }
    });

    console.log("Loan details:", response.data);

    if (!response.data || !response.data.loans) {
      return { totalLoans: 0, typeOfLastLoan: null };
    }

    // **Step 1: Filter loans with status "Approved" or "Pending"**
    const filteredLoans = response.data.loans.filter(
      (loan) => loan.status.toLowerCase() === "approved" || loan.status.toLowerCase() === "pending"
    );

    // **Step 2: Check the count condition**
    if (filteredLoans.length < 2) {
      // **Step 3: Get the last loan's type**
      const lastLoanType = filteredLoans.length > 0 ? filteredLoans[filteredLoans.length - 1].loanType : null;

      return {
        totalLoans: filteredLoans.length,
        typeOfLastLoan: lastLoanType
      };
    }

    return { totalLoans: filteredLoans.length, typeOfLastLoan: null };

  } catch (error) {
    console.error("Error fetching loan details", error);
    return { totalLoans: 0, typeOfLastLoan: null };
  }
};
