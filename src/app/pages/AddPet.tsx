import { useState } from "react";
import { useNavigate } from "react-router";
import { useCreatePet } from "../../hooks/useApi";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { AlertCircle, Loader2, PlusCircle } from "lucide-react";

export function AddPet() {
  const navigate = useNavigate();
  const { mutate: createPet, isPending } = useCreatePet();
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    type: "dog" as "dog" | "cat",
    breed: "",
    birthday: "",
    gender: "male" as "male" | "female",
    weight: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    createPet(
      {
        ...form,
        weight: form.weight ? parseFloat(form.weight) : undefined,
      },
      {
        onSuccess: () => navigate("/"),
        onError: (err: any) => setError(err?.message || "新增失敗，請檢查資料"),
      }
    );
  };

  const inputClass =
    "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]";
  const labelClass = "text-sm font-medium text-gray-700 block mb-1";

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">新增寵物</h1>
        <p className="text-muted-foreground text-sm">
          建立毛孩資料後，開始記錄健康資訊並追蹤保費優化。
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <PlusCircle className="w-5 h-5 text-[#4CAF50]" />
            寵物基本資料
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
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

            {/* Species */}
            <div>
              <label className={labelClass}>種類 *</label>
              <select
                id="pet-species"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as "dog" | "cat" })}
                className={inputClass}
              >
                <option value="dog">🐶 狗</option>
                <option value="cat">🐱 貓</option>
              </select>
            </div>

            {/* Breed */}
            <div>
              <label className={labelClass}>品種</label>
              <input
                id="pet-breed"
                value={form.breed}
                onChange={(e) => setForm({ ...form, breed: e.target.value })}
                placeholder="例：Golden Retriever"
                className={inputClass}
              />
            </div>

            {/* Birth Date */}
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

            {/* Gender */}
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

            {/* Weight (optional) */}
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
              <p className="text-xs text-muted-foreground mt-1">
                填寫後將自動建立第一筆體重紀錄
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
                onClick={() => navigate("/")}
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
                {isPending ? "儲存中..." : "新增寵物"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
