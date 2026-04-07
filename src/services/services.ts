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

export interface PetInsuranceType {
  key: string;
  label: string;
  description: string;
  eligible_species: string[];
}

export interface PetRecord {
  id: string | number;
  name: string;
  type: "dog" | "cat" | string;
  type_label?: string;
  gender: "male" | "female" | string;
  breed?: string | null;
  birthday?: string | null;
  weight?: number | null;
  microchip_number?: string | null;
  has_microchip?: boolean;
  is_registered?: boolean;
  registration_number?: string | null;
  insurance_type?: PetInsuranceType;
  insuranceProfile?: Record<string, unknown> | null;
  healthRecords?: Record<string, unknown>[];
}

export interface PetPayload {
  name: string;
  type: "dog" | "cat";
  gender: "male" | "female";
  breed?: string;
  birthday: string;
  weight?: number;
  microchip_number?: string;
  is_registered?: boolean;
  registration_number?: string;
}

/* ── Pets ───────────────────────────────────────── */
export const petService = {
  list: () => api.get("/pets") as Promise<PetRecord[]>,

  create: (data: PetPayload) => api.post("/pets", data) as Promise<PetRecord>,

  get: (id: string) => api.get(`/pets/${id}`) as Promise<PetRecord>,

  update: (id: string, data: Partial<PetPayload>) =>
    api.put(`/pets/${id}`, data) as Promise<PetRecord>,

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

export interface InsurancePlanListItem {
  id: number;
  provider_name: string;
  name: string;
  summary: string | null;
  currency: string;
  annual_premium_min: number;
  annual_premium_max: number;
  species_supported: string[];
  final_score: number;
  ranking_position: number;
  coverage_fit: number;
  claimability: number;
  sponsor_boost: number;
  score_breakdown: Record<string, number>;
  badges: string[];
  why_recommended: string[];
}

export interface InsurancePlanListResponse {
  plans: InsurancePlanListItem[];
  meta: {
    algorithm_version: string;
    catalog_version: string | null;
    total: number;
    pet?: {
      id: string | number;
      name: string;
      type: string;
      type_label: string;
      breed?: string | null;
      microchip_number?: string | null;
      has_microchip?: boolean;
      is_registered?: boolean;
      registration_number?: string | null;
      insurance_type: PetInsuranceType;
    };
  };
}

export interface InsurancePlanDetailResponse {
  id: number;
  provider: {
    id: number;
    name: string;
  };
  plan: {
    name: string;
    code: string;
    summary: string | null;
  };
  pricing: {
    currency: string;
    annual_premium_min: number;
    annual_premium_max: number;
  };
  eligibility: Record<string, unknown>;
  coverage: Record<string, boolean>;
  waiting_period: {
    major_conditions_days: number | null;
    general_conditions_days: number | null;
  };
  medical_constraints: Record<string, unknown>;
  exclusions: string[];
  claim_requirements: Record<string, boolean | null>;
  score_breakdown: Record<string, number> | null;
  badges: string[];
  why_recommended: string[];
  terms: {
    url: string | null;
    source_updated_at: string | null;
  };
  algorithm_version: string | null;
}

export const insuranceService = {
  plans: (petId: string) =>
    api.get(`/pets/${petId}/insurance/plans`) as Promise<InsurancePlanListResponse>,

  detail: (planId: string, petId?: string) =>
    api.get(`/insurance/plans/${planId}`, {
      params: petId ? { pet_id: petId } : undefined,
    }) as Promise<InsurancePlanDetailResponse>,
};

export type AiHealthScanStatus = "queued" | "processing" | "completed" | "failed";

export interface AiHealthFinding {
  id?: string;
  type: string;
  severity: "low" | "medium" | "high";
  title: string;
  description: string;
  recommendation: string | null;
  costImpact: number | null;
  confidence: number | null;
}

export interface AiHealthScanRecord {
  id: string;
  status: AiHealthScanStatus;
  summary: string | null;
  confidence: number | null;
  healthScore: number | null;
  preventiveSavings: number | null;
  remainingFreeScans: number | null;
  imageUrl: string | null;
  reportUrl: string | null;
  createdAt: string | null;
  findings: AiHealthFinding[];
  raw: any;
}

export interface CreateAiHealthScanPayload {
  file: File;
  petId: string;
}

export interface AiDoctorHistoryItem {
  role: "user" | "ai";
  content: string;
}

export interface AiDoctorConsultationAssessment {
  category: string;
  summary: string;
  severity: "low" | "medium" | "high";
  confidence: number;
  triage: string;
  recommendation: string;
  estimated_cost: {
    currency: string;
    min: number;
    max: number;
    insurance_savings: number;
  };
  next_steps: string[];
  warning_signs: string[];
  follow_up_questions: string[];
  matched_signals: string[];
}

export interface AiDoctorConsultationPetContext {
  id: string | number;
  name: string;
  type: string;
  breed?: string | null;
  weight?: number | null;
  age_years?: number | null;
  recent_records: Array<{
    type: string;
    recorded_at: string | null;
    summary: string;
  }>;
}

export interface AiDoctorConsultationResponse {
  reply: string;
  assessment: AiDoctorConsultationAssessment;
  pet: AiDoctorConsultationPetContext;
  meta: {
    generated_at: string;
    disclaimer: string;
  };
}

export interface CreateAiDoctorConsultationPayload {
  petId: string;
  message: string;
  history?: AiDoctorHistoryItem[];
}

const asRecord = (value: unknown): Record<string, any> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, any>)
    : {};

