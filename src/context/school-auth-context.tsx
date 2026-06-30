"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/services/api';
import { AdminProfile, School, AcademicYear } from '@/mocks/mock-data';

interface SchoolAuthContextType {
  admin: AdminProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
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

  // Load initial settings and check auth
  const initializeAuth = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load schools and academic years from mockup API
      const fetchedSchools = await apiService.getSchools();
      const fetchedYears = await apiService.getAcademicYears();

      setSchools(fetchedSchools);
      setAcademicYears(fetchedYears);

      // Set active year from storage or default
      const savedYear = localStorage.getItem('activeYear');
      if (savedYear && fetchedYears.some(y => y.id === savedYear)) {
        setActiveYearState(savedYear);
      } else if (fetchedYears.length > 0) {
        setActiveYearState(fetchedYears[0].id);
      }

      // Check token
      const token = localStorage.getItem('schoolToken');
      if (!token) {
        setAdmin(null);
        // Default active school
        if (fetchedSchools.length > 0) {
          setActiveSchoolState(fetchedSchools[0]);
        }
        return;
      }

      // Fetch profile
      const profile = await apiService.getAdminProfile();
      setAdmin(profile);

      // Set active school from storage or default
      const savedSchoolId = localStorage.getItem('activeSchoolId');
      const foundSchool = fetchedSchools.find(s => s.id === savedSchoolId);
      if (foundSchool) {
        setActiveSchoolState(foundSchool);
      } else if (fetchedSchools.length > 0) {
        setActiveSchoolState(fetchedSchools[0]);
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

      // Simple mock credential validation
      await new Promise(resolve => setTimeout(resolve, 800)); // simulate latency

      if (email === 'principal.sharma@example.com' && password === 'password123') {
        const profile = await apiService.getAdminProfile();
        
        localStorage.setItem('schoolToken', 'mock-school-admin-token-2026');
        localStorage.setItem('schoolAdminId', profile.id);
        localStorage.setItem('schoolAdminEmail', profile.email);
        localStorage.setItem('isAuthenticated', 'true');

        setAdmin(profile);
        
        // Ensure default school is set
        if (schools.length > 0 && !activeSchool) {
          setActiveSchool(schools[0]);
        }

        return { success: true };
      } else {
        return { success: false, message: 'Invalid email or password. Please use principal.sharma@example.com / password123.' };
      }
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, message: 'An unexpected error occurred during login.' };
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
    setAdmin(null);
    setError(null);
    // Hard redirect to login page
    window.location.href = '/login';
  };

  const refreshAuth = async () => {
    await initializeAuth();
  };

  const isAuthenticated = !!admin;

  const value: SchoolAuthContextType = {
    admin,
    loading,
    error,
    isAuthenticated,
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
