import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchMe, loginUser, logoutUser, registerUser } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const hydrate = useCallback(async () => {
    try {
      const { user } = await fetchMe();
      setUser(user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const login = async (email, password) => {
    const { user } = await loginUser({ email, password });
    setUser(user);
    return user;
  };

  const register = async (payload) => {
    const { user, devOtp } = await registerUser(payload);
    setUser(user);
    return { user, devOtp };
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const setVerified = () => setUser((u) => (u ? { ...u, emailVerified: true } : u));

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setVerified, refresh: hydrate }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
