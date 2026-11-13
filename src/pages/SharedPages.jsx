import React, { useState } from 'react';
import { Bell, CheckCheck, LogOut, Mail, MapPin, Phone, Shield, User } from 'lucide-react';
import { EmptyState } from '../components/ui.jsx';
import { apiRequest } from '../lib/api.js';
import { formatDateTime } from '../lib/constants.js';

export function NotificationsPage({
  token,
  notifs,
  reports,
  onRefresh,
  onOpenReport,
  notifyToast,
}) {
  const [filter, setFilter] = useState('ALL');

  const visible = filter === 'UNREAD' ? notifs.filter((n) => !n.is_read) : notifs;
  const unreadCount = notifs.filter((n) => !n.is_read).length;

  const markRead = async (n) => {
    try {
      if (!n.is_read) {
        await apiRequest(`/notifications/${n.id}/read`, { token, method: 'PATCH' });
        await onRefresh();
      }
      if (n.report_id) {
        const match = reports.find((r) => r.id === n.report_id);
        onOpenReport(match || { id: n.report_id });
      }
    } catch {
      // ignore
    }
  };

  const markAllRead = async () => {
    try {
      await apiRequest('/notifications/read-all', { token, method: 'PATCH' });
      notifyToast('Semua notifikasi ditandai sudah dibaca.');
      await onRefresh();
    } catch (error) {
      notifyToast(error.message, 'error');
    }
  };

  return (
    <section className="panel">
      <div className="toolbar">
        <div className="filter-tabs" style={{ margin: 0 }}>
          <button
            type="button"
            className={`filter-tab ${filter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            Semua ({notifs.length})
          </button>
          <button
            type="button"
            className={`filter-tab ${filter === 'UNREAD' ? 'active' : ''}`}
            onClick={() => setFilter('UNREAD')}
          >
            Belum Dibaca ({unreadCount})
          </button>
        </div>

        {unreadCount > 0 && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={markAllRead}>
            <CheckCheck size={16} /> Tandai semua dibaca
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={<Bell size={28} />}
          title="Tidak ada notifikasi"
          subtitle="Pembaruan status laporan dan penugasan akan muncul di sini."
        />
      ) : (
        <div className="notif-list">
          {visible.map((n) => (
            <button
              type="button"
              key={n.id}
              className={`notif-item ${!n.is_read ? 'unread' : ''}`}
              onClick={() => markRead(n)}
            >
              <div className={`notif-icon ${!n.is_read ? 'unread' : ''}`}>
                <Bell size={18} />
              </div>
              <div className="notif-body">
                <div className="notif-head">
                  <b>{n.title}</b>
                  <small>{formatDateTime(n.created_at)}</small>
                </div>
                <p>{n.message}</p>
              </div>
              {!n.is_read && <span className="unread-dot" />}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export function ProfilePage({ user, onLogout }) {
  const roleLabel =
    user.role === 'ADMIN'
      ? 'Administrator Kota'
      : user.role === 'OFFICER'
        ? 'Petugas Lapangan'
        : 'Warga Pelapor';

  return (
    <div className="profile-layout">
      <section className="panel profile-hero-card">
        <div className="profile-avatar-xl">{user.full_name?.[0] || 'U'}</div>
        <div className="profile-hero-info">
          <span className="role-pill">{roleLabel}</span>
          <h2>{user.full_name}</h2>
          <p>{user.email}</p>
        </div>
        <button type="button" className="btn btn-danger-outline" onClick={onLogout}>
          <LogOut size={16} /> Keluar Akun
        </button>
      </section>

      <section className="panel">
        <h2>Informasi Akun</h2>
        <div className="profile-info-grid">
          <div className="info-tile">
            <User size={18} className="text-primary" />
            <div>
              <small>Nama Lengkap</small>
              <b>{user.full_name}</b>
            </div>
          </div>
          <div className="info-tile">
            <Mail size={18} className="text-primary" />
            <div>
              <small>Alamat Email</small>
              <b>{user.email}</b>
            </div>
          </div>
          <div className="info-tile">
            <Phone size={18} className="text-primary" />
            <div>
              <small>Nomor Telepon</small>
              <b>{user.phone || 'Belum diatur'}</b>
            </div>
          </div>
          <div className="info-tile">
            <MapPin size={18} className="text-primary" />
            <div>
              <small>Wilayah / Alamat</small>
              <b>{user.address || 'Jakarta'}</b>
            </div>
          </div>
          <div className="info-tile">
            <Shield size={18} className="text-primary" />
            <div>
              <small>Hak Akses Peran</small>
              <b>{roleLabel}</b>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
