import { API_BASE_URL } from "@/config/app-config";

// Real backend calls for the principal invite/registration/login flow.
// Kept separate from the still-fully-mocked `apiService` in
// src/services/api.ts — only auth is real so far; dashboard data stays
// mocked until that's built out separately.

export interface AdminProfileResponse {
  id: string;
  fullName: string;
  email: string;
  phone_number?: string;
  role: string;
}

export interface SchoolInfoResponse {
  id: string;
  name: string;
  shortCode: string;
  logoUrl?: string;
  address?: string;
}

async function parseJsonOrThrow(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }
  return data;
}

export const schoolAuthApi = {
  async verifyInvitation(token: string): Promise<{ email: string; school: SchoolInfoResponse }> {
    const res = await fetch(`${API_BASE_URL}/school/auth/verify-invitation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    return parseJsonOrThrow(res);
  },

  async completeRegistration(input: {
    token: string;
    name: string;
    phone_number: string;
    password: string;
  }): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE_URL}/school/auth/complete-registration`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return parseJsonOrThrow(res);
  },

  async login(email: string, password: string): Promise<{
    token: string;
    adminProfile: AdminProfileResponse;
    school: SchoolInfoResponse;
  }> {
    const res = await fetch(`${API_BASE_URL}/school/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return parseJsonOrThrow(res);
  },

  async getProfile(token: string): Promise<{
    adminProfile: AdminProfileResponse;
    school: SchoolInfoResponse | null;
  }> {
    const res = await fetch(`${API_BASE_URL}/school/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return parseJsonOrThrow(res);
  },
};
