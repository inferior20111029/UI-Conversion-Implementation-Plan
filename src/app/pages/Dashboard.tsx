import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { InsuranceCard } from "../components/ui/InsuranceCard";
import { RiskInsight } from "../components/ui/RiskInsight";
import { Progress } from "../components/ui/progress";
import { Droplet, Footprints, Heart, Weight, TrendingUp } from "lucide-react";

export function Dashboard() {
  const healthMetrics = [
    {
      icon: Footprints,
      label: "今日步數",
      value: "6,842",
      target: "10,000",
      progress: 68,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Droplet,
      label: "飲水量",
      value: "450ml",
      target: "800ml",
      progress: 56,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
    {
      icon: Heart,
      label: "心率",
      value: "82 bpm",
      target: "正常範圍",
      progress: 100,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      icon: Weight,
      label: "體重",
      value: "12.5kg",
      target: "12.0kg 目標",
      progress: 96,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">健康儀表板</h1>
        <p className="text-muted-foreground">
          根據毛孩的健康數據，我們為您優化保費與照護建議
        </p>
      </div>

      {/* Insurance Card - Featured */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InsuranceCard
            planName="智慧健康守護方案"
            marketPrice={32.0}
            yourPrice={22.0}
            savings={10.0}
            nextMilestone={{
              action: "再完成 2 次散步",
              newPrice: 19.0,
              progress: 67,
            }}
            badge="已優化"
          />
        </div>

        {/* Quick Stats */}
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="text-base">本月成效</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">保費節省</span>
                <span className="font-bold text-green-600">$30.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">預防醫療成本</span>
                <span className="font-bold text-green-600">$17.50</span>
              </div>
              <div className="h-px bg-gray-200 my-2" />
              <div className="flex items-center justify-between">
                <span className="font-semibold">總計節省</span>
                <span className="text-xl font-bold text-[#4CAF50]">$47.50</span>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <p className="text-xs text-green-700 mb-1">與上月相比</p>
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-lg font-bold text-green-600">+23%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Metrics Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {healthMetrics.map((metric) => {
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
      </div>

      {/* Risk Insights */}
      <div>
        <h2 className="text-xl font-bold mb-4">智慧風險洞察</h2>
        <div className="grid lg:grid-cols-2 gap-4">
          <RiskInsight
            metric="每日飲水量不足"
            currentStatus="目前 450ml / 建議 800ml"
            statusType="warning"
            actionRecommendation="補充 200ml 水分，可降低泌尿系統疾病風險"
            financialImpact={{
              type: "decrease",
              amount: 3,
            }}
          />

          <RiskInsight
            metric="運動量達標"
            currentStatus="本週已完成 5 次散步"
            statusType="success"
            actionRecommendation="保持良好運動習慣，持續優化心血管健康"
            financialImpact={{
              type: "decrease",
              amount: 5,
            }}
          />
        </div>
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>今日活動紀錄</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: "09:30", activity: "早晨散步", duration: "25 分鐘", impact: "-$2 保費風險" },
              { time: "12:15", activity: "補充水分", duration: "150ml", impact: "泌尿健康 +5%" },
              { time: "15:00", activity: "營養補充", duration: "關節保健品", impact: "-$1.5 保費風險" },
              { time: "18:45", activity: "傍晚散步", duration: "30 分鐘", impact: "-$2.5 保費風險" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-0">
                <div className="text-sm font-semibold text-muted-foreground w-16">
                  {item.time}
                </div>
                <div className="w-2 h-2 rounded-full bg-[#4CAF50]" />
                <div className="flex-1">
                  <p className="font-semibold">{item.activity}</p>
                  <p className="text-sm text-muted-foreground">{item.duration}</p>
                </div>
                <div className="text-sm font-semibold text-green-600">
                  {item.impact}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
