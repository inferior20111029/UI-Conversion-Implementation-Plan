import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ActionCTA } from "../components/ui/ActionCTA";
import { Check, X, Zap, Crown, Shield, TrendingUp } from "lucide-react";

interface PlanFeature {
  name: string;
  free: boolean;
  professional: boolean;
  tooltip?: string;
}

export function Subscription() {
  const features: PlanFeature[] = [
    {
      name: "基本健康數據追蹤",
      free: true,
      professional: true,
    },
    {
      name: "每日健康提醒",
      free: true,
      professional: true,
    },
    {
      name: "每月 3 次 AI 健康掃描",
      free: true,
      professional: false,
    },
    {
      name: "無限 AI 健康掃描",
      free: false,
      professional: true,
    },
    {
      name: "動態保費減免系統",
      free: false,
      professional: true,
      tooltip: "根據健康數據自動優化保費，平均每月省 $25",
    },
    {
      name: "AI 疾病爆發預警",
      free: false,
      professional: true,
      tooltip: "提前 3-7 天預測潛在健康問題",
    },
    {
      name: "專屬獸醫諮詢優先權",
      free: false,
      professional: true,
    },
    {
      name: "完整健康報告下載",
      free: false,
      professional: true,
    },
    {
      name: "營養品與照護商品折扣",
      free: false,
      professional: true,
      tooltip: "所有商品享 15% 折扣",
    },
    {
      name: "區塊鏈健康證明",
      free: false,
      professional: true,
    },
    {
      name: "優先客服支援",
      free: false,
      professional: true,
    },
  ];

  const lossAversionPoints = [
    {
      icon: X,
      text: "無法享有動態保費減免",
      detail: "每月多付平均 $25",
    },
    {
      icon: X,
      text: "缺乏 AI 疾病爆發預警",
      detail: "錯過及早治療黃金期",
    },
    {
      icon: X,
      text: "無法使用完整健康分析",
      detail: "無法獲得完整的 ROI 計算",
    },
    {
      icon: X,
      text: "營養品與照護商品無折扣",
      detail: "每月多花 $15-30",
    },
  ];

  const professionalBenefits = [
    {
      metric: "平均每月節省保費",
      value: "$25",
      color: "text-green-600",
    },
    {
      metric: "預防醫療支出",
      value: "$150",
      color: "text-blue-600",
    },
    {
      metric: "商品折扣節省",
      value: "$20",
      color: "text-purple-600",
    },
    {
      metric: "總計月省",
      value: "$195",
      color: "text-[#4CAF50]",
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">訂閱方案</h1>
        <p className="text-muted-foreground">
          選擇最適合您的方案，開始節省保費與醫療成本
        </p>
      </div>

      {/* ROI Banner */}
      <Card className="border-2 border-[#4CAF50] bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-6">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#4CAF50] text-white px-4 py-2 rounded-full">
              <TrendingUp className="w-5 h-5" />
              <span className="font-bold">投資回報率分析</span>
            </div>
            <h3 className="text-2xl font-bold">
              每月只需 $12，平均每月可省下 $195
            </h3>
            <p className="text-sm text-gray-700">
              專業版會員透過保費優化、預防醫療與商品折扣，平均每月節省超過 16 倍訂閱費用
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Plans Comparison */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Free Plan */}
        <Card className="border-2 border-gray-300 relative">
          <CardHeader className="text-center pb-4">
            <div className="mb-3">
              <Shield className="w-12 h-12 mx-auto text-gray-400" />
            </div>
            <CardTitle className="text-2xl">無風險防護版</CardTitle>
            <div className="mt-4">
              <p className="text-4xl font-bold">$0</p>
              <p className="text-sm text-muted-foreground mt-1">永久免費</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold">包含功能：</p>
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    !feature.free ? "opacity-40" : ""
                  }`}
                >
                  {feature.free ? (
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <span className="text-sm">{feature.name}</span>
                </div>
              ))}
            </div>

            {/* Loss Aversion Section */}
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 space-y-3">
              <p className="font-semibold text-red-900 text-sm mb-2">
                ⚠️ 免費版限制
              </p>
              {lossAversionPoints.map((point, index) => {
                const Icon = point.icon;
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex items-start gap-2">
                      <Icon className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-red-900">
                        {point.text}
                      </span>
                    </div>
                    <p className="text-xs text-red-700 ml-6">{point.detail}</p>
                  </div>
                );
              })}
            </div>

            <ActionCTA
              primaryText="繼續使用免費版"
              secondaryText="隨時可升級專業版"
              onClick={() => console.log("Stay on free")}
              variant="default"
              size="default"
            />
          </CardContent>
        </Card>

        {/* Professional Plan */}
        <Card className="border-4 border-[#4CAF50] relative shadow-2xl transform lg:scale-105">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-[#4CAF50] text-white px-4 py-1.5 text-sm font-bold">
              ⭐ 最受歡迎
            </Badge>
          </div>

          <CardHeader className="text-center pb-4 pt-8">
            <div className="mb-3">
              <Crown className="w-12 h-12 mx-auto text-[#4CAF50]" />
            </div>
            <CardTitle className="text-2xl">專業守護版</CardTitle>
            <div className="mt-4">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-muted-foreground line-through">$20</span>
                <p className="text-4xl font-bold text-[#4CAF50]">$12</p>
                <span className="text-muted-foreground">/月</span>
              </div>
              <Badge variant="secondary" className="mt-2">
                限時優惠 40% off
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold">完整功能：</p>
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    !feature.professional ? "opacity-40" : ""
                  }`}
                >
                  {feature.professional ? (
                    <Check className="w-5 h-5 text-[#4CAF50] flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <span className="text-sm font-medium">{feature.name}</span>
                    {feature.tooltip && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {feature.tooltip}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ROI Breakdown */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-[#4CAF50]" />
                <p className="font-semibold text-green-900">每月價值分析</p>
              </div>

              {professionalBenefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-green-200 last:border-0"
                >
                  <span className="text-sm text-gray-700">{benefit.metric}</span>
                  <span className={`font-bold text-lg ${benefit.color}`}>
                    {benefit.value}
                  </span>
                </div>
              ))}

              <div className="bg-white rounded-lg p-3 text-center mt-3">
                <p className="text-sm text-gray-700">
                  投資 <span className="font-bold">$12</span>，獲得{" "}
                  <span className="font-bold text-[#4CAF50] text-lg">$195</span> 價值
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  投資回報率：<span className="font-bold text-green-600">1,525%</span>
                </p>
              </div>
            </div>

            <ActionCTA
              primaryText="立即升級專業版"
              secondaryText="30 天滿意保證，隨時可取消"
              onClick={() => console.log("Upgrade to pro")}
              variant="success"
              size="lg"
            />

            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                ✓ 無需綁約 ✓ 隨時取消 ✓ 全額退款保證
              </p>
              <p className="text-xs font-semibold text-green-600">
                🎁 前 100 名訂閱再送價值 $50 營養品折扣券
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Social Proof */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">加入 10,000+ 位聰明的寵物家長</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-3xl font-bold text-[#4CAF50] mb-2">94%</p>
                <p className="text-sm text-gray-700">會員表示成功降低保費</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-3xl font-bold text-blue-600 mb-2">$2.4M</p>
                <p className="text-sm text-gray-700">為會員累計節省醫療成本</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-3xl font-bold text-purple-600 mb-2">4.9/5</p>
                <p className="text-sm text-gray-700">平均用戶評分（2,340 評論）</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials */}
      <div className="grid md:grid-cols-2 gap-4">
        {[
          {
            name: "王小明",
            pet: "黃金獵犬・Max",
            text: "升級專業版 3 個月，保費從 $32 降到 $19，還成功預防了一次關節炎發作。這是我做過最值得的投資！",
            savings: "$156/年",
          },
          {
            name: "李美華",
            pet: "英國短毛貓・Mimi",
            text: "AI 疾病預警功能太神了！提前發現了泌尿系統問題，及早治療只花了 $80。醫生說如果晚一週可能要花 $500 以上。",
            savings: "$420+",
          },
        ].map((testimonial, index) => (
          <Card key={index} className="bg-gray-50">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#4CAF50] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.name[0]}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.pet}</p>
                </div>
                <Badge className="ml-auto bg-green-100 text-green-700">
                  省下 {testimonial.savings}
                </Badge>
              </div>
              <p className="text-sm text-gray-700 italic">"{testimonial.text}"</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Quick */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">常見問題</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              q: "可以隨時取消嗎？",
              a: "當然可以！無需綁約，隨時可在帳戶設定中取消，不會有任何罰款。",
            },
            {
              q: "真的能省下這麼多錢嗎？",
              a: "基於 10,000+ 會員的真實數據統計，94% 的會員成功降低保費與醫療成本。實際節省金額依個人情況而異。",
            },
            {
              q: "有試用期嗎？",
              a: "提供 30 天滿意保證。若不滿意可申請全額退款，無需任何理由。",
            },
          ].map((faq, index) => (
            <div key={index} className="pb-3 border-b last:border-0">
              <p className="font-semibold text-sm mb-1">{faq.q}</p>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
