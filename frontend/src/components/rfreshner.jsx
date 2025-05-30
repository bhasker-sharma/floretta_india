import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import '../styles/rfreshner.css';

const FreshnerAndFaceMistProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/api/freshners-mist-all')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching products:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  // Separate products by flag
  const freshners = products.filter(item => item.flag === 'freshner');
  const faceMists = products.filter(item => item.flag === 'face_mist');

  return (
    <div className="freshener-page">
      <h1 className="page-title">Room Fresheners</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>Failed to load products. Please try again.</p>
      ) : (
        <>
          <div className="product-grid">
            {freshners.map(item => (
              <ProductCard
                key={item.id}
                item={item}
                onClick={() => navigate(`/freshner-mist/${item.id}`)}
              />
            ))}
          </div>

          <div className="diamond-line" style={{ margin: '40px 0' }}>
            <div className="diamond" />
            <div className="line" />
            <div className="diamond" />
          </div>

          <h1 className="page-title">Face Mists</h1>
          <div className="product-grid">
            {faceMists.map(item => (
              <ProductCard
                key={item.id}
                item={item}
                onClick={() => navigate(`/freshner-mist/${item.id}`)}
              />
            ))}
          </div>
          <div className="diamond-line" style={{ margin: '40px 0' }}>
            <div className="diamond" />
            <div className="line" />
            <div className="diamond" />
          </div>
        </>
      )}
    </div>
  );
};

export default FreshnerAndFaceMistProducts;
