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
  { name: "AI 獸醫", path: "/ai-doctor", icon: MessageSquare },
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
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive
                ? "bg-[#4CAF50] text-white shadow-md"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#4CAF50] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🐾</span>
            </div>
            <h1 className="font-bold text-lg">Pet Health OS</h1>
          </div>
          
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <nav className="flex flex-col gap-2 mt-8">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#4CAF50] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">🐾</span>
              </div>
              <div>
                <h1 className="font-bold text-lg">Pet Health OS</h1>
                <p className="text-xs text-muted-foreground">智慧寵物照護平台</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <NavLinks />
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-green-900 mb-1">
                💰 本月已節省
              </p>
              <p className="text-2xl font-bold text-green-600">$47.50</p>
              <p className="text-xs text-green-700 mt-1">
                保費與醫療成本優化
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
