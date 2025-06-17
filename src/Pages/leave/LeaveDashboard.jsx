import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/appContext';
import { DataGrid } from '@mui/x-data-grid';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './leaveDashboard.scss';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const LeaveDashboard = () => {
  const { userInfo } = useSelector(state => state.auth);
  const { socket } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('applications');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [notifications, setNotifications] = useState([]);
  
  // Form states
  const [leaveForm, setLeaveForm] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    isEmergency: false
  });

  // Mock data for now - replace with actual API calls
  const [applications, setApplications] = useState([]);
  const [balance, setBalance] = useState([]);
  const [policies, setPolicies] = useState([
    { leaveType: 'Annual Leave', annualAllocation: 21, minNoticeDays: 7 },
    { leaveType: 'Sick Leave', annualAllocation: 10, minNoticeDays: 0 },
    { leaveType: 'Personal Leave', annualAllocation: 5, minNoticeDays: 2 }
  ]);

  // Socket.io listeners
  useEffect(() => {
    if (socket) {
      socket.on('notification', (data) => {
        if (data.type === 'leave') {
          setNotifications(prev => [data, ...prev]);
          toast.info(data.message);
          // Refresh data
          fetchApplications();
          fetchBalance();
        }
      });

      return () => {
        socket.off('notification');
      };
    }
  }, [socket]);

  // Fetch functions
  const fetchApplications = async () => {
    // Replace with actual API call
    // const response = await fetch('/api/leave/applications');
    // setApplications(await response.json());
  };

  const fetchBalance = async () => {
    // Replace with actual API call
    // const response = await fetch('/api/leave/balance');
    // setBalance(await response.json());
  };

  // Calculate statistics
  const calculateStats = () => {
    const stats = {
      pending: 0,
      approved: 0,
      rejected: 0,
      totalDays: 0
    };
    
    applications.forEach(app => {
      if (app.status === 'Pending') stats.pending++;
      else if (['Approved', 'Auto-Approved'].includes(app.status)) {
        stats.approved++;
        stats.totalDays += app.numberOfDays;
      }
      else if (app.status === 'Rejected') stats.rejected++;
    });
    
    return stats;
  };

  const stats = calculateStats();

  // Handle form submission
  const handleApplyLeave = async (e) => {
    e.preventDefault();
    
    try {
      // API call to apply leave
      const response = await fetch('/api/leave/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leaveForm)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast.success(result.message);
        setShowApplyModal(false);
        setLeaveForm({
          leaveType: '',
          startDate: '',
          endDate: '',
          reason: '',
          isEmergency: false
        });
        fetchApplications();
        fetchBalance();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to apply leave');
    }
  };

  // Handle status update (for managers)
  const handleStatusUpdate = async (id, status, rejectionReason = '') => {
    try {
      const response = await fetch('/api/leave/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, rejectionReason })
      });
      
      if (response.ok) {
        toast.success(`Leave ${status.toLowerCase()} successfully`);
        fetchApplications();
        setShowDetailsModal(false);
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  // DataGrid columns
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'employee', headerName: 'Employee', width: 130 },
    { field: 'leaveType', headerName: 'Type', width: 130 },
    { field: 'startDate', headerName: 'Start Date', width: 110 },
    { field: 'endDate', headerName: 'End Date', width: 110 },
    { field: 'days', headerName: 'Days', width: 80 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <span className={`status-chip status-${params.value.toLowerCase()}`}>
          {params.value}
        </span>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <button
          className="btn-view-details"
          onClick={() => {
            setSelectedLeave(params.row.original);
            setShowDetailsModal(true);
          }}
        >
          View Details
        </button>
      )
    }
  ];

  const rows = applications.map((app, index) => ({
    id: index + 1,
    employee: app.appliedBy?.username || 'Unknown',
    leaveType: app.leaveType,
    startDate: new Date(app.startDate).toLocaleDateString(),
    endDate: new Date(app.endDate).toLocaleDateString(),
    days: app.numberOfDays,
    status: app.status,
    original: app
  }));

  return (
    <div className="leave-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Leave Management Dashboard</h1>
        <div className="header-actions">
          <div className="notification-badge">
            <span className="badge-count">{notifications.length}</span>
            <i className="fas fa-bell"></i>
          </div>
          <button className="btn-primary" onClick={() => setShowApplyModal(true)}>
            <i className="fas fa-calendar-plus"></i> Apply Leave
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <div className="stat-content">
            <h3>Total Leave Days</h3>
            <p>{balance.reduce((sum, b) => sum + b.totalAllocation, 0)}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon success">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>Used Days</h3>
            <p>{balance.reduce((sum, b) => sum + b.used, 0)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>Pending</h3>
            <p>{stats.pending}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon info">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <h3>Available Days</h3>
            <p>{balance.reduce((sum, b) => sum + b.available, 0)}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            My Applications
          </button>
          <button 
            className={`tab ${activeTab === 'balance' ? 'active' : ''}`}
            onClick={() => setActiveTab('balance')}
          >
            Leave Balance
          </button>
          {userInfo.department === 'Management' && (
            <>
              <button 
                className={`tab ${activeTab === 'team' ? 'active' : ''}`}
                onClick={() => setActiveTab('team')}
              >
                Team Overview
              </button>
              <button 
                className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'applications' && (
          <div className="applications-section">
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              disableSelectionOnClick
              autoHeight
            />
          </div>
        )}

        {activeTab === 'balance' && (
          <div className="balance-grid">
            {balance.map((b, index) => (
              <div key={index} className="balance-card">
                <h3>{b.leaveType}</h3>
                <div className="balance-details">
                  <div className="progress-section">
                    <div className="progress-info">
                      <span>Used: {b.used} / {b.totalAllocation} days</span>
                      <span>{Math.round((b.used / b.totalAllocation) * 100)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${(b.used / b.totalAllocation) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="balance-stats">
                    <div>
                      <span className="label">Available:</span>
                      <span className="value">{b.available} days</span>
                    </div>
                    <div>
                      <span className="label">Pending:</span>
                      <span className="value">{b.pending} days</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'team' && userInfo.department === 'Management' && (
          <div className="team-section">
            <h2>Pending Approvals</h2>
            <DataGrid
              rows={rows.filter(r => r.status === 'Pending')}
              columns={columns}
              pageSize={10}
              autoHeight
            />
          </div>
        )}

        {activeTab === 'analytics' && userInfo.department === 'Management' && (
          <div className="analytics-section">
            <div className="charts-grid">
              <div className="chart-container">
                <h3>Leave Type Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Annual Leave', value: 40 },
                        { name: 'Sick Leave', value: 30 },
                        { name: 'Personal Leave', value: 20 },
                        { name: 'Other', value: 10 }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[0, 1, 2, 3].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="report-summary">
                <h3>Monthly Summary</h3>
                <div className="summary-stats">
                  <div className="summary-item">
                    <span className="label">Total Applications:</span>
                    <span className="value">{applications.length}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Approved:</span>
                    <span className="value">{stats.approved}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Rejected:</span>
                    <span className="value">{stats.rejected}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Average Days:</span>
                    <span className="value">
                      {stats.approved > 0 ? (stats.totalDays / stats.approved).toFixed(1) : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Apply for Leave</h2>
              <button className="modal-close" onClick={() => setShowApplyModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleApplyLeave} className="leave-form">
              <div className="form-group">
                <label>Leave Type</label>
                <select
                  value={leaveForm.leaveType}
                  onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                  required
                >
                  <option value="">Select Leave Type</option>
                  {policies.map((policy) => (
                    <option key={policy.leaveType} value={policy.leaveType}>
                      {policy.leaveType}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Reason</label>
                <textarea
                  rows="3"
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={leaveForm.isEmergency}
                    onChange={(e) => setLeaveForm({ ...leaveForm, isEmergency: e.target.checked })}
                  />
                  Emergency Leave
                </label>
              </div>
              
              {leaveForm.leaveType && (
                <div className="alert alert-info">
                  <i className="fas fa-info-circle"></i>
                  Available balance: {
                    balance.find(b => b.leaveType === leaveForm.leaveType)?.available || 0
                  } days
                </div>
              )}
              
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowApplyModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave Details Modal */}
      {showDetailsModal && selectedLeave && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal modal-large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Leave Application Details</h2>
              <button className="modal-close" onClick={() => setShowDetailsModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="details-grid">
                <div className="detail-item">
                  <label>Employee</label>
                  <p>{selectedLeave.appliedBy?.username}</p>
                </div>
                <div className="detail-item">
                  <label>Leave Type</label>
                  <p>{selectedLeave.leaveType}</p>
                </div>
                <div className="detail-item">
                  <label>Duration</label>
                  <p>
                    {new Date(selectedLeave.startDate).toLocaleDateString()} - 
                    {new Date(selectedLeave.endDate).toLocaleDateString()}
                    ({selectedLeave.numberOfDays} days)
                  </p>
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  <p>
                    <span className={`status-chip status-${selectedLeave.status.toLowerCase()}`}>
                      {selectedLeave.status}
                    </span>
                  </p>
                </div>
                <div className="detail-item full-width">
                  <label>Reason</label>
                  <p>{selectedLeave.reason}</p>
                </div>
              </div>
              
              {userInfo.department === 'Management' && selectedLeave.status === 'Pending' && (
                <div className="action-buttons">
                  <button
                    className="btn-success"
                    onClick={() => handleStatusUpdate(selectedLeave._id, 'Approved')}
                  >
                    <i className="fas fa-check"></i> Approve
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => {
                      const reason = prompt('Rejection reason:');
                      if (reason) handleStatusUpdate(selectedLeave._id, 'Rejected', reason);
                    }}
                  >
                    <i className="fas fa-times"></i> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveDashboard;