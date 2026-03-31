import { Outlet, Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Shield,
  MessageSquare,
  ScanLine,
  ShoppingBag,
  CreditCard,
  Key,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const navigation = [
  { name: "儀表板", path: "/", icon: LayoutDashboard },
  { name: "保險方案", path: "/insurance", icon: Shield },
  { name: "AI 醫師", path: "/ai-doctor", icon: MessageSquare },
  { name: "健康掃描", path: "/scanner", icon: ScanLine },
  { name: "照護商品", path: "/products", icon: ShoppingBag },
  { name: "訂閱計畫", path: "/subscription", icon: CreditCard },
  { name: "數據身分", path: "/web3", icon: Key },
];

export function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavLinks = () => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
              isActive
                ? "bg-[#4CAF50] text-white shadow-md shadow-green-200/60"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{item.name}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f9fcfa_0%,#f5f7f8_100%)]">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4CAF50] text-sm font-bold text-white">
              PH
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">Pet Health OS</p>
              <p className="text-xs text-gray-500">智慧寵物照護平台</p>
            </div>
          </div>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <div className="mt-8 flex items-center gap-3 border-b border-gray-100 pb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4CAF50] text-sm font-bold text-white">
                  PH
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Pet Health OS</p>
                  <p className="text-xs text-gray-500">智慧寵物照護平台</p>
                </div>
              </div>
              <nav className="mt-6 flex flex-col gap-2">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-0 hidden min-h-screen w-64 flex-col border-r border-gray-200 bg-white lg:flex">
          <div className="border-b border-gray-200 px-5 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4CAF50] text-sm font-bold text-white">
                PH
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Pet Health OS</h1>
                <p className="text-xs text-gray-500">智慧寵物照護平台</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-2 px-4 py-5">
            <NavLinks />
          </nav>

          <div className="border-t border-gray-200 p-4">
            <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4">
              <p className="text-xs font-semibold text-green-800">本月已節省</p>
              <p className="mt-1 text-3xl font-semibold text-green-600">$47.50</p>
              <p className="mt-1 text-xs text-green-700">
                來自健康追蹤、預防提醒與保費優化
              </p>
            </div>
          </div>
        </aside>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
