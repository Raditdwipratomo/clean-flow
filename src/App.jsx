import React, { useCallback, useEffect, useState } from 'react';
import {
  Bell,
  ClipboardList,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { BrandLogo, ToastStack } from './components/ui.jsx';
import { apiRequest } from './lib/api.js';
import LandingPage from './pages/LandingPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import {
  CitizenDashboard,
  CreateReportPage,
  MyReportsPage,
  ReportDetailPage,
} from './pages/CitizenPages.jsx';
import {
  AdminAllReportsPage,
  AdminDashboard,
  AdminOfficersPage,
  AdminVerificationPage,
} from './pages/AdminPages.jsx';
import { OfficerDashboard, OfficerTasksPage } from './pages/OfficerPages.jsx';
import { NotificationsPage, ProfilePage } from './pages/SharedPages.jsx';

function readStoredUser() {
  try {
    return JSON.parse(localStorage.user || 'null');
  } catch {
    return null;
  }
}

export default function App() {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.token || '');

  // Public routing: 'landing' or 'auth'
  const [publicView, setPublicView] = useState(() => {
    const p = window.location.pathname;
    if (p === '/login' || p === '/register') return 'auth';
    return 'landing';
  });
  const [authMode, setAuthMode] = useState(() =>
    window.location.pathname === '/register' ? 'register' : 'login'
  );
  const [prefillEmail, setPrefillEmail] = useState('');

  // App state
  const [page, setPage] = useState('dashboard');
  const [reports, setReports] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [verifyTarget, setVerifyTarget] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [loadErr, setLoadErr] = useState('');

  const notifyToast = useCallback((message, type = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const role = user?.role || 'CITIZEN';

  const refreshData = useCallback(async () => {
    if (!user || !token) return;
    setLoadErr('');
    try {
      const reportPath =
        role === 'ADMIN'
          ? '/admin/reports'
          : role === 'OFFICER'
            ? '/officer/assignments'
            : '/reports/my';

      const reqs = [
        apiRequest(reportPath, { token }),
        apiRequest('/notifications', { token }),
      ];
      if (role === 'ADMIN') {
        reqs.push(apiRequest('/admin/officers', { token }));
      }

      const [rRes, nRes, oRes] = await Promise.all(reqs);
      setReports(rRes.reports || rRes.assignments || []);
      setNotifs(nRes.notifications || []);
      if (oRes) setOfficers(oRes.officers || []);
    } catch (error) {
      if (error.message?.includes('masuk kembali') || error.message?.includes('401')) {
        localStorage.clear();
        setUser(null);
        setToken('');
        setPublicView('auth');
      } else {
        setLoadErr(error.message || 'Gagal memuat data.');
      }
    }
  }, [user, token, role]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleNavigateAuth = (mode = 'login', email = '') => {
    setAuthMode(mode);
    setPrefillEmail(email);
    setPublicView('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (res) => {
    localStorage.user = JSON.stringify(res.user);
    localStorage.token = res.token;
    setToken(res.token);
    setUser(res.user);
    setPage('dashboard');
    setSelectedReport(null);
    setVerifyTarget(null);
    notifyToast(`Selamat datang, ${res.user.full_name}!`);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setToken('');
    setReports([]);
    setOfficers([]);
    setNotifs([]);
    setSelectedReport(null);
    setVerifyTarget(null);
    setPublicView('landing');
    notifyToast('Anda telah keluar dari CleanFlow.');
  };

  const openReportDetail = (r) => {
    setSelectedReport(r);
    setPage('detail');
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openVerifyItem = (r) => {
    setVerifyTarget(r);
    setPage('verify');
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateApp = (target) => {
    setPage(target);
    if (target !== 'detail') setSelectedReport(null);
    if (target !== 'verify') setVerifyTarget(null);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!user) {
    return (
      <>
        {publicView === 'auth' ? (
          <AuthPage
            initialMode={authMode}
            prefillEmail={prefillEmail}
            onBack={() => setPublicView('landing')}
            onSuccess={handleAuthSuccess}
          />
        ) : (
          <LandingPage onNavigateAuth={handleNavigateAuth} />
        )}
        <ToastStack toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  const unreadCount = notifs.filter((n) => !n.is_read).length;
  const pendingVerifyCount = reports.filter((r) => r.status === 'SUBMITTED').length;

  const navItems =
    role === 'ADMIN'
      ? [
          { key: 'dashboard', label: 'Dasbor', icon: <LayoutDashboard size={19} /> },
          {
            key: 'verify',
            label: 'Verifikasi',
            icon: <ClipboardList size={19} />,
            badge: pendingVerifyCount,
          },
          { key: 'reports', label: 'Semua Laporan', icon: <FileText size={19} /> },
          { key: 'officers', label: 'Petugas', icon: <Users size={19} /> },
          { key: 'notifications', label: 'Notifikasi', icon: <Bell size={19} />, badge: unreadCount },
          { key: 'profile', label: 'Profil', icon: <UserRound size={19} /> },
        ]
      : role === 'OFFICER'
        ? [
            { key: 'dashboard', label: 'Dasbor', icon: <LayoutDashboard size={19} /> },
            { key: 'tasks', label: 'Tugas Saya', icon: <ClipboardList size={19} /> },
            { key: 'notifications', label: 'Notifikasi', icon: <Bell size={19} />, badge: unreadCount },
            { key: 'profile', label: 'Profil', icon: <UserRound size={19} /> },
          ]
        : [
            { key: 'dashboard', label: 'Dasbor', icon: <LayoutDashboard size={19} /> },
            { key: 'create', label: 'Buat Laporan', icon: <Plus size={19} /> },
            { key: 'reports', label: 'Laporan Saya', icon: <FileText size={19} /> },
            { key: 'notifications', label: 'Notifikasi', icon: <Bell size={19} />, badge: unreadCount },
            { key: 'profile', label: 'Profil', icon: <UserRound size={19} /> },
          ];

  const mobileTabs =
    role === 'ADMIN'
      ? [
          { key: 'dashboard', label: 'Dasbor', icon: <Home size={20} /> },
          { key: 'verify', label: 'Verifikasi', icon: <ClipboardList size={20} /> },
          { key: 'reports', label: 'Laporan', icon: <FileText size={20} /> },
          { key: 'profile', label: 'Profil', icon: <UserRound size={20} /> },
        ]
      : role === 'OFFICER'
        ? [
            { key: 'dashboard', label: 'Beranda', icon: <Home size={20} /> },
            { key: 'tasks', label: 'Tugas', icon: <ClipboardList size={20} /> },
            { key: 'notifications', label: 'Info', icon: <Bell size={20} /> },
            { key: 'profile', label: 'Profil', icon: <UserRound size={20} /> },
          ]
        : [
            { key: 'dashboard', label: 'Beranda', icon: <Home size={20} /> },
            { key: 'create', label: 'Lapor', icon: <Plus size={20} /> },
            { key: 'reports', label: 'Laporan', icon: <FileText size={20} /> },
            { key: 'profile', label: 'Profil', icon: <UserRound size={20} /> },
          ];

  const headerTitle = {
    dashboard:
      role === 'ADMIN'
        ? 'Ringkasan Operasional'
        : `Halo, ${user.full_name?.split(' ')[0]} 👋`,
    create: 'Buat Laporan',
    reports: role === 'ADMIN' ? 'Semua Laporan' : 'Laporan Saya',
    verify: 'Verifikasi & Penugasan',
    officers: 'Petugas Lapangan',
    tasks: 'Tugas Lapangan',
    notifications: 'Notifikasi',
    profile: 'Profil Saya',
    detail: 'Detail & Lacak Laporan',
  }[page];

  const headerSub = {
    dashboard:
      role === 'ADMIN'
        ? 'Pantau laporan masuk, penugasan petugas, dan penyelesaian masalah.'
        : role === 'OFFICER'
          ? 'Kelola tugas lapangan, inspeksi, dan pembaruan penanganan.'
          : 'Pantau semua laporan air & sanitasi kamu di sini.',
    create: 'Ceritakan masalahnya, kami bantu teruskan ke petugas lapangan.',
    reports: 'Daftar lengkap laporan beserta status penanganan terkini.',
    verify: 'Tinjau kelengkapan bukti, tentukan prioritas resmi, dan tugaskan petugas.',
    officers: 'Direktori petugas lapangan dan pemantauan beban kerja aktif.',
    tasks: 'Semua penugasan lapangan yang masuk kepada Anda.',
    notifications: 'Pembaruan real-time atas laporan dan tugas Anda.',
    profile: 'Informasi akun dan hak akses Anda di CleanFlow.',
    detail: 'Pelacakan status kronologis dan dokumentasi penanganan.',
  }[page];

  const roleBadgeLabel =
    role === 'ADMIN' ? 'ADMINISTRATOR' : role === 'OFFICER' ? 'PETUGAS LAPANGAN' : 'WARGA';

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'show' : ''}`}>
        <div className="sidebar-top">
          <BrandLogo onClick={() => navigateApp('dashboard')} />
          <button
            type="button"
            className="iconbtn mobile-only"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="nav-label">{roleBadgeLabel}</div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`nav-item ${page === item.key ? 'active' : ''}`}
              onClick={() => navigateApp(item.key)}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge > 0 && <b className="nav-badge">{item.badge}</b>}
            </button>
          ))}
        </nav>

        <div className="sidebar-profile">
          <div className="avatar">{user.full_name?.[0] || 'U'}</div>
          <div className="sidebar-profile-info">
            <b>{user.full_name}</b>
            <small>
              {role === 'ADMIN' ? 'Administrator' : role === 'OFFICER' ? 'Petugas' : 'Warga'} ·{' '}
              {user.address || 'Jakarta'}
            </small>
          </div>
          <button
            type="button"
            className="iconbtn"
            onClick={handleLogout}
            title="Keluar"
            aria-label="Keluar"
          >
            <LogOut size={17} />
          </button>
        </div>
      </aside>

      <main className="app-main">
        {page !== 'detail' && (
          <header className="app-header">
            <div className="app-header-left">
              <button
                type="button"
                className="iconbtn mobile-only"
                onClick={() => setSidebarOpen(true)}
                aria-label="Buka Menu"
              >
                <Menu size={22} />
              </button>
              <div>
                <h1>{headerTitle}</h1>
                <p>{headerSub}</p>
              </div>
            </div>

            <div className="head-actions">
              <button
                type="button"
                className="iconbtn notif-trigger"
                onClick={() => navigateApp('notifications')}
                aria-label="Notifikasi"
              >
                <Bell size={20} />
                {unreadCount > 0 && <span className="notif-dot" />}
              </button>

              {role === 'CITIZEN' && page !== 'create' && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => navigateApp('create')}
                >
                  <Plus size={18} /> <span>Buat Laporan Baru</span>
                </button>
              )}
            </div>
          </header>
        )}

        {loadErr && <div className="alert-error">{loadErr}</div>}

        {page === 'dashboard' && role === 'CITIZEN' && (
          <CitizenDashboard
            reports={reports}
            onNavigate={navigateApp}
            onOpenReport={openReportDetail}
          />
        )}

        {page === 'create' && role === 'CITIZEN' && (
          <CreateReportPage
            token={token}
            notifyToast={notifyToast}
            onCancel={() => navigateApp('dashboard')}
            onCreated={async (created) => {
              await refreshData();
              if (created) openReportDetail(created);
              else navigateApp('reports');
            }}
          />
        )}

        {page === 'reports' && role === 'CITIZEN' && (
          <MyReportsPage
            reports={reports}
            onNavigate={navigateApp}
            onOpenReport={openReportDetail}
          />
        )}

        {page === 'dashboard' && role === 'ADMIN' && (
          <AdminDashboard
            token={token}
            reports={reports}
            officers={officers}
            onNavigate={navigateApp}
            onOpenVerify={openVerifyItem}
            onOpenReport={openReportDetail}
            notifyToast={notifyToast}
          />
        )}

        {page === 'verify' && role === 'ADMIN' && (
          <AdminVerificationPage
            token={token}
            reports={reports}
            officers={officers}
            selectedReport={verifyTarget}
            onSelectReport={setVerifyTarget}
            onRefresh={refreshData}
            notifyToast={notifyToast}
          />
        )}

        {page === 'reports' && role === 'ADMIN' && (
          <AdminAllReportsPage
            token={token}
            reports={reports}
            onOpenReport={openReportDetail}
            onOpenVerify={openVerifyItem}
            notifyToast={notifyToast}
          />
        )}

        {page === 'officers' && role === 'ADMIN' && (
          <AdminOfficersPage
            token={token}
            officers={officers}
            onRefresh={refreshData}
            notifyToast={notifyToast}
          />
        )}

        {page === 'dashboard' && role === 'OFFICER' && (
          <OfficerDashboard
            token={token}
            assignments={reports}
            onNavigate={navigateApp}
            onOpenReport={openReportDetail}
            onRefresh={refreshData}
            notifyToast={notifyToast}
          />
        )}

        {page === 'tasks' && role === 'OFFICER' && (
          <OfficerTasksPage assignments={reports} onOpenReport={openReportDetail} />
        )}

        {page === 'notifications' && (
          <NotificationsPage
            token={token}
            notifs={notifs}
            reports={reports}
            onRefresh={refreshData}
            onOpenReport={openReportDetail}
            notifyToast={notifyToast}
          />
        )}

        {page === 'profile' && <ProfilePage user={user} onLogout={handleLogout} />}

        {page === 'detail' && selectedReport && (
          <ReportDetailPage
            reportId={selectedReport.id}
            initialReport={selectedReport}
            role={role}
            token={token}
            onBack={() => navigateApp(role === 'OFFICER' ? 'tasks' : role === 'ADMIN' ? 'reports' : 'dashboard')}
            onRefresh={refreshData}
            notifyToast={notifyToast}
          />
        )}

        <footer className="app-footer">
          CleanFlow · Platform Pelaporan Air Bersih &amp; Sanitasi · SDG 6
        </footer>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav" aria-label="Navigasi Mobile">
        {mobileTabs.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`mobile-tab ${page === t.key ? 'active' : ''}`}
            onClick={() => navigateApp(t.key)}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
