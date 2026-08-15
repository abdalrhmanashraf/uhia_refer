import React, { createContext, useContext, useState, useEffect } from 'react';
import { Referral, ReferralStatus } from '../types';

interface ReferralsContextType {
  referrals: Referral[];
  addReferral: (data: Omit<Referral, 'id' | 'createdAt' | 'lastModifiedAt'>) => Referral;
  updateReferral: (id: string, updatedData: Partial<Referral>) => void;
  updateReferralStatus: (id: string, newStatus: ReferralStatus, comment?: string) => void;
  deleteReferral: (id: string) => void;
  clearAllReferrals: () => void;
}

const ReferralsContext = createContext<ReferralsContextType | undefined>(undefined);

const REFERRALS_STORAGE_KEY = 'masar_referrals_list_v2';

export const ReferralsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [referrals, setReferrals] = useState<Referral[]>(() => {
    const saved = localStorage.getItem(REFERRALS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse referrals list', e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(REFERRALS_STORAGE_KEY, JSON.stringify(referrals));
  }, [referrals]);

  const addReferral = (data: Omit<Referral, 'id' | 'createdAt' | 'lastModifiedAt'>) => {
    const now = new Date();
    const dateCode = `${now.getFullYear().toString().slice(-2)}${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    const randomSeq = (referrals.length + 1).toString().padStart(3, '0');
    const newId = `REF-${dateCode}-${randomSeq}`;

    const newReferral: Referral = {
      ...data,
      id: newId,
      createdAt: now.toISOString(),
      lastModifiedAt: now.toISOString(),
    };

    setReferrals(prev => [newReferral, ...prev]);
    return newReferral;
  };

  const updateReferral = (id: string, updatedData: Partial<Referral>) => {
    setReferrals(prev =>
      prev.map(r =>
        r.id === id
          ? {
              ...r,
              ...updatedData,
              lastModifiedAt: new Date().toISOString(),
            }
          : r
      )
    );
  };

  const updateReferralStatus = (id: string, newStatus: ReferralStatus, comment?: string) => {
    updateReferral(id, {
      status: newStatus,
      rejectionComment: comment,
    });
  };

  const deleteReferral = (id: string) => {
    setReferrals(prev => prev.filter(r => r.id !== id));
  };

  const clearAllReferrals = () => {
    setReferrals([]);
    localStorage.removeItem(REFERRALS_STORAGE_KEY);
  };

  return (
    <ReferralsContext.Provider
      value={{
        referrals,
        addReferral,
        updateReferral,
        updateReferralStatus,
        deleteReferral,
        clearAllReferrals,
      }}
    >
      {children}
    </ReferralsContext.Provider>
  );
};

export const useReferrals = () => {
  const context = useContext(ReferralsContext);
  if (!context) {
    throw new Error('useReferrals must be used within a ReferralsProvider');
  }
  return context;
};
