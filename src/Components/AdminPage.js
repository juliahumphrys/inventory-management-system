import React, { useState } from 'react';
import axios from 'axios';
import './AdminPage.css';

const AdminPage = () => {
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showReportForm, setShowReportForm] = useState(false);
  const [reportOptions, setReportOptions] = useState({
    includeTheaterStatus: false,
    includeAdvancedInfo: false,
    includeHistoricalInfo: false,
  });

  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [deleteItemNumber, setDeleteItemNumber] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');

  // Toggle the admin form display
  const toggleAdminForm = () => {
    setShowAdminForm(!showAdminForm);
    setSuccessMessage('');
    setError('');
  };

  // Toggle the inventory report form display
  const toggleReportForm = () => {
    setShowReportForm(!showReportForm);
  };

  // Toggle the delete item form display
  const toggleDeleteForm = () => {
    setShowDeleteForm(!showDeleteForm);
    setDeleteError('');
    setDeleteSuccess('');
  };

  const handleAdminInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin({ ...newAdmin, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setReportOptions({ ...reportOptions, [name]: checked });
  };

  // Function to save new admin
  const handleSaveAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setError('');

    if (!newAdmin.username || !newAdmin.password) {
      setError('Both username and password are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/admins', newAdmin);

      if (response.status === 200) {
        setSuccessMessage('Successfully saved new Admin user');
        setNewAdmin({ username: '', password: '' });
      } else {
        setError('Failed to add new admin user');
      }
    } catch (err) {
      setError('Error occurred while adding admin. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      const response = await axios.post('/generate-inventory-report', reportOptions, {
        responseType: 'blob', // Ensures file download
      });
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'inventory_report.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const handleDeleteItem = async (e) => {
    e.preventDefault();
    setDeleteError('');
    setDeleteSuccess('');

    if (!deleteItemNumber) {
      setDeleteError('Item number is required.');
      return;
    }

    try {
      const response = await axios.delete(`/items/${deleteItemNumber}/delete`);
      if (response.status === 200) {
        setDeleteSuccess('Item deleted successfully.');
        setDeleteItemNumber('');
      } else {
        setDeleteError('Failed to delete item. Please try again.');
      }
    } catch (err) {
      setDeleteError('Error occurred while deleting the item. Please try again.');
    }
  };

  return (
    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Add New Admin Section */}
      <button onClick={toggleAdminForm} style={{ margin: '10px 0', padding: '10px' }}>
        Add New Admin
      </button>
      {showAdminForm && (
        <form onSubmit={handleSaveAdmin} style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '400px', width: '100%' }}>
          <label style={{ width: '100%', textAlign: 'left', marginBottom: '10px' }}>
            Enter New Admin Username:
            <input
              type="text"
              name="username"
              placeholder="Enter New Admin Username"
              value={newAdmin.username}
              onChange={handleAdminInputChange}
              required
              style={{ marginTop: '5px', width: '100%' }}
            />
          </label>
          <label style={{ width: '100%', textAlign: 'left', marginBottom: '10px' }}>
            Enter New User Password:
            <input
              type="password"
              name="password"
              placeholder="Enter New User Password"
              value={newAdmin.password}
              onChange={handleAdminInputChange}
              required
              style={{ marginTop: '5px', width: '100%' }}
            />
          </label>
          <button type="submit" disabled={loading} style={{ padding: '10px', marginTop: '10px' }}>
            {loading ? 'Saving...' : 'Save Admin'}
          </button>
        </form>
      )}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Run Inventory Report Section */}
      <button onClick={toggleReportForm} style={{ margin: '10px 0', padding: '10px' }}>
        Run Inventory Report
      </button>
      {showReportForm && (
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3>Customize Inventory Report</h3>
          <label>
            <input
              type="checkbox"
              name="includeTheaterStatus"
              checked={reportOptions.includeTheaterStatus}
              onChange={handleCheckboxChange}
            />
            Include Items Rented Out to Other Theaters
          </label>
          <label>
            <input
              type="checkbox"
              name="includeAdvancedInfo"
              checked={reportOptions.includeAdvancedInfo}
              onChange={handleCheckboxChange}
            />
            Include Advanced Item Info
          </label>
          <label>
            <input
              type="checkbox"
              name="includeHistoricalInfo"
              checked={reportOptions.includeHistoricalInfo}
              onChange={handleCheckboxChange}
            />
            Include Historical Item Info
          </label>
          <button onClick={handleGenerateReport} style={{ marginTop: '10px', padding: '10px' }}>
            Generate Inventory Report
          </button>
        </div>
      )}

      {/* Delete Item Section */}
      <button onClick={toggleDeleteForm} style={{ margin: '10px 0', padding: '10px' }}>
        Delete Item
      </button>
      {showDeleteForm && (
        <form onSubmit={handleDeleteItem} style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '400px', width: '100%' }}>
          <label style={{ width: '100%', textAlign: 'left', marginBottom: '10px' }}>
            Enter Item Number:
            <input
              type="text"
              name="deleteItemNumber"
              placeholder="Enter Item Number"
              value={deleteItemNumber}
              onChange={(e) => setDeleteItemNumber(e.target.value)}
              required
              style={{ marginTop: '5px', width: '100%' }}
            />
          </label>
          <button type="submit" style={{ padding: '10px', marginTop: '10px' }}>
            Confirm Delete Item
          </button>
        </form>
      )}
      {deleteError && <p style={{ color: 'red', marginTop: '10px' }}>{deleteError}</p>}
      {deleteSuccess && <p style={{ color: 'green', marginTop: '10px' }}>{deleteSuccess}</p>}
    </div>
  );
};


export default AdminPage;
