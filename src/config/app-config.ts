/**
 * Global application configuration.
 * Toggle NEXT_PUBLIC_USE_MOCK_DATA environment variable or change the default boolean here:
 * - true: Use local preseeded mock data and mock databases (demo mode)
 * - false: Fetch from real backend APIs
 */
export const USE_MOCK_DATA =
  process.env.NEXT_PUBLIC_USE_MOCK_DATA === undefined
    ? true
    : process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

// A production build with NEXT_PUBLIC_API_URL unset (or still pointing at
// localhost) previously fell back silently here, baking "http://localhost:5000/api"
// into the deployed bundle — every real user's browser then tried to reach
// their own machine, which failed invisibly and only surfaced downstream as
// "admin-preview redirects to login" with no indication of the real cause.
// Failing loudly at load time makes a misconfigured deploy impossible to miss.
if (process.env.NODE_ENV === "production" && (!process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL.includes("localhost"))) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is not set (or points at localhost) in a production build. " +
    "Set it in this project's Vercel Production environment variables to the real backend URL, e.g. https://api.noteswift.com.np/api"
  );
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
