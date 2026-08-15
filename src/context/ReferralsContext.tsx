import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Referral, ReferralStatus } from '../types';

interface ReferralsContextType {
  referrals: Referral[];
  addReferral: (data: Omit<Referral, 'id' | 'createdAt' | 'lastModifiedAt'>) => Referral;
  updateReferral: (id: string, updatedData: Partial<Referral>) => void;
  updateReferralStatus: (id: string, newStatus: ReferralStatus, comment?: string) => void;
  deleteReferral: (id: string) => void;
  clearAllReferrals: () => void;
  isSyncing: boolean;
}

const ReferralsContext = createContext<ReferralsContextType | undefined>(undefined);

const REFERRALS_STORAGE_KEY = 'masar_referrals_list_v2';
const CLOUD_SYNC_ENDPOINT = 'https://api.restful-api.dev/objects/ff8081819ff5b11001a006fc4fd8276f';

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

  const [isSyncing, setIsSyncing] = useState(false);
  const isLocalUpdateRef = useRef(false);

  // دالة المزامنة السحابية (رفع البيانات إلى السحابة ليراها كل المستخدمين والأجهزة)
  const saveToCloud = async (currentList: Referral[]) => {
    try {
      setIsSyncing(true);
      await fetch(CLOUD_SYNC_ENDPOINT, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'masar_luxor_referrals',
          data: { referrals: currentList },
        }),
      });
    } catch (err) {
      console.warn('Cloud sync write warning:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // دالة جلب البيانات السحابية الحية (لتحديث الشاشة فوراً عند قيام أي شخص آخر بعمل تحويل أو قبول)
  const fetchFromCloud = async () => {
    try {
      const res = await fetch(CLOUD_SYNC_ENDPOINT);
      if (res.ok) {
        const json = await res.json();
        const cloudReferrals: Referral[] = json?.data?.referrals;
        if (Array.isArray(cloudReferrals)) {
          setReferrals(prev => {
            // نحدث فقط إذا كانت هناك بيانات جديدة أو مختلفة
            const prevStr = JSON.stringify(prev);
            const newStr = JSON.stringify(cloudReferrals);
            if (prevStr !== newStr && !isLocalUpdateRef.current) {
              localStorage.setItem(REFERRALS_STORAGE_KEY, newStr);
              return cloudReferrals;
            }
            return prev;
          });
        }
      }
    } catch (err) {
      console.warn('Cloud sync read warning:', err);
    }
  };

  // المزامنة الدورية الحية في الخلفية كل 4 ثوانٍ
  useEffect(() => {
    fetchFromCloud();

    const interval = setInterval(() => {
      if (!isLocalUpdateRef.current) {
        fetchFromCloud();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // حفظ محلي دائم
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

    const updated = [newReferral, ...referrals];
    isLocalUpdateRef.current = true;
    setReferrals(updated);
    saveToCloud(updated);
    setTimeout(() => { isLocalUpdateRef.current = false; }, 1000);

    return newReferral;
  };

  const updateReferral = (id: string, updatedData: Partial<Referral>) => {
    const updated = referrals.map(r =>
      r.id === id
        ? {
            ...r,
            ...updatedData,
            lastModifiedAt: new Date().toISOString(),
          }
        : r
    );

    isLocalUpdateRef.current = true;
    setReferrals(updated);
    saveToCloud(updated);
    setTimeout(() => { isLocalUpdateRef.current = false; }, 1000);
  };

  const updateReferralStatus = (id: string, newStatus: ReferralStatus, comment?: string) => {
    updateReferral(id, {
      status: newStatus,
      rejectionComment: comment,
    });
  };

  const deleteReferral = (id: string) => {
    const updated = referrals.filter(r => r.id !== id);
    isLocalUpdateRef.current = true;
    setReferrals(updated);
    saveToCloud(updated);
    setTimeout(() => { isLocalUpdateRef.current = false; }, 1000);
  };

  const clearAllReferrals = () => {
    isLocalUpdateRef.current = true;
    setReferrals([]);
    localStorage.removeItem(REFERRALS_STORAGE_KEY);
    saveToCloud([]);
    setTimeout(() => { isLocalUpdateRef.current = false; }, 1000);
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
        isSyncing,
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
