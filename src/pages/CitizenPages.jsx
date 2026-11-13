import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock,
  Droplets,
  FileText,
  LocateFixed,
  MapPin,
  MessageSquarePlus,
  Plus,
  Search,
  Star,
  Trash2,
  Upload,
  UserCheck,
  Waves,
} from 'lucide-react';
import {
  CategoryIcon,
  EmptyState,
  EvidenceImage,
  MapPreview,
  PriorityBadge,
  StatusBadge,
  WorkflowStepper,
  getCategoryLabel,
} from '../components/ui.jsx';
import { apiRequest } from '../lib/api.js';
import {
  CATEGORIES,
  PRIORITY_LABELS,
  STATUS_LABELS,
  formatDate,
  formatDateTime,
  formatRelativeTime,
} from '../lib/constants.js';

export function CitizenDashboard({ reports, onNavigate, onOpenReport }) {
  const counts = {
    all: reports.length,
    wait: reports.filter((r) => ['SUBMITTED', 'NEEDS_INFORMATION'].includes(r.status)).length,
    progress: reports.filter((r) =>
      ['VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLUTION_SUBMITTED', 'REINSPECTION_REQUESTED'].includes(r.status)
    ).length,
    done: reports.filter((r) => ['CLOSED', 'AWAITING_CONFIRMATION'].includes(r.status)).length,
  };

  const actionReport = reports.find((r) =>
    ['AWAITING_CONFIRMATION', 'NEEDS_INFORMATION'].includes(r.status)
  );

  return (
    <div className="dash-stack">
      {/* Mobile Quick Hero Banner */}
      <div className="mobile-cta-banner">
        <div>
          <span>Ada masalah air atau sanitasi?</span>
          <h3>Laporkan dalam 2 menit</h3>
        </div>
        <button type="button" className="btn btn-white" onClick={() => onNavigate('create')}>
          <Plus size={16} /> Buat Laporan
        </button>
      </div>

      {/* 4 KPI Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon blue">
            <FileText size={22} />
          </span>
          <strong>{counts.all}</strong>
          <small>Total laporan</small>
        </div>
        <div className="stat-card">
          <span className="stat-icon amber">
            <ClipboardList size={22} />
          </span>
          <strong>{counts.wait}</strong>
          <small>Menunggu verifikasi</small>
        </div>
        <div className="stat-card">
          <span className="stat-icon teal">
            <Droplets size={22} />
          </span>
          <strong>{counts.progress}</strong>
          <small>Sedang diproses</small>
        </div>
        <div className="stat-card">
          <span className="stat-icon green">
            <Check size={22} />
          </span>
          <strong>{counts.done}</strong>
          <small>Selesai / konfirmasi</small>
        </div>
      </div>

      {/* Main Columns */}
      <div className="columns-grid">
        <section className="panel">
          <div className="section-title">
            <h2>Laporan Terbaru</h2>
            <button type="button" className="link-btn" onClick={() => onNavigate('reports')}>
              Lihat semua <ArrowUpRight size={16} />
            </button>
          </div>

          {reports.length === 0 ? (
            <EmptyState
              icon={<Waves size={28} />}
              title="Belum ada laporan"
              subtitle="Laporan masalah air dan sanitasi yang Anda kirim akan muncul di sini."
              action={
                <button type="button" className="btn btn-primary" onClick={() => onNavigate('create')}>
                  <Plus size={16} /> Buat Laporan Pertama
                </button>
              }
            />
          ) : (
            <div className="report-list">
              {reports.slice(0, 5).map((r) => (
                <button
                  type="button"
                  key={r.id}
                  className="report-row"
                  onClick={() => onOpenReport(r)}
                >
                  <span className="report-icon">
                    <CategoryIcon category={r.category} size={20} />
                  </span>
                  <div className="report-main">
                    <b>{r.title}</b>
                    <small>
                      {r.report_no} · {r.location}
                    </small>
                  </div>
                  <div className="report-badges">
                    <StatusBadge status={r.status} />
                    <PriorityBadge priority={r.priority} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="panel side-panel">
          {actionReport && (
            <div className="action-highlight-card">
              <span className="action-pill">PERLU TINDAKANMU</span>
              <b>
                {actionReport.status === 'AWAITING_CONFIRMATION'
                  ? 'Konfirmasi Hasil Perbaikan'
                  : 'Lengkapi Informasi Laporan'}
              </b>
              <p>
                {actionReport.status === 'AWAITING_CONFIRMATION'
                  ? `Petugas telah menyelesaikan penanganan untuk "${actionReport.title}". Apakah masalah sudah teratasi?`
                  : `Admin meminta detail tambahan untuk "${actionReport.title}" agar verifikasi dapat dilanjutkan.`}
              </p>
              <button
                type="button"
                className="btn btn-success btn-full"
                onClick={() => onOpenReport(actionReport)}
              >
                {actionReport.status === 'AWAITING_CONFIRMATION'
                  ? 'Konfirmasi Sekarang'
                  : 'Kirim Info Tambahan'}
              </button>
            </div>
          )}

          <div className="section-title">
            <h2>Aktivitas Terkini</h2>
          </div>

          {reports.length === 0 ? (
            <p className="muted-copy">Belum ada aktivitas pelaporan terbaru.</p>
          ) : (
            <div className="timeline-mini">
              {reports.slice(0, 5).map((r) => (
                <button
                  type="button"
                  key={r.id}
                  className="timeline-mini-item"
                  onClick={() => onOpenReport(r)}
                >
                  <span className="timeline-dot" />
                  <div>
                    <b>{STATUS_LABELS[r.status] || r.status}</b>
                    <small>
                      {r.report_no} · {formatRelativeTime(r.updated_at || r.created_at)}
                    </small>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export function CreateReportPage({ token, onCreated, onCancel, notifyToast }) {
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().slice(0, 10));
  const [impact, setImpact] = useState('MEDIUM');
  const [location, setLocation] = useState('');
  const [coords, setCoords] = useState({ latitude: '', longitude: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [locating, setLocating] = useState(false);
  const [err, setErr] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    if (!/^image\/(jpeg|png|webp)$/.test(selectedFile.type)) {
      setErr('Format gambar harus JPG, PNG, atau WebP.');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setErr('Ukuran foto bukti maksimal 5 MB.');
      return;
    }
    setErr('');
    if (preview) URL.revokeObjectURL(preview);
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setErr('Browser tidak mendukung deteksi lokasi otomatis.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        setCoords({ latitude: lat, longitude: lng });
        if (!location.trim()) {
          setLocation(`Lokasi GPS (${lat}, ${lng})`);
        }
        setLocating(false);
        notifyToast('Koordinat GPS berhasil dideteksi.');
      },
      () => {
        setLocating(false);
        setErr('Izin lokasi ditolak. Silakan isi alamat atau klik pada peta.');
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!file) {
      setErr('Foto bukti wajib diunggah (JPG, PNG, atau WebP maks. 5 MB).');
      return;
    }

    const fd = new FormData();
    fd.append('category', category);
    fd.append('title', title.trim());
    fd.append('description', description.trim());
    fd.append('incident_date', incidentDate);
    fd.append('impact', impact);
    fd.append('location', location.trim());
    if (coords.latitude) fd.append('latitude', coords.latitude);
    if (coords.longitude) fd.append('longitude', coords.longitude);
    fd.append('evidence', file);

    setBusy(true);
    try {
      const res = await apiRequest('/reports', {
        token,
        method: 'POST',
        body: fd,
      });
      notifyToast(`Laporan ${res.report?.report_no || ''} berhasil dikirim!`);
      onCreated(res.report);
    } catch (error) {
      setErr(error.message || 'Gagal mengirim laporan.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="create-report-wrap" onSubmit={handleSubmit}>
      <div className="create-head-bar">
        <div>
          <span className="step-indicator">Langkah 1 dari 1 · ± 2 menit</span>
        </div>
      </div>

      {err && <div className="alert-error">{err}</div>}

      <div className="create-grid">
        {/* Left Form Card */}
        <section className="panel">
          <div className="field-group">
            <label className="field-label">Kategori masalah</label>
            <div className="chip-grid">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  className={`select-chip ${category === cat.value ? 'active' : ''}`}
                  onClick={() => setCategory(cat.value)}
                >
                  <CategoryIcon category={cat.value} size={15} />
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label htmlFor="rep-title">Judul laporan</label>
            <input
              id="rep-title"
              type="text"
              placeholder="Contoh: Pipa utama bocor di depan Pasar Cilandak"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="rep-desc">Deskripsi detail masalah</label>
            <textarea
              id="rep-desc"
              rows={4}
              placeholder="Jelaskan kondisi di lapangan, sejak kapan terjadi, dan dampaknya terhadap warga sekitar…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-split">
            <div className="field">
              <label htmlFor="rep-date">Tanggal kejadian</label>
              <div className="input-icon-wrap">
                <Calendar size={16} />
                <input
                  id="rep-date"
                  type="date"
                  value={incidentDate}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label>Tingkat dampak (penilaian warga)</label>
              <div className="impact-pills">
                {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    className={`impact-pill ${impact === lvl ? 'active' : ''} impact-${lvl}`}
                    onClick={() => setImpact(lvl)}
                  >
                    {PRIORITY_LABELS[lvl]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Right Location & Photo Card */}
        <div className="create-side">
          <section className="panel">
            <div className="section-title">
              <h2>Lokasi kejadian</h2>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleUseMyLocation}
                disabled={locating}
              >
                <LocateFixed size={15} /> {locating ? 'Mendeteksi…' : 'Gunakan lokasiku'}
              </button>
            </div>

            <div className="field" style={{ marginBottom: 14 }}>
              <input
                type="text"
                placeholder="Nama jalan, RT/RW, kelurahan, atau patokan lokasi"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <MapPreview
              location={location || 'Klik peta untuk tandai titik koordinat'}
              latitude={coords.latitude}
              longitude={coords.longitude}
              interactive
              compact
              onPick={({ latitude, longitude }) => {
                setCoords({ latitude, longitude });
                if (!location.trim()) {
                  setLocation(`Area Pin Peta (${latitude}, ${longitude})`);
                }
              }}
            />
          </section>

          <section className="panel">
            <div className="section-title">
              <h2>Foto bukti</h2>
              <span className="muted-sm">Wajib · Maks. 5 MB</span>
            </div>

            <div
              className={`upload-dropzone ${dragOver ? 'drag-over' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFile(e.dataTransfer.files?.[0]);
              }}
              onClick={() => fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                hidden
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              {preview ? (
                <div className="upload-preview-box" onClick={(e) => e.stopPropagation()}>
                  <img src={preview} alt="Preview bukti" />
                  <div className="upload-preview-meta">
                    <div>
                      <b>{file?.name}</b>
                      <small>{(file?.size / 1024 / 1024).toFixed(2)} MB</small>
                    </div>
                    <button
                      type="button"
                      className="btn-icon-danger"
                      onClick={() => {
                        setFile(null);
                        setPreview('');
                      }}
                      title="Hapus foto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-icon-circle">
                    <Upload size={22} />
                  </div>
                  <b>Tarik foto ke sini atau klik untuk memilih</b>
                  <span>Format JPG, PNG, atau WebP maksimal 5 MB</span>
                </div>
              )}
            </div>
          </section>

          <div className="create-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>
              {busy ? 'Mengirim…' : 'Kirim Laporan'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export function MyReportsPage({ reports, onOpenReport, onNavigate }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  const tabs = [
    { key: 'ALL', label: 'Semua' },
    { key: 'WAIT', label: 'Menunggu' },
    { key: 'PROGRESS', label: 'Diproses' },
    { key: 'CONFIRM', label: 'Konfirmasi' },
    { key: 'CLOSED', label: 'Selesai' },
    { key: 'REJECTED', label: 'Ditolak' },
  ];

  const filtered = reports.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      r.title?.toLowerCase().includes(q) ||
      r.report_no?.toLowerCase().includes(q) ||
      r.location?.toLowerCase().includes(q);

    if (!matchSearch) return false;
    if (filter === 'ALL') return true;
    if (filter === 'WAIT') return ['SUBMITTED', 'NEEDS_INFORMATION'].includes(r.status);
    if (filter === 'PROGRESS')
      return ['VERIFIED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLUTION_SUBMITTED', 'REINSPECTION_REQUESTED'].includes(r.status);
    if (filter === 'CONFIRM') return r.status === 'AWAITING_CONFIRMATION';
    if (filter === 'CLOSED') return r.status === 'CLOSED';
    if (filter === 'REJECTED') return ['REJECTED', 'DUPLICATE'].includes(r.status);
    return true;
  });

  return (
    <section className="panel">
      <div className="toolbar">
        <div className="search-box">
          <Search size={17} />
          <input
            type="text"
            placeholder="Cari nomor laporan, judul, atau lokasi…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={() => onNavigate('create')}>
          <Plus size={16} /> Buat Laporan Baru
        </button>
      </div>

      <div className="filter-tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`filter-tab ${filter === t.key ? 'active' : ''}`}
            onClick={() => setFilter(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileText size={26} />}
          title="Tidak ada laporan ditemukan"
          subtitle="Coba ubah filter status atau kata kunci pencarian Anda."
        />
      ) : (
        <div className="report-list">
          {filtered.map((r) => (
            <button
              type="button"
              key={r.id}
              className="report-row"
              onClick={() => onOpenReport(r)}
            >
              <span className="report-icon">
                <CategoryIcon category={r.category} size={20} />
              </span>
              <div className="report-main">
                <b>{r.title}</b>
                <small>
                  {r.report_no} · {getCategoryLabel(r.category)} · {r.location} ·{' '}
                  {formatDate(r.created_at)}
                </small>
              </div>
              <div className="report-badges">
                <StatusBadge status={r.status} />
                <PriorityBadge priority={r.priority} />
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export function ReportDetailPage({
  reportId,
  initialReport,
  role,
  token,
  onBack,
  onRefresh,
  notifyToast,
}) {
  const [detail, setDetail] = useState({
    report: initialReport || null,
    history: [],
    updates: [],
    feedback: null,
  });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  // Action states
  const [extraInfo, setExtraInfo] = useState('');
  const [confirmExplain, setConfirmExplain] = useState('');
  const [showReinspect, setShowReinspect] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // Officer action states
  const [findings, setFindings] = useState('');
  const [severity, setSeverity] = useState('MEDIUM');
  const [progressNote, setProgressNote] = useState('');
  const [progressStage, setProgressStage] = useState('REPAIR');
  const [resDesc, setResDesc] = useState('');
  const [resFile, setResFile] = useState(null);

  const loadDetail = async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`/reports/${reportId}`, { token });
      setDetail(res);
      if (res.feedback) {
        setRating(res.feedback.rating);
        setComment(res.feedback.comment || '');
      }
    } catch {
      // keep initialReport
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [reportId]);

  const r = detail.report || initialReport;
  if (!r) return null;

  const submitCitizenInfo = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await apiRequest(`/reports/${r.id}/information`, {
        token,
        method: 'PATCH',
        body: JSON.stringify({ information: extraInfo }),
      });
      setExtraInfo('');
      notifyToast('Informasi tambahan berhasil dikirim.');
      await loadDetail();
      await onRefresh();
    } catch (error) {
      notifyToast(error.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const submitConfirmation = async (resolved) => {
    if (!resolved && !confirmExplain.trim()) {
      notifyToast('Mohon tuliskan penjelasan mengapa masalah masih terjadi.', 'error');
      return;
    }
    setBusy(true);
    try {
      await apiRequest(`/reports/${r.id}/confirmation`, {
        token,
        method: 'POST',
        body: JSON.stringify({ resolved, explanation: confirmExplain }),
      });
      notifyToast(
        resolved
          ? 'Terima kasih! Laporan telah ditutup.'
          : 'Permintaan inspeksi ulang telah dikirim.'
      );
      setShowReinspect(false);
      await loadDetail();
      await onRefresh();
    } catch (error) {
      notifyToast(error.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await apiRequest(`/reports/${r.id}/feedback`, {
        token,
        method: 'POST',
        body: JSON.stringify({ rating, comment }),
      });
      notifyToast('Umpan balik Anda berhasil disimpan. Terima kasih!');
      await loadDetail();
    } catch (error) {
      notifyToast(error.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const submitInspection = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await apiRequest(`/officer/reports/${r.id}/inspection`, {
        token,
        method: 'POST',
        body: JSON.stringify({ findings, severity }),
      });
      setFindings('');
      notifyToast('Hasil inspeksi berhasil dicatat.');
      await loadDetail();
      await onRefresh();
    } catch (error) {
      notifyToast(error.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const submitProgress = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await apiRequest(`/officer/reports/${r.id}/progress`, {
        token,
        method: 'POST',
        body: JSON.stringify({ description: progressNote, progress_status: progressStage }),
      });
      setProgressNote('');
      notifyToast('Progres perbaikan berhasil diperbarui.');
      await loadDetail();
      await onRefresh();
    } catch (error) {
      notifyToast(error.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const submitResolution = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('description', resDesc);
      if (resFile) fd.append('evidence', resFile);
      await apiRequest(`/officer/reports/${r.id}/resolution`, {
        token,
        method: 'POST',
        body: fd,
      });
      setResDesc('');
      setResFile(null);
      notifyToast('Laporan penyelesaian dikirim untuk validasi admin.');
      await loadDetail();
      await onRefresh();
    } catch (error) {
      notifyToast(error.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="detail-page">
      <div className="detail-top-nav">
        <button type="button" className="btn-back" onClick={onBack}>
          <ArrowLeft size={16} /> Kembali
        </button>
        <div className="detail-breadcrumb">
          <span>Laporan</span> / <b>{r.report_no}</b>
        </div>
      </div>

      <div className="detail-header-card">
        <div>
          <span className="report-code">{r.report_no}</span>
          <h1>{r.title}</h1>
          <div className="detail-meta-row">
            <span>
              <CategoryIcon category={r.category} size={15} /> {getCategoryLabel(r.category)}
            </span>
            <span>
              <Calendar size={15} /> Kejadian: {formatDate(r.incident_date)}
            </span>
            <span>
              <Clock size={15} /> Dilaporkan: {formatDate(r.created_at)}
            </span>
          </div>
        </div>
        <div className="detail-badges">
          <StatusBadge status={r.status} />
          <PriorityBadge priority={r.priority} />
        </div>
      </div>

      {/* 6-Step Horizontal Stepper */}
      <WorkflowStepper status={r.status} />

      <div className="columns-grid">
        {/* Left: Description, Evidence, Timeline */}
        <div className="detail-main-col">
          <section className="panel">
            <h2>Detail Laporan</h2>
            <p className="detail-desc">{r.description}</p>

            {r.admin_note && (
              <div className="admin-note-box">
                <b>Catatan Penanganan / Admin</b>
                <p>{r.admin_note}</p>
              </div>
            )}

            <div className="detail-evidence-wrap">
              <h3>Foto Bukti Lapangan</h3>
              <EvidenceImage src={r.image_url} category={r.category} height={240} />
            </div>
          </section>

          <section className="panel">
            <h2>Riwayat Status &amp; Pembaruan</h2>
            {loading ? (
              <p className="muted-copy">Memuat riwayat…</p>
            ) : (
              <div className="history-timeline">
                {detail.updates.map((u) => (
                  <div key={u.id} className="history-item is-update">
                    <span className="history-dot teal" />
                    <div className="history-body">
                      <div className="history-head">
                        <b>Progres Lapangan · {u.progress_status}</b>
                        <small>{formatDateTime(u.created_at)}</small>
                      </div>
                      <p>{u.description}</p>
                    </div>
                  </div>
                ))}

                {[...detail.history].reverse().map((h) => (
                  <div key={h.id} className="history-item">
                    <span className="history-dot" />
                    <div className="history-body">
                      <div className="history-head">
                        <b>{STATUS_LABELS[h.new_status] || h.new_status}</b>
                        <small>{formatDateTime(h.created_at)}</small>
                      </div>
                      <p>
                        {h.notes || 'Pembaruan status laporan'}
                        {h.actor ? ` · oleh ${h.actor}` : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right: Map, Officer Info, Role Actions */}
        <div className="detail-side-col">
          <section className="panel">
            <h2>Lokasi Kejadian</h2>
            <MapPreview
              location={r.location}
              latitude={r.latitude}
              longitude={r.longitude}
              compact
            />
          </section>

          <section className="panel">
            <h2>Petugas Penanggung Jawab</h2>
            {r.officer_name ? (
              <div className="officer-card-mini">
                <div className="avatar">{r.officer_name[0]}</div>
                <div>
                  <b>{r.officer_name}</b>
                  <small>Petugas Lapangan CleanFlow</small>
                </div>
                <span className="badge badge-status CLOSED">Aktif</span>
              </div>
            ) : (
              <p className="muted-copy">
                Belum ada petugas yang ditugaskan. Laporan akan ditugaskan setelah verifikasi admin.
              </p>
            )}
          </section>

          {/* Citizen Action: Needs Info */}
          {role === 'CITIZEN' && r.status === 'NEEDS_INFORMATION' && (
            <section className="panel action-panel">
              <h2>
                <MessageSquarePlus size={18} /> Kirim Informasi Tambahan
              </h2>
              <p>Lengkapi detail yang diminta verifikator agar laporan dapat diproses kembali.</p>
              <form onSubmit={submitCitizenInfo} className="stack-form">
                <textarea
                  rows={3}
                  placeholder="Tulis informasi tambahan atau patokan lokasi yang lebih spesifik…"
                  value={extraInfo}
                  onChange={(e) => setExtraInfo(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary btn-full" disabled={busy}>
                  Kirim Informasi Tambahan
                </button>
              </form>
            </section>
          )}

          {/* Citizen Action: Confirmation */}
          {role === 'CITIZEN' && r.status === 'AWAITING_CONFIRMATION' && (
            <section className="panel action-panel highlight">
              <h2>Konfirmasi Penyelesaian</h2>
              <p>
                Perbaikan telah divalidasi admin. Apakah masalah di lokasi Anda sudah benar-benar
                teratasi?
              </p>
              <div className="stack-form">
                <button
                  type="button"
                  className="btn btn-success btn-full"
                  onClick={() => submitConfirmation(true)}
                  disabled={busy}
                >
                  <CheckCircle2 size={17} /> Ya, Masalah Sudah Selesai
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-full"
                  onClick={() => setShowReinspect(!showReinspect)}
                >
                  Masih Terjadi / Perlu Inspeksi Ulang
                </button>
                {showReinspect && (
                  <div className="reinspect-box">
                    <textarea
                      rows={3}
                      placeholder="Jelaskan kendala yang masih ditemukan di lapangan…"
                      value={confirmExplain}
                      onChange={(e) => setConfirmExplain(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-full"
                      onClick={() => submitConfirmation(false)}
                      disabled={busy}
                    >
                      Minta Inspeksi Ulang
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Citizen Action: Feedback */}
          {role === 'CITIZEN' && r.status === 'CLOSED' && (
            <section className="panel">
              <h2>Umpan Balik Penanganan</h2>
              <p>Bagaimana penilaian Anda terhadap proses penanganan laporan ini?</p>
              <form onSubmit={submitFeedback} className="stack-form">
                <div className="star-row">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`star-btn ${n <= rating ? 'active' : ''}`}
                      onClick={() => setRating(n)}
                      aria-label={`${n} bintang`}
                    >
                      <Star size={22} fill={n <= rating ? '#F59E0B' : 'none'} />
                    </button>
                  ))}
                </div>
                <textarea
                  rows={2}
                  placeholder="Tulis komentar atau saran Anda (opsional)…"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button type="submit" className="btn btn-primary btn-full" disabled={busy}>
                  {detail.feedback ? 'Perbarui Penilaian' : 'Kirim Penilaian'}
                </button>
              </form>
            </section>
          )}

          {/* Officer Actions when assigned and IN_PROGRESS */}
          {role === 'OFFICER' &&
            ['IN_PROGRESS', 'ASSIGNED', 'REINSPECTION_REQUESTED'].includes(r.status) && (
              <>
                <section className="panel">
                  <h2>1. Catat Inspeksi Lapangan</h2>
                  <form onSubmit={submitInspection} className="stack-form">
                    <textarea
                      rows={3}
                      placeholder="Temuan kondisi kerusakan di lapangan…"
                      value={findings}
                      onChange={(e) => setFindings(e.target.value)}
                      required
                    />
                    <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
                      <option value="LOW">Keparahan: Rendah</option>
                      <option value="MEDIUM">Keparahan: Sedang</option>
                      <option value="HIGH">Keparahan: Tinggi</option>
                      <option value="CRITICAL">Keparahan: Kritis</option>
                    </select>
                    <button type="submit" className="btn btn-secondary btn-full" disabled={busy}>
                      Simpan Hasil Inspeksi
                    </button>
                  </form>
                </section>

                <section className="panel">
                  <h2>2. Perbarui Progres Perbaikan</h2>
                  <form onSubmit={submitProgress} className="stack-form">
                    <select
                      value={progressStage}
                      onChange={(e) => setProgressStage(e.target.value)}
                    >
                      <option value="INSPECTION">Tahap: Survei / Inspeksi</option>
                      <option value="REPAIR">Tahap: Perbaikan Berlangsung</option>
                      <option value="TESTING">Tahap: Uji Aliran / Kualitas</option>
                    </select>
                    <textarea
                      rows={2}
                      placeholder="Catatan progres untuk warga dan admin…"
                      value={progressNote}
                      onChange={(e) => setProgressNote(e.target.value)}
                      required
                    />
                    <button type="submit" className="btn btn-secondary btn-full" disabled={busy}>
                      Kirim Update Progres
                    </button>
                  </form>
                </section>

                <section className="panel action-panel">
                  <h2>3. Ajukan Penyelesaian</h2>
                  <p>Kirim dokumentasi setelah pekerjaan selesai untuk divalidasi oleh admin.</p>
                  <form onSubmit={submitResolution} className="stack-form">
                    <textarea
                      rows={3}
                      placeholder="Ringkasan tindakan perbaikan yang telah dilakukan…"
                      value={resDesc}
                      onChange={(e) => setResDesc(e.target.value)}
                      required
                    />
                    <label className="file-btn-label">
                      <Camera size={16} />
                      <span>{resFile ? resFile.name : 'Lampirkan foto setelah perbaikan (opsional)'}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        hidden
                        onChange={(e) => setResFile(e.target.files?.[0] || null)}
                      />
                    </label>
                    <button type="submit" className="btn btn-primary btn-full" disabled={busy}>
                      <UserCheck size={16} /> Kirim Resolusi Selesai
                    </button>
                  </form>
                </section>
              </>
            )}
        </div>
      </div>
    </div>
  );
}
