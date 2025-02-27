import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Home/contexts/AuthContext";
 
const ApplicationStatus = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
 
  useEffect(() => {
    const fetchLoanApplications = async () => {
      try {
        console.log("accountNumber", user.accountNumber);
        const response = await axios.get("http://localhost:2000/api/loan", {
          params: {
            accountNumber: user?.accountNumber,
          },
        });
        console.log("response", response.data);
        setApplications(response.data.loans);
      } catch (err) {
        setError("Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };
 
    fetchLoanApplications();
  }, [user]);
 
  return (
    <div>
      <h2>Loan Application Status</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !error && applications.length === 0 && (
        <p>No loan applications found.</p>
      )}
 
      {!loading && !error && applications.length > 0 && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Loan Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Submitted on</th>
              <th>Approved on</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id}>
                <td>{app.loanType}</td>
                <td>${app.loanAmount}</td>
                <td>
                  <span
                    className={`badge ${
                      app.status.toLowerCase() === "approved"
                        ? "bg-success"
                        : app.status.toLowerCase() === "pending"
                        ? "bg-warning"
                        : "bg-danger"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td>
                  {/* Show submittedOn date */}
                  {app.submittedOn
                    ? new Date(app.submittedOn).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>
                  {/* Show submittedOn date */}
                  {app.approvedOn
                    ? new Date(app.approvedOn).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
 
export default ApplicationStatus;