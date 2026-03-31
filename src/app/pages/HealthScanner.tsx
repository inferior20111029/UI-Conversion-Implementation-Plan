import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Eye,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Sparkles,
  TrendingDown,
  TriangleAlert,
  Upload,
  Zap,
} from "lucide-react";
import { useAiHealthScan, useCreateAiHealthScan, usePets } from "../../hooks/useApi";
import {
  AiHealthFinding,
  AiHealthScanRecord,
  normalizeAiHealthScan,
} from "../../services/services";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png"];
const DEFAULT_FREE_SCANS = 2;

const statusMeta = {
  idle: {
    label: "尚未開始",
    description: "請先選擇寵物並上傳一張清晰照片。",
    progress: 0,
  },
  uploading: {
    label: "正在建立掃描",
    description: "照片已送出，正在建立 AI 掃描任務。",
    progress: 30,
  },
  queued: {
    label: "排隊中",
    description: "掃描任務已建立，正在等待 AI 分析資源。",
    progress: 45,
  },
  processing: {
    label: "AI 分析中",
    description: "正在辨識眼睛、毛髮、皮膚與其他外觀異常線索。",
    progress: 72,
  },
  completed: {
    label: "掃描完成",
    description: "分析已完成，可以查看這次掃描結果。",
    progress: 100,
  },
  failed: {
    label: "掃描失敗",
    description: "請更換清晰照片，或稍後再試一次。",
    progress: 100,
  },
} as const;

function extractErrorMessages(error: any): string[] {
  if (!error) {
    return ["掃描失敗，請稍後再試。"];
  }

  if (typeof error === "string") {
    return [error];
  }

  if (error.errors && typeof error.errors === "object") {
    const flattened = Object.values(error.errors)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter((value): value is string => typeof value === "string" && value.trim().length > 0);

    if (flattened.length > 0) {
      return flattened;
    }
  }

  if (typeof error.message === "string" && error.message.trim()) {
    return [error.message];
  }

  return ["掃描失敗，請稍後再試。"];
}

function formatCurrency(value: number | null | undefined) {
  if (value == null) {
    return "--";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 100 ? 0 : 2,
  }).format(value);
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getSeverityTone(severity: AiHealthFinding["severity"]) {
  if (severity === "high") {
    return {
      badge: "高關注",
      iconClass: "text-rose-600",
      cardClass: "border-rose-200 bg-rose-50/80",
      badgeClass: "bg-rose-100 text-rose-700 hover:bg-rose-100",
    };
  }

  if (severity === "low") {
    return {
      badge: "低風險",
      iconClass: "text-amber-600",
      cardClass: "border-amber-200 bg-amber-50/80",
      badgeClass: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    };
  }

  return {
    badge: "持續觀察",
    iconClass: "text-orange-600",
    cardClass: "border-orange-200 bg-orange-50/80",
    badgeClass: "bg-orange-100 text-orange-700 hover:bg-orange-100",
  };
}