const arrayify = <T,>(value: T | T[] | null | undefined): T[] => {
  if (Array.isArray(value)) {
    return value;
  }

  return value == null ? [] : [value];
};

const toStringOrNull = (value: unknown): string | null => {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return null;
};

const toNumberOrNull = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const coalesceString = (...values: unknown[]): string | null => {
  for (const value of values) {
    const normalized = toStringOrNull(value);
    if (normalized) {
      return normalized;
    }
  }

  return null;
};

const coalesceNumber = (...values: unknown[]): number | null => {
  for (const value of values) {
    const normalized = toNumberOrNull(value);
    if (normalized !== null) {
      return normalized;
    }
  }

  return null;
};

const normalizePercent = (value: unknown): number | null => {
  const numeric = toNumberOrNull(value);
  if (numeric === null) {
    return null;
  }

  return Math.round(numeric <= 1 ? numeric * 100 : numeric);
};

const normalizeSeverity = (value: unknown): "low" | "medium" | "high" => {
  const normalized = toStringOrNull(value)?.toLowerCase();

  if (!normalized) {
    return "medium";
  }

  if (normalized.includes("high") || normalized.includes("critical") || normalized.includes("severe")) {
    return "high";
  }

  if (normalized.includes("low") || normalized.includes("mild")) {
    return "low";
  }

  return "medium";
};

const normalizeStatus = (value: unknown, hasResult: boolean): AiHealthScanStatus => {
  const normalized = toStringOrNull(value)?.toLowerCase();

  if (!normalized) {
    return hasResult ? "completed" : "processing";
  }

  if (normalized.includes("fail") || normalized.includes("error")) {
    return "failed";
  }

  if (
    normalized.includes("done") ||
    normalized.includes("complete") ||
    normalized.includes("success") ||
    normalized.includes("finish")
  ) {
    return "completed";
  }

  if (normalized.includes("queue") || normalized.includes("pending") || normalized.includes("wait")) {
    return "queued";
  }

  return "processing";
};

const normalizeRecommendation = (value: unknown): string | null => {
  if (Array.isArray(value)) {
    const items = value
      .map((item) => toStringOrNull(item))
      .filter((item): item is string => Boolean(item));

    return items.length > 0 ? items.join(" ") : null;
  }

  return coalesceString(value);
};

