import React, { createContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export const AuthContext = createContext();

const API = "https://student-portal-ndol.onrender.com/"; // ✅ keep outside

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [username, setUsername] = useState(localStorage.getItem('username') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Update axios headers when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    }
  }, [token]);

  // ✅ FIXED LOGIN FUNCTION
  const login = async (user, pass) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API}/api/login`, {
        username: user,
        password: pass
      });

      // ✅ VERY IMPORTANT FIX
      setToken(response.data.token);          // 🔥 update state
      setUsername(user);                      // optional but useful

      return true;
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Failed to login");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ logout
  const logout = () => {
    setToken(null);
    setUsername(null);
  };

  const value = useMemo(() => ({ token, username, loading, error, login, logout }), [token, username, loading, error, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};