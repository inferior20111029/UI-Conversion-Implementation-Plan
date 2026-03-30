import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { InsuranceCard } from "../components/ui/InsuranceCard";
import { ActionCTA } from "../components/ui/ActionCTA";
import { Badge } from "../components/ui/badge";
import { Check, Shield, Heart, Zap, Lock } from "lucide-react";
import { Progress } from "../components/ui/progress";

export function Insurance() {
  const plans = [
    {
      name: "基礎健康守護",
      marketPrice: 25.0,
      yourPrice: 20.0,
      savings: 5.0,
      features: [
        "基本疾病理賠",
        "年度健康檢查",
        "24/7 線上諮詢",
        "基礎藥物補助",
      ],
      nextMilestone: {
        action: "完成健康評估",
        newPrice: 18.0,
        progress: 45,
      },
    },
    {
      name: "智慧健康守護方案",
      marketPrice: 32.0,
      yourPrice: 22.0,
      savings: 10.0,
      badge: "最受歡迎",
      features: [
        "全方位疾病理賠",
        "AI 健康預警系統",
        "專屬獸醫諮詢",
        "手術費用全額負擔",
        "營養補充品折扣",
        "動態保費優化",
      ],
      nextMilestone: {
        action: "再完成 2 次散步",
        newPrice: 19.0,
        progress: 67,
      },
    },
    {
      name: "尊榮照護方案",
      marketPrice: 45.0,
      yourPrice: 35.0,
      savings: 10.0,
      badge: "頂級方案",
      features: [
        "涵蓋所有基礎與智慧方案",
        "遺傳疾病篩檢",
        "高端醫療機構優先預約",
        "年度健檢全額補助",
        "寵物按摩與復健療程",
        "跨國醫療諮詢",
        "終身保障無上限",
      ],
      nextMilestone: {
        action: "連續 7 天達標運動",
        newPrice: 32.0,
        progress: 43,
      },
    },
  ];

  const dynamicFactors = [
    { label: "每日運動量", impact: "+15%", status: "positive" },
    { label: "定期健康檢查", impact: "+12%", status: "positive" },
    { label: "營養品使用", impact: "+8%", status: "positive" },
    { label: "體重控制", impact: "+5%", status: "positive" },
    { label: "預防接種紀錄", impact: "+10%", status: "positive" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">保險方案</h1>
        <p className="text-muted-foreground">
          基於您毛孩的健康數據，我們提供個人化的動態保費優惠
        </p>
      </div>

      {/* Value Proposition Banner */}
      <Card className="bg-gradient-to-r from-[#4CAF50] to-emerald-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-6 h-6" />
                <h3 className="text-xl font-bold">動態保費優化引擎</h3>
              </div>
              <p className="text-white/90 text-sm">
                每一次散步、每一餐營養補充，都能即時降低您的保費。健康數據越好，保費越便宜！
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center min-w-[140px]">
              <p className="text-sm opacity-90 mb-1">本月平均優惠</p>
              <p className="text-3xl font-bold">31%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Pricing Factors */}
      <Card>
        <CardHeader>
          <CardTitle>您的保費優惠因子</CardTitle>
          <CardDescription>
            以下行為正在幫您節省保費
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {dynamicFactors.map((factor, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{factor.label}</p>
                  <p className="text-xs text-green-700">折扣 {factor.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insurance Plans */}
      <div>
        <h2 className="text-xl font-bold mb-4">選擇您的方案</h2>
        <div className="grid lg:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div key={index} className="space-y-4">
              <InsuranceCard
                planName={plan.name}
                marketPrice={plan.marketPrice}
                yourPrice={plan.yourPrice}
                savings={plan.savings}
                nextMilestone={plan.nextMilestone}
                badge={plan.badge}
              />
              
              {/* Features List */}
              <Card>
                <CardContent className="p-4 space-y-2">
                  {plan.features.map((feature, fIndex) => (
                    <div key={fIndex} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#4CAF50] mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <ActionCTA
                primaryText="立即鎖定低保費"
                secondaryText="不須綁約，隨時取消。30 天滿意保證"
                onClick={() => console.log(`Selected plan: ${plan.name}`)}
                variant={index === 1 ? "success" : "default"}
              />
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            動態保費如何運作？
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <Heart className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">1. 記錄健康數據</h4>
              <p className="text-sm text-muted-foreground">
                透過 APP 記錄運動、飲食、體重等健康指標
              </p>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">2. AI 即時分析</h4>
              <p className="text-sm text-muted-foreground">
                我們的 AI 引擎即時評估風險並計算優惠
              </p>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <Lock className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">3. 自動降低保費</h4>
              <p className="text-sm text-muted-foreground">
                健康數據越好，下個月保費自動調降
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border-2 border-green-200">
            <p className="text-sm font-semibold text-green-900 mb-2">
              💡 案例分享：
            </p>
            <p className="text-sm text-gray-700">
              「連續 3 個月維持每日散步與健康飲食，我家毛孩的保費從 $32 降至 $19，
              每年省下 <span className="font-bold text-green-600">$156</span>！」
            </p>
            <p className="text-xs text-muted-foreground mt-2">- 王小明，黃金獵犬家長</p>
          </div>
        </CardContent>
      </Card>

      {/* Progress to Next Tier */}
      <Card>
        <CardHeader>
          <CardTitle>解鎖更多優惠</CardTitle>
          <CardDescription>
            完成以下目標，立即獲得額外保費折扣
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { task: "上傳最近 6 個月健康檢查報告", reward: "-$2", progress: 0 },
            { task: "連續 7 天達成運動目標", reward: "-$3", progress: 71 },
            { task: "完成 AI 健康評估問卷", reward: "-$1.5", progress: 100 },
            { task: "邀請 3 位好友加入", reward: "-$5", progress: 33 },
          ].map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.task}</span>
                <Badge variant={item.progress === 100 ? "default" : "secondary"}>
                  {item.reward}
                </Badge>
              </div>
              <Progress 
                value={item.progress} 
                className={`h-2 ${item.progress === 100 ? "bg-green-200" : ""}`}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
