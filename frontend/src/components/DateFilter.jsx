import React, { useState, useEffect } from 'react';
import '../styles/DateFilter.css';

function DateFilter({ onDateChange, initialStartDate, initialEndDate }) {
  const [startDate, setStartDate] = useState(initialStartDate || getDefaultStartDate());
  const [endDate, setEndDate] = useState(initialEndDate || getDefaultEndDate());
  const [preset, setPreset] = useState('last30days');

  function getDefaultStartDate() {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  }

  function getDefaultEndDate() {
    return new Date().toISOString().split('T')[0];
  }

  useEffect(() => {
    // Trigger initial date change with default dates
    const defaultStart = getDefaultStartDate();
    const defaultEnd = getDefaultEndDate();
    onDateChange({ start_date: defaultStart, end_date: defaultEnd });
  }, []); // Only run on mount

  const handlePresetChange = (presetValue) => {
    setPreset(presetValue);
    const today = new Date();
    let newStartDate, newEndDate;

    switch (presetValue) {
      case 'today':
        newStartDate = today.toISOString().split('T')[0];
        newEndDate = today.toISOString().split('T')[0];
        break;
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        newStartDate = yesterday.toISOString().split('T')[0];
        newEndDate = yesterday.toISOString().split('T')[0];
        break;
      case 'last7days':
        const last7 = new Date(today);
        last7.setDate(last7.getDate() - 7);
        newStartDate = last7.toISOString().split('T')[0];
        newEndDate = today.toISOString().split('T')[0];
        break;
      case 'last30days':
        const last30 = new Date(today);
        last30.setDate(last30.getDate() - 30);
        newStartDate = last30.toISOString().split('T')[0];
        newEndDate = today.toISOString().split('T')[0];
        break;
      case 'last90days':
        const last90 = new Date(today);
        last90.setDate(last90.getDate() - 90);
        newStartDate = last90.toISOString().split('T')[0];
        newEndDate = today.toISOString().split('T')[0];
        break;
      case 'thisMonth':
        newStartDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        newEndDate = today.toISOString().split('T')[0];
        break;
      case 'lastMonth':
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        newStartDate = lastMonth.toISOString().split('T')[0];
        newEndDate = lastMonthEnd.toISOString().split('T')[0];
        break;
      case 'thisYear':
        newStartDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
        newEndDate = today.toISOString().split('T')[0];
        break;
      case 'custom':
        return; // Don't update dates for custom
      default:
        return;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    onDateChange({ start_date: newStartDate, end_date: newEndDate });
  };

  const handleCustomDateChange = () => {
    setPreset('custom');
    onDateChange({ start_date: startDate, end_date: endDate });
  };

  return (
    <div className="date-filter-container">
      <div className="date-filter-presets">
        <label>Quick Select:</label>
        <select value={preset} onChange={(e) => handlePresetChange(e.target.value)}>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="last7days">Last 7 Days</option>
          <option value="last30days">Last 30 Days</option>
          <option value="last90days">Last 90 Days</option>
          <option value="thisMonth">This Month</option>
          <option value="lastMonth">Last Month</option>
          <option value="thisYear">This Year</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>

      <div className="date-filter-custom">
        <div className="date-input-group">
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={endDate}
          />
        </div>

        <div className="date-input-group">
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        <button className="btn-apply-dates" onClick={handleCustomDateChange}>
          <i className="fas fa-sync-alt"></i> Apply
        </button>
      </div>
    </div>
  );
}

export default DateFilter;
