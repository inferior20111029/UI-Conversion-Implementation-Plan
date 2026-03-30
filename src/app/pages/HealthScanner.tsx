import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ActionCTA } from "../components/ui/ActionCTA";
import { Badge } from "../components/ui/badge";
import { 
  Upload, 
  Image as ImageIcon, 
  Zap, 
  AlertTriangle, 
  CheckCircle,
  TrendingDown,
  Eye,
  Camera,
} from "lucide-react";
import { Progress } from "../components/ui/progress";

export function HealthScanner() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [freeScansLeft, setFreeScansLeft] = useState(2);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setScanResult(null);
    }
  };

  const handleScan = () => {
    if (!selectedFile) return;

    setScanning(true);
    setScanResult(null);

    // Simulate AI scanning
    setTimeout(() => {
      setScanning(false);
      setFreeScansLeft((prev) => Math.max(0, prev - 1));
      setScanResult({
        confidence: 94,
        findings: [
          {
            type: "skin",
            severity: "low",
            title: "輕微皮膚乾燥",
            description: "建議補充 Omega-3 脂肪酸，並增加水分攝取",
            recommendation: "使用寵物專用保濕產品，每日補充魚油",
            costImpact: 25,
          },
        ],
        healthScore: 87,
        preventiveSavings: 150,
      });
    }, 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">AI 健康掃描</h1>
        <p className="text-muted-foreground">
          及早發現隱藏病灶，平均可節省 $150 醫療支出
        </p>
      </div>

      {/* Value Proposition */}
      <Card className="border-2 border-[#4CAF50] bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-[#4CAF50] rounded-full flex items-center justify-center flex-shrink-0">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold mb-2">
                AI 影像分析，及早發現潛在健康問題
              </h3>
              <p className="text-sm text-gray-700">
                上傳毛孩的照片，我們的 AI 會分析皮膚、眼睛、毛髮等健康指標，
                提供專業建議並預估可避免的醫療支出
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-md min-w-[140px]">
              <p className="text-sm text-muted-foreground mb-1">平均節省</p>
              <p className="text-3xl font-bold text-green-600">$150</p>
              <p className="text-xs text-muted-foreground mt-1">醫療成本</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Free Scans Remaining */}
      <Card className="border-2 border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-900">
                  今日剩餘免費 AI 掃描次數
                </p>
                <p className="text-xs text-yellow-700">
                  升級專業版享無限次掃描
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-yellow-600">
                {freeScansLeft}
              </p>
              <p className="text-xs text-yellow-700">次</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-[#4CAF50] transition-colors">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              {selectedFile ? (
                <ImageIcon className="w-10 h-10 text-[#4CAF50]" />
              ) : (
                <Upload className="w-10 h-10 text-gray-400" />
              )}
            </div>

            {selectedFile ? (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 inline-block">
                  <p className="font-semibold text-green-900">{selectedFile.name}</p>
                  <p className="text-xs text-green-700">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedFile(null)}
                  >
                    重新選擇
                  </Button>
                  <ActionCTA
                    primaryText={scanning ? "AI 分析中..." : "開始 AI 掃描"}
                    onClick={handleScan}
                    variant="success"
                    size="default"
                    icon={scanning ? undefined : <Camera className="w-5 h-5 ml-2" />}
                  />
                </div>

                {scanning && (
                  <div className="space-y-2 max-w-md mx-auto">
                    <Progress value={66} className="h-2" />
                    <p className="text-sm text-muted-foreground">
                      正在分析圖片中的健康指標...
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    上傳毛孩的照片開始掃描
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    支援 JPG、PNG 格式，建議檔案大小小於 10MB
                  </p>
                </div>

                <label htmlFor="file-upload">
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                    disabled={freeScansLeft === 0}
                  />
                  <Button
                    variant="outline"
                    size="lg"
                    className="cursor-pointer"
                    disabled={freeScansLeft === 0}
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    選擇照片
                  </Button>
                </label>

                {freeScansLeft === 0 && (
                  <p className="text-sm text-red-600">
                    今日免費額度已用完，請升級專業版繼續使用
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Scan Results */}
      {scanResult && (
        <div className="space-y-4">
          <Card className="border-2 border-[#4CAF50]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">掃描結果</CardTitle>
                <Badge variant="default" className="bg-[#4CAF50]">
                  信心度 {scanResult.confidence}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Health Score */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-green-900">整體健康評分</span>
                  <span className="text-3xl font-bold text-green-600">
                    {scanResult.healthScore}
                    <span className="text-lg">/100</span>
                  </span>
                </div>
                <Progress value={scanResult.healthScore} className="h-3 bg-green-100" />
              </div>

              {/* Findings */}
              <div className="space-y-3">
                <h4 className="font-semibold">發現項目</h4>
                {scanResult.findings.map((finding: any, index: number) => (
                  <Card
                    key={index}
                    className={`border-2 ${
                      finding.severity === "low"
                        ? "border-yellow-200 bg-yellow-50"
                        : finding.severity === "medium"
                        ? "border-orange-200 bg-orange-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {finding.severity === "low" ? (
                          <CheckCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0" />
                        )}
                        <div className="flex-1 space-y-2">
                          <div>
                            <h5 className="font-semibold">{finding.title}</h5>
                            <p className="text-sm text-gray-700 mt-1">
                              {finding.description}
                            </p>
                          </div>

                          <div className="bg-white/70 rounded p-2 text-sm">
                            <p className="font-medium mb-1">建議處置：</p>
                            <p className="text-gray-700">{finding.recommendation}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <TrendingDown className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-semibold text-green-700">
                              及早處理可避免 ${finding.costImpact} 醫療費用
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Financial Impact */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingDown className="w-6 h-6 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">預防性照護價值</h4>
                </div>
                <p className="text-sm text-blue-800 mb-3">
                  根據掃描結果，若及早採取建議的照護措施：
                </p>
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">預計可節省醫療支出</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${scanResult.preventiveSavings}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    基於類似案例的歷史數據統計
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <Button variant="outline" size="lg" className="h-auto py-4">
                  <div className="text-left">
                    <p className="font-semibold">下載完整報告</p>
                    <p className="text-xs text-muted-foreground">
                      PDF 格式，可分享給獸醫
                    </p>
                  </div>
                </Button>

                <Button className="bg-[#4CAF50] hover:bg-[#45a049] h-auto py-4">
                  <div className="text-left">
                    <p className="font-semibold">查看建議產品</p>
                    <p className="text-xs opacity-90">
                      購買推薦的營養品與照護用品
                    </p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AI 掃描如何運作？</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-semibold">上傳照片</h4>
              <p className="text-sm text-muted-foreground">
                拍攝或上傳毛孩清晰的照片
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-xl font-bold text-green-600">2</span>
              </div>
              <h4 className="font-semibold">AI 分析</h4>
              <p className="text-sm text-muted-foreground">
                深度學習模型分析 50+ 健康指標
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-xl font-bold text-purple-600">3</span>
              </div>
              <h4 className="font-semibold">獲得建議</h4>
              <p className="text-sm text-muted-foreground">
                收到專業照護建議與成本預估
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scan Tips */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg">拍攝技巧</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>確保光線充足，避免過度曝光或陰影</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>拍攝側面與正面照片，涵蓋眼睛、耳朵、皮膚細節</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>毛孩保持放鬆狀態，可獲得更準確的分析結果</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>定期掃描（建議每週一次）以追蹤健康變化</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
