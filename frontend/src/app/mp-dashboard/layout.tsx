'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Download,
  Settings as SettingsIcon,
  LogOut,
  Bell,
  User,
  Sun,
  Moon,
  Building,
  Menu,
  X
} from 'lucide-react';

export default function MPDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('mp@nagriksathi.in');
  const [password, setPassword] = useState('password');
  const [loginError, setLoginError] = useState('');

  // Header / UI States
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const notifications = [
    { id: 1, text: 'Critical: Water pipeline burst in Ward 4', time: '10m ago', unread: true },
    { id: 2, text: 'New complaint filed regarding streetlights', time: '1h ago', unread: true },
    { id: 3, text: 'Monthly resolution report is ready to download', time: '1d ago', unread: false }
  ];

  useEffect(() => {
    const auth = localStorage.getItem('mp_authenticated');
    if (auth === 'true') setIsAuthenticated(true);
    const dark = localStorage.getItem('dark_mode') === 'true';
    setIsDarkMode(dark);
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    setLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'mp@nagriksathi.in' && password === 'password') {
      localStorage.setItem('mp_authenticated', 'true');
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid email or password. Use mp@nagriksathi.in / password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mp_authenticated');
    setIsAuthenticated(false);
    router.push('/');
  };

  const toggleDarkMode = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    localStorage.setItem('dark_mode', String(nextDark));
    if (nextDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  /* ─── Loading spinner ─────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-200 font-bold text-white text-lg">NS</div>
          <div className="animate-spin h-6 w-6 border-3 border-orange-400 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  /* ─── Login Gate ──────────────────────────────────────────── */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Decorative blobs */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-orange-100 blur-[100px] pointer-events-none opacity-60" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-orange-50 blur-[100px] pointer-events-none opacity-80" />

        {/* Header */}
        <div className="text-center mb-8 flex flex-col items-center gap-2">
          <div className="h-14 w-14 rounded-3xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-200 mb-2">
            <Building className="h-7 w-7 text-white" />
          </div>
          <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">Constituency Redressal Portal</p>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Member of Parliament Dashboard
          </h1>
        </div>

        {/* Login Card */}
        <div className="soft-card w-full max-w-md p-8 flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Sign In</h2>
            <p className="text-xs text-gray-400 mt-1">Authorised officers and MPs only. Enter credentials to access.</p>
          </div>

          {loginError && (
            <div className="bg-red-50 border border-red-100 text-red-500 rounded-2xl p-3 text-xs font-semibold">
              ⚠️ {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                placeholder="mp@nagriksathi.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Password</label>
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3 px-4 text-sm cursor-pointer text-center"
            >
              Access Representative Portal
            </button>
          </form>

          <div className="text-center">
            <a href="/" className="text-xs text-gray-400 hover:text-orange-500 transition underline">
              Return to Citizen Homepage
            </a>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Sidebar nav items ───────────────────────────────────── */
  const sidebarItems = [
    { label: 'Dashboard', path: '/mp-dashboard', icon: LayoutDashboard },
    { label: 'Complaints', path: '/mp-dashboard/complaints', icon: FileText },
    { label: 'Analytics', path: '/mp-dashboard/analytics', icon: BarChart3 },
    { label: 'Reports', path: '/mp-dashboard/reports', icon: Download },
    { label: 'Settings', path: '/mp-dashboard/settings', icon: SettingsIcon }
  ];

  /* ─── Main Dashboard Shell ────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#F7F8FA] text-gray-900 flex font-sans">

      {/* ── Sidebar Desktop ── */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 shrink-0 shadow-sm">
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-100">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-orange-100">
            NS
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 text-sm leading-none" style={{ fontFamily: 'Poppins, sans-serif' }}>NagrikSathi</span>
            <span className="text-[10px] text-orange-500 font-bold uppercase mt-0.5 tracking-wider">MP Officer Portal</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-0.5">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || (item.path !== '/mp-dashboard' && pathname.startsWith(item.path));
            return (
              <a
                key={item.label}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-orange-50 text-orange-600 border border-orange-100 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-orange-500' : ''}`} />
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Logout Account
          </button>
        </div>
      </aside>

      {/* ── Mobile Sidebar overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden bg-gray-900/40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        >
          <aside className="w-64 bg-white flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold text-white text-sm">NS</div>
                <span className="font-bold text-gray-900 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>NagrikSathi</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-5 space-y-0.5">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path || (item.path !== '/mp-dashboard' && pathname.startsWith(item.path));
                return (
                  <a
                    key={item.label}
                    href={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-orange-50 text-orange-600 border border-orange-100'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-orange-500' : ''}`} />
                    {item.label}
                  </a>
                );
              })}
            </nav>

            <div className="p-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <LogOut className="h-4 w-4" />
                Logout Account
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
          {/* Left: menu + breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer"
            >
              <Menu className="h-5 w-5 text-gray-500" />
            </button>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-orange-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 hidden sm:inline">Rampur Constituency</span>
              <span className="text-xs text-gray-200 hidden sm:inline">•</span>
              <span className="text-xs font-semibold text-gray-500">Representative Portal</span>
            </div>
          </div>

          {/* Right: controls */}
          <div className="flex items-center gap-3">

            {/* Dark mode */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 transition cursor-pointer border border-gray-100"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
                className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 relative cursor-pointer border border-gray-100"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl p-4 shadow-xl z-50 text-xs">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-sm text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Recent Updates</span>
                    <span className="text-[10px] text-orange-500 font-semibold cursor-pointer hover:text-orange-600">Mark all read</span>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((n) => (
                      <div key={n.id} className={`p-2.5 rounded-xl border transition ${n.unread ? 'bg-orange-50/60 border-orange-100' : 'bg-gray-50 border-transparent'}`}>
                        <p className="text-gray-700 font-medium leading-normal">{n.text}</p>
                        <span className="text-[10px] text-gray-400 mt-1 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                className="flex items-center gap-2 cursor-pointer p-1 pr-2 rounded-2xl hover:bg-gray-50 border border-gray-100 transition"
              >
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">
                  MP
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-gray-900 leading-none" style={{ fontFamily: 'Poppins, sans-serif' }}>Dr. Ramesh Kumar</p>
                  <p className="text-[9px] text-orange-500 font-bold mt-0.5 uppercase tracking-wide">Member of Parliament</p>
                </div>
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl p-3 shadow-xl z-50 text-xs">
                  <div className="px-2 py-1.5 border-b border-gray-100 mb-2">
                    <p className="font-bold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>Dr. Ramesh Kumar</p>
                    <p className="text-[10px] text-gray-400">Rampur Constituency</p>
                  </div>
                  <a
                    href="/mp-dashboard/settings"
                    onClick={() => setShowProfile(false)}
                    className="flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-orange-50 hover:text-orange-600 font-medium transition"
                  >
                    <User className="h-3.5 w-3.5" /> Profile Settings
                  </a>
                  <button
                    onClick={() => { setShowProfile(false); handleLogout(); }}
                    className="w-full flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-red-50 text-red-500 font-medium text-left cursor-pointer transition"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>

    </div>
  );
}
