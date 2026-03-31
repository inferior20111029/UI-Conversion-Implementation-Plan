import { useState } from "react";
import { useNavigate } from "react-router";
import { authService } from "../../services/services";
import { useAuthStore } from "../../store/useAuthStore";

export function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleDemoLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res: any = await authService.login({
        email: "testUser@email.com",
        password: "password123",
      });
      setAuth(res.user, res.access_token);
      navigate("/");
    } catch (err: any) {
      setError(err?.message || "Demo 登入失敗");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res: any = isRegister
        ? await authService.register(form)
        : await authService.login(form);
      // Our logic in api.ts now returns response.data.data directly
      setAuth(res.user, res.access_token);
      navigate("/");
    } catch (err: any) {
      setError(err?.message || "登入失敗，請重試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#4CAF50] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl">🐾</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Pet Health OS</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isRegister ? "建立您的帳號" : "登入您的帳號"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                姓名
              </label>
              <input
                id="name"
                type="text"
                required={isRegister}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="您的名字"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              密碼
            </label>
            <input
              id="password"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            id="submit-btn"
            type="submit"
            disabled={loading}
            className="w-full bg-[#4CAF50] hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "處理中..." : isRegister ? "建立帳號" : "登入"}
          </button>

          {!isRegister && (
            <button
              id="demo-login-btn"
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full bg-white border-2 border-[#4CAF50] text-[#4CAF50] hover:bg-green-50 font-semibold py-2.5 rounded-lg transition disabled:opacity-60 mt-2"
            >
              🚀 快速體驗 Demo 帳號
            </button>
          )}
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {isRegister ? "已有帳號？" : "還沒有帳號？"}{" "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-[#4CAF50] font-semibold hover:underline"
          >
            {isRegister ? "立即登入" : "免費註冊"}
          </button>
        </p>

        {/* Dev hint */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 text-center">
          測試帳號：testUser@email.com / password123
        </div>
      </div>
    </div>
  );
}
