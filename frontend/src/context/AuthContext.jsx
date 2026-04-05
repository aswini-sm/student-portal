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

  const login = async (user, pass) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        username: user,
        password: pass
      });
      const data = response.data;
      setToken(data.token);
      setUsername(data.username);
      localStorage.setItem('username', data.username);
      setLoading(false);
      return true;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data || "Failed to login. Please check credentials.");
      return false;
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
