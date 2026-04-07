import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Activity,
  AlertCircle,
  HeartPulse,
  PencilLine,
  PlusCircle,
  ShieldCheck,
  Stethoscope,
  Syringe,
  Weight,
} from "lucide-react";
import { usePets, usePetDashboard } from "../../hooks/useApi";
import { breedLabel } from "../../lib/pet-breeds";
import type {
  DashboardChecklistItem,
  DashboardPreventiveCareStatus,
  DashboardRecentHealthRecord,
  PetDashboardResponse,
  PetRecord,
} from "../../services/services";
import { Button } from "../components/ui/button";
import { InsuranceCard } from "../components/ui/InsuranceCard";
import { RiskInsight } from "../components/ui/RiskInsight";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";

function MetricSkeleton() {
  return (
    <Card>
      <CardContent className="animate-pulse p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gray-200" />
          <div className="flex-1 space-y-1">
            <div className="h-3 w-1/2 rounded bg-gray-200" />
            <div className="h-5 w-1/3 rounded bg-gray-200" />
          </div>
        </div>
        <div className="h-2 rounded bg-gray-200" />
      </CardContent>
    </Card>
  );
}

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  iconClassName: string;
  iconWrapperClassName: string;
  label: string;
  value: string;
  note: string;
  progress: number;
  subValue?: string | null;
}

