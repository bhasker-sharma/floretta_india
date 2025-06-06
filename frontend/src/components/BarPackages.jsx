import React from 'react';
import "../styles/BarPackages.css";

const BarPackages = () => {
  const packages = [
    {
      title: 'BRONZE',
      guests: [
        { count: 100, price: '25,000' },
        { count: 200, price: '30,000' },
        { count: 300, price: '35,000' },
        { count: 500, price: '40,000' },
      ],
      description: 'This Package Is Ideal For Small Weddings & Events',
      features: [
        '20ml Perfume Bottle',
        'Decorative Plain Net Potli',
        'Customized Label',
      ],
      note: 'Additional Bottle Charge ₹85/pc',
    },
    {
      title: 'SILVER',
      guests: [
        { count: 100, price: '30,000' },
        { count: 200, price: '35,000' },
        { count: 300, price: '40,000' },
        { count: 500, price: '45,000' },
      ],
      description: 'Silver Package Includes',
      features: [
        '30ml Perfume Bottle',
        'Jute Potli',
        'Customized Premium Label',
      ],
      note: 'Additional Bottle Charge ₹95/pc',
    },
    {
      title: 'GOLD',
      guests: [
        { count: 100, price: '35,000' },
        { count: 200, price: '40,000' },
        { count: 300, price: '45,000' },
        { count: 500, price: '50,000' },
      ],
      description: 'Gold Package is Ideal for big Weddings & Events',
      features: [
        '30ml Premium Perfume Bottle',
        'Decorative Golden Net Potli',
        'Customized Premium Label',
        'Premium Fragrances',
      ],
      note: 'Additional Bottle Charge ₹135/pc',
    },
  ];

  return (
    <div className="bar-container">
      <h2 className="bar-title">OUR PACKAGE FOR BARS</h2>
      <div className="bar-packages">
        {packages.map((pkg, i) => (
          <div className="bar-card" key={i}>
            <button className="bar-tier">{pkg.title}</button>
            <table className="bar-table">
              <thead>
                <tr>
                  <th>No. Of Guests</th>
                  <th>Price (₹)</th>
                </tr>
              </thead>
              <tbody>
                {pkg.guests.map((row, j) => (
                  <tr key={j}>
                    <td>{row.count}</td>
                    <td>{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="bar-desc">{pkg.description}</p>
            <ul className="bar-features">
              {pkg.features.map((feature, k) => (
                <li key={k}>• {feature}</li>
              ))}
            </ul>
            <p className="bar-note">{pkg.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarPackages;
