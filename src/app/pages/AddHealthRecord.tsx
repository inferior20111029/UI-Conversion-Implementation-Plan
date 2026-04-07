import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AlertCircle, HeartPulse, Loader2 } from "lucide-react";
import { useCreateHealthRecord } from "../../hooks/useApi";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const RECORD_TYPES = [
  {
    value: "weight",
    label: "體重",
    fieldLabel: "體重（kg）",
    placeholder: "例如：29",
    helper: "建議定期更新體重，方便追蹤健康趨勢。",
  },
  {
    value: "checkup",
    label: "健檢",
    fieldLabel: "健檢摘要",
    placeholder: "例如：心肺狀況正常，建議持續控制體重",
    helper: "填寫健檢重點或醫師建議即可。",
  },
  {
    value: "vaccine",
    label: "疫苗",
    fieldLabel: "疫苗名稱",
    placeholder: "例如：Rabies、DHPP",
    helper: "請填最近一次完成的疫苗名稱或組合。",
  },
] as const;

export function AddHealthRecord() {
  const navigate = useNavigate();
  const { petId } = useParams<{ petId: string }>();
  const { mutate: createRecord, isPending } = useCreateHealthRecord(petId ?? "");

  const [recordType, setRecordType] = useState<(typeof RECORD_TYPES)[number]["value"]>("weight");
  const [rawValue, setRawValue] = useState("");
  const [recordedAt, setRecordedAt] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState("");

  const currentType = RECORD_TYPES.find((type) => type.value === recordType)!;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!petId) {
      setError("找不到對應的寵物。");
      return;
    }

    const trimmedValue = rawValue.trim();
    if (!trimmedValue) {
      setError("請先填寫紀錄內容。");
      return;
    }

    let value = trimmedValue;

    if (recordType === "weight") {
      const parsed = Number(trimmedValue);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        setError("請輸入正確的體重數值。");
        return;
      }

      value = `${parsed}kg`;
    }

    if (recordType === "checkup") {
      value = JSON.stringify({ note: trimmedValue });
    }

    if (recordType === "vaccine") {
      value = JSON.stringify({ name: trimmedValue });
    }

    createRecord(
      {
        type: recordType,
        value,
        recorded_at: `${recordedAt}T12:00:00`,
      },
      {
        onSuccess: () => navigate("/"),
        onError: (err: { message?: string }) => {
          setError(err?.message || "新增健康紀錄失敗，請稍後再試。");
        },
      },
    );
  };

  const inputClass =
    "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]";
  const labelClass = "mb-1 block text-sm font-medium text-gray-700";

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="mb-1 text-3xl font-bold">新增健康紀錄</h1>
        <p className="text-sm text-muted-foreground">
          補上近期體重、健檢或疫苗資料，讓健康儀表板與保費估算更準確。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <HeartPulse className="h-5 w-5 text-[#4CAF50]" />
            健康紀錄內容
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>紀錄類型</label>
              <div className="grid grid-cols-3 gap-2">
                {RECORD_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => {
                      setRecordType(type.value);
                      setRawValue("");
                    }}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      recordType === type.value
                        ? "border-[#4CAF50] bg-[#4CAF50] text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-[#4CAF50]"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>紀錄日期</label>
              <input
                id="recorded-at"
                type="date"
                required
                value={recordedAt}
                onChange={(event) => setRecordedAt(event.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>{currentType.fieldLabel}</label>
              <input
                id="record-value"
                type={recordType === "weight" ? "number" : "text"}
                step={recordType === "weight" ? "0.1" : undefined}
                required
                value={rawValue}
                onChange={(event) => setRawValue(event.target.value)}
                placeholder={currentType.placeholder}
                className={inputClass}
              />
              <p className="mt-1 text-xs text-muted-foreground">{currentType.helper}</p>
            </div>

            {error ? (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            ) : null}

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>
                取消
              </Button>
              <Button id="submit-record" type="submit" className="flex-1" disabled={isPending}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {isPending ? "儲存中..." : "儲存健康紀錄"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
