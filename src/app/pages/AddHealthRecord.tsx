import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useCreateHealthRecord } from "../../hooks/useApi";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { AlertCircle, Loader2, HeartPulse } from "lucide-react";

const RECORD_TYPES = [
  { value: "WEIGHT", label: "體重", valueLabel: "體重 (kg)", placeholder: "例：5.5", valueKey: "weight_kg" },
  { value: "DIET", label: "飲食", valueLabel: "餐食描述", placeholder: "例：乾糧100g + 水煮雞胸肉", valueKey: "meal" },
  { value: "EXERCISE", label: "運動", valueLabel: "運動描述", placeholder: "例：散步 30 分鐘", valueKey: "activity" },
  { value: "VACCINE", label: "疫苗", valueLabel: "疫苗名稱", placeholder: "例：Rabies + DHPP", valueKey: "vaccine_name" },
  { value: "MEDICATION", label: "用藥", valueLabel: "藥物名稱 / 劑量", placeholder: "例：Heartgard 1 錠", valueKey: "medication" },
  { value: "SYMPTOM", label: "症狀", valueLabel: "症狀描述", placeholder: "例：嘔吐兩次", valueKey: "symptom" },
  { value: "VET_VISIT", label: "看診", valueLabel: "看診原因", placeholder: "例：年度健康檢查", valueKey: "reason" },
];

export function AddHealthRecord() {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();
  const { mutate: createRecord, isPending } = useCreateHealthRecord(petId!);

  const [recordType, setRecordType] = useState("WEIGHT");
  const [textValue, setTextValue] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const currentType = RECORD_TYPES.find((t) => t.value === recordType)!;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const isNumericType = recordType === "WEIGHT";
    const parsedValue = isNumericType ? parseFloat(textValue) : textValue;

    if (isNumericType && isNaN(parsedValue as number)) {
      setError("請輸入有效的數字");
      return;
    }

    const value = { [currentType.valueKey]: parsedValue };

    createRecord(
      { record_type: recordType, value, date, notes },
      {
        onSuccess: () => navigate(-1),
        onError: (err: any) => setError(err?.message || "新增失敗，請重試"),
      }
    );
  };

  const inputClass =
    "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]";
  const labelClass = "text-sm font-medium text-gray-700 block mb-1";

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">新增健康紀錄</h1>
        <p className="text-muted-foreground text-sm">
          每一筆紀錄都有助於優化風險評分與保費折扣。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <HeartPulse className="w-5 h-5 text-[#4CAF50]" />
            紀錄內容
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Record Type */}
            <div>
              <label className={labelClass}>紀錄類型 *</label>
              <div className="grid grid-cols-4 gap-2">
                {RECORD_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => { setRecordType(t.value); setTextValue(""); }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition ${
                      recordType === t.value
                        ? "bg-[#4CAF50] text-white border-[#4CAF50]"
                        : "bg-white text-gray-700 border-gray-200 hover:border-[#4CAF50]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div>
              <label className={labelClass}>日期 *</label>
              <input
                id="record-date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Value */}
            <div>
              <label className={labelClass}>{currentType.valueLabel} *</label>
              <input
                id="record-value"
                type={recordType === "WEIGHT" ? "number" : "text"}
                step={recordType === "WEIGHT" ? "0.1" : undefined}
                required
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder={currentType.placeholder}
                className={inputClass}
              />
            </div>

            {/* Notes */}
            <div>
              <label className={labelClass}>備註</label>
              <textarea
                id="record-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="其他補充說明..."
                className={`${inputClass} resize-none`}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition text-sm"
              >
                取消
              </button>
              <button
                id="submit-record"
                type="submit"
                disabled={isPending}
                className="flex-1 bg-[#4CAF50] hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60 text-sm flex items-center justify-center gap-2"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {isPending ? "儲存中..." : "儲存紀錄"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