export const normalizeAiHealthScan = (
  payload: any,
  fallbackId?: string | null,
): AiHealthScanRecord => {
  const root = asRecord(payload);
  const scanNode = asRecord(root.scan);
  const resultNode = asRecord(root.result);
  const analysisNode = asRecord(root.analysis);
  const metaNode = asRecord(root.meta);

  const findingsSource =
    root.findings ??
    scanNode.findings ??
    resultNode.findings ??
    analysisNode.findings ??
    root.detected_conditions ??
    root.conditions ??
    root.issues;

  const findings = arrayify(findingsSource).map((finding, index) => {
    if (typeof finding === "string") {
      return {
        type: "general",
        severity: "medium" as const,
        title: `發現項目 ${index + 1}`,
        description: finding,
        recommendation: null,
        costImpact: null,
        confidence: null,
      };
    }

    const item = asRecord(finding);

    return {
      id: coalesceString(item.id, item.uuid) ?? undefined,
      type: coalesceString(item.type, item.category, item.code, item.label, "general") ?? "general",
      severity: normalizeSeverity(item.severity ?? item.level ?? item.risk_level),
      title:
        coalesceString(item.title, item.name, item.label, item.type) ??
        `發現項目 ${index + 1}`,
      description:
        coalesceString(item.description, item.summary, item.details, item.message) ??
        "AI 已偵測到可能需要持續觀察的狀況。",
      recommendation: normalizeRecommendation(
        item.recommendation ?? item.suggestion ?? item.advice ?? item.next_step ?? item.next_steps,
      ),
      costImpact: coalesceNumber(
        item.cost_impact,
        item.costImpact,
        item.preventive_savings,
        item.preventiveSavings,
        item.estimated_savings,
      ),
      confidence: normalizePercent(item.confidence ?? item.confidence_score),
    };
  });

  const hasResult =
    findings.length > 0 ||
    normalizePercent(
      root.health_score ??
        root.healthScore ??
        scanNode.health_score ??
        resultNode.health_score ??
        analysisNode.health_score,
    ) !== null ||
    coalesceString(
      root.summary,
      root.overview,
      root.analysis_summary,
      resultNode.summary,
      resultNode.overview,
      analysisNode.summary,
      analysisNode.overview,
    ) !== null;

  return {
    id:
      coalesceString(
        root.id,
        root.scan_id,
        root.uuid,
        scanNode.id,
        scanNode.scan_id,
        scanNode.uuid,
        metaNode.id,
        fallbackId,
      ) ?? "",
    status: normalizeStatus(
      root.status ?? root.scan_status ?? root.state ?? scanNode.status ?? resultNode.status ?? analysisNode.status,
      hasResult,
    ),
    summary: coalesceString(
      root.summary,
      root.overview,
      root.analysis_summary,
      root.message,
      resultNode.summary,
      resultNode.overview,
      analysisNode.summary,
      analysisNode.overview,
    ),
    confidence: normalizePercent(
      root.confidence ??
        root.confidence_score ??
        scanNode.confidence ??
        resultNode.confidence ??
        analysisNode.confidence,
    ),
    healthScore: normalizePercent(
      root.health_score ??
        root.healthScore ??
        scanNode.health_score ??
        resultNode.health_score ??
        analysisNode.health_score,
    ),
    preventiveSavings: coalesceNumber(
      root.preventive_savings,
      root.preventiveSavings,
      root.estimated_savings,
      scanNode.preventive_savings,
      resultNode.preventive_savings,
      resultNode.estimated_savings,
      analysisNode.preventive_savings,
      analysisNode.estimated_savings,
    ),
    remainingFreeScans: coalesceNumber(
      root.remaining_free_scans,
      root.remainingFreeScans,
      root.free_scans_left,
      root.freeScansLeft,
      metaNode.remaining_free_scans,
      metaNode.free_scans_left,
    ),
    imageUrl: coalesceString(
      root.image_url,
      root.imageUrl,
      root.photo_url,
      root.photoUrl,
      scanNode.image_url,
      scanNode.photo_url,
    ),
    reportUrl: coalesceString(
      root.report_url,
      root.reportUrl,
      resultNode.report_url,
      analysisNode.report_url,
    ),
    createdAt: coalesceString(
      root.created_at,
      root.createdAt,
      scanNode.created_at,
      scanNode.createdAt,
    ),
    findings,
    raw: payload,
  };
};

export const aiHealthService = {
  create: ({ file, petId }: CreateAiHealthScanPayload) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("image", file);
    formData.append("pet_id", petId);

    return api.post("/ai-health/scans", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }) as Promise<any>;
  },

  get: (id: string) => api.get(`/ai-health/scans/${id}`) as Promise<any>,
};

export const aiDoctorService = {
  consult: ({ petId, message, history = [] }: CreateAiDoctorConsultationPayload) =>
    api.post("/ai-doctor/consultations", {
      pet_id: petId,
      message,
      history,
    }) as Promise<AiDoctorConsultationResponse>,
};
