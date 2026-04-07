import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FilePlus2,
  HeartPulse,
  Loader2,
  PawPrint,
  Send,
  Shield,
  Sparkles,
  Stethoscope,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAiDoctorConsultation, usePets } from "../../hooks/useApi";
import type {
  AiDoctorConsultationAssessment,
  AiDoctorConsultationPetContext,
  PetRecord,
} from "../../services/services";
import { breedLabel } from "../../lib/pet-breeds";

type ChatMessage = {
  id: string;
  role: "user" | "ai";
  content: string;
  assessment?: AiDoctorConsultationAssessment;
  petContext?: AiDoctorConsultationPetContext;
  disclaimer?: string;
};

const QUICK_PROMPTS = {
  dog: [
    "牠今天一直抓癢，耳朵也有味道，這樣需要看醫生嗎？",
    "狗狗從昨天開始食慾變差，還有一點嘔吐，我該先觀察什麼？",
    "散步後跛腳、不太想踩右後腿，該怎麼判斷嚴重程度？",
  ],
  cat: [
    "貓咪最近一直躲起來，食慾下降又不太喝水，要注意什麼？",
    "牠頻繁跑貓砂盆但尿很少，這算緊急狀況嗎？",
    "一直舔毛到局部掉毛，先記錄哪些資訊比較有幫助？",
  ],
  default: [
    "牠今天精神變差，我要先提供哪些症狀資訊？",
    "如果有嘔吐或腹瀉，哪些情況需要盡快就醫？",
    "我想先做居家觀察，應該記錄哪些重點？",
  ],
};

const SIGNAL_RULES = [
  { pattern: /抓癢|搔癢|很癢/, token: "itchy_skin" },
  { pattern: /耳朵|耳道|甩頭/, token: "ear_issue" },
  { pattern: /異味|耳臭|臭味|味道/, token: "ear_odor" },
  { pattern: /掉毛|脫毛/, token: "hair_loss" },
  { pattern: /紅腫|紅疹|發紅|皮膚/, token: "skin_redness" },
  { pattern: /嘔吐|吐了|一直吐/, token: "vomit" },
  { pattern: /腹瀉|拉肚子|軟便/, token: "diarrhea" },
  { pattern: /食慾差|食慾下降|沒胃口|不太吃|不吃/, token: "low_appetite" },
  { pattern: /肚子痛|腹痛|肚子怪怪/, token: "stomach_pain" },
  { pattern: /咳嗽/, token: "cough" },
  { pattern: /打噴嚏|流鼻水/, token: "sneeze" },
  { pattern: /呼吸|喘|張口呼吸/, token: "breathing_issue" },
  { pattern: /跛腳|不敢踩|掰咖|拐腳/, token: "limp" },
  { pattern: /關節痛|關節|腳痛/, token: "joint_pain" },
  { pattern: /痛|疼痛|哀叫/, token: "pain" },
  { pattern: /頻尿|尿少|排尿|一直蹲廁所|尿不太出來/, token: "urine_issue" },
  { pattern: /血尿/, token: "blood_urine" },
  { pattern: /精神差|沒精神|嗜睡|懶洋洋/, token: "low_energy" },
  { pattern: /發燒|發熱/, token: "fever" },
  { pattern: /變瘦|體重下降/, token: "weight_loss" },
  { pattern: /一天|兩天|24 ?小時|持續/, token: "persistent" },
  { pattern: /越來越嚴重|惡化|加重/, token: "worsening" },
  { pattern: /完全不吃/, token: "loss_of_appetite" },
  { pattern: /很痛|劇痛|痛到叫/, token: "high_pain" },
  { pattern: /頻繁|一直|反覆/, token: "frequent" },
  { pattern: /呼吸困難|喘不過氣/, token: "breathing_emergency" },
  { pattern: /抽搐|癲癇/, token: "seizure" },
  { pattern: /昏倒|倒地/, token: "collapse" },
  { pattern: /尿不出|完全沒尿/, token: "urinary_block" },
];

const createAiGreeting = (petName?: string): ChatMessage => ({
  id: `greeting-${petName ?? "default"}`,
  role: "ai",
  content: petName
    ? `你好，我是 AI 獸醫助理。你可以直接描述 ${petName} 的症狀、持續時間、食慾、活動力或最近的健康紀錄，我會先幫你做初步分級與下一步建議。`
    : "你好，我是 AI 獸醫助理。先選擇一隻寵物，再告訴我症狀、持續時間、食慾、活動力或最近變化，我會先幫你做初步分級與下一步建議。",
});

const severityMeta = {
  low: {
    label: "低風險",
    badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
    iconClass: "text-emerald-600",
  },
  medium: {
    label: "中度注意",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
    icon: AlertTriangle,
    iconClass: "text-amber-600",
  },
  high: {
    label: "高風險",
    badgeClass: "border-rose-200 bg-rose-50 text-rose-700",
    icon: AlertTriangle,
    iconClass: "text-rose-600",
  },
} as const;

