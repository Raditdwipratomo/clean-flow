import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Droplets,
  MapPin,
  Menu,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
  X,
  BarChart3,
  Clock,
  Camera,
  Star,
  Globe2,
  Activity,
} from 'lucide-react';
import {
  BrandLogo,
  CategoryIcon,
  PriorityBadge,
  StatusBadge,
  getCategoryLabel,
} from '../components/ui.jsx';
import { apiRequest } from '../lib/api.js';
import { CATEGORIES, DEMO_ACCOUNTS, formatDate } from '../lib/constants.js';

const HERO_CASES = [
  {
    id: 'case-1',
    no: 'CF-2026-000125',
    title: 'Pipa utama bocor di Jl. Melati',
    area: 'Cilandak, Jakarta Selatan',
    category: 'Water Pipe Leakage',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    step: 3,
    officer: 'Dedi Santoso · Teknisi Pipa',
    eta: 'Estimasi selesai sore ini',
    pin: { x: 64, y: 42 },
  },
  {
    id: 'case-2',
    no: 'CF-2026-000118',
    title: 'Air keran keruh & berbau',
    area: 'Kebayoran Baru, Jakarta Selatan',
    category: 'Suspected Water Contamination',
    status: 'AWAITING_CONFIRMATION',
    priority: 'CRITICAL',
    step: 4,
    officer: 'Budi Santoso · Tim Kualitas Air',
    eta: 'Menunggu konfirmasi warga',
    pin: { x: 34, y: 58 },
  },
  {
    id: 'case-3',
    no: 'CF-2026-000087',
    title: 'Saluran drainase tersumbat',
    area: 'Tebet, Jakarta Selatan',
    category: 'Wastewater Drainage Problem',
    status: 'CLOSED',
    priority: 'LOW',
    step: 5,
    officer: 'Siti Rahma · Petugas Sanitasi',
    eta: 'Selesai & terkonfirmasi',
    pin: { x: 76, y: 66 },
  },
];

const WORKFLOW = [
  {
    num: '01',
    title: 'Warga Mengirim Laporan',
    desc: 'Pilih kategori masalah, tandai titik lokasi di peta, unggah foto bukti, dan kirim dalam kurang dari 2 menit.',
    icon: <Camera size={20} />,
  },
  {
    num: '02',
    title: 'Verifikasi & Prioritas Admin',
    desc: 'Admin mengecek kelengkapan bukti, menetapkan tingkat prioritas resmi (Rendah–Kritis), dan menugaskan petugas.',
    icon: <ShieldCheck size={20} />,
  },
  {
    num: '03',
    title: 'Inspeksi & Perbaikan Lapangan',
    desc: 'Petugas melakukan survei lokasi, memperbarui progres perbaikan secara real-time, dan mengunggah bukti selesai.',
    icon: <Wrench size={20} />,
  },
  {
    num: '04',
    title: 'Konfirmasi & Penilaian Warga',
    desc: 'Setelah divalidasi admin, warga mengonfirmasi masalah benar-benar tuntas dan memberi rating pelayanan.',
    icon: <Star size={20} />,
  },
];

const ROLE_SHOWCASE = {
  CITIZEN: {
    badge: 'UNTUK WARGA & KOMUNITAS',
    title: 'Lapor cepat tanpa birokrasi berbelit, pantau setiap tahapnya.',
    points: [
      'Formulir laporan cerdas dengan pemilih lokasi GPS & unggah foto bukti.',
      'Pelacakan status 6 tahap transparan lengkap dengan riwayat kronologis.',
      'Hak konfirmasi penyelesaian & permintaan inspeksi ulang bila belum tuntas.',
    ],
    ctaLabel: 'Coba Demo Warga',
    demoEmail: 'rina@cleanflow.id',
    previewTitle: 'Dasbor Warga — Rina Putri',
    previewStats: [
      { label: 'Total Laporan', val: '8' },
      { label: 'Diproses', val: '3' },
      { label: 'Selesai', val: '3' },
    ],
    previewAction: 'Konfirmasi penyelesaian untuk CF-2026-000118 siap dilakukan.',
  },
  ADMIN: {
    badge: 'UNTUK ADMINISTRATOR & PENGELOLA',
    title: 'Kendali penuh triase laporan, beban petugas, dan analitik wilayah.',
    points: [
      'Checklist verifikasi terstruktur: validasi, minta info tambahan, tolak, atau tandai duplikat.',
      'Penugasan cerdas dengan visibilitas beban kerja aktif tiap petugas lapangan.',
      'Analitik kategori, distribusi status real-time, serta ekspor laporan ke CSV.',
    ],
    ctaLabel: 'Coba Demo Admin',
    demoEmail: 'admin@cleanflow.id',
    previewTitle: 'Ringkasan Operasional Admin',
    previewStats: [
      { label: 'Perlu Verifikasi', val: '12' },
      { label: 'Sedang Diproses', val: '31' },
      { label: 'Rata-rata Selesai', val: '2,4 hr' },
    ],
    previewAction: '12 laporan baru siap diverifikasi dan ditugaskan ke teknisi terdekat.',
  },
  OFFICER: {
    badge: 'UNTUK PETUGAS LAPANGAN',
    title: 'Daftar tugas jelas di genggaman, laporkan inspeksi langsung dari lokasi.',
    points: [
      'Terima atau tolak penugasan dengan alasan terstruktur dan navigasi lokasi.',
      'Catat temuan inspeksi kerusakan serta tingkat keparahan di lapangan.',
      'Kirim pembaruan progres perbaikan dan dokumentasi foto setelah perbaikan.',
    ],
    ctaLabel: 'Coba Demo Petugas',
    demoEmail: 'budi@cleanflow.id',
    previewTitle: 'Dasbor Petugas — Budi Santoso',
    previewStats: [
      { label: 'Tugas Aktif', val: '4' },
      { label: 'Menunggu Respon', val: '1' },
      { label: 'Tuntas Bulan Ini', val: '19' },
    ],
    previewAction: 'Tugas CF-2026-000125 di Cilandak siap untuk input hasil inspeksi.',
  },
};

