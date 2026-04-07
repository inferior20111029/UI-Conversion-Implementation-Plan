import { AlertTriangle, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "./badge";
import { Card } from "./card";

interface RiskInsightProps {
  metric: string;
  currentStatus: string;
  statusType: "warning" | "success" | "danger";
  actionRecommendation: string;
  financialImpact?: {
    type: "increase" | "decrease";
    amount: number;
    unit?: string | null;
    label?: string | null;
  };
}

const formatImpact = (amount: number, unit?: string | null) => `${amount}${unit ?? ""}`;

export function RiskInsight({
  metric,
  currentStatus,
  statusType,
  actionRecommendation,
  financialImpact,
}: RiskInsightProps) {
  const statusColors = {
    warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
    success: "border-green-200 bg-green-50 text-green-800",
    danger: "border-red-200 bg-red-50 text-red-800",
  };

  const StatusIcon =
    statusType === "danger"
      ? AlertTriangle
      : financialImpact?.type === "decrease"
        ? TrendingDown
        : TrendingUp;

  return (
    <Card className={`border-2 p-4 ${statusColors[statusType]}`}>
      <div className="flex items-start gap-3">
        <StatusIcon className="mt-0.5 h-5 w-5 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div>
            <p className="text-sm font-semibold">{metric}</p>
            <p className="text-xs opacity-90">{currentStatus}</p>
          </div>

          <div className="rounded-md bg-white/50 p-2 text-xs">
            <p className="mb-1 font-medium">建議行動</p>
            <p>{actionRecommendation}</p>
          </div>

          {financialImpact ? (
            <div className="flex items-center gap-2">
              <Badge
                variant={financialImpact.type === "decrease" ? "default" : "destructive"}
                className="flex items-center gap-1"
              >
                <DollarSign className="h-3 w-3" />
                {financialImpact.type === "decrease" ? "-" : "+"}
                {formatImpact(financialImpact.amount, financialImpact.unit)}
                <span className="ml-1">{financialImpact.label ?? "保費影響"}</span>
              </Badge>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
