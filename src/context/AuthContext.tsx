import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, UserRole, VerificationStatus } from '../types';
import { LegalStorage, subscribeStorage } from '../services/storage';

interface AuthContextType {
  currentUser: User;
  allUsers: User[];
  isLawyer: boolean;
  isOrg: boolean;
  isAdmin: boolean;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  switchUser: (userId: string) => void;
  updateCurrentUser: (user: User) => void;
  logout: () => void;
  loginDemo: (role: UserRole) => void;
  unreadNotificationsCount: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => LegalStorage.getCurrentUser());
  const [allUsers, setAllUsers] = useState<User[]>(() => LegalStorage.getUsers());
  const [unreadNotificationsCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const handleUpdate = () => {
      const current = LegalStorage.getCurrentUser();
      const users = LegalStorage.getUsers();
      const notifs = LegalStorage.getNotifications();
      setCurrentUser(current);
      setAllUsers(users);
      setUnreadCount(notifs.filter((n) => !n.read).length);
    };

    handleUpdate();
    const unsubscribe = subscribeStorage(handleUpdate);
    return () => unsubscribe();
  }, []);

  const switchUser = (userId: string) => {
    LegalStorage.setCurrentUserId(userId);
  };

  const updateCurrentUser = (user: User) => {
    LegalStorage.updateUser(user);
    setCurrentUser(user);
  };

  const logout = () => {
    // switch to first demo or guest
    LegalStorage.setCurrentUserId('user-eleanor-vance');
  };

  const loginDemo = (role: UserRole) => {
    const target = allUsers.find((u) => u.role === role);
    if (target) {
      LegalStorage.setCurrentUserId(target.id);
    }
  };

  const isLawyer = currentUser.role === 'lawyer';
  const isOrg = currentUser.role === 'organization';
  const isAdmin = currentUser.role === 'admin';
  const verificationStatus: VerificationStatus =
    currentUser.lawyerProfile?.verificationStatus ||
    (currentUser.organizationProfile?.isVerified ? 'verified' : 'not_verified');
  const isVerified = verificationStatus === 'verified';

  const value = useMemo(
    () => ({
      currentUser,
      allUsers,
      isLawyer,
      isOrg,
      isAdmin,
      isVerified,
      verificationStatus,
      switchUser,
      updateCurrentUser,
      logout,
      loginDemo,
      unreadNotificationsCount,
    }),
    [currentUser, allUsers, unreadNotificationsCount]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
