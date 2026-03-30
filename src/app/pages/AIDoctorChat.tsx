import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { ActionCTA } from "../components/ui/ActionCTA";
import { Send, Bot, User, Calendar, Shield, AlertTriangle, CheckCircle } from "lucide-react";

interface Message {
  role: "user" | "ai";
  content: string;
  diagnosis?: {
    severity: "low" | "medium" | "high";
    recommendation: string;
    estimatedCost?: number;
  };
}

export function AIDoctorChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "您好！我是 AI 獸醫助理。請描述您毛孩的症狀，我會為您提供初步評估與建議。",
    },
  ]);
  const [input, setInput] = useState("");
  const [showNextSteps, setShowNextSteps] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        role: "ai",
        content:
          "根據您的描述，毛孩可能出現輕微的消化不良症狀。建議先觀察 24 小時，期間給予清淡飲食（白飯 + 雞胸肉），並確保充足水分。若症狀持續或惡化，請立即就醫。",
        diagnosis: {
          severity: "medium",
          recommendation: "建議 24 小時內觀察，必要時就醫",
          estimatedCost: 80,
        },
      };

      setMessages((prev) => [...prev, aiResponse]);
      setShowNextSteps(true);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">AI 獸醫諮詢</h1>
        <p className="text-muted-foreground">
          24/7 即時健康諮詢，平均可節省 $150 醫療支出
        </p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Bot className="w-8 h-8 mx-auto mb-2 text-[#4CAF50]" />
            <p className="text-2xl font-bold">98.5%</p>
            <p className="text-sm text-muted-foreground">診斷準確率</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold">&lt;2 分鐘</p>
            <p className="text-sm text-muted-foreground">平均回覆時間</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold">$150</p>
            <p className="text-sm text-muted-foreground">平均節省醫療成本</p>
          </CardContent>
        </Card>
      </div>

      {/* Chat Interface */}
      <Card className="border-2 border-gray-200">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">對話諮詢</CardTitle>
            <Badge variant="outline" className="text-green-600 border-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse" />
              線上
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Messages */}
          <div className="h-[400px] overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className="space-y-2">
                <div
                  className={`flex items-start gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "ai"
                        ? "bg-[#4CAF50] text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {message.role === "ai" ? (
                      <Bot className="w-5 h-5" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>

                  <div
                    className={`flex-1 max-w-[80%] ${
                      message.role === "user" ? "text-right" : ""
                    }`}
                  >
                    <div
                      className={`inline-block p-3 rounded-lg ${
                        message.role === "ai"
                          ? "bg-gray-100 text-gray-900"
                          : "bg-[#4CAF50] text-white"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>

                    {/* Diagnosis Card */}
                    {message.diagnosis && (
                      <div className="mt-3 bg-white border-2 border-gray-200 rounded-lg p-4 text-left">
                        <div className="flex items-center gap-2 mb-3">
                          {message.diagnosis.severity === "low" && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                          {message.diagnosis.severity === "medium" && (
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                          )}
                          {message.diagnosis.severity === "high" && (
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                          )}
                          <span className="font-semibold text-gray-900">
                            初步診斷結果
                          </span>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">建議：</span>
                            <p className="text-gray-700 mt-1">
                              {message.diagnosis.recommendation}
                            </p>
                          </div>

                          {message.diagnosis.estimatedCost && (
                            <div className="bg-blue-50 border border-blue-200 rounded p-2">
                              <span className="font-medium">預估就醫費用：</span>
                              <span className="ml-2 text-blue-700 font-bold">
                                ${message.diagnosis.estimatedCost}
                              </span>
                              <p className="text-xs text-blue-600 mt-1">
                                💡 使用保險理賠，您只需支付 $
                                {Math.round(message.diagnosis.estimatedCost * 0.2)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="描述您毛孩的症狀..."
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                className="bg-[#4CAF50] hover:bg-[#45a049]"
                disabled={!input.trim()}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              💡 提示：請詳細描述症狀、持續時間、食慾狀況等資訊
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps - Shown after diagnosis */}
      {showNextSteps && (
        <Card className="border-2 border-[#4CAF50] bg-green-50">
          <CardHeader>
            <CardTitle className="text-lg">建議後續行動</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-[#4CAF50] transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-semibold">立即預約特約獸醫</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  最快今日可看診，享有保險直付服務
                </p>
                <ActionCTA
                  primaryText="查看附近獸醫"
                  onClick={() => console.log("Book appointment")}
                  size="default"
                />
              </div>

              <div className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-[#4CAF50] transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <h4 className="font-semibold">使用保險理賠試算</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  了解此次就醫的理賠金額與自付額
                </p>
                <ActionCTA
                  primaryText="開始試算"
                  onClick={() => console.log("Calculate insurance")}
                  size="default"
                  variant="success"
                />
              </div>
            </div>

            <div className="mt-4 bg-white rounded-lg p-3 border border-green-200">
              <p className="text-sm text-green-900">
                <span className="font-semibold">💰 費用試算：</span>
                若需就醫，預估費用 $80，使用保險後您只需支付{" "}
                <span className="font-bold text-green-600">$16</span>，
                為您節省 <span className="font-bold">$64</span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Common Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">常見症狀快速諮詢</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "食慾不振超過 24 小時",
              "嘔吐或腹瀉",
              "異常掉毛或皮膚問題",
              "呼吸急促或咳嗽",
              "關節疼痛或行動困難",
              "眼睛或耳朵分泌物",
            ].map((symptom, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start h-auto py-3 text-left"
                onClick={() => setInput(symptom)}
              >
                {symptom}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
