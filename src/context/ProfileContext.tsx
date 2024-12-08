'use client'

import React, { createContext, useContext, useState } from 'react';

export interface Profile {
  name: string;
  lifestyle: 'active' | 'moderate' | 'relaxed';
  homeType: 'house' | 'apartment';
  hasChildren: boolean;
  hasPets: boolean;
  experience: 'first-time' | 'some' | 'experienced';
  preferredSize: 'small' | 'medium' | 'large' | 'any';
}

interface ProfileContextType {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<Profile | null>(() => {
    // Only access localStorage after component mounts (client-side)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('profile');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  // Update localStorage when profile changes
  const setProfile = (newProfile: Profile) => {
    setProfileState(newProfile);
    localStorage.setItem('profile', JSON.stringify(newProfile));
  };

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}