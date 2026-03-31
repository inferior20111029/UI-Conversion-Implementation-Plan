import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ActionCTA } from "../components/ui/ActionCTA";
import { Badge } from "../components/ui/badge";
import { Check, Shield, Zap, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { Progress } from "../components/ui/progress";
import { useAffiliateOffers, useLogAffiliateClick, useDiscountEstimate, usePets } from "../../hooks/useApi";
import { useState } from "react";

export function Insurance() {
  const { data: pets } = usePets();
  const activePetId = pets?.[0]?.id ?? "";

  const { data: offers, isLoading: offersLoading, isError: offersError } = useAffiliateOffers();
  const { data: discount, isLoading: discountLoading } = useDiscountEstimate(activePetId);
  const { mutate: logClick } = useLogAffiliateClick();

  const handleOfferClick = async (offer: any) => {
    logClick(offer.id, {
      onSuccess: (res: any) => {
        const url = res?.data?.redirect_url ?? offer.url;
        window.open(url, "_blank", "noopener,noreferrer");
      },
      onError: () => {
        // still open URL even if logging fails
        window.open(offer.url, "_blank", "noopener,noreferrer");
      },
    });
  };

  const offerTypeLabel: Record<string, string> = {
    INSURANCE: "保險方案",
    FOOD: "健康飲食",
    VET: "獸醫服務",
  };

  const offerTypeBadge: Record<string, string> = {
    INSURANCE: "bg-blue-100 text-blue-700",
    FOOD: "bg-green-100 text-green-700",
    VET: "bg-purple-100 text-purple-700",
  };

  const isLoading = offersLoading || discountLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">保險方案</h1>
        <p className="text-muted-foreground">
          基於您毛孩的健康數據，我們提供個人化的動態保費優惠
        </p>
      </div>

      {/* Value Proposition Banner - from real risk data */}
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
                  ? `${pets?.[0]?.name ?? "您的毛孩"} 目前風險等級：${discount.risk_level}，可獲得最高 ${discount.discount_percent}% 保費折扣`
                  : "每一筆健康紀錄，都能即時降低您的保費。健康數據越好，保費越便宜！"}
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

      {/* Discount Unlock Actions */}
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

      {/* Affiliate Offers from API */}
      <div>
        <h2 className="text-xl font-bold mb-4">推薦合作方案</h2>

        {isLoading && (
          <div className="grid lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse h-64 bg-gray-100" />
            ))}
          </div>
        )}

        {offersError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">無法載入方案資料，請稍後再試。</p>
          </div>
        )}

        {!isLoading && offers && (
          <div className="grid lg:grid-cols-3 gap-6">
            {offers.map((offer: any) => (
              <div key={offer.id} className="space-y-4">
                <Card className="border-2 hover:border-[#4CAF50] transition-colors cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${offerTypeBadge[offer.offer_type] ?? "bg-gray-100 text-gray-700"}`}>
                        {offerTypeLabel[offer.offer_type] ?? offer.offer_type}
                      </span>
                    </div>
                    <CardTitle className="text-base">{offer.title}</CardTitle>
                    <CardDescription className="text-xs">{offer.partner_name}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-700">{offer.description}</p>
                    <ActionCTA
                      primaryText={
                        <span className="flex items-center gap-2 justify-center">
                          立即查看 <ExternalLink className="w-4 h-4" />
                        </span> as any
                      }
                      secondaryText="點擊後將記錄您的使用回饋"
                      onClick={() => handleOfferClick(offer)}
                      variant={offer.offer_type === "INSURANCE" ? "success" : "default"}
                    />
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}

        {!isLoading && offers?.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-muted-foreground">目前沒有可用的合作方案</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* How It Works */}
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
              { step: "1", title: "記錄健康數據", desc: "透過 APP 記錄體重、飲食、疫苗等健康指標", color: "blue" },
              { step: "2", title: "風險引擎分析", desc: "我們的規則引擎即時評估風險並計算折扣", color: "green" },
              { step: "3", title: "自動降低保費", desc: "健康分數越高，對應的保費折扣越大", color: "purple" },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-lg p-4">
                <div className={`w-10 h-10 bg-${item.color}-100 rounded-full flex items-center justify-center mb-3`}>
                  <span className={`text-${item.color}-600 font-bold`}>{item.step}</span>
                </div>
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
