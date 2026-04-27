import React, { createContext, useState, useContext } from 'react';

export const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('adminToken'));
  const [adminUser, setAdminUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('adminUser')); } catch { return null; }
  });

  const adminLogin = (token, user) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(user));
    setAdminToken(token);
    setAdminUser(user);
  };

  const adminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setAdminToken(null);
    setAdminUser(null);
  };

  return (
    <AdminContext.Provider value={{ adminToken, adminUser, adminLogin, adminLogout }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
