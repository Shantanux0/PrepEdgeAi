import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const saveAuth = (authResponse) => {
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('user', JSON.stringify({ name: authResponse.name, email: authResponse.email }));
    setUser({ name: authResponse.name, email: authResponse.email });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, saveAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
