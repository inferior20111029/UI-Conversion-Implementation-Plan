import { useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { ArrowLeft, AlertCircle, ExternalLink, Loader2, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ActionCTA } from "../components/ui/ActionCTA";
import type { PetRecord } from "../../services/services";
import { useInsurancePlanDetail, usePets } from "../../hooks/useApi";

export function InsuranceDetail() {
  const { planId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const { data: pets } = usePets();
  const fallbackPetId = pets?.[0]?.id;
  const selectedPetId = searchParams.get("pet") || fallbackPetId;
  const selectedPet = useMemo(
    () => pets?.find((pet: PetRecord) => String(pet.id) === String(selectedPetId)),
    [pets, selectedPetId],
  );
  const { data: plan, isLoading, isError } = useInsurancePlanDetail(planId, selectedPetId);

  const coverageEntries = useMemo(
    () => Object.entries(plan?.coverage ?? {}).filter(([, enabled]) => Boolean(enabled)),
    [plan],
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse h-48 bg-gray-100" />
        <Card className="animate-pulse h-64 bg-gray-100" />
      </div>
    );
  }

  if (isError || !plan) {
    return (
      <div className="space-y-6">
        <Link to="/insurance" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" />
          返回保險方案
        </Link>
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">無法載入方案詳情，請稍後再試。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/insurance" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-slate-900">
        <ArrowLeft className="w-4 h-4" />
        返回保險方案
      </Link>

      <Card className="border-0 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60 mb-3">{plan.provider.name}</p>
              <h1 className="text-3xl font-bold mb-3">{plan.plan.name}</h1>
              <p className="max-w-2xl text-sm text-white/80">{plan.plan.summary || "保險公司已同步此方案的保障摘要與投保條件。"}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {plan.badges.map((badge: string) => (
                  <Badge key={badge} className="bg-white/10 text-white border-white/20">{badge}</Badge>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
              <p className="text-xs text-white/70 mb-1">年保費區間</p>
              <p className="text-2xl font-bold">
                {plan.pricing.currency} {plan.pricing.annual_premium_min.toLocaleString()} - {plan.pricing.annual_premium_max.toLocaleString()}
              </p>
              <p className="mt-2 text-xs text-white/70">演算法版本：{plan.algorithm_version || "v1"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-[1.7fr_1fr] gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>保障內容</CardTitle>
              <CardDescription>依 Provider catalog 投影的保障摘要</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-3">
              {coverageEntries.map(([key]) => (
                <div key={key} className="rounded-xl border bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                  {coverageLabel(key)}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>投保資格</CardTitle>
              <CardDescription>保險公司同步的可投保條件</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4 text-sm text-slate-700">
              <div className="rounded-xl border bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500 mb-2">物種</p>
                <p>{((plan.eligibility.species_supported as string[]) || []).join(" / ") || "未限制"}</p>
              </div>
              <div className="rounded-xl border bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500 mb-2">年齡範圍</p>
                <p>
                  最低 {(plan.eligibility.min_age_months as number | null) ?? "未限制"} 月 / 最高 {(plan.eligibility.max_age_years as number | null) ?? "未限制"} 歲
                </p>
              </div>
              <div className="rounded-xl border bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500 mb-2">晶片要求</p>
                <p>{plan.eligibility.requires_microchip ? "需要" : "未明確要求"}</p>
              </div>
              <div className="rounded-xl border bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500 mb-2">寵登要求</p>
                <p>{plan.eligibility.requires_registration ? "需要" : "未明確要求"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>等待期與理賠限制</CardTitle>
              <CardDescription>投保前應先確認的重要規則</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-700">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl border bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-500 mb-2">一般疾病等待期</p>
                  <p>{plan.waiting_period.general_conditions_days ?? "未提供"} 天</p>
                </div>
                <div className="rounded-xl border bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-500 mb-2">重大疾病等待期</p>
                  <p>{plan.waiting_period.major_conditions_days ?? "未提供"} 天</p>
                </div>
              </div>
              <div className="rounded-xl border bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500 mb-2">理賠需求</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(plan.claim_requirements).map(([key, value]) => (
                    <Badge key={key} variant="secondary">
                      {claimRequirementLabel(key)}: {value === null ? "未提供" : value ? "需要 / 支援" : "否"}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                推薦摘要
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPet && (
                <div className="rounded-xl border bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-500 mb-2">目前匹配對象</p>
                  <div className="space-y-2 text-sm text-slate-700">
                    <p>{selectedPet.name} / {selectedPet.type_label ?? selectedPet.type}</p>
                    <p>品種：{selectedPet.breed || "尚未填寫"}</p>
                    <p>晶片：{selectedPet.has_microchip ? selectedPet.microchip_number || "已填寫" : "尚未填寫"}</p>
                  </div>
                </div>
              )}
              <div className="rounded-xl bg-green-50 p-4 border border-green-200">
                <p className="text-xs font-semibold text-green-700 mb-1">推薦原因</p>
                <ul className="space-y-2 text-sm text-green-900">
                  {plan.why_recommended.map((reason: string) => (
                    <li key={reason}>• {reason}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500 mb-2">分數拆解</p>
                {plan.score_breakdown ? (
                  <div className="space-y-2 text-sm">
                    {Object.entries(plan.score_breakdown).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span>{scoreLabel(key)}</span>
                        <strong>{value}</strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">目前沒有可用的個人化分數。</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>不保事項摘要</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-700">
                {plan.exclusions.length > 0 ? (
                  plan.exclusions.map((item: string) => <li key={item}>• {item}</li>)
                ) : (
                  <li>尚未提供結構化不保事項</li>
                )}
              </ul>
            </CardContent>
          </Card>

          <ActionCTA
            primaryText={plan.terms.url ? "查看條款連結" : "條款連結未提供"}
            secondaryText={plan.terms.source_updated_at ? `來源更新時間：${new Date(plan.terms.source_updated_at).toLocaleString("zh-TW")}` : "目前尚未同步條款更新時間"}
            onClick={() => {
              if (plan.terms.url) {
                window.open(plan.terms.url, "_blank", "noopener,noreferrer");
              }
            }}
            variant="premium"
            icon={plan.terms.url ? <ExternalLink className="w-5 h-5 ml-2" /> : <Loader2 className="w-5 h-5 ml-2" />}
          />
        </div>
      </div>
    </div>
  );
}

function coverageLabel(key: string) {
  const labels: Record<string, string> = {
    medical: "醫療保障",
    liability: "侵權責任",
    lost_pet_ad: "協尋廣告",
    owner_hospital_boarding: "住院寄宿",
    funeral: "喪葬費用",
    reacquisition: "重新購置",
  };

  return labels[key] || key;
}

function scoreLabel(key: string) {
  const labels: Record<string, string> = {
    risk: "風險適配",
    coverage: "保障適配",
    claimability: "理賠可行性",
    sponsor: "商業加權",
  };

  return labels[key] || key;
}

function claimRequirementLabel(key: string) {
  const labels: Record<string, string> = {
    diagnosis_with_chip_id: "診斷需含晶片編號",
    original_receipt_required: "需正本收據",
    digital_records_supported: "支援數位病歷",
    referral_rule_required: "需轉診規則",
  };

  return labels[key] || key;
}
