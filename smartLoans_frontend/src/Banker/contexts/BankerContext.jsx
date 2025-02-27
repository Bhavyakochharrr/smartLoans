import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const BankerContext = createContext();

export const BankerProvider = ({ children, token }) => {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [documentsVerified, setDocumentsVerified] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [isButtonsDisabled, setIsButtonsDisabled] = useState(true);
  const [documentSelected, setDocumentSelected] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedDocType, setSelectedDocType] = useState(null);

  useEffect(() => {
    if (selectedLoan) {
      setDocumentsVerified(selectedLoan.documentVerification || false);
      setRemarks(selectedLoan.remarks || "");
    }
  }, [selectedLoan]);

  useEffect(() => {
    setIsButtonsDisabled(!(documentsVerified && remarks.trim() !== ""));
  }, [documentsVerified, remarks]);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await axios.get("http://localhost:2000/api/banker/loans", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoans(response.data);
    } catch (error) {
      console.error("Error fetching loans:", error.response?.data || error.message);
    }
  };

  const handleViewDetails = async (loan) => {
    if (!loan?.loanId || !loan?.panNumber) {
      console.error("Invalid loan data", loan);
      return;
    }

    try {
      const response = await axios.patch(
        "http://localhost:2000/api/banker/scores",
        {
          loanId: loan.loanId,
          panNumber: loan.panNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const updatedLoan = response.data;
      setDocumentSelected(true);
      setSelectedLoan(updatedLoan);
      setRemarks(updatedLoan.remarks || "");
      setShowModal(true);
    } catch (error) {
      console.error(
        "Error updating loan scores:",
        error.response?.data || error.message
      );
    }
  };

  const handleStatusChange = async (loanId, status, remarks) => {
    try {
      await axios.patch(
        `http://localhost:2000/api/banker/${status}`,
        { loanId, remarks },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchLoans();
      setShowModal(false);
    } catch (error) {
      console.error("Error updating loan status:", error.response?.data || error.message);
    }
  };

  const handleViewDocument = (base64Data, filename) => {
    setSelectedDocument(base64Data);
    setSelectedDocType(filename);
    setShowViewer(true);
  };

  const handleDocumentVerification = () => {
    setDocumentsVerified(!documentsVerified);
  };

  const handleRemarksChange = (e) => {
    setRemarks(e.target.value);
  };

  const handleDownload = (base64Data, filename) => {
    try {
      const base64WithoutPrefix = base64Data.split(",")[1] || base64Data;
      const byteCharacters = atob(base64WithoutPrefix);
      const byteNumbers = new Uint8Array(
        [...byteCharacters].map((char) => char.charCodeAt(0))
      );
      const blob = new Blob([byteNumbers]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <BankerContext.Provider
      value={{
        loans,
        selectedLoan,
        showModal,
        documentsVerified,
        remarks,
        isButtonsDisabled,
        documentSelected,
        showViewer,
        selectedDocument,
        selectedDocType,
        setShowModal,
        setDocumentsVerified,
        setRemarks,
        setShowViewer,
        setSelectedDocument,
        setSelectedDocType,
        handleViewDetails,
        handleStatusChange,
        handleViewDocument,
        handleDocumentVerification,
        handleRemarksChange,
        handleDownload,
        fetchLoans,
      }}
    >
      {children}
    </BankerContext.Provider>
  );
};
