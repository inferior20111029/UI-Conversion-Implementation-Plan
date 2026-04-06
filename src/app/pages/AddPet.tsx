import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useCreatePet, usePet, useUpdatePet } from "../../hooks/useApi";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { AlertCircle, Loader2, PencilLine, PlusCircle, Shield } from "lucide-react";

type PetFormState = {
  name: string;
  type: "dog" | "cat";
  breed: string;
  birthday: string;
  gender: "male" | "female";
  weight: string;
  microchipNumber: string;
};

const defaultForm: PetFormState = {
  name: "",
  type: "dog",
  breed: "",
  birthday: "",
  gender: "male",
  weight: "",
  microchipNumber: "",
};

export function AddPet() {
  const navigate = useNavigate();
  const { petId } = useParams();
  const isEditMode = Boolean(petId);
  const { data: pet, isLoading: petLoading, isError: petError } = usePet(petId ?? "");
  const { mutate: createPet, isPending: isCreating } = useCreatePet();
  const { mutate: updatePet, isPending: isUpdating } = useUpdatePet();
  const [error, setError] = useState("");
  const [form, setForm] = useState<PetFormState>(defaultForm);

  useEffect(() => {
    if (!pet) {
      return;
    }

    setForm({
      name: pet.name ?? "",
      type: pet.type === "cat" ? "cat" : "dog",
      breed: pet.breed ?? "",
      birthday: pet.birthday ? String(pet.birthday).slice(0, 10) : "",
      gender: pet.gender === "female" ? "female" : "male",
      weight: pet.weight != null ? String(pet.weight) : "",
      microchipNumber: pet.microchip_number ?? "",
    });
  }, [pet]);

  const isPending = isCreating || isUpdating;
  const insurancePreview = useMemo(() => insuranceTypePreview(form.type), [form.type]);
  const breedOptions = useMemo(() => breedSuggestions(form.type), [form.type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const payload = {
      name: form.name,
      type: form.type,
      birthday: form.birthday,
      gender: form.gender,
      breed: form.breed || undefined,
      weight: form.weight ? parseFloat(form.weight) : undefined,
      microchip_number: form.microchipNumber || undefined,
    };

    const handlers = {
      onSuccess: (savedPet: { id: string | number }) => navigate(`/insurance?pet=${savedPet.id}`),
      onError: (err: { message?: string }) => setError(err?.message || "儲存失敗，請檢查資料後再試"),
    };

    if (isEditMode && petId) {
      updatePet({ id: petId, data: payload }, handlers);
      return;
    }

    createPet(payload, handlers);
  };

  const inputClass =
    "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]";
  const labelClass = "text-sm font-medium text-gray-700 block mb-1";

  if (isEditMode && petLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="animate-pulse h-40 bg-gray-100" />
        <Card className="animate-pulse h-[28rem] bg-gray-100" />
      </div>
    );
  }

  if (isEditMode && petError) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">編輯寵物</h1>
          <p className="text-muted-foreground text-sm">
            無法讀取毛孩資料，請返回列表後重新選擇。
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          無法載入寵物資料，請稍後再試。
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">{isEditMode ? "編輯寵物資料" : "新增寵物"}</h1>
        <p className="text-muted-foreground text-sm">
          {isEditMode
            ? "更新毛孩資料後，保險列表會依最新物種與條件重新篩選。"
            : "建立毛孩資料後，開始記錄健康資訊並追蹤保費優化。"}
        </p>
      </div>

      <Card className="border-2 border-slate-200 bg-slate-50/80">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                <Shield className="h-3.5 w-3.5 text-[#4CAF50]" />
                保險類型對應
              </div>
              <h2 className="text-lg font-semibold text-slate-900">{insurancePreview.label}</h2>
              <p className="mt-1 text-sm text-slate-600">{insurancePreview.description}</p>
            </div>
            <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
              <p className="text-xs font-semibold text-green-700 mb-1">可匹配物種</p>
              <p>{insurancePreview.eligibleSpecies}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            {isEditMode ? (
              <PencilLine className="w-5 h-5 text-[#4CAF50]" />
            ) : (
              <PlusCircle className="w-5 h-5 text-[#4CAF50]" />
            )}
            寵物基本資料
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>寵物名稱 *</label>
              <input
                id="pet-name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="例：Bella"
                className={inputClass}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>種類 *</label>
                <select
                  id="pet-species"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as "dog" | "cat" })}
                  className={inputClass}
                >
                  <option value="dog">狗</option>
                  <option value="cat">貓</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>性別 *</label>
                <select
                  id="pet-gender"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value as "male" | "female" })}
                  className={inputClass}
                >
                  <option value="male">男生</option>
                  <option value="female">女生</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>品種</label>
              <input
                id="pet-breed"
                list={`breed-options-${form.type}`}
                value={form.breed}
                onChange={(e) => setForm({ ...form, breed: e.target.value })}
                placeholder="例：Shiba Inu"
                className={inputClass}
              />
              <datalist id={`breed-options-${form.type}`}>
                {breedOptions.map((breed) => (
                  <option key={breed} value={breed} />
                ))}
              </datalist>
              <p className="mt-1 text-xs text-muted-foreground">
                建議使用系統建議品種值，能更準確對到品種型保單。
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>出生日期 *</label>
                <input
                  id="pet-birth-date"
                  type="date"
                  required
                  value={form.birthday}
                  onChange={(e) => setForm({ ...form, birthday: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>目前體重 (kg)</label>
                <input
                  id="pet-weight"
                  type="number"
                  step="0.1"
                  min="0"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  placeholder="例：5.5"
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {isEditMode ? "更新後會反映在健康與保費分析中。" : "填寫後將自動建立第一筆體重紀錄。"}
                </p>
              </div>
            </div>

            <div>
              <label className={labelClass}>晶片號碼</label>
              <input
                id="pet-microchip-number"
                value={form.microchipNumber}
                onChange={(e) => setForm({ ...form, microchipNumber: e.target.value })}
                placeholder="例：MCP-123456789"
                className={inputClass}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                若方案要求晶片，系統會依此判斷是否符合投保資格。
              </p>
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
                onClick={() => navigate(isEditMode && petId ? `/insurance?pet=${petId}` : "/insurance")}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition text-sm"
              >
                取消
              </button>
              <button
                id="submit-pet"
                type="submit"
                disabled={isPending}
                className="flex-1 bg-[#4CAF50] hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60 text-sm flex items-center justify-center gap-2"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isPending ? "儲存中..." : isEditMode ? "儲存變更" : "新增寵物"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function insuranceTypePreview(type: "dog" | "cat") {
  if (type === "cat") {
    return {
      label: "貓用保險",
      description: "優先對應貓咪可投保的醫療、住院與慢性病保障方案。",
      eligibleSpecies: "貓",
    };
  }

  return {
    label: "犬用保險",
    description: "優先對應犬隻可投保的醫療、意外與活動型保障方案。",
    eligibleSpecies: "狗",
  };
}

function breedSuggestions(type: "dog" | "cat") {
  if (type === "cat") {
    return [
      "British Shorthair",
      "Ragdoll",
      "Persian",
      "Maine Coon",
      "Scottish Fold",
      "Domestic Shorthair",
    ];
  }

  return [
    "Shiba Inu",
    "Golden Retriever",
    "Labrador Retriever",
    "French Bulldog",
    "Welsh Corgi",
    "Poodle",
  ];
}