function FindingCard({ finding }: { finding: AiHealthFinding }) {
  const tone = getSeverityTone(finding.severity);

  return (
    <div className={`rounded-2xl border p-4 ${tone.cardClass}`}>
      <div className="flex items-start gap-3">
        <TriangleAlert className={`mt-0.5 h-5 w-5 flex-shrink-0 ${tone.iconClass}`} />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-base font-semibold text-gray-900">{finding.title}</h4>
            <Badge className={tone.badgeClass}>{tone.badge}</Badge>
            {finding.confidence !== null ? (
              <span className="text-xs text-gray-500">信心 {finding.confidence}%</span>
            ) : null}
          </div>

          <p className="text-sm leading-6 text-gray-700">{finding.description}</p>

          {finding.recommendation ? (
            <div className="rounded-xl bg-white/80 p-3 text-sm text-gray-700">
              <p className="mb-1 font-medium text-gray-900">建議處置</p>
              <p>{finding.recommendation}</p>
            </div>
          ) : null}

          {finding.costImpact !== null ? (
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
              <TrendingDown className="h-4 w-4" />
              <span>及早處理預估可避免 {formatCurrency(finding.costImpact)} 的後續支出</span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function HealthScanner() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeScanId = searchParams.get("scanId");

  const { data: pets, isLoading: petsLoading } = usePets();
  const createScanMutation = useCreateAiHealthScan();
  const scanQuery = useAiHealthScan(activeScanId);

  const petList = Array.isArray(pets) ? pets : [];

  const [selectedPetId, setSelectedPetId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [inlineErrors, setInlineErrors] = useState<string[]>([]);
  const [freeScansLeft, setFreeScansLeft] = useState(DEFAULT_FREE_SCANS);
  const [localScan, setLocalScan] = useState<AiHealthScanRecord | null>(null);

  useEffect(() => {
    if (!selectedPetId && petList.length > 0) {
      setSelectedPetId(String(petList[0].id));
    }
  }, [petList, selectedPetId]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (scanQuery.data) {
      setLocalScan(scanQuery.data);
    }
  }, [scanQuery.data]);

  useEffect(() => {
    if (scanQuery.data?.remainingFreeScans !== null && scanQuery.data?.remainingFreeScans !== undefined) {
      setFreeScansLeft(scanQuery.data.remainingFreeScans);
    }
  }, [scanQuery.data?.remainingFreeScans]);

  const selectedPet = petList.find((pet: any) => String(pet.id) === selectedPetId);
  const scan = activeScanId ? scanQuery.data ?? localScan : localScan;
  const stageKey = createScanMutation.isPending ? "uploading" : scan?.status ?? "idle";
  const stage = statusMeta[stageKey as keyof typeof statusMeta];
  const displayImage = previewUrl ?? scan?.imageUrl ?? null;
  const findings = scan?.findings ?? [];

  const computedSavings = useMemo(() => {
    const total = findings.reduce((sum, finding) => sum + (finding.costImpact ?? 0), 0);
    if (scan?.preventiveSavings != null) {
      return scan.preventiveSavings;
    }

    return total > 0 ? total : null;
  }, [findings, scan?.preventiveSavings]);

  const resultReady =
    Boolean(scan) &&
    scan?.status !== "failed" &&
    (scan?.status === "completed" || findings.length > 0 || scan?.healthScore !== null);

  const processing =
    createScanMutation.isPending ||
    scan?.status === "queued" ||
    scan?.status === "processing";

  const highRiskCount = findings.filter((finding) => finding.severity === "high").length;
  const mediumRiskCount = findings.filter((finding) => finding.severity === "medium").length;
  const lowRiskCount = findings.filter((finding) => finding.severity === "low").length;

  const queryErrors = scanQuery.error ? extractErrorMessages(scanQuery.error) : [];
  const failedErrors =
    scan?.status === "failed"
      ? [scan.summary ?? "後端未能完成掃描，請換一張更清楚的照片再試一次。"]
      : [];

  const errorMessages =
    inlineErrors.length > 0 ? inlineErrors : failedErrors.length > 0 ? failedErrors : queryErrors;

  const resetScanState = () => {
    setLocalScan(null);
    setInlineErrors([]);

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("scanId");
    setSearchParams(nextParams);
  };

  const handleChooseFile = () => {
    inputRef.current?.click();
  };

  const handlePetChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPetId(event.target.value);
    resetScanState();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    setInlineErrors([]);

    if (!file) {
      return;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setSelectedFile(null);
      setInlineErrors(["僅支援 JPG、PNG 格式。"]);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setSelectedFile(null);
      setInlineErrors(["檔案大小需小於 10MB。"]);
      return;
    }

    resetScanState();
    setSelectedFile(file);
  };

  const handleStartScan = async () => {
    if (!selectedPetId) {
      setInlineErrors(["請先選擇要掃描的寵物。"]);
      return;
    }

    if (!selectedFile) {
      setInlineErrors(["請先選擇一張寵物照片。"]);
      return;
    }

    setInlineErrors([]);

    try {
      const response = await createScanMutation.mutateAsync({
        file: selectedFile,
        petId: selectedPetId,
      });
      const normalized = normalizeAiHealthScan(response);

      setLocalScan(normalized);

      if (normalized.remainingFreeScans !== null && normalized.remainingFreeScans !== undefined) {
        setFreeScansLeft(normalized.remainingFreeScans);
      } else {
        setFreeScansLeft((current) => Math.max(0, current - 1));
      }

      const nextParams = new URLSearchParams(searchParams);

      if (normalized.id) {
        nextParams.set("scanId", normalized.id);
      } else {
        nextParams.delete("scanId");
      }

      setSearchParams(nextParams);
    } catch (error) {
      setInlineErrors(extractErrorMessages(error));
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    resetScanState();
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900">AI 健康掃描</h1>
        <p className="text-sm text-gray-500">
          及早發現隱藏病灶，平均可節省 $150 醫療支出
        </p>
      </div>

      <Card className="overflow-hidden border border-green-200 bg-[linear-gradient(135deg,#ecfbef_0%,#f8fffb_60%,#eefaf4_100%)] shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#4CAF50] text-white shadow-lg shadow-green-200">
              <Eye className="h-8 w-8" />
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <h2 className="text-2xl font-semibold text-gray-900">
                AI 影像分析，及早發現潛在健康問題
              </h2>
              <p className="max-w-3xl text-sm leading-6 text-gray-600">
                上傳毛孩照片後，我們會透過 AI 分析皮膚、毛髮與外觀異常線索，提供初步風險提醒與後續照護建議。
              </p>
            </div>

            <div className="min-w-[156px] rounded-2xl bg-white px-5 py-4 text-center shadow-md shadow-green-100/80">
              <p className="text-xs text-gray-500">平均節省</p>
              <p className="mt-2 text-4xl font-semibold text-[#2e9d43]">$150</p>
              <p className="mt-1 text-xs text-gray-500">預防成本</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-amber-200 bg-[linear-gradient(135deg,#fff8e7_0%,#fffdf6_100%)] shadow-sm">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-amber-100 p-2 text-amber-600">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-amber-900">今日剩餘免費 AI 掃描次數</p>
              <p className="text-sm text-amber-700">
                若後端有回傳額度資訊，這裡會自動同步剩餘次數。
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-4xl font-semibold text-amber-600">{freeScansLeft}</p>
            <p className="text-xs text-amber-700">次</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-dashed border-gray-300 bg-white shadow-sm transition-colors hover:border-[#4CAF50]">
        <CardContent className="space-y-6 p-6 md:p-8">
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">選擇寵物</label>
              <select
                value={selectedPetId}
                onChange={handlePetChange}
                disabled={petsLoading || createScanMutation.isPending || petList.length === 0}
                className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-[#4CAF50] focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                {petList.length === 0 ? (
                  <option value="">尚無可掃描的寵物</option>
                ) : null}
                {petList.map((pet: any) => (
                  <option key={pet.id} value={String(pet.id)}>
                    {pet.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-4">
              <p className="text-sm font-medium text-gray-900">目前掃描對象</p>
              <p className="mt-2 text-sm text-gray-600">
                {selectedPet ? `將為 ${selectedPet.name} 建立 AI 掃描任務。` : "請先建立寵物資料後再進行掃描。"}
              </p>
              {petList.length === 0 ? (
                <Link to="/pets/add" className="mt-3 inline-flex text-sm font-medium text-[#4CAF50] hover:underline">
                  前往新增寵物
                </Link>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-full w-full items-center justify-center md:w-64">
              {displayImage ? (
                <div className="w-full overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 shadow-sm">
                  <img
                    src={displayImage}
                    alt="待掃描寵物照片"
                    className="aspect-[4/3] h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-40 w-full flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50 text-gray-400">
                  <Upload className="mb-3 h-10 w-10" />
                  <p className="text-sm">支援 JPG、PNG，檔案小於 10MB</p>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-4">
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-gray-900">上傳毛孩照片開始掃描</h3>
                <p className="text-sm leading-6 text-gray-500">
                  建議使用正面、光線充足且清楚對焦的照片，以提升辨識與風險分析品質。
                </p>
              </div>

              {selectedFile ? (
                <div className="rounded-2xl border border-green-200 bg-green-50/80 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-green-900">{selectedFile.name}</p>
                      <p className="text-xs text-green-700">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Badge className="w-fit bg-white text-green-700 hover:bg-white">已選擇照片</Badge>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-4 text-sm text-gray-600">
                  尚未選擇照片。可先挑一張近期、清晰的臉部或患部照片。
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="rounded-xl"
                  onClick={handleChooseFile}
                  disabled={createScanMutation.isPending || petList.length === 0}
                >
                  <Upload className="h-4 w-4" />
                  選擇照片
                </Button>

                <Button
                  type="button"
                  size="lg"
                  className="rounded-xl bg-[#4CAF50] text-white hover:bg-[#429647]"
                  onClick={handleStartScan}
                  disabled={
                    createScanMutation.isPending ||
                    !selectedFile ||
                    !selectedPetId ||
                    petList.length === 0
                  }
                >
                  {createScanMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                  {createScanMutation.isPending ? "掃描中..." : "開始 AI 掃描"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  className="rounded-xl"
                  onClick={handleReset}
                  disabled={createScanMutation.isPending}
                >
                  清除結果
                </Button>
              </div>

              {scan?.id ? <p className="text-xs text-gray-500">目前掃描編號：#{scan.id}</p> : null}
            </div>
          </div>
        </CardContent>
      </Card>

      {(processing || errorMessages.length > 0) && (
        <Card
          className={`shadow-sm ${
            errorMessages.length > 0
              ? "border border-rose-200 bg-rose-50/70"
              : "border border-sky-200 bg-sky-50/70"
          }`}
        >
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              {errorMessages.length > 0 ? (
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-600" />
              ) : (
                <Loader2 className="mt-0.5 h-5 w-5 flex-shrink-0 animate-spin text-sky-600" />
              )}

              <div className="min-w-0 flex-1 space-y-3">
                <div>
                  <p className="font-semibold text-gray-900">
                    {errorMessages.length > 0 ? "無法完成掃描" : stage.label}
                  </p>
                  {errorMessages.length > 0 ? (
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      {errorMessages.map((message, index) => (
                        <p key={`${message}-${index}`}>{message}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">{stage.description}</p>
                  )}
                </div>

                {errorMessages.length === 0 ? (
                  <div className="space-y-2">
                    <Progress value={stage.progress} className="h-2 bg-sky-100" />
                    <p className="text-xs text-sky-700">
                      {scanQuery.isFetching && !createScanMutation.isPending
                        ? "正在同步最新掃描結果..."
                        : "完成後將自動顯示分析結果。"}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {resultReady && scan ? (
        <Card className="overflow-hidden border border-[#86d68a] bg-white shadow-sm">
          <CardHeader className="border-b border-green-100 bg-[linear-gradient(135deg,#f6fff7_0%,#f9fffb_100%)]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-semibold text-gray-900">掃描結果</CardTitle>
                <p className="text-sm text-gray-600">
                  {scan.summary ??
                    "AI 已完成這次健康掃描，以下是目前辨識到的風險線索與建議。"}
                </p>
                {scan.createdAt ? (
                  <p className="text-xs text-gray-500">建立時間：{formatDate(scan.createdAt)}</p>
                ) : null}
              </div>

              <Badge className="w-fit bg-[#4CAF50] px-3 py-1 text-white hover:bg-[#4CAF50]">
                {stage.label}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,320px)]">
            <div className="space-y-5">
              {findings.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-[#4CAF50]" />
                    <h3 className="text-lg font-semibold text-gray-900">AI 發現的重點</h3>
                  </div>
                  {findings.map((finding, index) => (
                    <FindingCard key={`${finding.id ?? finding.title}-${index}`} finding={finding} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-green-200 bg-green-50/80 p-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">未發現明顯高風險異常</p>
                      <p className="mt-1 text-sm leading-6 text-green-800">
                        這次掃描沒有辨識到明顯異常外觀，但仍建議持續定期拍攝，建立毛孩健康變化記錄。
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Card className="border border-green-200 bg-[linear-gradient(180deg,#f3fff4_0%,#ffffff_100%)]">
                <CardContent className="space-y-4 p-5">
                  <div>
                    <p className="text-sm text-gray-500">健康分數</p>
                    <div className="mt-2 flex items-end gap-2">
                      <span className="text-5xl font-semibold text-[#2e9d43]">
                        {scan.healthScore ?? "--"}
                      </span>
                      <span className="pb-1 text-sm text-gray-500">/ 100</span>
                    </div>
                  </div>
                  <Progress value={scan.healthScore ?? 0} className="h-3 bg-green-100" />
                  <p className="text-sm text-gray-600">
                    分數越高，代表目前影像中可辨識的風險越少。
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card className="border border-gray-200">
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-500">平均信心</p>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">
                      {scan.confidence != null ? `${scan.confidence}%` : "--"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-500">預防節省</p>
                    <p className="mt-2 text-2xl font-semibold text-emerald-600">
                      {formatCurrency(computedSavings)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border border-gray-200">
                <CardContent className="space-y-3 p-5">
                  <p className="text-sm font-semibold text-gray-900">風險分布</p>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-2xl bg-rose-50 p-3">
                      <p className="text-xs text-rose-600">高關注</p>
                      <p className="mt-1 text-2xl font-semibold text-rose-700">{highRiskCount}</p>
                    </div>
                    <div className="rounded-2xl bg-orange-50 p-3">
                      <p className="text-xs text-orange-600">觀察中</p>
                      <p className="mt-1 text-2xl font-semibold text-orange-700">{mediumRiskCount}</p>
                    </div>
                    <div className="rounded-2xl bg-amber-50 p-3">
                      <p className="text-xs text-amber-600">低風險</p>
                      <p className="mt-1 text-2xl font-semibold text-amber-700">{lowRiskCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={handleChooseFile}
                >
                  <RefreshCw className="h-4 w-4" />
                  重新選擇照片
                </Button>

                {scan.reportUrl ? (
                  <Button asChild className="rounded-xl bg-[#4CAF50] text-white hover:bg-[#429647]">
                    <a href={scan.reportUrl} target="_blank" rel="noreferrer">
                      查看報告
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              AI 掃描如何運作？
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "選擇寵物",
                description: "先指定這次掃描要分析哪一隻毛孩。",
                tone: "bg-sky-100 text-sky-700",
              },
              {
                step: "2",
                title: "上傳照片",
                description: "送出清晰圖片後，後端會建立 scan 任務。",
                tone: "bg-emerald-100 text-emerald-700",
              },
              {
                step: "3",
                title: "取得結果",
                description: "系統會自動查詢結果並顯示健康分數與建議。",
                tone: "bg-violet-100 text-violet-700",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                <div
                  className={`mb-3 flex h-11 w-11 items-center justify-center rounded-full text-lg font-semibold ${item.tone}`}
                >
                  {item.step}
                </div>
                <h4 className="text-base font-semibold text-gray-900">{item.title}</h4>
                <p className="mt-2 text-sm leading-6 text-gray-600">{item.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-[linear-gradient(180deg,#fbfefb_0%,#f7fbf8_100%)] shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">拍攝技巧</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "確保光線充足，避免過度曝光或明顯陰影。",
              "優先拍攝毛孩正面或有症狀的局部特寫，讓 AI 更容易辨識。",
              "保持對焦清楚，盡量避免晃動或過度壓縮的圖片。",
              "建議固定角度定期拍攝，方便比對健康變化。",
            ].map((tip) => (
              <div key={tip} className="flex items-start gap-3 rounded-2xl border border-green-100 bg-white/80 p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#4CAF50]" />
                <p className="text-sm leading-6 text-gray-700">{tip}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-slate-100 p-2 text-slate-700">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">API 串接方式</p>
              <p className="text-sm text-gray-600">
                這頁會送出 <code>file</code> 與 <code>pet_id</code> 到
                <code> POST /ai-health/scans</code>，再用
                <code> GET /ai-health/scans/{"{id}"}</code> 自動查詢結果。
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-gray-50 px-4 py-3 text-xs leading-6 text-gray-500">
            若你的 Laravel API 位址不是 <code>http://localhost:8000/api</code>，
            請調整 <code>VITE_API_URL</code>。
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
