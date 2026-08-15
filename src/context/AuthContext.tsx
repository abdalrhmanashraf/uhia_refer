import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { mockUsers, MOCK_CREDENTIALS } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  allUsers: User[];
  login: (username: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  switchUser: (userId: string) => void;
  addUser: (newUser: Omit<User, 'id' | 'createdAt'>, password?: string) => void;
  updateUser: (userId: string, updatedData: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  hasRole: (roles: UserRole[]) => boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'masar_auth_user';
const USERS_STORAGE_KEY = 'masar_users_list';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved users', e);
      }
    }
    return mockUsers;
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    // افتراضياً يدخل بحساب الادمين عبد الرحمن اشرف
    return mockUsers[0];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(allUsers));
  }, [allUsers]);

  const login = (username: string, password: string) => {
    const cred = MOCK_CREDENTIALS[username.trim().toLowerCase()];
    if (!cred || cred.password !== password.trim()) {
      return { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
    }

    const foundUser = allUsers.find(u => u.id === cred.userId || u.username === username.trim().toLowerCase());
    if (!foundUser) {
      return { success: false, message: 'المستخدم غير مسجل بالنظام' };
    }

    if (!foundUser.isActive) {
      return { success: false, message: 'هذا الحساب معطل حالياً، يرجى مراجعة مسؤول النظام' };
    }

    setUser(foundUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const switchUser = (userId: string) => {
    const target = allUsers.find(u => u.id === userId);
    if (target) {
      setUser(target);
    }
  };

  const addUser = (newUserData: Omit<User, 'id' | 'createdAt'>, password = '1234') => {
    const newId = `u_${Date.now()}`;
    const createdUser: User = {
      ...newUserData,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    MOCK_CREDENTIALS[newUserData.username.toLowerCase()] = {
      password: password || '1234',
      userId: newId,
    };

    setAllUsers(prev => [createdUser, ...prev]);
  };

  const updateUser = (userId: string, updatedData: Partial<User>) => {
    setAllUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, ...updatedData } : u))
    );
    if (user && user.id === userId) {
      setUser(prev => (prev ? { ...prev, ...updatedData } : null));
    }
  };

  const deleteUser = (userId: string) => {
    setAllUsers(prev => prev.filter(u => u.id !== userId));
  };

  const hasRole = (roles: UserRole[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const isAdmin = user?.role === 'SYSTEM_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        allUsers,
        login,
        logout,
        switchUser,
        addUser,
        updateUser,
        deleteUser,
        hasRole,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
