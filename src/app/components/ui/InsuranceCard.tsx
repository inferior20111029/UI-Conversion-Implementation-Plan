import { Sparkles, TrendingDown } from "lucide-react";
import { Badge } from "./badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Progress } from "./progress";

interface InsuranceCardProps {
  planName: string;
  providerName?: string | null;
  currency?: string;
  marketPrice: number;
  yourPrice: number;
  savings: number;
  highlights?: string[];
  nextMilestone?: {
    action: string;
    newPrice: number;
    progress: number;
    helperText?: string;
  };
  badge?: string;
}

const formatCurrency = (amount: number, currency = "TWD") =>
  new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency,
    maximumFractionDigits: amount >= 100 ? 0 : 2,
  }).format(amount);

export function InsuranceCard({
  planName,
  providerName,
  currency = "TWD",
  marketPrice,
  yourPrice,
  savings,
  highlights = [],
  nextMilestone,
  badge,
}: InsuranceCardProps) {
  const savingsPercentage = marketPrice > 0 ? Math.round((savings / marketPrice) * 100) : 0;

  return (
    <Card className="border-2 border-[#4CAF50] shadow-lg transition-shadow hover:shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl">{planName}</CardTitle>
            <CardDescription className="mt-1 text-xs">
              {providerName ? `${providerName} · 根據目前健康資料估算` : "基於目前健康資料估算"}
            </CardDescription>
          </div>
          {badge ? (
            <Badge variant="default" className="bg-[#4CAF50] text-white">
              <Sparkles className="mr-1 h-3 w-3" />
              {badge}
            </Badge>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground line-through">市場估算月保費</span>
            <span className="text-muted-foreground line-through">{formatCurrency(marketPrice, currency)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold">依目前健康狀態估算</span>
            <span className="text-2xl font-bold text-[#4CAF50]">
              {formatCurrency(yourPrice, currency)}
              <span className="ml-1 text-sm font-normal text-muted-foreground">/ 月</span>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-900">目前可省下</span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">{formatCurrency(savings, currency)}</p>
            <p className="text-xs text-green-700">每月，約 {savingsPercentage}% 折扣</p>
          </div>
        </div>

        {highlights.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {highlights.slice(0, 3).map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700"
              >
                {item}
              </span>
            ))}
          </div>
        ) : null}

        {nextMilestone ? (
          <div className="space-y-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-blue-900">{nextMilestone.action}</span>
              <span className="font-bold text-blue-600">{formatCurrency(nextMilestone.newPrice, currency)}</span>
            </div>
            <Progress value={nextMilestone.progress} className="h-2 bg-blue-100" />
            <p className="text-center text-xs text-blue-700">
              進度：{nextMilestone.progress}%{nextMilestone.helperText ? ` · ${nextMilestone.helperText}` : ""}
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
