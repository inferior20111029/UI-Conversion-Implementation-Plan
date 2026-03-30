import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { TrendingDown, Sparkles } from "lucide-react";
import { Progress } from "./progress";

interface InsuranceCardProps {
  planName: string;
  marketPrice: number;
  yourPrice: number;
  savings: number;
  nextMilestone?: {
    action: string;
    newPrice: number;
    progress: number;
  };
  badge?: string;
}

export function InsuranceCard({
  planName,
  marketPrice,
  yourPrice,
  savings,
  nextMilestone,
  badge,
}: InsuranceCardProps) {
  const savingsPercentage = Math.round((savings / marketPrice) * 100);

  return (
    <Card className="border-2 border-[#4CAF50] shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{planName}</CardTitle>
            <CardDescription className="text-xs mt-1">
              基於您的健康數據優化
            </CardDescription>
          </div>
          {badge && (
            <Badge variant="default" className="bg-[#4CAF50] text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              {badge}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price Comparison */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground line-through">市場原價</span>
            <span className="text-muted-foreground line-through">${marketPrice.toFixed(2)}/月</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="font-semibold">您的專屬保費</span>
            <span className="text-2xl font-bold text-[#4CAF50]">
              ${yourPrice.toFixed(2)}
              <span className="text-sm text-muted-foreground">/月</span>
            </span>
          </div>
        </div>

        {/* Savings Badge */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-900">已為您節省</span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">
              ${savings.toFixed(2)}
            </p>
            <p className="text-xs text-green-700">每月 ({savingsPercentage}% off)</p>
          </div>
        </div>

        {/* Next Milestone */}
        {nextMilestone && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-blue-900">
                {nextMilestone.action}
              </span>
              <span className="font-bold text-blue-600">
                → ${nextMilestone.newPrice.toFixed(2)}
              </span>
            </div>
            <Progress 
              value={nextMilestone.progress} 
              className="h-2 bg-blue-100"
            />
            <p className="text-xs text-blue-700 text-center">
              進度：{nextMilestone.progress}%
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
