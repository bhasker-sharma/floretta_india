import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token"); // ✅ get JWT token

  // Close search bar on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  const handleProfileClick = () => {
    if (token) {
      navigate("/userprofile");
    } else {
      navigate("/login");
    }
  };

  const handleCartClick = () => {
    if (token) {
      navigate("/addtocart");
    } else {
      navigate("/login");
    }
  };

  const handleWishlistClick = () => {
    if (token) {
      navigate("/wishlist");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="navbar">
      <NavLink to="/" style={{ textDecoration: "none" }}>
        <div className="logo-container">
          <img src={logo} alt="Floretta Logo" className="logo" />
          <div>
            <span className="logo-text">FLORETTA</span>
            <span className="subtext">INDIA</span>
          </div>
        </div>
      </NavLink>

      <button
        className="hamburger"
        onClick={() => setMobileMenuOpen((prev) => !prev)}
      >
        <svg viewBox="0 0 24 24">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <nav className={mobileMenuOpen ? "mobile-nav open" : "mobile-nav"}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/product"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Products
        </NavLink>
        <NavLink
          to="/liveperfume"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Live Perfumery Bar
        </NavLink>
        <NavLink
          to="/hotel-amenities"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Hotel Amenities
        </NavLink>
        <NavLink
          to="/blogs"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Blog
        </NavLink>
      </nav>

      <div className="icon-buttons" ref={searchRef}>
        {/* Uncomment to implement secarch */}
        {/* {isSearchOpen ? (
          <div className="search-box-wide">
            <input
              type="text"
              className="search-input-wide"
              placeholder="Search"
              autoFocus
            />
            <button className="search-submit" onClick={() => setIsSearchOpen(false)}>
              <svg viewBox="0 0 24 24">
                <path d="M21 21l-6-6m0 0a7 7 0 1 0-10 0 7 7 0 0 0 10 0z" />
              </svg>
            </button>
          </div>
        ) : (
          <button onClick={() => setIsSearchOpen(true)}>
            <svg viewBox="0 0 24 24">
              <path d="M21 21l-6-6m0 0a7 7 0 1 0-10 0 7 7 0 0 0 10 0z" />
            </svg>
          </button>
        )} */}

        {/* ✅ Wishlist Icon */}
        <button onClick={handleWishlistClick} title="Wishlist">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* ✅ Cart Icon */}
        <button onClick={handleCartClick} title="Cart">
          <svg viewBox="0 0 24 24">
            <path d="M3 3h18l-1 13H4L3 3z" />
            <path d="M16 17a2 2 0 1 0 4 0M4 17a2 2 0 1 0 4 0" />
          </svg>
        </button>

        {/* ✅ Profile Icon */}
        <button onClick={handleProfileClick} title="Profile">
          <svg viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4s-4 1.79-4 4 1.79 4 4 4z" />
            <path d="M4 20c0-4 8-4 8-4s8 0 8 4v1H4v-1z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
