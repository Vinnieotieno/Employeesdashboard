import React, { useState, useEffect } from 'react';
import { useGetPaymentsQuery, useDownloadExcelMutation, useDownloadPDFMutation } from '../../state/paymentsApiSlice';
import DataTable from 'react-data-table-component';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './paymentReport.scss';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PaymentReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { data: payments = [], refetch, error } = useGetPaymentsQuery({ startDate, endDate });
  // Removed unused variables to fix the warning
  const [activeTab, setActiveTab] = useState('table');

  useEffect(() => {
    refetch();
  }, [startDate, endDate, refetch]);

  useEffect(() => {
    if (error) {
      console.error('Error fetching payments:', error);
      alert('Failed to fetch payments. Please check the API endpoint.');
    }
  }, [error]);

  // Define DataTable columns
  const columns = [
    {
      name: 'Driver Name',
      selector: row => row.driverName,
      sortable: true,
    },
    {
      name: 'Trips',
      selector: row => row.tripCount,
      sortable: true,
    },
    {
      name: 'Payment (KES)',
      selector: row => row.payment,
      sortable: true,
      cell: row => `KES ${row.payment.toLocaleString()}`,
    },
    {
      name: 'Date',
      selector: row => new Date(row.date).toLocaleDateString(),
      sortable: true,
    }
  ];

  const handleDownloadExcel = async () => {
    try {
      const response = await fetch("http://localhost:8000/payments/export/excel");
  
      if (!response.ok) {
        throw new Error("Failed to download Excel");
      }
  
      const blob = await response.blob(); 
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "driver_payments.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading Excel:", error);
      alert("Failed to download Excel. Please check the API endpoint.");
    }
  };
  
  const handleDownloadPDF = async () => {
    try {
      const response = await fetch("http://localhost:8000/payments/export/pdf", {
        method: "GET",
        headers: { "Content-Type": "application/pdf" },
      });
  
      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "driver_payments.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please check the API.");
    }
  };
  
  // Process chart data to avoid overlapping
  const processChartData = () => {
    // Get at most 10 entries to avoid crowding
    const displayData = payments.slice(0, 10);
    
    return {
      labels: displayData.map(payment => payment.driverName),
      datasets: [
        {
          label: 'Trips',
          data: displayData.map(payment => payment.tripCount),
          backgroundColor: 'rgba(53, 162, 235, 0.8)',
          borderColor: 'rgba(53, 162, 235, 1)',
          borderWidth: 1,
          borderRadius: 4,
        },
        {
          label: 'Payment (KES)',
          data: displayData.map(payment => payment.payment / 1000), // Convert to thousands for better scaling
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          borderRadius: 4,
          // Use a different y-axis
          yAxisID: 'y1',
        }
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
        right: 25,
        bottom: 20,
        left: 25
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 11,
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        title: {
          display: true,
          text: 'Number of Trips',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      y1: {
        position: 'right',
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'Payments (KES in thousands)',
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: 12,
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 10,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            if (label === 'Payment (KES)') {
              return `${label}: KES ${(context.parsed.y * 1000).toLocaleString()}`;
            }
            return `${label}: ${context.parsed.y}`;
          }
        }
      }
    }
  };

  // Calculate summary statistics
  const totalTrips = payments.reduce((sum, payment) => sum + payment.tripCount, 0);
  const totalPayments = payments.reduce((sum, payment) => sum + payment.payment, 0);
  const averagePayment = payments.length > 0 ? totalPayments / payments.length : 0;

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#f8f9fa',
        color: '#212529',
        fontWeight: 'bold',
        borderBottomWidth: '2px',
        borderBottomColor: '#dee2e6',
      },
    },
    headCells: {
      style: {
        paddingLeft: '16px',
        paddingRight: '16px',
        fontSize: '14px',
      },
    },
    cells: {
      style: {
        paddingLeft: '16px',
        paddingRight: '16px',
        fontSize: '14px',
      },
    },
    rows: {
      highlightOnHoverStyle: {
        backgroundColor: '#f1f5f9',
        cursor: 'pointer',
      },
    },
    pagination: {
      style: {
        borderTopWidth: '1px',
        borderTopColor: '#dee2e6',
      },
    },
  };

  return (
    <div className="payment-report">
      <div className="report-header">
        <h2>Driver Payment Report</h2>
        <div className="report-summary">
          <div className="summary-card">
            <span className="summary-title">Total Trips</span>
            <span className="summary-value">{totalTrips.toLocaleString()}</span>
          </div>
          <div className="summary-card">
            <span className="summary-title">Total Payments</span>
            <span className="summary-value">KES {totalPayments.toLocaleString()}</span>
          </div>
          <div className="summary-card">
            <span className="summary-title">Average Payment</span>
            <span className="summary-value">KES {averagePayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
      
      <div className="filters-section">
        <div className="date-filters">
          <div className="filter-group">
            <label htmlFor="start-date">From:</label>
            <input 
              id="start-date"
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
            />
          </div>
          <div className="filter-group">
            <label htmlFor="end-date">To:</label>
            <input 
              id="end-date"
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
            />
          </div>
          <button className="filter-button" onClick={refetch}>
            Apply Filter
          </button>
        </div>
      </div>

      <div className="report-content">
        <div className="tab-buttons">
          <button 
            className={`tab-button ${activeTab === 'table' ? 'active' : ''}`}
            onClick={() => setActiveTab('table')}
          >
            Table View
          </button>
          <button 
            className={`tab-button ${activeTab === 'chart' ? 'active' : ''}`}
            onClick={() => setActiveTab('chart')}
          >
            Chart View
          </button>
        </div>

        {activeTab === 'table' && (
          <div className="table-section">
            <DataTable
              columns={columns}
              data={payments}
              pagination
              highlightOnHover
              striped
              customStyles={customStyles}
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 20, 30, 50]}
              noDataComponent="No payment records found"
            />
          </div>
        )}

        {activeTab === 'chart' && (
          <div className="chart-section">
            <div className="chart-container">
              <Bar data={processChartData()} options={chartOptions} />
            </div>
            <div className="chart-info">
              <p>* Showing up to 10 drivers for better visualization</p>
              <p>* Payment values are shown in thousands (KES) for better scaling</p>
            </div>
          </div>
        )}
      </div>

      <div className="export-section">
        <button className="export-button excel" onClick={handleDownloadExcel}>
          Export to Excel
        </button>
        <button className="export-button pdf" onClick={handleDownloadPDF}>
          Export to PDF
        </button>
      </div>
    </div>
  );
};

export default PaymentReport;