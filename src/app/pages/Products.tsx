import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ActionCTA } from "../components/ui/ActionCTA";
import { TrendingDown, Heart, Shield, Sparkles, Info } from "lucide-react";
import { Progress } from "../components/ui/progress";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  riskReduction: number;
  premiumImpact: number;
  healthBenefits: string[];
  aiRecommendation: string;
  confidence: number;
}

export function Products() {
  const products: Product[] = [
    {
      id: "1",
      name: "關節保健配方（高效 Omega-3）",
      category: "營養補充",
      price: 45.0,
      image: "supplement",
      riskReduction: 15,
      premiumImpact: -2.5,
      healthBenefits: [
        "降低關節炎風險 15%",
        "改善行動力",
        "減少發炎反應",
      ],
      aiRecommendation: "根據您毛孩的年齡與活動量，此產品可有效預防關節退化",
      confidence: 92,
    },
    {
      id: "2",
      name: "腸道益生菌複合配方",
      category: "消化健康",
      price: 38.0,
      image: "probiotic",
      riskReduction: 12,
      premiumImpact: -1.8,
      healthBenefits: [
        "改善消化功能",
        "增強免疫系統",
        "減少腸胃疾病風險 12%",
      ],
      aiRecommendation: "最近掃描顯示輕微消化問題，建議使用此產品改善",
      confidence: 88,
    },
    {
      id: "3",
      name: "心臟保健營養品（CoQ10）",
      category: "心血管健康",
      price: 52.0,
      image: "heart",
      riskReduction: 18,
      premiumImpact: -3.2,
      healthBenefits: [
        "支持心臟健康",
        "降低心血管疾病風險 18%",
        "提升整體活力",
      ],
      aiRecommendation: "中大型犬種建議使用，預防心臟疾病效果顯著",
      confidence: 85,
    },
    {
      id: "4",
      name: "皮膚與毛髮護理精華",
      category: "皮膚照護",
      price: 33.0,
      image: "skincare",
      riskReduction: 10,
      premiumImpact: -1.5,
      healthBenefits: [
        "改善皮膚乾燥",
        "減少過敏反應",
        "降低皮膚病風險 10%",
      ],
      aiRecommendation: "健康掃描發現輕微皮膚乾燥，此產品可改善狀況",
      confidence: 90,
    },
    {
      id: "5",
      name: "免疫力提升膠囊",
      category: "免疫系統",
      price: 41.0,
      image: "immune",
      riskReduction: 14,
      premiumImpact: -2.0,
      healthBenefits: [
        "增強免疫系統",
        "降低感染風險 14%",
        "加速傷口癒合",
      ],
      aiRecommendation: "換季期間建議使用，可減少疾病風險",
      confidence: 87,
    },
    {
      id: "6",
      name: "牙齒與口腔保健配方",
      category: "口腔健康",
      price: 29.0,
      image: "dental",
      riskReduction: 11,
      premiumImpact: -1.3,
      healthBenefits: [
        "減少牙結石形成",
        "改善口腔健康",
        "降低牙周病風險 11%",
      ],
      aiRecommendation: "定期使用可避免昂貴的牙科治療費用",
      confidence: 89,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">智慧照護商品</h1>
        <p className="text-muted-foreground">
          AI 推薦的營養品與照護用品，幫助降低健康風險並優化保費
        </p>
      </div>

      {/* Value Proposition */}
      <Card className="border-2 border-[#4CAF50] bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-[#4CAF50] rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold mb-2">
                不只是購物，而是風險管理投資
              </h3>
              <p className="text-sm text-gray-700">
                每個推薦產品都經過 AI 分析，能有效降低特定健康風險。
                購買後會自動更新您的風險評分，直接反映在下月保費中。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Savings Summary */}
      <Card className="bg-blue-50 border-2 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                本月透過照護商品節省的保費
              </h3>
              <p className="text-sm text-blue-700">
                購買推薦產品後的累計保費減免
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600">$7.30</p>
              <p className="text-sm text-blue-700">下月預估：$12.50</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="border-2 border-gray-200 hover:border-[#4CAF50] transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                    <Badge 
                      variant="default" 
                      className="bg-green-100 text-green-700 text-xs"
                    >
                      AI 推薦 {product.confidence}%
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#4CAF50]">
                    ${product.price}
                  </p>
                  <p className="text-xs text-muted-foreground">一個月份</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* AI Recommendation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-blue-900 mb-1">
                    AI 分析建議
                  </p>
                  <p className="text-sm text-blue-800">{product.aiRecommendation}</p>
                </div>
              </div>

              {/* Health Benefits */}
              <div>
                <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  健康效益
                </p>
                <ul className="space-y-1.5">
                  {product.healthBenefits.map((benefit, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* ROI Section */}
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-900">
                      降低疾病風險
                    </span>
                  </div>
                  <span className="text-xl font-bold text-green-600">
                    {product.riskReduction}%
                  </span>
                </div>
                <Progress 
                  value={product.riskReduction * 5} 
                  className="h-2 bg-green-100"
                />

                <div className="flex items-center justify-between pt-2 border-t border-green-200">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-900">
                      下月保費評分減免
                    </span>
                  </div>
                  <span className="text-xl font-bold text-green-600">
                    ${Math.abs(product.premiumImpact).toFixed(1)}
                  </span>
                </div>

                <div className="bg-white rounded p-2 text-center">
                  <p className="text-xs text-green-800">
                    💡 投資 <span className="font-bold">${product.price}</span>，
                    每月節省 <span className="font-bold">${Math.abs(product.premiumImpact).toFixed(1)}</span> 保費
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    約 {Math.round((product.price / Math.abs(product.premiumImpact)) * 10) / 10} 個月回本
                  </p>
                </div>
              </div>

              {/* CTA */}
              <ActionCTA
                primaryText="加入照護計畫並更新風險評估"
                secondaryText="購買後自動更新保費評分，下月生效"
                onClick={() => console.log(`Add to plan: ${product.name}`)}
                variant="success"
                size="default"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bundle Offer */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            組合方案優惠
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h4 className="font-semibold text-lg mb-2">
                全方位健康守護組合
              </h4>
              <p className="text-sm text-gray-700 mb-3">
                包含關節保健 + 腸道益生菌 + 免疫力提升
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">單買總價</span>
                  <span className="line-through">$126.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">組合價</span>
                  <span className="text-2xl font-bold text-purple-600">$99.00</span>
                </div>
                <div className="bg-purple-100 border border-purple-200 rounded p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-purple-900">
                      額外保費減免
                    </span>
                    <span className="text-lg font-bold text-purple-600">
                      -$8.50/月
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <ActionCTA
                primaryText="訂購組合方案"
                secondaryText="立省 $27，還能獲得額外保費優惠"
                onClick={() => console.log("Bundle selected")}
                variant="premium"
                size="default"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">購買流程</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              {
                step: "1",
                title: "AI 推薦分析",
                description: "基於健康數據推薦最適合的產品",
              },
              {
                step: "2",
                title: "加入照護計畫",
                description: "選擇產品並完成訂購",
              },
              {
                step: "3",
                title: "自動更新評分",
                description: "系統更新您的風險評估",
              },
              {
                step: "4",
                title: "保費立即調降",
                description: "下月帳單自動反映優惠",
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
        </CardContent>
      </Card>
    </div>
  );
}
