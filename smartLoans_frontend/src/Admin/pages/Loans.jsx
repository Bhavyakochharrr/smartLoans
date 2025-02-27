import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Container, Row, Col, Card } from "react-bootstrap";
import { getLoans } from "../services/authService";

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedDocName, setSelectedDocName] = useState("");
  const [selectedDocMimeType, setSelectedDocMimeType] = useState("");
  const [showViewer, setShowViewer] = useState(false);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const data = await getLoans();
        setLoans(data);
      } catch (err) {
        setError("Error fetching loans");
      }
    };

    fetchLoans();
  }, []);

  const handleViewLoan = (loan) => {
    setSelectedLoan(loan);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLoan(null);
  };
  
  const handleCloseDocumentViewer = () => {
    setShowViewer(false);
    setSelectedDocument(null);
    setSelectedDocName("");
    setSelectedDocMimeType("");
  };
  
  // Updated document viewing function
  const handleViewDocument = (base64Data, filename, mimetype) => {
    try {
      // Ensure the base64 data has the correct prefix
      let formattedData = base64Data;
      
      // If the data doesn't have a data URL prefix, add it
      if (!base64Data.startsWith('data:')) {
        const mimeType = mimetype || getMimeType(filename);
        formattedData = `data:${mimeType};base64,${base64Data.split(',')[1] || base64Data}`;
      }
      
      setSelectedDocument(formattedData);
      setSelectedDocName(filename);
      setSelectedDocMimeType(mimetype || getMimeType(filename));
      setShowViewer(true);
    } catch (error) {
      console.error("Error viewing document:", error);
      alert("Error viewing document. Please try downloading instead.");
    }
  };
  
  const handleDownload = (base64Data, filename) => {
    try {
      let formattedData = base64Data;
      
      // If the data already has a data URL prefix, extract the base64 part
      if (base64Data.includes('base64,')) {
        formattedData = base64Data.split('base64,')[1];
      }
      
      const byteCharacters = atob(formattedData);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: getMimeType(filename) });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Error downloading file. Please try again.");
    }
  };

  // Function to determine MIME type based on file extension
  const getMimeType = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    
    const mimeTypes = {
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'txt': 'text/plain'
    };
    
    return mimeTypes[extension] || 'application/octet-stream';
  };

  return (
    <Container fluid>
      <h1 className="my-4">Loan Management</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center p-3">
            <h5>Total Loans</h5>
            <h3 style={{ color: "#41B3A2" }}>{loans.length}</h3>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center p-3">
            <h5>Loans Approved</h5>
            <h3 style={{ color: "#28a745" }}>{loans.filter(l => l.status === "Approved").length}</h3>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center p-3">
            <h5>Loans Rejected</h5>
            <h3 style={{ color: "#dc3545" }}>{loans.filter(l => l.status === "Rejected").length}</h3>
          </Card>
        </Col>
      </Row>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Loan Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan._id}>
              <td>{loan.customerName}</td>
              <td>₹ {loan.loanAmount}</td>
              <td>
                <span className={`badge bg-${loan.status === "Pending" ? "warning" : loan.status === "Approved" ? "success" : "danger"}`}>
                  {loan.status}
                </span>
              </td>
              <td>
                <Button variant="primary" size="sm" onClick={() => handleViewLoan(loan)} style={{ backgroundColor: '#41B3A2', borderColor: '#41B3A2' }}>Review Application</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Loan Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Loan Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLoan && (
            <Card>
              <Card.Body>
                <div className="mb-6">
                  <h5 className="text-primary mb-3">Customer Information</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Name:</strong> {selectedLoan.customerName}</p>
                      <p><strong>Email:</strong> {selectedLoan.email}</p>
                      <p><strong>Phone:</strong> {selectedLoan.phoneNumber || 'N/A'}</p>
                      <p><strong>ITR Value:</strong> {selectedLoan.itrValue || 'N/A'}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Account Number:</strong> {selectedLoan.accountNumber || 'N/A'}</p>
                      <p><strong>PAN Number:</strong> {selectedLoan.pannumber || 'N/A'}</p>
                      <p><strong>CIBIL Score:</strong> {selectedLoan.cibilScore || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="text-primary mb-3">Loan Information</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Loan Amount:</strong> ₹{selectedLoan.loanAmount}</p>
                      <p><strong>Status:</strong> {selectedLoan.status|| 'N/A'}</p>
                      <p><strong>Interest Rate:</strong> {selectedLoan.interestRate}%</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Loan Term:</strong> {selectedLoan.loanDuration} years</p>
                      <p><strong>Monthly Payment:</strong> {selectedLoan.emi_loan}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="text-primary mb-3">Documents:</h5>
                  <div className="d-flex flex-wrap gap-3">
                    {selectedLoan.documents && selectedLoan.documents.length > 0 ? (
                      selectedLoan.documents.map((doc, index) => (
                        <div key={index} className="border rounded p-2 mb-2">
                          <div className="mb-2">{doc.filename}</div>
                          <div className="d-flex gap-2">
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              onClick={() => handleViewDocument(doc.data, doc.filename, doc.mimetype)}
                            >
                              View
                            </Button>
                            <Button 
                              variant="outline-secondary" 
                              size="sm" 
                              onClick={() => handleDownload(doc.data, doc.filename)}
                            >
                              Download
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No documents available</p>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Document Viewer Modal */}
      <Modal 
        show={showViewer} 
        onHide={handleCloseDocumentViewer} 
        centered 
        size="lg" 
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title>Document: {selectedDocName}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {selectedDocument && (
            <div style={{ height: '75vh', overflow: 'auto' }}>
              {selectedDocMimeType.startsWith('image/') ? (
                <div className="text-center p-3">
                  <img 
                    src={selectedDocument} 
                    alt={selectedDocName} 
                    style={{ maxWidth: '100%' }} 
                  />
                </div>
              ) : selectedDocMimeType === 'application/pdf' ? (
                <object
                  data={selectedDocument}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                  className="d-block m-0"
                >
                  <div className="p-4 text-center">
                    <p>Your browser doesn't support PDF preview.</p>
                    <Button 
                      variant="primary" 
                      onClick={() => window.open(selectedDocument, '_blank')}
                    >
                      Open PDF in New Tab
                    </Button>
                  </div>
                </object>
              ) : (
                <div className="p-4 text-center">
                  <p>This file type cannot be previewed in the browser.</p>
                  <Button 
                    variant="primary" 
                    onClick={() => handleDownload(selectedDocument, selectedDocName)}
                  >
                    Download File
                  </Button>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="primary" 
            onClick={() => handleDownload(selectedDocument, selectedDocName)}
          >
            Download
          </Button>
          <Button variant="secondary" onClick={handleCloseDocumentViewer}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Loans;