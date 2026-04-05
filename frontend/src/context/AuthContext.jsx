import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [username, setUsername] = useState(localStorage.getItem('username') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // When token changes, update axios default headers
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

  const API = import.meta.env.VITE_API_URL; // ✅ add this at top

const login = async (user, pass) => {
  setLoading(true);
  setError(null);
  try {
    const response = await axios.post(`${API}/api/login`, {
      username: user,
      password: pass
    });

    localStorage.setItem("token", response.data.token); // ✅ important
    return true;
  } catch (err) {
    setError("Failed to login");
    return false;
  } finally {
    setLoading(false);
  }
};

  const logout = () => {
    setToken(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ token, username, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
