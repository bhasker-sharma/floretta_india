import React from 'react';
import '../styles/KPICard.css';

function KPICard({ label, value, trend, icon, formatter, trendSuffix = '%' }) {
  const isPositive = trend > 0;
  const isNegative = trend < 0;
  const isNeutral = trend === 0;

  const formatValue = (val) => {
    if (formatter === 'currency') {
      return `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (formatter === 'number') {
      return Number(val).toLocaleString('en-IN');
    } else if (formatter === 'percentage') {
      return `${Number(val).toFixed(1)}%`;
    } else if (formatter === 'rating') {
      return `${Number(val).toFixed(2)} ★`;
    }
    return val;
  };

  return (
    <div className="kpi-card">
      <div className="kpi-card-header">
        <span className="kpi-label">{label}</span>
        {icon && <i className={`kpi-icon ${icon}`}></i>}
      </div>

      <div className="kpi-value">{formatValue(value)}</div>

      <div className={`kpi-trend ${isPositive ? 'positive' : isNegative ? 'negative' : 'neutral'}`}>
        {!isNeutral && (
          <i className={`fas fa-arrow-${isPositive ? 'up' : 'down'}`}></i>
        )}
        <span>
          {isNeutral ? 'No change' : `${Math.abs(trend).toFixed(1)}${trendSuffix}`}
        </span>
        <span className="kpi-trend-label"> vs previous period</span>
      </div>
    </div>
  );
}

export default KPICard;
