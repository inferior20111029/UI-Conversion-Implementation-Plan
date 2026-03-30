import { AlertTriangle, TrendingDown, TrendingUp, DollarSign } from "lucide-react";
import { Card } from "./card";
import { Badge } from "./badge";

interface RiskInsightProps {
  metric: string;
  currentStatus: string;
  statusType: "warning" | "success" | "danger";
  actionRecommendation: string;
  financialImpact: {
    type: "increase" | "decrease";
    amount: number;
  };
}

export function RiskInsight({
  metric,
  currentStatus,
  statusType,
  actionRecommendation,
  financialImpact,
}: RiskInsightProps) {
  const statusColors = {
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    success: "bg-green-50 border-green-200 text-green-800",
    danger: "bg-red-50 border-red-200 text-red-800",
  };

  const StatusIcon = statusType === "danger" ? AlertTriangle : 
                     financialImpact.type === "decrease" ? TrendingDown : TrendingUp;

  return (
    <Card className={`p-4 border-2 ${statusColors[statusType]}`}>
      <div className="flex items-start gap-3">
        <StatusIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div>
            <p className="font-semibold text-sm">{metric}</p>
            <p className="text-xs opacity-90">{currentStatus}</p>
          </div>
          
          <div className="bg-white/50 rounded-md p-2 text-xs">
            <p className="font-medium mb-1">建議行動：</p>
            <p>{actionRecommendation}</p>
          </div>

          <div className="flex items-center gap-2">
            <Badge 
              variant={financialImpact.type === "decrease" ? "default" : "destructive"}
              className="flex items-center gap-1"
            >
              <DollarSign className="w-3 h-3" />
              {financialImpact.type === "decrease" ? "-" : "+"}${financialImpact.amount}
              <span className="ml-1">保費影響</span>
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
