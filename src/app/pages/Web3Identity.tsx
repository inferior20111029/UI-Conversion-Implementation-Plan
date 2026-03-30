import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ActionCTA } from "../components/ui/ActionCTA";
import { 
  Shield, 
  Lock, 
  Zap, 
  Database, 
  Share2, 
  CheckCircle,
  Clock,
  FileText,
  Key,
} from "lucide-react";

export function Web3Identity() {
  const benefits = [
    {
      icon: Database,
      title: "數據所有權",
      subtitle: "您擁有 100% 控制權",
      description: "毛孩的健康數據完全屬於您，隨時可以匯出或轉移到其他平台，不會被平台綁架。",
      value: "完全掌控",
      color: "blue",
    },
    {
      icon: Zap,
      title: "快速保險驗證",
      subtitle: "理賠審核時間縮短 99.9%",
      description: "區塊鏈防篡改特性，讓理賠審核時間從傳統的 7 天縮短為 3 秒，大幅提升理賠效率。",
      value: "7 天 → 3 秒",
      color: "green",
    },
    {
      icon: Share2,
      title: "智慧授權管理",
      subtitle: "一鍵分享健康紀錄",
      description: "換獸醫或求診時，一鍵授權即可分享完整健康紀錄，不用再重複填寫紙本病歷。",
      value: "零紙本作業",
      color: "purple",
    },
  ];

  const securityFeatures = [
    {
      feature: "端對端加密",
      description: "所有健康數據都經過軍事級加密",
      icon: Lock,
    },
    {
      feature: "分散式儲存",
      description: "數據不存放在單一伺服器，避免單點故障",
      icon: Database,
    },
    {
      feature: "零知識證明",
      description: "驗證身分時不需要透露個人隱私資料",
      icon: Shield,
    },
    {
      feature: "不可篡改紀錄",
      description: "所有健康紀錄永久保存且無法偽造",
      icon: FileText,
    },
  ];

  const useCases = [
    {
      scenario: "更換獸醫診所",
      traditional: "填寫紙本病歷，等待 3-5 天資料轉移",
      web3: "掃描 QR Code，3 秒完成授權",
      savings: "節省 5 天等待時間",
    },
    {
      scenario: "保險理賠申請",
      traditional: "提交文件，等待 7-14 天人工審核",
      web3: "自動驗證區塊鏈紀錄，3 秒完成理賠",
      savings: "節省 7-14 天 + $50 處理費",
    },
    {
      scenario: "緊急醫療情況",
      traditional: "無法立即取得完整病歷，影響診斷",
      web3: "即時存取完整健康紀錄，加速診療",
      savings: "可能拯救生命",
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">區塊鏈健康身分</h1>
        <p className="text-muted-foreground">
          數據主權在您手中，理賠速度提升 1000 倍
        </p>
      </div>

      {/* Value Proposition */}
      <Card className="border-2 border-[#4CAF50] bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-[#4CAF50] rounded-full flex items-center justify-center flex-shrink-0">
              <Key className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold mb-2">
                為什麼需要區塊鏈健康身分？
              </h3>
              <p className="text-sm text-gray-700">
                傳統醫療紀錄散落在各診所，保險理賠需要等待數天人工審核。
                區塊鏈技術讓您完全掌控數據，並實現秒級理賠驗證。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Benefits */}
      <div className="grid lg:grid-cols-3 gap-6">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          const colorClasses = {
            blue: "bg-blue-50 border-blue-200 text-blue-600",
            green: "bg-green-50 border-green-200 text-green-600",
            purple: "bg-purple-50 border-purple-200 text-purple-600",
          };

          return (
            <Card
              key={index}
              className={`border-2 ${colorClasses[benefit.color as keyof typeof colorClasses]}`}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 mx-auto">
                  <Icon className={`w-6 h-6 ${colorClasses[benefit.color as keyof typeof colorClasses].split(' ')[2]}`} />
                </div>
                <CardTitle className="text-lg text-center">
                  {benefit.title}
                </CardTitle>
                <p className="text-xs text-center text-muted-foreground">
                  {benefit.subtitle}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-700 text-center">
                  {benefit.description}
                </p>
                <div className="bg-white rounded-lg p-3 text-center">
                  <Badge variant="secondary" className="font-bold">
                    {benefit.value}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Real-World Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-[#4CAF50]" />
            實際應用場景對比
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-[#4CAF50] transition-colors"
              >
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#4CAF50] text-white rounded-full flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  {useCase.scenario}
                </h4>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-xs font-semibold text-red-900 mb-2">
                      ❌ 傳統方式
                    </p>
                    <p className="text-sm text-gray-700">{useCase.traditional}</p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-xs font-semibold text-green-900 mb-2">
                      ✓ 區塊鏈方式
                    </p>
                    <p className="text-sm text-gray-700">{useCase.web3}</p>
                  </div>
                </div>

                <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-2 text-center">
                  <span className="text-sm font-semibold text-blue-900">
                    💡 {useCase.savings}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card className="border-2 border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-600" />
            安全與隱私保障
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {securityFeatures.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 border-2 border-purple-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1">{item.feature}</h5>
                      <p className="text-sm text-gray-700">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* How to Get Started */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">如何開始使用？</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {[
              {
                step: "1",
                title: "建立數位身分",
                description: "一鍵生成區塊鏈健康 ID",
              },
              {
                step: "2",
                title: "同步健康數據",
                description: "自動同步現有的健康紀錄",
              },
              {
                step: "3",
                title: "授權管理",
                description: "設定誰可以存取您的數據",
              },
              {
                step: "4",
                title: "開始使用",
                description: "享受快速理賠與無紙化體驗",
              },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-2">
                <div className="w-12 h-12 bg-[#4CAF50] text-white rounded-full flex items-center justify-center mx-auto font-bold text-lg">
                  {item.step}
                </div>
                <h4 className="font-semibold text-sm">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <ActionCTA
              primaryText="建立我的區塊鏈健康身分"
              secondaryText="完全免費，僅需 2 分鐘設定"
              onClick={() => console.log("Create Web3 Identity")}
              variant="success"
              size="lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Benefits Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">立即體驗的好處</h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="font-semibold mb-1">理賠加速</p>
                <p className="text-sm text-muted-foreground">
                  從 7 天縮短為 3 秒
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="font-semibold mb-1">數據主權</p>
                <p className="text-sm text-muted-foreground">
                  完全掌控您的資料
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow-sm">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <p className="font-semibold mb-1">無紙化作業</p>
                <p className="text-sm text-muted-foreground">
                  節省時間與金錢
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Notice */}
      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Lock className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold mb-2">隱私與資料保護</h4>
              <p className="text-sm text-gray-700 mb-3">
                我們重視您的隱私。所有健康數據都經過加密處理，
                只有您明確授權的對象才能存取。您隨時可以撤銷授權或刪除數據。
              </p>
              <p className="text-xs text-muted-foreground">
                Figma Make 與 Pet Health OS 不適用於收集個人身分資訊（PII）
                或處理敏感資料。本功能僅為展示區塊鏈技術在寵物健康管理的應用可能性。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-[#4CAF50] mb-1">3,247</p>
            <p className="text-sm text-muted-foreground">
              已建立區塊鏈健康身分
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600 mb-1">$128K</p>
            <p className="text-sm text-muted-foreground">
              透過快速理賠節省的處理成本
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-purple-600 mb-1">99.8%</p>
            <p className="text-sm text-muted-foreground">
              理賠驗證成功率
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
