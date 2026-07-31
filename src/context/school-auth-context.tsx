"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/api';
import { schoolAuthApi } from '@/services/school-auth-api';
import { AdminProfile, School, AcademicYear } from '@/mocks/mock-data';

function toSchool(s: { id: string; name: string; shortCode: string; logoUrl?: string; address?: string }): School {
  return { id: s.id, name: s.name, address: s.address || '' };
}

function toAdminProfile(p: { id: string; fullName: string; email: string; phone_number?: string; role: string }, logoUrl?: string): AdminProfile {
  return { id: p.id, fullName: p.fullName, email: p.email, phone_number: p.phone_number, role: p.role, avatar: logoUrl || '/assets/logo.png' };
}

interface SchoolAuthContextType {
  admin: AdminProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isAdminPreview: boolean;
  schools: School[];
  activeSchool: School | null;
  setActiveSchool: (school: School) => void;
  academicYears: AcademicYear[];
  activeYear: string;
  setActiveYear: (year: string) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const SchoolAuthContext = createContext<SchoolAuthContextType | undefined>(undefined);

export function SchoolAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [schools, setSchools] = useState<School[]>([]);
  const [activeSchool, setActiveSchoolState] = useState<School | null>(null);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [activeYear, setActiveYearState] = useState<string>('2081-82');

  // Load initial settings and check auth. A principal has exactly one
  // school, so unlike the old mock flow there's no "pick from a list" step —
  // schools/activeSchool are only ever populated from that one account's
  // real profile response, never from a preloaded catalog.
  const initializeAuth = async () => {
    try {
      setLoading(true);
      setError(null);

      // Academic years aren't wired to a real endpoint yet — still mocked.
      const fetchedYears = await apiService.getAcademicYears();
      setAcademicYears(fetchedYears);

      const savedYear = localStorage.getItem('activeYear');
      if (savedYear && fetchedYears.some(y => y.id === savedYear)) {
        setActiveYearState(savedYear);
      } else if (fetchedYears.length > 0) {
        setActiveYearState(fetchedYears[0].id);
      }

      const token = localStorage.getItem('schoolToken');
      if (!token) {
        setAdmin(null);
        setSchools([]);
        setActiveSchoolState(null);
        return;
      }

      try {
        const { adminProfile, school } = await schoolAuthApi.getProfile(token);
        setAdmin(toAdminProfile(adminProfile, school?.logoUrl));
        if (school) {
          const mapped = toSchool(school);
          setSchools([mapped]);
          setActiveSchoolState(mapped);
        }
      } catch (profileErr) {
        // Token expired/invalid — clear it and fall back to logged-out state
        // rather than leaving a broken session hanging around. This is an
        // expected, self-resolving condition (an old/expired token sitting
        // in localStorage), not a real error, so warn rather than error —
        // Next's dev overlay treats console.error as a crash-level event.
        console.warn('School session expired or invalid, clearing it:', profileErr);
        localStorage.removeItem('schoolToken');
        setAdmin(null);
        setSchools([]);
        setActiveSchoolState(null);
      }
    } catch (err) {
      console.error('Error during school auth initialization:', err);
      setError(err instanceof Error ? err.message : 'Initialization failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  const setActiveSchool = (school: School) => {
    setActiveSchoolState(school);
    localStorage.setItem('activeSchoolId', school.id);
  };

  const setActiveYear = (year: string) => {
    setActiveYearState(year);
    localStorage.setItem('activeYear', year);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setLoading(true);
      setError(null);

      const { token, adminProfile, school } = await schoolAuthApi.login(email, password);

      localStorage.setItem('schoolToken', token);
      localStorage.setItem('schoolAdminId', adminProfile.id);
      localStorage.setItem('schoolAdminEmail', adminProfile.email);
      localStorage.setItem('isAuthenticated', 'true');

      setAdmin(toAdminProfile(adminProfile, school.logoUrl));
      const mapped = toSchool(school);
      setSchools([mapped]);
      setActiveSchool(mapped);

      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, message: err instanceof Error ? err.message : 'An unexpected error occurred during login.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('schoolToken');
    localStorage.removeItem('schoolAdminId');
    localStorage.removeItem('schoolAdminEmail');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('activeSchoolId');
    localStorage.removeItem('activeYear');
    localStorage.removeItem('isAdminPreview');
    setAdmin(null);
    setError(null);
    // Hard redirect to login page
    window.location.href = '/login';
  };

  const refreshAuth = async () => {
    await initializeAuth();
  };

  const isAuthenticated = !!admin;
  const isAdminPreview = typeof window !== 'undefined' && localStorage.getItem('isAdminPreview') === 'true';

  const value: SchoolAuthContextType = {
    admin,
    loading,
    error,
    isAuthenticated,
    isAdminPreview,
    schools,
    activeSchool,
    setActiveSchool,
    academicYears,
    activeYear,
    setActiveYear,
    login,
    logout,
    refreshAuth
  };

  return (
    <SchoolAuthContext.Provider value={value}>
      {children}
    </SchoolAuthContext.Provider>
  );
}

export function useSchoolAuth() {
  const context = useContext(SchoolAuthContext);
  if (context === undefined) {
    throw new Error('useSchoolAuth must be used within a SchoolAuthProvider');
  }
  return context;
}
