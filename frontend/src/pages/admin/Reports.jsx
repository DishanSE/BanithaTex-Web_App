import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import './style/Reports.css';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Main style file
import 'react-date-range/dist/theme/default.css'; // Theme CSS file
import BarChart from '../../components/Charts/BarChart.jsx';
import LineChart from '../../components/Charts/LineChart.jsx';
import PieChart from '../../components/Charts/PieChart.jsx';

const Reports = () => {
  const [salesTrends, setSalesTrends] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [newCustomers, setNewCustomers] = useState([]);
  const [revenueByYarnType, setRevenueByYarnType] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)), // Default: last month
    endDate: new Date(),
    key: 'selection',
  });

  // Handle date range change
  const handleDateChange = (ranges) => {
    setDateRange(ranges.selection);
  };

  // Fetch data for the selected date range
  const fetchData = async () => {
    try {
      const { startDate, endDate } = dateRange;

      // Format dates for API request
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];

      // Fetch monthly sales trends
      const salesResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/reports/monthly-sales?start_date=${formattedStartDate}&end_date=${formattedEndDate}`
      );
      setSalesTrends(salesResponse.data);

      // Fetch top products
      const productsResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/reports/top-products?start_date=${formattedStartDate}&end_date=${formattedEndDate}`
      );
      setTopProducts(productsResponse.data);

      // Fetch new customers per month
      const customersResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/reports/new-customers?start_date=${formattedStartDate}&end_date=${formattedEndDate}`
      );
      setNewCustomers(customersResponse.data);

      // Fetch revenue by yarn type
      const revenueResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/reports/revenue-by-yarn-type?start_date=${formattedStartDate}&end_date=${formattedEndDate}`
      );
      setRevenueByYarnType(revenueResponse.data);
    } catch (err) {
      console.error('Error fetching reports:', err.response?.data || err.message);
    }
  };

  // Download CSV
  const downloadCSV = () => {
    const csvData = [
      ['Metric', 'Value'],
      ...salesTrends.map((item) => [`Sales (${item.month})`, item.total_sales]),
      ...topProducts.map((item) => [`Revenue (${item.product_name})`, item.total_revenue]),
      ...newCustomers.map((item) => [`New Customers (${item.month})`, item.new_customers]),
      ...revenueByYarnType.map((item) => [`Revenue (${item.yarn_type})`, item.total_revenue]),
    ];

    const csvContent = csvData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'business_insights.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchData(); // Initial fetch with default date range
  }, [dateRange]);

  return (
    <div className="admin-reports-page">
      <Sidebar userType="admin" />
      <div className="admin-reports-container">
        <h1>Business Insights</h1>

        {/* Date Range Picker */}
        <div className="date-range-picker">
          <DateRangePicker
            ranges={[dateRange]}
            onChange={handleDateChange}
          />
        </div>

        {/* Download Button */}
        <button className="download-btn" onClick={downloadCSV}>
          Download Report
        </button>

        {/* Charts Container */}
        <div className="charts-container">
          {/* Row 1 */}
          <div className="chart-row">
            {/* Sales Trends Chart */}
            <div className="chart-card">
              <h2>Sales Trends</h2>
              <LineChart
                data={salesTrends.map((item) => ({
                  month: item.month,
                  sales: parseFloat(item.total_sales),
                }))}
                xKey="month"
                yKey="sales"
              />
            </div>

            {/* Top Products Chart */}
            <div className="chart-card">
              <h2>Top Products</h2>
              <BarChart
                data={topProducts.map((item) => ({
                  product: item.product_name,
                  revenue: parseFloat(item.total_revenue),
                }))}
                xKey="product"
                yKey="revenue"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="chart-row">
            {/* New Customers Chart */}
            <div className="chart-card">
              <h2>New Customers Per Month</h2>
              <LineChart
                data={newCustomers.map((item) => ({
                  month: item.month,
                  customers: parseInt(item.new_customers),
                }))}
                xKey="month"
                yKey="customers"
              />
            </div>

            {/* Revenue by Yarn Type Chart */}
            <div className="chart-card">
              <h2>Revenue by Yarn Type</h2>
              <PieChart
                data={revenueByYarnType.map((item) => ({
                  label: item.yarn_type,
                  value: parseFloat(item.total_revenue),
                }))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;