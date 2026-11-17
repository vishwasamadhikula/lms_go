import React, { createContext, useContext, useEffect, useState } from 'react';
import { getToken, saveToken, getUserProfile, saveUserProfile, clearSession } from '../services/storage';
import { moodleApi } from '../services/api';

interface User {
  userid: number;
  fullname: string;
  userpictureurl: string;
  sitename: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (tokenOrCreds: { username?: string; password?: string; directToken?: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session on app mount
    (async () => {
      try {
        const savedToken = await getToken();
        const savedUser = await getUserProfile();
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(savedUser);
        }
      } catch (e) {
        console.error('Session restore failed', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async ({ username, password, directToken }: { username?: string; password?: string; directToken?: string }) => {
    setIsLoading(true);
    try {
      const activeToken = directToken || (await moodleApi.login(username!, password!));
      const info = await moodleApi.getSiteInfo(activeToken);

      const profileData: User = {
        userid: info.userid,
        fullname: info.fullname,
        userpictureurl: info.userpictureurl,
        sitename: info.sitename,
      };

      await saveToken(activeToken);
      await saveUserProfile(profileData);

      setToken(activeToken);
      setUser(profileData);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await clearSession();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);