import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { InsuranceCard } from "../components/ui/InsuranceCard";
import { RiskInsight } from "../components/ui/RiskInsight";
import { Progress } from "../components/ui/progress";
import { Droplet, Footprints, Heart, Weight, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { useDashboardSummary, usePets, usePetDashboard } from "../../hooks/useApi";
import { useState } from "react";

// ── Skeleton ────────────────────────────────────────────
function MetricSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 animate-pulse">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-gray-200" />
          <div className="flex-1 space-y-1">
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-5 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
        <div className="h-2 bg-gray-200 rounded" />
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  // Fetch pets list to pick the active one
  const { data: pets, isLoading: petsLoading } = usePets();
  const [activePetId, setActivePetId] = useState<string>("");

  // Use first pet if no selection yet
  const selectedPetId = activePetId || pets?.[0]?.id || "";
  const { data: petDashboard, isLoading: dashLoading, isError } = usePetDashboard(selectedPetId);

  const isLoading = petsLoading || dashLoading;
  const risk = petDashboard?.risk_profile;
  const discountStatus = petDashboard?.discount_status;
  const weightTrend = petDashboard?.weight_trend ?? [];
  const recentRecords = petDashboard?.recent_health_records ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">健康儀表板</h1>
          <p className="text-muted-foreground">
            根據毛孩的健康數據，我們為您優化保費與照護建議
          </p>
        </div>
        {/* Pet Selector */}
        {pets && pets.length > 0 && (
          <select
            id="pet-selector"
            value={selectedPetId}
            onChange={(e) => setActivePetId(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
          >
            {pets.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Error State */}
      {isError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">無法載入儀表板資料，請重新整理或稍後再試。</p>
        </div>
      )}

      {/* Insurance Card + Quick Stats */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {isLoading ? (
            <Card className="animate-pulse h-44 bg-gray-100" />
          ) : (
            <InsuranceCard
              planName="智慧健康守護方案"
              marketPrice={50}
              yourPrice={discountStatus ? 50 * (1 - (discountStatus.discount_percent || 0) / 100) : 50}
              savings={discountStatus?.discount_percent ? 50 * discountStatus.discount_percent / 100 : 0}
              nextMilestone={{
                action: risk?.recommendations?.[0] ?? "完成健康紀錄以解鎖折扣",
                newPrice: 45,
                progress: risk ? Math.min(risk.score, 100) : 0,
              }}
              badge={risk?.risk_level === "LOW" ? "已優化" : undefined}
            />
          )}
        </div>

        {/* Quick Stats from API */}
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="text-base">風險評分</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ) : risk ? (
              <>
                <div className="text-center">
                  <p className="text-5xl font-bold text-[#4CAF50]">{risk.score}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    風險等級：
                    <span className={`font-semibold ${
                      risk.risk_level === "LOW" ? "text-green-600" :
                      risk.risk_level === "MEDIUM" ? "text-yellow-600" : "text-red-600"
                    }`}>
                      {risk.risk_level === "LOW" ? "低" : risk.risk_level === "MEDIUM" ? "中" : "高"}
                    </span>
                  </p>
                </div>
                <Progress value={risk.score} className="h-3" />
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <p className="text-xs text-green-700 mb-1">預計折扣</p>
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-lg font-bold text-green-600">
                      {discountStatus?.discount_percent ?? 0}%
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">尚無評分資料</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Health Metrics (static + weight from API) */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <MetricSkeleton key={i} />)
        ) : (
          <>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-purple-50 p-2 rounded-lg">
                    <Weight className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">最新體重</p>
                    <p className="text-lg font-bold">
                      {weightTrend.length > 0
                        ? `${weightTrend[weightTrend.length - 1].weight_kg} kg`
                        : "未記錄"}
                    </p>
                  </div>
                </div>
                <Progress value={weightTrend.length > 0 ? 90 : 0} className="h-2 mb-1" />
                <p className="text-xs text-muted-foreground">
                  {weightTrend.length > 0 ? "已有體重紀錄" : "尚無體重紀錄"}
                </p>
              </CardContent>
            </Card>
            {[
              { icon: Footprints, label: "今日步數", value: "—", target: "需連接裝置", progress: 0, color: "text-blue-600", bgColor: "bg-blue-50" },
              { icon: Droplet, label: "飲水量", value: "—", target: "需連接裝置", progress: 0, color: "text-cyan-600", bgColor: "bg-cyan-50" },
              { icon: Heart, label: "疫苗狀態", value: recentRecords.some((r: any) => r.record_type === "VACCINE") ? "已接種" : "待確認", target: "基於紀錄", progress: recentRecords.some((r: any) => r.record_type === "VACCINE") ? 100 : 30, color: "text-red-600", bgColor: "bg-red-50" },
            ].map((metric) => {
              const Icon = metric.icon;
              return (
                <Card key={metric.label}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`${metric.bgColor} p-2 rounded-lg`}>
                        <Icon className={`w-5 h-5 ${metric.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">{metric.label}</p>
                        <p className="text-lg font-bold">{metric.value}</p>
                      </div>
                    </div>
                    <Progress value={metric.progress} className="h-2 mb-1" />
                    <p className="text-xs text-muted-foreground">{metric.target}</p>
                  </CardContent>
                </Card>
              );
            })}
          </>
        )}
      </div>

      {/* Risk Insights from API */}
      {!isLoading && risk && (
        <div>
          <h2 className="text-xl font-bold mb-4">智慧風險洞察</h2>
          <div className="grid lg:grid-cols-2 gap-4">
            {risk.factors.length === 0 ? (
              <RiskInsight
                metric="健康狀態良好"
                currentStatus="所有健康指標正常"
                statusType="success"
                actionRecommendation="繼續保持定期健康紀錄，維持低風險狀態"
                financialImpact={{ type: "decrease", amount: 10 }}
              />
            ) : (
              risk.factors.map((factor: string, i: number) => (
                <RiskInsight
                  key={i}
                  metric={factor}
                  currentStatus={risk.recommendations[i] ?? "建議採取行動"}
                  statusType="warning"
                  actionRecommendation={risk.recommendations[i] ?? ""}
                  financialImpact={{ type: "increase", amount: 5 }}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Recent Records Timeline */}
      {!isLoading && recentRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>最近健康紀錄</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRecords.map((record: any) => (
                <div key={record.id} className="flex items-center gap-4 pb-4 border-b last:border-0">
                  <div className="text-sm font-semibold text-muted-foreground w-24">
                    {new Date(record.date).toLocaleDateString("zh-TW")}
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#4CAF50]" />
                  <div className="flex-1">
                    <p className="font-semibold">{record.record_type}</p>
                    <p className="text-sm text-muted-foreground">
                      {record.notes || JSON.stringify(record.value)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State: No pets */}
      {!isLoading && (!pets || pets.length === 0) && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-5xl mb-4">🐾</div>
            <h3 className="text-lg font-semibold mb-2">尚未建立毛孩資料</h3>
            <p className="text-muted-foreground text-sm">
              新增您的第一隻寵物，開始追蹤健康紀錄與保費優化。
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