const formatMoney = (value?: number | null) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "TWD --";
  }

  return `TWD ${Math.round(value).toLocaleString("en-US")}`;
};

const formatAge = (value?: number | null) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "未提供";
  }

  if (value < 1) {
    return `${Math.max(1, Math.round(value * 12))} 個月`;
  }

  return `${value.toFixed(value >= 10 ? 0 : 1)} 歲`;
};

const ageFromBirthday = (birthday?: string | null) => {
  if (!birthday) {
    return null;
  }

  const parsed = new Date(birthday);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  const diffMs = Date.now() - parsed.getTime();
  return diffMs > 0 ? diffMs / (365.25 * 24 * 60 * 60 * 1000) : null;
};

const formatRecordDate = (value?: string | null) => {
  if (!value) {
    return "最近紀錄";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "最近紀錄";
  }

  return parsed.toLocaleDateString("zh-TW", {
    month: "numeric",
    day: "numeric",
  });
};

const enrichConsultationMessage = (message: string) => {
  const tokens = SIGNAL_RULES
    .filter((rule) => rule.pattern.test(message))
    .map((rule) => rule.token);

  if (tokens.length === 0) {
    return message;
  }

  return `${message}\n[signals:${Array.from(new Set(tokens)).join(",")}]`;
};

export function AIDoctorChat() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: pets, isLoading: petsLoading } = usePets();
  const { mutate, isPending, reset } = useAiDoctorConsultation();
  const [messages, setMessages] = useState<ChatMessage[]>([createAiGreeting()]);
  const [input, setInput] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const activePetId = searchParams.get("pet") ?? "";
  const selectedPet = useMemo(
    () => pets?.find((pet: PetRecord) => String(pet.id) === String(activePetId)),
    [activePetId, pets],
  );

  useEffect(() => {
    if (!pets || pets.length === 0) {
      return;
    }

    const hasSelectedPet = pets.some((pet: PetRecord) => String(pet.id) === String(activePetId));
    if (hasSelectedPet) {
      return;
    }

    const params = new URLSearchParams(searchParams);
    params.set("pet", String(pets[0].id));
    setSearchParams(params, { replace: true });
  }, [activePetId, pets, searchParams, setSearchParams]);

  useEffect(() => {
    setMessages([createAiGreeting(selectedPet?.name)]);
    setInput("");
    setSubmitError(null);
    reset();
  }, [reset, selectedPet?.id, selectedPet?.name]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isPending, messages]);

  const quickPrompts = useMemo(() => {
    if (selectedPet?.type === "dog") {
      return QUICK_PROMPTS.dog;
    }

    if (selectedPet?.type === "cat") {
      return QUICK_PROMPTS.cat;
    }

    return QUICK_PROMPTS.default;
  }, [selectedPet?.type]);

  const latestAiMessage = useMemo(
    () => [...messages].reverse().find((message) => message.role === "ai" && message.assessment),
    [messages],
  );

  const latestAssessment = latestAiMessage?.assessment;
  const latestPetContext = latestAiMessage?.petContext;
  const selectedBreed = breedLabel(selectedPet?.breed ?? latestPetContext?.breed) || "未提供";
  const selectedAge = latestPetContext?.age_years ?? ageFromBirthday(selectedPet?.birthday);

  const stats = [
    {
      key: "confidence",
      icon: Stethoscope,
      iconClass: "text-emerald-600",
      value: latestAssessment ? `${latestAssessment.confidence}%` : "96%",
      label: "診斷信心",
    },
    {
      key: "response-time",
      icon: Clock3,
      iconClass: "text-blue-600",
      value: isPending ? "分析中" : "< 2 分鐘",
      label: "平均回覆時間",
    },
    {
      key: "savings",
      icon: Shield,
      iconClass: "text-violet-600",
      value: latestAssessment
        ? formatMoney(latestAssessment.estimated_cost.insurance_savings)
        : "TWD 800",
      label: "預估可節省醫療成本",
    },
  ];

  const updatePetSelection = (petId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("pet", petId);
    setSearchParams(params);
  };

  const submitMessage = (rawMessage?: string) => {
    const message = (rawMessage ?? input).trim();

    if (!message || !selectedPet) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: message,
    };

    const history = messages
      .filter((item) => item.role === "user" || item.role === "ai")
      .slice(-6)
      .map((item) => ({
        role: item.role,
        content: item.content,
      }));

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setSubmitError(null);

    mutate(
      {
        petId: String(selectedPet.id),
        message: enrichConsultationMessage(message),
        history,
      },
      {
        onSuccess: (data) => {
          setMessages((current) => [
            ...current,
            {
              id: `ai-${Date.now()}`,
              role: "ai",
              content: data.reply,
              assessment: data.assessment,
              petContext: data.pet,
              disclaimer: data.meta?.disclaimer,
            },
          ]);
        },
        onError: (error: any) => {
          const messageText = error?.message || "AI 醫師暫時無法回覆，請稍後再試一次。";
          setSubmitError(messageText);
          setMessages((current) => [
            ...current,
            {
              id: `ai-error-${Date.now()}`,
              role: "ai",
              content: `我剛剛沒有成功完成分析。${messageText}`,
            },
          ]);
        },
      },
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitMessage();
    }
  };

  if (!petsLoading && (!pets || pets.length === 0)) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI 獸醫諮詢</h1>
          <p className="text-muted-foreground">
            先建立一隻寵物，AI 才能結合品種、年齡與健康紀錄給你更實用的初步判斷。
          </p>
        </div>

        <Card className="border-dashed border-2 text-center py-12">
          <CardContent className="space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <PawPrint className="h-7 w-7 text-[#4CAF50]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">還沒有寵物資料</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                新增寵物後，你就可以直接在這裡描述症狀，並拿到風險分級、觀察重點與就醫建議。
              </p>
            </div>
            <Button onClick={() => navigate("/pets/add")}>新增寵物</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI 獸醫諮詢</h1>
          <p className="text-muted-foreground">
            24/7 即時健康諮詢，會結合症狀、寵物資料與最近健康紀錄，先幫你做初步分級與下一步建議。
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {pets && pets.length > 0 && (
            <select
              id="ai-doctor-pet-selector"
              value={activePetId}
              onChange={(event) => updatePetSelection(event.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
            >
              {pets.map((pet: PetRecord) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                </option>
              ))}
            </select>
          )}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/pets/${activePetId}/add-record`)}
              disabled={!selectedPet}
            >
              <FilePlus2 className="h-4 w-4" />
              新增健康紀錄
            </Button>
            <Button onClick={() => navigate(`/insurance?pet=${activePetId}`)} disabled={!selectedPet}>
              <Shield className="h-4 w-4" />
              查看保險方案
            </Button>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.key}>
              <CardContent className="p-4 text-center">
                <Icon className={`w-8 h-8 mx-auto mb-2 ${item.iconClass}`} />
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedPet && (
        <Card className="border-2 border-slate-200 bg-slate-50/80">
          <CardContent className="p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                  <HeartPulse className="h-3.5 w-3.5 text-[#4CAF50]" />
                  AI 會優先以這隻寵物的資料做分析
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {selectedPet.name} 目前是{" "}
                  {selectedPet.type === "dog" ? "狗" : selectedPet.type === "cat" ? "貓" : "寵物"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  請盡量描述症狀開始時間、頻率、食慾、精神、排便排尿與任何突發變化。
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                  <span className="rounded-full bg-white px-3 py-1 shadow-sm">品種：{selectedBreed}</span>
                  <span className="rounded-full bg-white px-3 py-1 shadow-sm">
                    體重：{selectedPet.weight ? `${selectedPet.weight} kg` : "未提供"}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 shadow-sm">
                    年齡：{formatAge(selectedAge)}
                  </span>
                </div>
              </div>
              <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
                <p className="text-xs font-semibold text-green-700 mb-1">建議補充的關鍵資訊</p>
                <p>症狀多久了、是否有惡化、喝水排尿排便、精神食慾、最近是否換食或外出。</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-2 border-gray-200">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-lg">對話諮詢</CardTitle>
            <Badge variant="outline" className="text-green-600 border-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse" />
              線上
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="h-[460px] overflow-y-auto p-4 space-y-4">
            {messages.map((message) => {
              const severity = message.assessment?.severity;
              const meta = severity ? severityMeta[severity] : null;
              const SeverityIcon = meta?.icon;

              return (
                <div key={message.id} className="space-y-2">
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
                      {message.role === "ai" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>

                    <div className={`flex-1 max-w-[85%] ${message.role === "user" ? "text-right" : ""}`}>
                      <div
                        className={`inline-block p-3 rounded-2xl ${
                          message.role === "ai"
                            ? "bg-slate-100 text-slate-900"
                            : "bg-[#4CAF50] text-white"
                        }`}
                      >
                        <p className="text-sm leading-6 whitespace-pre-wrap">{message.content}</p>
                      </div>

                      {message.assessment && meta && SeverityIcon && (
                        <div className="mt-3 rounded-2xl border bg-white p-4 text-left shadow-sm">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <SeverityIcon className={`h-5 w-5 ${meta.iconClass}`} />
                                <span className="font-semibold text-slate-900">初步評估</span>
                                <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.badgeClass}`}>
                                  {meta.label}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600">{message.assessment.summary}</p>
                            </div>
                            <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm">
                              <p className="text-slate-500">診斷信心</p>
                              <p className="font-semibold text-slate-900">{message.assessment.confidence}%</p>
                            </div>
                          </div>

                          <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">分級建議</p>
                                <p className="mt-1 text-sm text-slate-800">{message.assessment.triage}</p>
                              </div>
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">建議處置</p>
                                <p className="mt-1 text-sm text-slate-800">{message.assessment.recommendation}</p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                                <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">預估就醫成本</p>
                                <p className="mt-1 text-sm font-semibold text-blue-900">
                                  {formatMoney(message.assessment.estimated_cost.min)} - {formatMoney(message.assessment.estimated_cost.max)}
                                </p>
                                <p className="mt-1 text-xs text-blue-700">
                                  若已有保險，平均可抵掉約 {formatMoney(message.assessment.estimated_cost.insurance_savings)}
                                </p>
                              </div>

                              {message.assessment.matched_signals.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">AI 偵測到的關鍵訊號</p>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {message.assessment.matched_signals.map((signal) => (
                                      <Badge key={signal} variant="secondary">
                                        {signal}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 grid gap-4 lg:grid-cols-3">
                            <div className="rounded-xl bg-slate-50 p-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">下一步</p>
                              <ul className="mt-2 space-y-2 text-sm text-slate-700">
                                {message.assessment.next_steps.map((step) => (
                                  <li key={step}>• {step}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="rounded-xl bg-amber-50 p-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">警示徵兆</p>
                              <ul className="mt-2 space-y-2 text-sm text-amber-900">
                                {message.assessment.warning_signs.map((item) => (
                                  <li key={item}>• {item}</li>
                                ))}
                              </ul>
                            </div>

                            <div className="rounded-xl bg-emerald-50 p-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">建議追問</p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {message.assessment.follow_up_questions.map((question) => (
                                  <button
                                    key={question}
                                    type="button"
                                    onClick={() => setInput(question)}
                                    className="rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-left text-xs text-emerald-800 transition hover:border-emerald-400"
                                  >
                                    {question}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {message.petContext && message.petContext.recent_records.length > 0 && (
                            <div className="mt-4 rounded-xl border border-slate-200 p-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">最近健康紀錄</p>
                              <div className="mt-2 space-y-2">
                                {message.petContext.recent_records.map((record) => (
                                  <div
                                    key={`${record.type}-${record.recorded_at ?? record.summary}`}
                                    className="flex gap-3 text-sm text-slate-700"
                                  >
                                    <span className="w-16 shrink-0 text-slate-500">{formatRecordDate(record.recorded_at)}</span>
                                    <span className="font-medium">{record.type}</span>
                                    <span>{record.summary}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {message.disclaimer && (
                            <p className="mt-3 text-xs text-slate-500">{message.disclaimer}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isPending && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#4CAF50] text-white flex-shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  正在整理症狀與健康紀錄，幫你做初步分級……
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="border-t p-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setInput(prompt)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 transition hover:border-[#4CAF50] hover:text-slate-900"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  selectedPet
                    ? `描述 ${selectedPet.name} 的症狀、持續時間、食慾或精神狀況……`
                    : "請先選擇一隻寵物"
                }
                className="flex-1"
                disabled={!selectedPet || isPending}
              />
              <Button
                onClick={() => submitMessage()}
                className="bg-[#4CAF50] hover:bg-[#45a049]"
                disabled={!selectedPet || !input.trim() || isPending}
              >
                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </Button>
            </div>

            {submitError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {submitError}
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              提示：越清楚描述症狀、持續時間、食慾與活動力，AI 的分級與下一步建議會越準確。
            </p>
          </div>
        </CardContent>
      </Card>

      {latestAssessment && (
        <Card className="border-2 border-[#4CAF50] bg-green-50">
          <CardHeader>
            <CardTitle className="text-lg">建議的下一步</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/80 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <ClipboardList className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">補充或更新健康紀錄</h3>
                  <p className="text-sm text-muted-foreground">把這次症狀、食慾或排泄狀況記下來，之後追蹤會更準。</p>
                </div>
              </div>
              <Button variant="outline" onClick={() => navigate(`/pets/${activePetId}/add-record`)}>
                前往新增紀錄
              </Button>
            </div>

            <div className="rounded-2xl border border-white/80 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <Sparkles className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">查看保險理賠與方案</h3>
                  <p className="text-sm text-muted-foreground">
                    依照這次的預估成本，先確認保險方案與可能的理賠節省幅度。
                  </p>
                </div>
              </div>
              <Button onClick={() => navigate(`/insurance?pet=${activePetId}`)}>前往保險方案</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
