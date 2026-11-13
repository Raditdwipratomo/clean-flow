import React, { useState } from 'react';
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock,
  Droplets,
  FileText,
  MapPin,
  Wrench,
  X,
} from 'lucide-react';
import {
  CategoryIcon,
  EmptyState,
  PriorityBadge,
  StatusBadge,
  getCategoryLabel,
} from '../components/ui.jsx';
import { apiRequest } from '../lib/api.js';
import { formatDate } from '../lib/constants.js';

export function OfficerDashboard({
  token,
  assignments,
  onNavigate,
  onOpenReport,
  onRefresh,
  notifyToast,
}) {
  const [declineItem, setDeclineItem] = useState(null);
  const [declineReason, setDeclineReason] = useState('');
  const [busy, setBusy] = useState(false);

  const pending = assignments.filter((a) => a.assignment_status === 'PENDING');
  const active = assignments.filter((a) =>
    ['ASSIGNED', 'IN_PROGRESS', 'REINSPECTION_REQUESTED'].includes(a.status)
  );
  const completed = assignments.filter((a) =>
    ['RESOLUTION_SUBMITTED', 'AWAITING_CONFIRMATION', 'CLOSED'].includes(a.status)
  );

  const respondAssignment = async (assignmentId, action, reason = '') => {
    setBusy(true);
    try {
      await apiRequest(`/officer/assignments/${assignmentId}/respond`, {
        token,
        method: 'PATCH',
        body: JSON.stringify({ action, reason }),
      });
      notifyToast(action === 'ACCEPTED' ? 'Tugas diterima! Status kini Sedang Diproses.' : 'Tugas ditolak.');
      setDeclineItem(null);
      setDeclineReason('');
      await onRefresh();
    } catch (error) {
      notifyToast(error.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="dash-stack">
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon blue">
            <FileText size={22} />
          </span>
          <strong>{assignments.length}</strong>
          <small>Total tugas saya</small>
        </div>
        <div className="stat-card">
          <span className="stat-icon amber">
            <Clock size={22} />
          </span>
          <strong>{pending.length}</strong>
          <small>Menunggu respons</small>
        </div>
        <div className="stat-card">
          <span className="stat-icon teal">
            <Wrench size={22} />
          </span>
          <strong>{active.length}</strong>
          <small>Sedang dikerjakan</small>
        </div>
        <div className="stat-card">
          <span className="stat-icon green">
            <Check size={22} />
          </span>
          <strong>{completed.length}</strong>
          <small>Selesai / validasi</small>
        </div>
      </div>

      <div className="columns-grid">
        <section className="panel">
          <div className="section-title">
            <h2>Daftar Tugas Lapangan</h2>
            <button type="button" className="link-btn" onClick={() => onNavigate('tasks')}>
              Lihat semua <ArrowUpRight size={16} />
            </button>
          </div>

          {assignments.length === 0 ? (
            <EmptyState
              icon={<ClipboardList size={28} />}
              title="Belum ada tugas lapangan"
              subtitle="Penugasan baru dari administrator akan muncul di sini."
            />
          ) : (
            <div className="report-list">
              {assignments.map((a) => (
                <div key={a.assignment_id} className="report-row static">
                  <span className="report-icon">
                    <CategoryIcon category={a.category} size={20} />
                  </span>
                  <div
                    className="report-main"
                    onClick={() => onOpenReport(a)}
                    style={{ cursor: 'pointer' }}
                  >
                    <b>{a.title}</b>
                    <small>
                      {a.report_no} · <MapPin size={12} /> {a.location}
                    </small>
                    {a.assignment_notes && (
                      <small className="assign-note">Catatan admin: {a.assignment_notes}</small>
                    )}
                  </div>
                  <div className="report-badges">
                    <StatusBadge status={a.status} />
                    <PriorityBadge priority={a.priority} />
                    {a.assignment_status === 'PENDING' ? (
                      <div className="inline-btns">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => respondAssignment(a.assignment_id, 'ACCEPTED')}
                          disabled={busy}
                        >
                          Terima
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setDeclineItem(a)}
                          disabled={busy}
                        >
                          Tolak
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => onOpenReport(a)}
                      >
                        Kelola Tugas
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel side-panel">
          {pending.length > 0 && (
            <div className="action-highlight-card">
              <span className="action-pill">TUGAS BARU</span>
              <b>{pending.length} Penugasan Menunggu Konfirmasi</b>
              <p>
                Segera terima penugasan agar Anda dapat mulai mencatat inspeksi lapangan dan
                memperbarui progres perbaikan.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-full"
                onClick={() => onOpenReport(pending[0])}
              >
                Tinjau Tugas Terbaru
              </button>
            </div>
          )}

          <h2>Panduan Petugas</h2>
          <div className="timeline-mini">
            <div className="timeline-mini-item static">
              <span className="timeline-dot" />
              <div>
                <b>1. Terima Penugasan</b>
                <small>Tinjau lokasi &amp; tingkat prioritas laporan.</small>
              </div>
            </div>
            <div className="timeline-mini-item static">
              <span className="timeline-dot" />
              <div>
                <b>2. Catat Inspeksi &amp; Progres</b>
                <small>Buka detail tugas untuk input temuan di lapangan.</small>
              </div>
            </div>
            <div className="timeline-mini-item static">
              <span className="timeline-dot" />
              <div>
                <b>3. Kirim Resolusi Selesai</b>
                <small>Lampirkan ringkasan perbaikan untuk divalidasi admin.</small>
              </div>
            </div>
          </div>
        </section>
      </div>

      {declineItem && (
        <div className="overlay" onClick={() => setDeclineItem(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="close-btn" onClick={() => setDeclineItem(null)}>
              <X size={20} />
            </button>
            <h2>Tolak Penugasan</h2>
            <p>
              Berikan alasan penolakan untuk tugas <b>{declineItem.report_no}</b> agar admin dapat
              menugaskan petugas lain.
            </p>
            <form
              className="stack-form"
              style={{ marginTop: 16 }}
              onSubmit={(e) => {
                e.preventDefault();
                respondAssignment(declineItem.assignment_id, 'DECLINED', declineReason);
              }}
            >
              <textarea
                rows={3}
                placeholder="Contoh: Sedang menangani laporan kritis di area lain…"
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-danger btn-full" disabled={busy}>
                Kirim Penolakan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function OfficerTasksPage({ assignments, onOpenReport }) {
  const [filter, setFilter] = useState('ALL');

  const filtered = assignments.filter((a) => {
    if (filter === 'PENDING') return a.assignment_status === 'PENDING';
    if (filter === 'ACTIVE') return a.status === 'IN_PROGRESS';
    if (filter === 'DONE')
      return ['RESOLUTION_SUBMITTED', 'AWAITING_CONFIRMATION', 'CLOSED'].includes(a.status);
    return true;
  });

  return (
    <section className="panel">
      <div className="filter-tabs">
        <button
          type="button"
          className={`filter-tab ${filter === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilter('ALL')}
        >
          Semua ({assignments.length})
        </button>
        <button
          type="button"
          className={`filter-tab ${filter === 'PENDING' ? 'active' : ''}`}
          onClick={() => setFilter('PENDING')}
        >
          Menunggu Respons ({assignments.filter((a) => a.assignment_status === 'PENDING').length})
        </button>
        <button
          type="button"
          className={`filter-tab ${filter === 'ACTIVE' ? 'active' : ''}`}
          onClick={() => setFilter('ACTIVE')}
        >
          Dikerjakan ({assignments.filter((a) => a.status === 'IN_PROGRESS').length})
        </button>
        <button
          type="button"
          className={`filter-tab ${filter === 'DONE' ? 'active' : ''}`}
          onClick={() => setFilter('DONE')}
        >
          Selesai ({assignments.filter((a) => ['RESOLUTION_SUBMITTED', 'AWAITING_CONFIRMATION', 'CLOSED'].includes(a.status)).length})
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<CheckCircle2 size={28} />}
          title="Tidak ada tugas di kategori ini"
          subtitle="Pilih filter lain untuk melihat penugasan Anda."
        />
      ) : (
        <div className="report-list">
          {filtered.map((a) => (
            <button
              type="button"
              key={a.assignment_id}
              className="report-row"
              onClick={() => onOpenReport(a)}
            >
              <span className="report-icon">
                <CategoryIcon category={a.category} size={20} />
              </span>
              <div className="report-main">
                <b>{a.title}</b>
                <small>
                  {a.report_no} · {getCategoryLabel(a.category)} · {a.location} ·{' '}
                  {formatDate(a.created_at)}
                </small>
              </div>
              <div className="report-badges">
                <StatusBadge status={a.status} />
                <PriorityBadge priority={a.priority} />
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