function MetricCard({
  icon: Icon,
  iconClassName,
  iconWrapperClassName,
  label,
  value,
  note,
  progress,
  subValue,
}: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className={`rounded-lg p-2 ${iconWrapperClassName}`}>
            <Icon className={`h-5 w-5 ${iconClassName}`} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-lg font-bold">{value}</p>
            {subValue ? <p className="text-xs text-muted-foreground">{subValue}</p> : null}
          </div>
        </div>
        <Progress value={progress} className="mb-1 h-2" />
        <p className="text-xs text-muted-foreground">{note}</p>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const { data: pets, isLoading: petsLoading } = usePets();
  const [activePetId, setActivePetId] = useState<string>("");

  const selectedPetId = activePetId || String(pets?.[0]?.id ?? "");
  const { data: petDashboard, isLoading: dashboardLoading, isError } = usePetDashboard(selectedPetId);

  const selectedPet = pets?.find((pet: PetRecord) => String(pet.id) === String(selectedPetId));
  const dashboard = petDashboard as PetDashboardResponse | undefined;
  const insuranceType = dashboard?.insurance_type ?? selectedPet?.insurance_type;
  const petTypeLabel = dashboard?.type_label ?? selectedPet?.type_label ?? "寵物";
  const recommendedPlan = dashboard?.recommended_plan;
  const risk = dashboard?.risk_profile;
  const healthSummary = dashboard?.health_summary;
  const latestWeight = dashboard?.latest_weight;
  const activitySummary = dashboard?.activity_summary;
  const checkupStatus = dashboard?.preventive_care?.checkup;
  const vaccineStatus = dashboard?.preventive_care?.vaccine;
  const recentRecords = dashboard?.recent_health_records ?? [];

  const isLoading = petsLoading || dashboardLoading;

  const nextActionItems = healthSummary?.missing_items ?? [];
  const insightCards = risk?.insights ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">健康儀表板</h1>
          <p className="text-muted-foreground">
            根據毛孩的健康數據，我們為您整合保費優化、風險洞察與照護提醒。
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {pets && pets.length > 0 ? (
            <select
              id="pet-selector"
              value={selectedPetId}
              onChange={(event) => setActivePetId(event.target.value)}
              className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
            >
              {pets.map((pet: PetRecord) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                </option>
              ))}
            </select>
          ) : null}

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/pets/add")}>
              <PlusCircle className="h-4 w-4" />
              新增寵物
            </Button>
            {selectedPetId ? (
              <Button onClick={() => navigate(`/pets/${selectedPetId}/edit`)}>
                <PencilLine className="h-4 w-4" />
                編輯資料
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {isError ? (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">目前無法取得健康儀表板資料，請稍後再試一次。</p>
        </div>
      ) : null}

      {selectedPetId && insuranceType ? (
        <Card className="border-2 border-slate-200 bg-slate-50/80">
          <CardContent className="p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#4CAF50]" />
                  目前投保對應
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {(selectedPet?.name ?? dashboard?.name) || "毛孩"} 目前屬於 {petTypeLabel}，將優先對應 {insuranceType.label}
                </h2>
                <p className="mt-1 text-sm text-slate-600">{insuranceType.description}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                  <span className="rounded-full bg-white px-3 py-1 shadow-sm">
                    品種：{breedLabel(selectedPet?.breed || dashboard?.breed) || selectedPet?.breed || dashboard?.breed || "尚未填寫"}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 shadow-sm">
                    晶片：{selectedPet?.has_microchip || dashboard?.has_microchip ? "已填寫" : "尚未完成"}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 shadow-sm">
                    寵登：{selectedPet?.is_registered || dashboard?.is_registered ? "已完成" : "尚未完成"}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
                <p className="mb-1 text-xs font-semibold text-green-700">可投保物種</p>
                <p>{insuranceType.eligible_species.join(" / ") || "尚未設定"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {isLoading ? (
            <Card className="h-44 animate-pulse bg-gray-100" />
          ) : (
            <InsuranceCard
              planName={recommendedPlan?.name ?? `${selectedPet?.name ?? "毛孩"} 專屬守護方案`}
              providerName={recommendedPlan?.provider_name}
              currency={recommendedPlan?.currency ?? "TWD"}
              marketPrice={recommendedPlan?.market_price_monthly ?? 50}
              yourPrice={recommendedPlan?.discounted_price_monthly ?? 50}
              savings={recommendedPlan?.monthly_savings ?? 0}
              highlights={recommendedPlan?.why_recommended ?? []}
              nextMilestone={
                recommendedPlan?.next_milestone
                  ? {
                      action: recommendedPlan.next_milestone.title,
                      newPrice: recommendedPlan.next_milestone.projected_price_monthly,
                      progress: recommendedPlan.next_milestone.progress_percent,
                      helperText: recommendedPlan.next_milestone.helper_text,
                    }
                  : undefined
              }
              badge={
                risk?.risk_level === "low"
                  ? "已優化"
                  : recommendedPlan?.ranking_position
                    ? `推薦 #${recommendedPlan.ranking_position}`
                    : undefined
              }
            />
          )}
        </div>

        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="text-base">風險評分</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-12 rounded bg-gray-200" />
                <div className="h-4 w-2/3 rounded bg-gray-200" />
              </div>
            ) : risk ? (
              <>
                <div className="text-center">
                  <p className="text-5xl font-bold text-[#4CAF50]">{risk.score}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    風險等級：
                    <span className={`font-semibold ${riskLevelColor(risk.risk_level)}`}>
                      {riskLevelLabel(risk.risk_level)}
                    </span>
                  </p>
                </div>
                <Progress value={Math.min(risk.score, 100)} className="h-3" />
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-center">
                  <p className="mb-1 text-xs text-green-700">目前折扣</p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-lg font-bold text-green-600">
                      {dashboard?.discount_status?.discount_percent ?? 0}%
                    </span>
                  </div>
                </div>
                <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-700">目前最值得優先處理</p>
                  {(nextActionItems.length > 0 ? nextActionItems : defaultChecklist()).slice(0, 3).map((item) => (
                    <div key={item.key} className="rounded-md bg-white px-3 py-2 text-sm text-slate-700">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.helper}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground">尚無風險資料</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => <MetricSkeleton key={index} />)
        ) : (
          <>
            <MetricCard
              icon={Weight}
              iconClassName="text-purple-600"
              iconWrapperClassName="bg-purple-50"
              label="最新體重"
              value={latestWeight?.value_kg != null ? `${latestWeight.value_kg} kg` : "尚無紀錄"}
              subValue={formatWeightDelta(latestWeight?.delta_kg)}
              note={latestWeight?.note ?? "尚未建立體重紀錄"}
              progress={latestWeight?.progress ?? 0}
            />
            <MetricCard
              icon={Activity}
              iconClassName="text-blue-600"
              iconWrapperClassName="bg-blue-50"
              label="近 7 日活動"
              value={`${activitySummary?.minutes_last_7_days ?? 0} 分鐘`}
              subValue={activitySummary ? `今日 ${activitySummary.today_minutes} 分鐘` : undefined}
              note={activitySummary?.note ?? "尚無活動紀錄"}
              progress={activitySummary?.progress ?? 0}
            />
            <MetricCard
              icon={Stethoscope}
              iconClassName="text-cyan-600"
              iconWrapperClassName="bg-cyan-50"
              label="最近健檢"
              value={preventiveValue(checkupStatus, "健檢")}
              note={checkupStatus?.note ?? "尚未建立健檢紀錄"}
              progress={checkupStatus?.progress ?? 0}
            />
            <MetricCard
              icon={Syringe}
              iconClassName="text-red-600"
              iconWrapperClassName="bg-red-50"
              label="疫苗狀態"
              value={preventiveLabel(vaccineStatus)}
              note={vaccineStatus?.note ?? "尚未建立疫苗紀錄"}
              progress={vaccineStatus?.progress ?? 0}
            />
          </>
        )}
      </div>

      {!isLoading && selectedPetId ? (
        <Card className="border-slate-200">
          <CardContent className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">下一步建議</p>
              <p className="text-sm text-muted-foreground">
                {nextActionItems.length > 0
                  ? `優先補齊：${nextActionItems.slice(0, 2).map((item) => item.label).join("、")}`
                  : "目前健康檔案完整度良好，建議持續維持規律更新。"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => navigate(`/insurance?pet=${selectedPetId}`)}>
                查看保險方案
              </Button>
              <Button onClick={() => navigate(`/pets/${selectedPetId}/add-record`)}>
                新增健康紀錄
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && risk ? (
        <div>
          <h2 className="mb-4 text-xl font-bold">智慧風險洞察</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {insightCards.map((insight) => (
              <RiskInsight
                key={insight.key}
                metric={insight.title}
                currentStatus={insight.current_status}
                statusType={insight.status_type}
                actionRecommendation={insight.recommendation}
                financialImpact={insight.financial_impact}
              />
            ))}
          </div>
        </div>
      ) : null}

      {!isLoading && recentRecords.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>最近健康紀錄</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRecords.map((record) => (
                <RecentRecordRow key={record.id} record={record} />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && (!pets || pets.length === 0) ? (
        <Card className="py-12 text-center">
          <CardContent>
            <div className="mb-4 text-5xl">🐾</div>
            <h3 className="mb-2 text-lg font-semibold">還沒有建立寵物資料</h3>
            <p className="text-sm text-muted-foreground">
              先新增第一隻毛孩，我們就能開始整理健康資料、保險建議與照護提醒。
            </p>
            <Button className="mt-4" onClick={() => navigate("/pets/add")}>
              <PlusCircle className="h-4 w-4" />
              新增寵物
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function RecentRecordRow({ record }: { record: DashboardRecentHealthRecord }) {
  return (
    <div className="flex items-center gap-4 border-b pb-4 last:border-0">
      <div className="w-24 text-sm font-semibold text-muted-foreground">
        {record.date ? formatDate(record.date) : "—"}
      </div>
      <div className="h-2 w-2 rounded-full bg-[#4CAF50]" />
      <div className="flex-1">
        <p className="font-semibold">{record.record_type_label}</p>
        <p className="text-sm text-muted-foreground">{record.summary}</p>
      </div>
    </div>
  );
}

function preventiveValue(status?: DashboardPreventiveCareStatus, fallbackLabel?: string) {
  if (!status) {
    return "尚無紀錄";
  }

  if (status.days_since == null) {
    return fallbackLabel ? `尚無${fallbackLabel}` : "尚無紀錄";
  }

  return `${status.days_since} 天前`;
}

function preventiveLabel(status?: DashboardPreventiveCareStatus) {
  if (!status) {
    return "尚無紀錄";
  }

  if (status.status === "good") {
    return "已追蹤";
  }

  if (status.status === "attention") {
    return "需確認";
  }

  return "未建立";
}

function formatWeightDelta(deltaKg?: number | null) {
  if (deltaKg == null) {
    return null;
  }

  const sign = deltaKg > 0 ? "+" : "";
  return `較上次 ${sign}${deltaKg} kg`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

function riskLevelLabel(level: "low" | "medium" | "high") {
  if (level === "high") {
    return "高";
  }

  if (level === "medium") {
    return "中";
  }

  return "低";
}

function riskLevelColor(level: "low" | "medium" | "high") {
  if (level === "high") {
    return "text-red-600";
  }

  if (level === "medium") {
    return "text-yellow-600";
  }

  return "text-green-600";
}

function defaultChecklist(): DashboardChecklistItem[] {
  return [
    {
      key: "healthy",
      label: "持續維護健康紀錄",
      completed: false,
      helper: "定期更新體重、健檢與疫苗狀態，可讓保費估算更準確。",
    },
  ];
}
