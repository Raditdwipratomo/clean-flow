import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Check,
  CheckCircle2,
  ClipboardList,
  Download,
  Droplets,
  FileText,
  Filter,
  Plus,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import {
  CategoryIcon,
  DonutChart,
  EmptyState,
  EvidenceImage,
  MapPreview,
  PriorityBadge,
  StatusBadge,
  getCategoryLabel,
} from '../components/ui.jsx';
import { apiRequest, downloadCsvExport } from '../lib/api.js';
import { PRIORITY_LABELS, formatDate } from '../lib/constants.js';

export function AdminDashboard({ token, reports, officers, onNavigate, onOpenVerify, onOpenReport, notifyToast }) {
  const [analytics, setAnalytics] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let active = true;
    apiRequest('/admin/analytics', { token })
      .then((res) => {
        if (active) setAnalytics(res);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [token, reports]);

  const stats = analytics?.stats || {
    total: reports.length,
    submitted: reports.filter((r) => r.status === 'SUBMITTED').length,
    verified: reports.filter((r) => r.status === 'VERIFIED').length,
    in_progress: reports.filter((r) => ['ASSIGNED', 'IN_PROGRESS', 'RESOLUTION_SUBMITTED'].includes(r.status)).length,
    awaiting_confirmation: reports.filter((r) => r.status === 'AWAITING_CONFIRMATION').length,
    closed: reports.filter((r) => r.status === 'CLOSED').length,
    rejected: reports.filter((r) => r.status === 'REJECTED').length,
  };

  const categories = analytics?.categories || [];
  const maxCat = Math.max(1, ...categories.map((c) => c.count));
  const officerLoad = analytics?.officers || officers;
  const maxLoad = Math.max(5, ...officerLoad.map((o) => o.workload || 0));

  const handleExport = async () => {
    setExporting(true);
    try {
      await downloadCsvExport(token);
      notifyToast('File CSV laporan berhasil diunduh.');
    } catch (error) {
      notifyToast(error.message, 'error');
    } finally {
      setExporting(false);
    }
  };

  const actionable = reports.filter((r) =>
    ['SUBMITTED', 'VERIFIED', 'RESOLUTION_SUBMITTED', 'REINSPECTION_REQUESTED'].includes(r.status)
  );

  const completionRate =
    stats.total > 0 ? Math.round(((stats.closed + stats.awaiting_confirmation) / stats.total) * 100) : 0;

  return (
    <div className="dash-stack">
      <div className="admin-subbar">
        <span className="date-range-pill">Periode Aktif · Semua Data Operasional</span>
        <button type="button" className="btn btn-secondary" onClick={handleExport} disabled={exporting}>
          <Download size={16} /> {exporting ? 'Mengunduh…' : 'Ekspor CSV'}
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon amber">
            <ClipboardList size={22} />
          </span>
          <strong>{stats.submitted}</strong>
          <small>Menunggu verifikasi</small>
        </div>
        <div className="stat-card">
          <span className="stat-icon blue">
            <Droplets size={22} />
          </span>
          <strong>{stats.in_progress + stats.verified}</strong>
          <small>Sedang diproses</small>
        </div>
        <div className="stat-card">
          <span className="stat-icon green">
            <Check size={22} />
          </span>
          <strong>{stats.closed}</strong>
          <small>Laporan selesai</small>
        </div>
        <div className="stat-card">
          <span className="stat-icon teal">
            <BarChart3 size={22} />
          </span>
          <strong>{completionRate}%</strong>
          <small>Tingkat penyelesaian ({stats.total} total)</small>
        </div>
      </div>

      {/* 3-Column Analytics Row matching 05-admin-dashboard.png */}
      <div className="analytics-grid">
        <section className="panel">
          <h2>Laporan per Kategori</h2>
          {categories.length === 0 ? (
            <p className="muted-copy">Belum ada data kategori.</p>
          ) : (
            <div className="bar-list">
              {categories.map((c) => (
                <div key={c.category} className="bar-item">
                  <div className="bar-label">
                    <span>{getCategoryLabel(c.category)}</span>
                    <b>{c.count}</b>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill teal"
                      style={{ width: `${Math.round((c.count / maxCat) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel">
          <h2>Status Laporan</h2>
          <DonutChart stats={stats} />
        </section>

        <section className="panel">
          <h2>Beban Kerja Petugas</h2>
          {officerLoad.length === 0 ? (
            <p className="muted-copy">Belum ada petugas terdaftar.</p>
          ) : (
            <div className="bar-list">
              {officerLoad.map((o) => {
                const high = (o.workload || 0) >= 5;
                return (
                  <div key={o.full_name} className="bar-item">
                    <div className="bar-label">
                      <span>{o.full_name}</span>
                      <b>{o.workload || 0} tugas</b>
                    </div>
                    <div className="bar-track">
                      <div
                        className={`bar-fill ${high ? 'amber' : 'teal'}`}
                        style={{
                          width: `${Math.max(8, Math.round(((o.workload || 0) / maxLoad) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              <p className="workload-note">
                Warna kuning = beban tinggi, pertimbangkan penugasan ke petugas lain.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Actionable Queue */}
      <section className="panel">
        <div className="section-title">
          <h2>Antrean Perlu Tindak Lanjut ({actionable.length})</h2>
          <button type="button" className="link-btn" onClick={() => onNavigate('verify')}>
            Buka Ruang Verifikasi <ArrowUpRight size={16} />
          </button>
        </div>

        {actionable.length === 0 ? (
          <EmptyState
            icon={<CheckCircle2 size={28} />}
            title="Semua antrean tertangani"
            subtitle="Tidak ada laporan baru yang menunggu verifikasi atau validasi saat ini."
          />
        ) : (
          <div className="report-list">
            {actionable.slice(0, 6).map((r) => (
              <div key={r.id} className="report-row static">
                <span className="report-icon">
                  <CategoryIcon category={r.category} size={20} />
                </span>
                <div className="report-main" onClick={() => onOpenReport(r)} style={{ cursor: 'pointer' }}>
                  <b>{r.title}</b>
                  <small>
                    {r.report_no} · {r.citizen_name || 'Warga'} · {r.location}
                  </small>
                </div>
                <div className="report-badges">
                  <StatusBadge status={r.status} />
                  <PriorityBadge priority={r.priority} />
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => onOpenVerify(r)}
                  >
                    {r.status === 'SUBMITTED'
                      ? 'Verifikasi'
                      : r.status === 'RESOLUTION_SUBMITTED'
                        ? 'Validasi'
                        : 'Tugaskan'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export function AdminVerificationPage({
  token,
  reports,
  officers,
  selectedReport,
  onSelectReport,
  onRefresh,
  notifyToast,
}) {
  const [queueTab, setQueueTab] = useState('SUBMITTED');
  const [priority, setPriority] = useState('MEDIUM');
  const [note, setNote] = useState('');
  const [officerId, setOfficerId] = useState('');
  const [checklist, setChecklist] = useState([true, true, true, true, true]);
  const [busy, setBusy] = useState(false);

  const checklistLabels = [
    'Informasi laporan lengkap & jelas',
    'Lokasi kejadian valid dan berada dalam wilayah layanan',
    'Foto bukti relevan dengan masalah air/sanitasi',
    'Kategori laporan sudah sesuai',
    'Bukan laporan duplikat dari kasus aktif lain',
  ];

  useEffect(() => {
    if (selectedReport) {
      setPriority(selectedReport.priority || selectedReport.impact || 'MEDIUM');
      setNote(selectedReport.admin_note || '');
      setOfficerId(selectedReport.officer_id || '');
      if (selectedReport.status === 'VERIFIED' || selectedReport.status === 'REINSPECTION_REQUESTED') {
        setQueueTab('ASSIGN');
      } else if (selectedReport.status === 'RESOLUTION_SUBMITTED') {
        setQueueTab('REVIEW');
      } else {
        setQueueTab('SUBMITTED');
      }
    }
  }, [selectedReport]);

  const queueItems = reports.filter((r) => {
    if (queueTab === 'SUBMITTED') return r.status === 'SUBMITTED';
    if (queueTab === 'ASSIGN') return ['VERIFIED', 'REINSPECTION_REQUESTED'].includes(r.status);
    if (queueTab === 'REVIEW') return r.status === 'RESOLUTION_SUBMITTED';
    return false;
  });

  const activeItem = selectedReport || queueItems[0] || null;

  const toggleCheck = (idx) => {
    setChecklist((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  const handleVerify = async (outcome) => {
    if (!activeItem) return;
    if ((outcome === 'REJECTED' || outcome === 'DUPLICATE' || outcome === 'NEEDS_INFORMATION') && !note.trim()) {
      notifyToast('Mohon isi alasan atau catatan untuk keputusan ini.', 'error');
      return;
    }

    setBusy(true);
    try {
      await apiRequest(`/admin/reports/${activeItem.id}/verify`, {
        token,
        method: 'PATCH',
        body: JSON.stringify({ outcome, priority, note }),
      });

      if (outcome === 'VERIFIED' && officerId) {
        await apiRequest(`/admin/reports/${activeItem.id}/assign`, {
          token,
          method: 'POST',
          body: JSON.stringify({ officer_id: officerId, notes: note || 'Ditugaskan saat verifikasi' }),
        });
        notifyToast(`Laporan ${activeItem.report_no} diverifikasi dan ditugaskan!`);
      } else {
        notifyToast(`Status laporan ${activeItem.report_no} diperbarui.`);
      }

      onSelectReport(null);
      await onRefresh();
    } catch (error) {
      notifyToast(error.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleAssignOnly = async () => {
    if (!activeItem || !officerId) {
      notifyToast('Pilih petugas lapangan terlebih dahulu.', 'error');
      return;
    }
    setBusy(true);
    try {
      if (priority !== activeItem.priority) {
        await apiRequest(`/admin/reports/${activeItem.id}/priority`, {
          token,
          method: 'PATCH',
          body: JSON.stringify({ priority, reason: note || 'Penyesuaian prioritas oleh admin' }),
        });
      }
      await apiRequest(`/admin/reports/${activeItem.id}/assign`, {
        token,
        method: 'POST',
        body: JSON.stringify({ officer_id: officerId, notes: note }),
      });
      notifyToast(`Petugas berhasil ditugaskan untuk ${activeItem.report_no}.`);
      onSelectReport(null);
      await onRefresh();
    } catch (error) {
      notifyToast(error.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleReviewResolution = async (decision) => {
    if (!activeItem) return;
    if (decision === 'NEEDS_REVISION' && !note.trim()) {
      notifyToast('Tuliskan catatan perbaikan yang diperlukan petugas.', 'error');
      return;
    }
    setBusy(true);
    try {
      await apiRequest(`/admin/resolutions/${activeItem.id}/review`, {
        token,
        method: 'PATCH',
        body: JSON.stringify({ decision, remarks: note }),
      });
      notifyToast(
        decision === 'APPROVED'
          ? 'Resolusi disetujui! Menunggu konfirmasi warga.'
          : 'Resolusi dikembalikan ke petugas untuk revisi.'
      );
      onSelectReport(null);
      await onRefresh();
    } catch (error) {
      notifyToast(error.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="dash-stack">
      {/* Queue Tabs */}
      <div className="filter-tabs">
        <button
          type="button"
          className={`filter-tab ${queueTab === 'SUBMITTED' ? 'active' : ''}`}
          onClick={() => {
            setQueueTab('SUBMITTED');
            onSelectReport(null);
          }}
        >
          Verifikasi Baru ({reports.filter((r) => r.status === 'SUBMITTED').length})
        </button>
        <button
          type="button"
          className={`filter-tab ${queueTab === 'ASSIGN' ? 'active' : ''}`}
          onClick={() => {
            setQueueTab('ASSIGN');
            onSelectReport(null);
          }}
        >
          Siap Ditugaskan (
          {reports.filter((r) => ['VERIFIED', 'REINSPECTION_REQUESTED'].includes(r.status)).length})
        </button>
        <button
          type="button"
          className={`filter-tab ${queueTab === 'REVIEW' ? 'active' : ''}`}
          onClick={() => {
            setQueueTab('REVIEW');
            onSelectReport(null);
          }}
        >
          Validasi Resolusi (
          {reports.filter((r) => r.status === 'RESOLUTION_SUBMITTED').length})
        </button>
      </div>

      {!activeItem ? (
        <section className="panel">
          <EmptyState
            icon={<ShieldCheck size={28} />}
            title="Antrean ini kosong"
            subtitle="Tidak ada laporan pada tahap ini untuk ditindaklanjuti."
          />
        </section>
      ) : (
        <div className="verify-layout">
          {/* Queue selector pills when multiple items */}
          {queueItems.length > 1 && (
            <div className="queue-strip">
              {queueItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`queue-chip ${activeItem.id === item.id ? 'active' : ''}`}
                  onClick={() => onSelectReport(item)}
                >
                  <b>{item.report_no}</b>
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          )}

          {/* Header */}
          <div className="detail-header-card">
            <div>
              <span className="report-code">{activeItem.report_no}</span>
              <h1>{activeItem.title}</h1>
              <p className="muted-copy">
                Pelapor: <b>{activeItem.citizen_name || 'Warga'}</b> · Dampak (versi warga):{' '}
                <b>{PRIORITY_LABELS[activeItem.impact] || activeItem.impact}</b> ·{' '}
                {formatDate(activeItem.created_at)}
              </p>
            </div>
            <StatusBadge status={activeItem.status} />
          </div>

          <div className="columns-grid">
            {/* Left: Evidence + Map + Checklist matching 06-admin-verification.png */}
            <div className="detail-main-col">
              <section className="panel">
                <div className="verify-media-grid">
                  <EvidenceImage
                    src={activeItem.image_url}
                    category={activeItem.category}
                    height={190}
                  />
                  <MapPreview
                    location={activeItem.location}
                    latitude={activeItem.latitude}
                    longitude={activeItem.longitude}
                    compact
                  />
                </div>
                <p className="detail-desc" style={{ marginTop: 18 }}>
                  {activeItem.description}
                </p>
              </section>

              <section className="panel">
                <h2>Checklist Verifikasi</h2>
                <div className="checklist-box">
                  {checklistLabels.map((label, idx) => (
                    <button
                      type="button"
                      key={label}
                      className={`check-row ${checklist[idx] ? 'checked' : ''}`}
                      onClick={() => toggleCheck(idx)}
                    >
                      <span className="check-circle">
                        {checklist[idx] && <Check size={14} strokeWidth={3} />}
                      </span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* Right: Keputusan, Prioritas, Tugaskan Petugas */}
            <div className="detail-side-col">
              <section className="panel">
                <h2>Keputusan &amp; Prioritas</h2>
                <div className="field-group">
                  <label className="field-label">Prioritas resmi</label>
                  <div className="impact-pills">
                    {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        className={`impact-pill ${priority === lvl ? 'active' : ''} impact-${lvl}`}
                        onClick={() => setPriority(lvl)}
                      >
                        {PRIORITY_LABELS[lvl]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="field" style={{ marginTop: 14 }}>
                  <label>Alasan / catatan</label>
                  <textarea
                    rows={3}
                    placeholder="Tambahkan catatan verifikasi, alasan penolakan, atau instruksi untuk petugas…"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </section>

              {activeItem.status !== 'RESOLUTION_SUBMITTED' && (
                <section className="panel">
                  <h2>Tugaskan Petugas</h2>
                  <div className="officer-picker-list">
                    {officers.map((o) => {
                      const busyOfficer = (o.workload || 0) >= 5;
                      const picked = officerId === o.id;
                      return (
                        <button
                          key={o.id}
                          type="button"
                          className={`officer-pick-card ${picked ? 'selected' : ''}`}
                          onClick={() => setOfficerId(picked ? '' : o.id)}
                        >
                          <div className={`avatar ${picked ? '' : 'avatar-muted'}`}>
                            {o.full_name[0]}
                          </div>
                          <div className="officer-pick-info">
                            <b>{o.full_name}</b>
                            <small>
                              {o.address || 'Petugas Lapangan'} · {o.workload || 0} tugas
                            </small>
                          </div>
                          <span
                            className={`badge badge-status ${
                              busyOfficer ? 'SUBMITTED' : 'CLOSED'
                            }`}
                          >
                            {busyOfficer ? 'Sibuk' : 'Tersedia'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Action Buttons */}
              <div className="verify-actions">
                {activeItem.status === 'SUBMITTED' && (
                  <>
                    <button
                      type="button"
                      className="btn btn-danger-outline"
                      onClick={() => handleVerify('REJECTED')}
                      disabled={busy}
                    >
                      Tolak
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleVerify('NEEDS_INFORMATION')}
                      disabled={busy}
                    >
                      Minta Info
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleVerify('DUPLICATE')}
                      disabled={busy}
                    >
                      Duplikat
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleVerify('VERIFIED')}
                      disabled={busy}
                    >
                      {officerId ? 'Verifikasi & Tugaskan' : 'Verifikasi Laporan'}
                    </button>
                  </>
                )}

                {['VERIFIED', 'REINSPECTION_REQUESTED'].includes(activeItem.status) && (
                  <button
                    type="button"
                    className="btn btn-primary btn-full"
                    onClick={handleAssignOnly}
                    disabled={busy}
                  >
                    Tugaskan Petugas Terpilih
                  </button>
                )}

                {activeItem.status === 'RESOLUTION_SUBMITTED' && (
                  <>
                    <button
                      type="button"
                      className="btn btn-danger-outline"
                      onClick={() => handleReviewResolution('NEEDS_REVISION')}
                      disabled={busy}
                    >
                      Minta Perbaikan Ulang
                    </button>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => handleReviewResolution('APPROVED')}
                      disabled={busy}
                    >
                      Setujui Penyelesaian
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminAllReportsPage({ token, reports, onOpenReport, onOpenVerify, notifyToast }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const filtered = reports.filter((r) => {
    const q = search.toLowerCase();
    const matchQ =
      !q ||
      r.title?.toLowerCase().includes(q) ||
      r.report_no?.toLowerCase().includes(q) ||
      r.location?.toLowerCase().includes(q) ||
      r.citizen_name?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchPri = priorityFilter === 'ALL' || r.priority === priorityFilter;
    return matchQ && matchStatus && matchPri;
  });

  const handleExport = async () => {
    try {
      await downloadCsvExport(token);
      notifyToast('CSV berhasil diunduh.');
    } catch (error) {
      notifyToast(error.message, 'error');
    }
  };

  return (
    <section className="panel">
      <div className="toolbar">
        <div className="search-box">
          <Search size={17} />
          <input
            type="text"
            placeholder="Cari nomor, judul, lokasi, atau pelapor…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="toolbar-filters">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">Semua Status</option>
            <option value="SUBMITTED">Menunggu Verifikasi</option>
            <option value="VERIFIED">Terverifikasi</option>
            <option value="ASSIGNED">Ditugaskan</option>
            <option value="IN_PROGRESS">Sedang Diproses</option>
            <option value="RESOLUTION_SUBMITTED">Menunggu Validasi</option>
            <option value="AWAITING_CONFIRMATION">Menunggu Konfirmasi</option>
            <option value="CLOSED">Selesai</option>
            <option value="REJECTED">Ditolak</option>
          </select>

          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="ALL">Semua Prioritas</option>
            <option value="CRITICAL">Kritis</option>
            <option value="HIGH">Tinggi</option>
            <option value="MEDIUM">Sedang</option>
            <option value="LOW">Rendah</option>
          </select>

          <button type="button" className="btn btn-secondary" onClick={handleExport}>
            <Download size={16} /> CSV
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Filter size={26} />}
          title="Tidak ada laporan sesuai filter"
          subtitle="Ubah filter atau kata kunci pencarian untuk melihat laporan lainnya."
        />
      ) : (
        <div className="report-list">
          {filtered.map((r) => (
            <div key={r.id} className="report-row static">
              <span className="report-icon">
                <CategoryIcon category={r.category} size={20} />
              </span>
              <div className="report-main" onClick={() => onOpenReport(r)} style={{ cursor: 'pointer' }}>
                <b>{r.title}</b>
                <small>
                  {r.report_no} · {getCategoryLabel(r.category)} · {r.location} ·{' '}
                  {r.citizen_name || 'Warga'}
                </small>
              </div>
              <div className="report-badges">
                <StatusBadge status={r.status} />
                <PriorityBadge priority={r.priority} />
                {['SUBMITTED', 'VERIFIED', 'RESOLUTION_SUBMITTED', 'REINSPECTION_REQUESTED'].includes(
                  r.status
                ) && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => onOpenVerify(r)}
                  >
                    Tindak
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function AdminOfficersPage({ token, officers, onRefresh, notifyToast }) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('cleanflow123');
  const [busy, setBusy] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await apiRequest('/admin/officers', {
        token,
        method: 'POST',
        body: JSON.stringify({ name, email, phone, password }),
      });
      notifyToast(`Petugas ${name} berhasil ditambahkan.`);
      setShowAdd(false);
      setName('');
      setEmail('');
      setPhone('');
      await onRefresh();
    } catch (error) {
      notifyToast(error.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="dash-stack">
      <div className="admin-subbar">
        <span className="muted-copy">
          Total {officers.length} petugas lapangan terdaftar dalam sistem.
        </span>
        <button type="button" className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <UserPlus size={16} /> Tambah Petugas
        </button>
      </div>

      <div className="officers-grid">
        {officers.map((o) => {
          const high = (o.workload || 0) >= 5;
          return (
            <div key={o.id} className="panel officer-dir-card">
              <div className="officer-dir-top">
                <div className="avatar avatar-lg">{o.full_name[0]}</div>
                <div>
                  <h3>{o.full_name}</h3>
                  <small>{o.address || 'Area Layanan Jakarta'}</small>
                </div>
                <span className={`badge badge-status ${high ? 'SUBMITTED' : 'CLOSED'}`}>
                  {high ? 'Sibuk' : 'Tersedia'}
                </span>
              </div>

              <div className="officer-dir-meta">
                <span>Email: {o.email}</span>
                <span>Telepon: {o.phone || '-'}</span>
              </div>

              <div className="bar-item">
                <div className="bar-label">
                  <span>Beban Tugas Aktif</span>
                  <b>{o.workload || 0} tugas</b>
                </div>
                <div className="bar-track">
                  <div
                    className={`bar-fill ${high ? 'amber' : 'teal'}`}
                    style={{ width: `${Math.min(100, Math.max(10, (o.workload || 0) * 15))}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showAdd && (
        <div className="overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="close-btn" onClick={() => setShowAdd(false)}>
              <X size={20} />
            </button>
            <h2>Tambah Petugas Lapangan</h2>
            <p>Buat akun petugas baru untuk menangani penugasan lapangan.</p>
            <form onSubmit={handleAdd} className="stack-form" style={{ marginTop: 18 }}>
              <div className="field">
                <label>Nama lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Contoh: Dedi Santoso"
                />
              </div>
              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="dedi@cleanflow.id"
                />
              </div>
              <div className="field">
                <label>Nomor telepon</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812xxxxxxxx"
                />
              </div>
              <div className="field">
                <label>Password awal</label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={busy}>
                {busy ? 'Menyimpan…' : 'Simpan Petugas'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
