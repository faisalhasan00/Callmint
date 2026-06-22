const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Token management
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("voiceai_token");
}

export function setToken(token: string) {
  localStorage.setItem("voiceai_token", token);
}

export function removeToken() {
  localStorage.removeItem("voiceai_token");
}

// Generic API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    removeToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  if (res.status === 402) {
    if (typeof window !== "undefined") {
      window.location.href = "/billing";
    }
    throw new Error("Subscription required");
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `API error: ${res.status}`);
  }

  if (res.status === 204) return {} as T;
  return res.json();
}

// Auth endpoints
export const authApi = {
  register: (data: { email: string; password: string; business_name: string; business_type: string }) =>
    apiRequest<any>("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    apiRequest<{ access_token: string; token_type: string }>("/auth/login", { method: "POST", body: JSON.stringify(data) }),

  me: () => apiRequest<any>("/auth/me"),

  getBusiness: () => apiRequest<any>("/auth/business"),

  updateBusiness: (data: { name: string; type: string; timings_open: string; timings_close: string }) =>
    apiRequest<any>("/auth/business", { method: "PUT", body: JSON.stringify(data) }),
};

// Billing endpoints
export const billingApi = {
  getStatus: () => apiRequest<any>("/billing/status"),
  subscribe: (plan: string) => apiRequest<any>("/billing/subscribe", { method: "POST", body: JSON.stringify({ plan }) }),
};

// Customer CRM endpoints
export const customersApi = {
  list: () => apiRequest<any[]>("/customers/"),
  create: (data: { name: string; phone: string; preferred_language: string; subscription_end_date?: string | null }) =>
    apiRequest<any>("/customers/", { method: "POST", body: JSON.stringify(data) }),
  get: (id: number) => apiRequest<any>(`/customers/${id}`),
  update: (id: number, data: { name: string; phone: string; preferred_language: string; subscription_end_date?: string | null }) =>
    apiRequest<any>(`/customers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) => apiRequest<void>(`/customers/${id}`, { method: "DELETE" }),
};

// Appointment endpoints
export const appointmentsApi = {
  list: () => apiRequest<any[]>("/appointments/"),
  create: (data: { customer_id: number; date_time: string; service: string }) =>
    apiRequest<any>("/appointments/", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: { customer_id: number; date_time: string; service: string }) =>
    apiRequest<any>(`/appointments/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  cancel: (id: number) => apiRequest<void>(`/appointments/${id}`, { method: "DELETE" }),
};

// Offers endpoints
export const offersApi = {
  list: () => apiRequest<any[]>("/offers"),
  create: (data: { title: string; description: string; discount_percentage: number; is_active: boolean }) =>
    apiRequest<any>("/offers", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: { title: string; description: string; discount_percentage: number; is_active: boolean }) =>
    apiRequest<any>(`/offers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
};

// Campaign endpoints
export const campaignsApi = {
  list: () => apiRequest<any[]>("/campaigns"),
  create: (data: { name: string; type: string; offer_id?: number; scheduled_at: string; custom_prompt?: string; target_date_start?: string; target_date_end?: string }) =>
    apiRequest<any>("/campaigns", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: { name: string; type: string; offer_id?: number; scheduled_at: string; custom_prompt?: string; target_date_start?: string; target_date_end?: string }) =>
    apiRequest<any>(`/campaigns/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) => apiRequest<void>(`/campaigns/${id}`, { method: "DELETE" }),
  launch: (id: number) => apiRequest<any>(`/campaigns/${id}/launch`, { method: "POST" }),
  previewTargets: (id: number) => apiRequest<any>(`/campaigns/${id}/preview_targets`),
};

// Call logs / Analytics endpoints
export const callsApi = {
  list: () => apiRequest<any[]>("/calls/"),
  stats: () => apiRequest<any>("/calls/stats"),
};

// AI Config endpoints
export const configsApi = {
  getAI: () => apiRequest<any>("/configs/ai"),
  updateAI: (data: { voice_style: string; language: string; custom_system_prompt?: string; custom_greeting?: string }) =>
    apiRequest<any>("/configs/ai", { method: "PUT", body: JSON.stringify(data) }),
  getTemplates: () => apiRequest<any[]>("/configs/templates"),
};
