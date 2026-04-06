import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ActionCTA } from "../components/ui/ActionCTA";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Shield, Zap, Loader2, AlertCircle, Sparkles, PencilLine, PlusCircle } from "lucide-react";
import { Progress } from "../components/ui/progress";
import { useDiscountEstimate, useInsurancePlans, usePets } from "../../hooks/useApi";
import type { PetRecord } from "../../services/services";
import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";

export function Insurance() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: pets, isLoading: petsLoading } = usePets();
  const activePetId = searchParams.get("pet") || pets?.[0]?.id || "";
  const selectedPet = useMemo(() => {
    const matchedPet = pets?.find((pet: PetRecord) => String(pet.id) === String(activePetId));
    return matchedPet;
  }, [activePetId, pets]);

  const { data: insurancePlans, isLoading: plansLoading, isError: plansError } = useInsurancePlans(activePetId);
  const { data: discount, isLoading: discountLoading } = useDiscountEstimate(activePetId);
  const isLoading = plansLoading || discountLoading;
  const plans = insurancePlans?.plans ?? [];
  const insuranceType = selectedPet?.insurance_type ?? insurancePlans?.meta?.pet?.insurance_type;
  const selectedPetName = selectedPet?.name ?? insurancePlans?.meta?.pet?.name ?? "您的毛孩";
  const selectedPetTypeLabel = selectedPet?.type_label ?? insurancePlans?.meta?.pet?.type_label ?? "寵物";
  const hasMicrochip = selectedPet?.has_microchip ?? insurancePlans?.meta?.pet?.has_microchip ?? false;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">保險方案</h1>
          <p className="text-muted-foreground">
            依據毛孩的健康資料、物種條件與保險公司策略，同步呈現最適合的保費列表。
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {pets && pets.length > 0 && (
            <select
              id="insurance-pet-selector"
              value={activePetId}
              onChange={(e) => setSearchParams({ pet: e.target.value })}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
            >
              {pets.map((pet: PetRecord) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                </option>
              ))}
            </select>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/pets/add")}>
              <PlusCircle className="h-4 w-4" />
              新增寵物
            </Button>
            {activePetId && (
              <Button onClick={() => navigate(`/pets/${activePetId}/edit`)}>
                <PencilLine className="h-4 w-4" />
                編輯寵物
              </Button>
            )}
          </div>
        </div>
      </div>

      {!petsLoading && (!pets || pets.length === 0) && (
        <Card className="border-dashed border-2 text-center py-12">
          <CardContent>
            <div className="text-5xl mb-4">🐾</div>
            <h3 className="text-lg font-semibold mb-2">先建立寵物資料，才能匹配保險方案</h3>
            <p className="text-muted-foreground text-sm mb-4">
              保費列表會依毛孩的物種與基本條件，對應犬用或貓用保險方案。
            </p>
            <Button onClick={() => navigate("/pets/add")}>
              <PlusCircle className="h-4 w-4" />
              新增第一隻寵物
            </Button>
          </CardContent>
        </Card>
      )}

      {activePetId && insuranceType && (
        <Card className="border-2 border-slate-200 bg-slate-50/80">
          <CardContent className="p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                  <Shield className="h-3.5 w-3.5 text-[#4CAF50]" />
                  保險類型匹配
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {selectedPetName} 目前屬於 {selectedPetTypeLabel}，優先查看 {insuranceType.label}
                </h2>
                <p className="mt-1 text-sm text-slate-600">{insuranceType.description}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                  <span className="rounded-full bg-white px-3 py-1 shadow-sm">
                    品種：{selectedPet?.breed ?? insurancePlans?.meta?.pet?.breed ?? "尚未填寫"}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 shadow-sm">
                    晶片：{hasMicrochip ? "已填寫" : "尚未填寫"}
                  </span>
                </div>
              </div>
              <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
                <p className="text-xs font-semibold text-green-700 mb-1">可投保物種</p>
                <p>{insuranceType.eligible_species.join(" / ")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activePetId && (
        <>
          <Card className="bg-gradient-to-r from-[#4CAF50] to-emerald-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-6 h-6" />
                    <h3 className="text-xl font-bold">動態保費優化引擎</h3>
                  </div>
                  <p className="text-white/90 text-sm">
                    {discount
                      ? `${selectedPetName} 目前風險等級：${discount.risk_level}，可獲得最高 ${discount.discount_percent}% 保費折扣`
                      : "每一筆健康紀錄，都能即時降低您的保費。健康數據越好，保費越便宜。"}
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center min-w-[140px]">
                  {discountLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  ) : (
                    <>
                      <p className="text-sm opacity-90 mb-1">您的折扣</p>
                      <p className="text-3xl font-bold">{discount?.discount_percent ?? 0}%</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {discount && discount.unlock_actions?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>解鎖更多折扣</CardTitle>
                <CardDescription>完成以下健康任務，立即提升保費折扣</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {discount.unlock_actions.map((action: string, i: number) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{action}</span>
                      <Badge variant="secondary">+5%</Badge>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div>
            <div className="flex flex-col gap-1 mb-4">
              <h2 className="text-xl font-bold">推薦保險方案</h2>
              <p className="text-sm text-muted-foreground">
                由保險公司策略引擎同步的可投保方案，已依 {selectedPetName} 的條件完成排序。
              </p>
            </div>

            {isLoading && (
              <div className="grid lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="animate-pulse h-64 bg-gray-100" />
                ))}
              </div>
            )}

            {plansError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">無法載入保費列表，請確認 API 是否完成同步後再試。</p>
              </div>
            )}

            {!isLoading && plans.length > 0 && (
              <div className="grid lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div key={plan.id} className="space-y-4">
                    <Card className="border-2 hover:border-[#4CAF50] transition-colors group">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <Badge variant="secondary">#{plan.ranking_position} 推薦</Badge>
                          <div className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                            <Sparkles className="w-3.5 h-3.5" />
                            分數 {plan.final_score}
                          </div>
                        </div>
                        <CardTitle className="text-base">{plan.name}</CardTitle>
                        <CardDescription className="text-xs">{plan.provider_name}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-700">
                            {plan.summary || "保險公司已提供結構化保障說明，可於詳情頁查看完整內容。"}
                          </p>
                          <p className="mt-3 text-lg font-semibold text-slate-900">
                            {plan.currency} {plan.annual_premium_min.toLocaleString()} - {plan.annual_premium_max.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">年保費區間</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {plan.badges.map((badge) => (
                            <Badge key={badge} variant="secondary">{badge}</Badge>
                          ))}
                        </div>
                        <div className="rounded-xl bg-slate-50 p-4">
                          <p className="text-xs font-semibold text-slate-600 mb-2">推薦原因</p>
                          <ul className="space-y-1 text-sm text-slate-700">
                            {plan.why_recommended.map((reason) => (
                              <li key={reason}>• {reason}</li>
                            ))}
                          </ul>
                        </div>
                        <ActionCTA
                          primaryText="查看方案詳情"
                          secondaryText="查看保障內容、等待期、不保事項與理賠需求"
                          onClick={() => navigate(`/insurance/${plan.id}?pet=${activePetId}`)}
                          variant="success"
                        />
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && !plansError && plans.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-muted-foreground">
                    目前沒有符合 {selectedPetName} 條件的保險方案，請調整毛孩資料或稍後再試。
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                動態保費如何運作？
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { step: "1", title: "記錄健康數據", desc: "透過 APP 記錄體重、飲食、疫苗等健康指標", style: "bg-blue-100 text-blue-600" },
                  { step: "2", title: "風險引擎分析", desc: "我們的規則引擎即時評估風險並計算折扣", style: "bg-green-100 text-green-600" },
                  { step: "3", title: "自動降低保費", desc: "健康分數越高，對應的保費折扣越大", style: "bg-purple-100 text-purple-600" },
                ].map((item) => (
                  <div key={item.step} className="bg-white rounded-lg p-4">
                    <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${item.style}`}>
                      <span className="font-bold">{item.step}</span>
                    </div>
                    <h4 className="font-semibold mb-2">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
