import api from "./api";

/**
 * Reconciled for Laravel 12 + Sanctum Backend
 * 
 * Note: Data fields (id, name, type, birthday, etc.) should match 
 * the Laravel Domain Models.
 */

/* ── Auth ───────────────────────────────────────── */
export const authService = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post("/register", data) as Promise<any>,

  login: (data: { email: string; password: string }) =>
    api.post("/login", data) as Promise<any>,

  me: () => api.get("/user") as Promise<any>,
};

/* ── Pets ───────────────────────────────────────── */
export const petService = {
  list: () => api.get("/pets") as Promise<any>,

  create: (data: {
    name: string;
    type: "dog" | "cat"; // mapped from species
    gender: "male" | "female";
    breed?: string;
    birthday: string; // mapped from birth_date
    weight?: number;
  }) => api.post("/pets", data) as Promise<any>,

  get: (id: string) => api.get(`/pets/${id}`) as Promise<any>,

  update: (id: string, data: Partial<any>) =>
    api.put(`/pets/${id}`, data) as Promise<any>,

  delete: (id: string) => api.delete(`/pets/${id}`) as Promise<any>,

  // Special Recommendation Engine
  recommendations: (petId: string) =>
    api.get(`/pets/${petId}/affiliates`) as Promise<any>,
};

/* ── Health Records ─────────────────────────────── */
export const healthRecordService = {
  list: (petId: string, params?: { type?: string; page?: number; limit?: number }) =>
    api.get(`/pets/${petId}/records`, { params }) as Promise<any>,

  create: (petId: string, data: { type: string; value: any; recorded_at: string; notes?: string }) =>
    api.post(`/pets/${petId}/records`, data) as Promise<any>,

  delete: (recordId: string) =>
    api.delete(`/records/${recordId}`) as Promise<any>,
};

/* ── Affiliate ──────────────────────────────────── */
export const affiliateService = {
  offers: () => api.get("/affiliates") as Promise<any>,
  
  // Recommendations by pet
  petOffers: (petId: string) => api.get(`/pets/${petId}/affiliates`) as Promise<any>,

  logClick: (offerId: string) => api.post(`/affiliates/${offerId}/click`) as Promise<any>,
};

/* ── Dashboard ──────────────────────────────────── */
export const dashboardService = {
  // Aggregated data for the main dashboard view
  petDashboard: (petId: string) =>
    api.get(`/dashboard/pets/${petId}`) as Promise<any>,

  // Legacy/Helper mappings
  summary: () => api.get("/pets") as Promise<any>,
  riskScore: (petId: string) => api.get(`/pets/${petId}/affiliates`) as Promise<any>,
  discountEstimate: (petId: string) => api.get(`/pets/${petId}/affiliates`) as Promise<any>,
};