export default function LandingPage({ onNavigateAuth }) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);
  const [roleTab, setRoleTab] = useState('CITIZEN');
  const [publicData, setPublicData] = useState({
    summary: { total: 0, active: 0, closed: 0 },
    categories: [],
    recent: [],
  });

  useEffect(() => {
    let active = true;
    apiRequest('/public/stats')
      .then((res) => {
        if (active && res) setPublicData(res);
      })
      .catch(() => {
        // Fallback gracefully if DB is cold or offline
      });
    return () => {
      active = false;
    };
  }, []);

  const currentHero = HERO_CASES[heroIdx];
  const currentRole = ROLE_SHOWCASE[roleTab];
  const totalReports = publicData.summary?.total || 0;
  const activeReports = publicData.summary?.active || 0;
  const closedReports = publicData.summary?.closed || 0;

  const recentList =
    publicData.recent && publicData.recent.length > 0
      ? publicData.recent
      : HERO_CASES.map((c) => ({
          report_no: c.no,
          title: c.title,
          category: c.category,
          location: c.area,
          priority: c.priority,
          status: c.status,
          created_at: new Date().toISOString(),
        }));

  return (
    <div className="landing-page">
      {/* Sticky Glassmorphic Navbar */}
      <header className="landing-nav-wrap">
        <div className="landing-container landing-nav">
          <BrandLogo onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

          <nav className="landing-links">
            <a href="#cara-kerja">Cara Kerja</a>
            <a href="#kategori">Kategori</a>
            <a href="#peran">Peran Sistem</a>
            <a href="#transparansi">Transparansi</a>
            <a href="#sdg6">Tentang & SDG 6</a>
          </nav>

          <div className="landing-nav-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => onNavigateAuth('login')}
            >
              Masuk
            </button>
            <button
              type="button"
              className="btn btn-primary btn-glow"
              onClick={() => onNavigateAuth('register')}
            >
              Laporkan Masalah <ArrowRight size={16} />
            </button>
          </div>

          <button
            type="button"
            className="iconbtn mobile-only"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle Menu"
          >
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileMenu && (
          <div className="landing-mobile-menu">
            <a href="#cara-kerja" onClick={() => setMobileMenu(false)}>Cara Kerja</a>
            <a href="#kategori" onClick={() => setMobileMenu(false)}>Kategori Masalah</a>
            <a href="#peran" onClick={() => setMobileMenu(false)}>Peran Sistem</a>
            <a href="#transparansi" onClick={() => setMobileMenu(false)}>Transparansi Publik</a>
            <a href="#sdg6" onClick={() => setMobileMenu(false)}>Tentang & SDG 6</a>
            <div className="landing-mobile-cta">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onNavigateAuth('login')}
              >
                Masuk
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => onNavigateAuth('register')}
              >
                Daftar & Lapor
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-grid" aria-hidden="true" />
        <div className="hero-aura hero-aura-1" aria-hidden="true" />
        <div className="hero-aura hero-aura-2" aria-hidden="true" />

        <div className="landing-container hero-grid">
          <div className="hero-copy">
            <div className="hero-pill">
              <span className="pulse-dot" />
              <span>SDG 6 · Platform Pelaporan Air Bersih & Sanitasi</span>
            </div>

            <h1>
              Setiap Tetes Terjaga,{' '}
              <span className="text-gradient">Setiap Laporan Punya Tindak Lanjut.</span>
            </h1>

            <p className="hero-subtitle">
              CleanFlow menghubungkan warga, administrator kota, dan petugas lapangan dalam satu
              ekosistem pelaporan infrastruktur air &amp; sanitasi yang transparan, terverifikasi,
              dan dapat dipantau hingga tuntas.
            </p>

            <div className="hero-cta-row">
              <button
                type="button"
                className="btn btn-primary btn-lg btn-glow"
                onClick={() => onNavigateAuth('register')}
              >
                Laporkan Masalah Sekarang <ArrowRight size={18} />
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-lg"
                onClick={() => onNavigateAuth('login')}
              >
                Masuk ke Dasbor
              </button>
            </div>

            <div className="hero-trust-row">
              <div>
                <CheckCircle2 size={16} className="text-green" />
                <span>Lapor dalam ± 2 menit</span>
              </div>
              <div>
                <MapPin size={16} className="text-primary" />
                <span>Berbasis lokasi &amp; foto bukti</span>
              </div>
              <div>
                <Activity size={16} className="text-teal" />
                <span>Pelacakan 6 tahap real-time</span>
              </div>
            </div>
          </div>

          {/* Interactive SaaS Hero Preview Widget */}
          <div className="hero-visual">
            <div className="hero-preview-shell">
              <div className="hero-preview-topbar">
                <div className="window-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span className="preview-url">cleanflow.id/pantau-laporan</span>
                <span className="live-chip">● Live Tracker</span>
              </div>

              {/* Stylized Interactive Map Preview */}
              <div className="hero-mini-map">
                <svg viewBox="0 0 420 170" preserveAspectRatio="none" className="map-svg">
                  <rect width="420" height="170" fill="#E8F2F8" />
                  <rect x="44" y="18" width="66" height="32" rx="8" fill="#D2ECDF" />
                  <rect x="284" y="96" width="84" height="44" rx="10" fill="#D2ECDF" />
                  <path
                    d="M-10,115 C95,95 190,138 285,112 C345,94 385,90 430,82 L430,102 C385,110 345,114 285,132 C190,158 95,115 -10,135 Z"
                    fill="#9FD3F4"
                  />
                  <g stroke="#FFFFFF" strokeWidth="6">
                    <line x1="0" y1="56" x2="420" y2="50" />
                    <line x1="0" y1="100" x2="420" y2="108" />
                    <line x1="112" y1="0" x2="112" y2="170" />
                    <line x1="230" y1="0" x2="215" y2="170" />
                    <line x1="336" y1="0" x2="336" y2="170" />
                  </g>
                </svg>

                {HERO_CASES.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`hero-map-pin ${idx === heroIdx ? 'active' : ''}`}
                    style={{ left: `${item.pin.x}%`, top: `${item.pin.y}%` }}
                    onClick={() => setHeroIdx(idx)}
                    title={item.title}
                  >
                    <span className="pin-ripple" />
                    <span className="pin-dot" />
                    <span className="pin-tooltip">{item.area.split(',')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Active Case Details */}
              <div className="hero-case-card">
                <div className="hero-case-head">
                  <div>
                    <small className="case-no">{currentHero.no}</small>
                    <h3>{currentHero.title}</h3>
                    <span className="case-area">
                      <MapPin size={13} /> {currentHero.area}
                    </span>
                  </div>
                  <div className="case-badges">
                    <StatusBadge status={currentHero.status} />
                    <PriorityBadge priority={currentHero.priority} />
                  </div>
                </div>

                {/* Mini Progress Track */}
                <div className="hero-mini-steps">
                  {['Terkirim', 'Verifikasi', 'Ditugaskan', 'Perbaikan', 'Konfirmasi', 'Selesai'].map(
                    (label, idx) => (
                      <div
                        key={label}
                        className={`mini-step ${idx <= currentHero.step ? 'done' : ''} ${
                          idx === currentHero.step ? 'now' : ''
                        }`}
                      >
                        <div className="mini-step-bar" />
                        <span>{label}</span>
                      </div>
                    )
                  )}
                </div>

                <div className="hero-case-foot">
                  <div className="officer-mini">
                    <div className="officer-avatar-sm">{currentHero.officer[0]}</div>
                    <div>
                      <b>{currentHero.officer}</b>
                      <small>{currentHero.eta}</small>
                    </div>
                  </div>
                  <span className="hint-switch">Klik pin peta untuk lihat kasus lain</span>
                </div>
              </div>
            </div>

            {/* Floating Stat Glass Cards */}
            <div className="floating-badge floating-badge-top">
              <div className="floating-icon green">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <b>Terverifikasi</b>
                <small>Validasi foto &amp; lokasi</small>
              </div>
            </div>

            <div className="floating-badge floating-badge-bottom">
              <div className="floating-icon blue">
                <Droplets size={18} />
              </div>
              <div>
                <b>SDG 6 Active</b>
                <small>Air bersih berkelanjutan</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Live Impact Metrics Bar */}
      <section className="metrics-strip">
        <div className="landing-container metrics-grid">
          <div className="metric-card">
            <div className="metric-icon blue">
              <ClipboardCheck size={22} />
            </div>
            <div>
              <strong>{totalReports > 0 ? totalReports : '142+'}</strong>
              <span>Total Laporan Tercatat</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon teal">
              <Wrench size={22} />
            </div>
            <div>
              <strong>{activeReports > 0 ? activeReports : '24'}</strong>
              <span>Sedang Dalam Penanganan</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon green">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <strong>{closedReports > 0 ? closedReports : '118'}</strong>
              <span>Tuntas &amp; Dikonfirmasi Warga</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon amber">
              <Clock size={22} />
            </div>
            <div>
              <strong>± 2 Menit</strong>
              <span>Waktu Kirim Laporan Baru</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid: Categories */}
      <section id="kategori" className="landing-section">
        <div className="landing-container">
          <div className="section-heading">
            <span className="section-eyebrow">CAKUPAN PELAPORAN</span>
            <h2>Enam Kategori Masalah Air &amp; Sanitasi</h2>
            <p>
              Mulai dari kebocoran pipa distribusi hingga saluran drainase tersumbat, setiap
              keluhan langsung diarahkan ke tim teknis yang relevan.
            </p>
          </div>

          <div className="bento-grid">
            {CATEGORIES.map((cat, idx) => (
              <div
                key={cat.value}
                className={`bento-card ${idx === 0 || idx === 3 ? 'bento-wide' : ''}`}
              >
                <div className="bento-top">
                  <span className={`bento-icon tone-${idx % 4}`}>
                    <CategoryIcon category={cat.value} size={22} />
                  </span>
                  <span className="bento-tag">{cat.tag}</span>
                </div>
                <h3>{cat.label}</h3>
                <p>{cat.shortDesc}</p>
                <button
                  type="button"
                  className="bento-link"
                  onClick={() => onNavigateAuth('register')}
                >
                  Laporkan masalah ini <ArrowRight size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="cara-kerja" className="landing-section surface-alt">
        <div className="landing-container">
          <div className="section-heading">
            <span className="section-eyebrow">ALUR PENANGANAN TRANSPARAN</span>
            <h2>Dari Laporan Warga Hingga Masalah Tuntas</h2>
            <p>
              Tidak ada laporan yang tenggelam tanpa kabar. Setiap status tercatat kronologis dan
              hanya bisa ditutup setelah dikonfirmasi oleh pelapor.
            </p>
          </div>

          <div className="workflow-grid">
            {WORKFLOW.map((step) => (
              <div key={step.num} className="workflow-card">
                <div className="workflow-head">
                  <span className="workflow-num">{step.num}</span>
                  <div className="workflow-icon">{step.icon}</div>
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive 3-Role Showcase */}
      <section id="peran" className="landing-section">
        <div className="landing-container">
          <div className="section-heading">
            <span className="section-eyebrow">EKOSISTEM TERINTEGRASI</span>
            <h2>Satu Platform untuk Tiga Peran Utama</h2>
            <p>
              Setiap pemangku kepentingan mendapatkan ruang kerja khusus sesuai wewenang dan
              kebutuhan di lapangan.
            </p>
          </div>

          <div className="role-tabs">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.role}
                type="button"
                className={`role-tab ${roleTab === acc.role ? 'active' : ''}`}
                onClick={() => setRoleTab(acc.role)}
              >
                <Users size={16} />
                <span>{acc.label}</span>
              </button>
            ))}
          </div>

          <div className="role-showcase-box">
            <div className="role-showcase-info">
              <span className="role-pill">{currentRole.badge}</span>
              <h3>{currentRole.title}</h3>
              <ul className="role-checklist">
                {currentRole.points.map((pt) => (
                  <li key={pt}>
                    <CheckCircle2 size={18} className="text-green" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
              <div className="role-cta-group">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => onNavigateAuth('login', currentRole.demoEmail)}
                >
                  {currentRole.ctaLabel} <ArrowRight size={16} />
                </button>
                <small className="demo-hint">
                  Email demo: <code>{currentRole.demoEmail}</code> · Sandi: <code>cleanflow123</code>
                </small>
              </div>
            </div>

            <div className="role-preview-panel">
              <div className="role-preview-header">
                <BarChart3 size={18} className="text-primary" />
                <b>{currentRole.previewTitle}</b>
              </div>
              <div className="role-preview-stats">
                {currentRole.previewStats.map((s) => (
                  <div key={s.label} className="role-stat-box">
                    <strong>{s.val}</strong>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
              <div className="role-preview-alert">
                <Sparkles size={17} className="text-primary" />
                <span>{currentRole.previewAction}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Public Transparency Feed */}
      <section id="transparansi" className="landing-section surface-alt">
        <div className="landing-container">
          <div className="transparency-head">
            <div>
              <span className="section-eyebrow">TRANSPARANSI PUBLIK</span>
              <h2>Pantauan Laporan Terkini</h2>
              <p>
                Data ringkas penanganan infrastruktur air &amp; sanitasi tanpa mengekspos data
                pribadi pelapor.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onNavigateAuth('login')}
            >
              Lihat Semua di Dasbor <ArrowRight size={16} />
            </button>
          </div>

          <div className="public-feed-grid">
            {recentList.map((r) => (
              <div key={r.report_no} className="public-report-card">
                <div className="public-report-top">
                  <span className="report-code">{r.report_no}</span>
                  <StatusBadge status={r.status} />
                </div>
                <h3>{r.title}</h3>
                <p className="public-report-cat">{getCategoryLabel(r.category)}</p>
                <div className="public-report-meta">
                  <span>
                    <MapPin size={14} /> {r.location}
                  </span>
                  <PriorityBadge priority={r.priority} />
                </div>
                <div className="public-report-date">
                  Diperbarui {formatDate(r.created_at)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SDG 6 & Final CTA */}
      <section id="sdg6" className="landing-section">
        <div className="landing-container">
          <div className="sdg-banner">
            <div className="sdg-content">
              <span className="sdg-pill">
                <Globe2 size={15} /> KOMITMEN SDG 6 — CLEAN WATER &amp; SANITATION
              </span>
              <h2>Bersama Wujudkan Akses Air Bersih &amp; Sanitasi Layak untuk Semua.</h2>
              <p>
                CleanFlow mendukung target Tujuan Pembangunan Berkelanjutan ke-6 melalui pelaporan
                berbasis komunitas, dokumentasi riwayat pemeliharaan infrastruktur, dan akuntabilitas
                layanan publik.
              </p>
              <div className="sdg-actions">
                <button
                  type="button"
                  className="btn btn-white btn-lg"
                  onClick={() => onNavigateAuth('register')}
                >
                  Buat Akun Warga Gratis <ArrowRight size={18} />
                </button>
                <button
                  type="button"
                  className="btn btn-outline-white btn-lg"
                  onClick={() => onNavigateAuth('login')}
                >
                  Masuk Akun
                </button>
              </div>
            </div>

            <div className="sdg-visual-badge">
              <Droplets size={110} strokeWidth={1.5} />
              <strong>SDG 6</strong>
              <span>Clean Water &amp; Sanitation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-container footer-grid">
          <div className="footer-brand">
            <BrandLogo />
            <p>
              Platform pelaporan dan pemantauan infrastruktur air bersih serta fasilitas sanitasi
              berbasis komunitas.
            </p>
          </div>
          <div>
            <h4>Navigasi</h4>
            <a href="#cara-kerja">Cara Kerja</a>
            <a href="#kategori">Kategori Masalah</a>
            <a href="#transparansi">Transparansi Publik</a>
            <a href="#sdg6">Tentang SDG 6</a>
          </div>
          <div>
            <h4>Akses Sistem</h4>
            <button type="button" onClick={() => onNavigateAuth('login')}>
              Masuk ke Akun
            </button>
            <button type="button" onClick={() => onNavigateAuth('register')}>
              Daftar Akun Warga
            </button>
            <button type="button" onClick={() => onNavigateAuth('login', 'admin@cleanflow.id')}>
              Portal Admin
            </button>
            <button type="button" onClick={() => onNavigateAuth('login', 'budi@cleanflow.id')}>
              Portal Petugas Lapangan
            </button>
          </div>
        </div>
        <div className="landing-container footer-bottom">
          <span>© 2026 CleanFlow · Platform Pelaporan Air Bersih &amp; Sanitasi</span>
          <span>Selaras dengan Sustainable Development Goal 6</span>
        </div>
      </footer>
    </div>
  );
}
