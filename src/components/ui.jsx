import React, { useState } from 'react';
import {
  Droplets,
  Wrench,
  Waves,
  AlertTriangle,
  ShieldAlert,
  Building2,
  MapPin,
  Check,
  XCircle,
  Copy,
  Image as ImageIcon,
  ExternalLink,
  CheckCircle2,
  Info,
} from 'lucide-react';
import {
  CATEGORY_MAP,
  PRIORITY_LABELS,
  STATUS_LABELS,
  WORKFLOW_STEPS,
  getStepIndex,
} from '../lib/constants.js';

export function BrandLogo({ onClick, size = 'md', light = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`brand ${size === 'sm' ? 'brand-sm' : ''} ${light ? 'brand-light' : ''}`}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <span className="brand-mark">
        <Droplets size={size === 'sm' ? 18 : 22} strokeWidth={2.3} />
      </span>
      <span className="brand-text">CleanFlow</span>
    </button>
  );
}

export function CategoryIcon({ category, size = 18 }) {
  switch (category) {
    case 'Water Pipe Leakage':
      return <Wrench size={size} />;
    case 'Water Supply Disruption':
      return <Droplets size={size} />;
    case 'Suspected Water Contamination':
      return <AlertTriangle size={size} />;
    case 'Damaged Sanitation Facility':
      return <Building2 size={size} />;
    case 'Wastewater Drainage Problem':
      return <Waves size={size} />;
    default:
      return <ShieldAlert size={size} />;
  }
}

export function getCategoryLabel(category) {
  return CATEGORY_MAP[category]?.label || category || 'Lainnya';
}

export function StatusBadge({ status }) {
  return (
    <span className={`badge badge-status ${status || ''}`}>
      <i className="badge-dot" />
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  return (
    <span className={`badge badge-priority pri-${priority || 'MEDIUM'}`}>
      {PRIORITY_LABELS[priority] || priority}
    </span>
  );
}

export function WorkflowStepper({ status }) {
  const isRejected = status === 'REJECTED';
  const isDuplicate = status === 'DUPLICATE';
  const isNeedsInfo = status === 'NEEDS_INFORMATION';
  const activeIdx = getStepIndex(status);

  if (isRejected || isDuplicate) {
    return (
      <div className="stepper-card stepper-alert">
        <div className="stepper-alert-icon">
          {isRejected ? <XCircle size={22} /> : <Copy size={22} />}
        </div>
        <div>
          <strong>
            {isRejected ? 'Laporan Ditolak oleh Verifikator' : 'Laporan Ditandai sebagai Duplikat'}
          </strong>
          <p>
            {isRejected
              ? 'Laporan ini dinilai tidak valid atau berada di luar cakupan layanan. Periksa catatan admin di bawah.'
              : 'Laporan serupa di lokasi yang sama sudah terdaftar dan sedang ditangani pada laporan utama.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="stepper-card">
      {isNeedsInfo && (
        <div className="stepper-banner-warn">
          <Info size={16} />
          <span>Admin meminta informasi tambahan sebelum laporan dapat dilanjutkan ke verifikasi.</span>
        </div>
      )}
      <div className="stepper-track">
        {WORKFLOW_STEPS.map((step, idx) => {
          const isCompleted = idx < activeIdx || status === 'CLOSED';
          const isCurrent = idx === activeIdx && status !== 'CLOSED';
          return (
            <div
              key={step.key}
              className={`stepper-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
            >
              {idx > 0 && (
                <div className={`stepper-line ${idx <= activeIdx || status === 'CLOSED' ? 'filled' : ''}`} />
              )}
              <div className="stepper-node">
                {isCompleted ? <Check size={14} strokeWidth={3} /> : <span>{idx + 1}</span>}
              </div>
              <span className="stepper-label">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MapPreview({
  location,
  latitude,
  longitude,
  interactive = false,
  onPick,
  compact = false,
}) {
  // Derive deterministic relative pin position from coordinates or location string hash
  const getInitialPos = () => {
    if (latitude && longitude) {
      const x = Math.min(84, Math.max(16, 50 + ((Number(longitude) - 106.82) * 320)));
      const y = Math.min(80, Math.max(20, 50 - ((Number(latitude) + 6.24) * 320)));
      return { x, y };
    }
    let hash = 0;
    const str = location || 'Jakarta Selatan';
    for (let i = 0; i < str.length; i += 1) {
      hash = (hash * 31 + str.charCodeAt(i)) % 1000;
    }
    return {
      x: 24 + (hash % 52),
      y: 26 + ((hash >> 3) % 44),
    };
  };

  const pos = getInitialPos();

  const handleClick = (e) => {
    if (!interactive || !onPick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const rx = Math.max(0.08, Math.min(0.92, (e.clientX - rect.left) / rect.width));
    const ry = Math.max(0.1, Math.min(0.9, (e.clientY - rect.top) / rect.height));
    const lat = (-6.18 - ry * 0.14).toFixed(6);
    const lng = (106.76 + rx * 0.14).toFixed(6);
    onPick({ latitude: lat, longitude: lng });
  };

  const mapsQuery =
    latitude && longitude
      ? `${latitude},${longitude}`
      : encodeURIComponent(location || 'Jakarta Selatan');

  return (
    <div className={`map-card ${compact ? 'map-compact' : ''}`}>
      <div
        className={`map-canvas ${interactive ? 'interactive' : ''}`}
        onClick={handleClick}
        title={interactive ? 'Klik pada peta untuk memindahkan pin lokasi' : undefined}
      >
        <svg viewBox="0 0 400 180" preserveAspectRatio="none" className="map-svg" aria-hidden="true">
          <rect width="400" height="180" fill="#E8F1F5" />
          {/* Park patches */}
          <rect x="195" y="14" width="52" height="28" rx="8" fill="#CDE8D9" />
          <rect x="42" y="116" width="60" height="36" rx="10" fill="#D4EBDD" />
          {/* River / canal */}
          <path
            d="M-10,126 C85,108 165,142 260,122 C330,108 370,104 415,96 L415,114 C368,122 325,127 256,141 C160,160 80,127 -10,145 Z"
            fill="#AAD7F4"
          />
          {/* Roads */}
          <g stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round">
            <line x1="0" y1="54" x2="400" y2="54" />
            <line x1="0" y1="98" x2="400" y2="88" />
            <line x1="88" y1="0" x2="88" y2="180" />
            <line x1="184" y1="0" x2="184" y2="180" />
            <line x1="296" y1="0" x2="274" y2="180" />
          </g>
          <g stroke="#F8FBFD" strokeWidth="2.5">
            <line x1="135" y1="0" x2="135" y2="94" />
            <line x1="342" y1="0" x2="342" y2="180" />
          </g>
        </svg>

        <div className="map-pin" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
          <span className="map-pin-pulse" />
          <span className="map-pin-core" />
        </div>

        {interactive && (
          <span className="map-hint">Klik peta untuk sesuaikan titik pin</span>
        )}
      </div>

      <div className="map-footer">
        <div className="map-address">
          <MapPin size={15} className="text-primary" />
          <span>
            {location || 'Lokasi belum ditentukan'}
            {latitude && longitude ? ` · (${Number(latitude).toFixed(4)}, ${Number(longitude).toFixed(4)})` : ''}
          </span>
        </div>
        {!interactive && location && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
            target="_blank"
            rel="noreferrer"
            className="map-ext-link"
          >
            Buka Peta <ExternalLink size={13} />
          </a>
        )}
      </div>
    </div>
  );
}

export function EvidenceImage({ src, alt = 'Foto bukti laporan', category, height = 190 }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="evidence-fallback" style={{ minHeight: height }}>
        <div className="evidence-fallback-icon">
          {category ? <CategoryIcon category={category} size={24} /> : <ImageIcon size={24} />}
        </div>
        <b>{src ? 'Pratinjau foto tidak tersedia' : 'Dokumentasi Laporan'}</b>
        <small>
          {src
            ? 'Foto tersimpan di arsip penyimpanan sementara.'
            : 'Laporan contoh tanpa lampiran foto lokal.'}
        </small>
      </div>
    );
  }

  return (
    <div className="evidence-frame" style={{ height }}>
      <img src={src} alt={alt} onError={() => setFailed(true)} loading="lazy" />
    </div>
  );
}

export function DonutChart({ stats }) {
  const segments = [
    { label: 'Selesai', value: stats?.closed || 0, color: '#2FAE7B' },
    { label: 'Diproses', value: stats?.in_progress || 0, color: '#0F6BBA' },
    { label: 'Verifikasi', value: (stats?.submitted || 0) + (stats?.verified || 0), color: '#D99B26' },
    { label: 'Konfirmasi', value: stats?.awaiting_confirmation || 0, color: '#744FD4' },
    { label: 'Ditolak', value: stats?.rejected || 0, color: '#C73B3B' },
  ];

  const total = segments.reduce((acc, s) => acc + s.value, 0);
  const radius = 56;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <div className="donut-wrap">
      <div className="donut-svg-box">
        <svg viewBox="0 0 150 150" className="donut-svg">
          <circle
            cx="75"
            cy="75"
            r={radius}
            fill="none"
            stroke="#EEF3F8"
            strokeWidth="18"
          />
          {total > 0 &&
            segments.map((seg) => {
              if (!seg.value) return null;
              const dash = (seg.value / total) * circumference;
              const currentOffset = offset;
              offset += dash;
              return (
                <circle
                  key={seg.label}
                  cx="75"
                  cy="75"
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="18"
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={-currentOffset}
                  transform="rotate(-90 75 75)"
                  strokeLinecap="butt"
                />
              );
            })}
        </svg>
        <div className="donut-center">
          <strong>{total}</strong>
          <span>laporan</span>
        </div>
      </div>

      <div className="donut-legend">
        {segments.map((seg) => {
          const pct = total > 0 ? Math.round((seg.value / total) * 100) : 0;
          return (
            <div key={seg.label} className="donut-legend-item">
              <span className="legend-dot" style={{ background: seg.color }} />
              <span>
                {seg.label} <b>{pct}%</b>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon || <Waves size={28} />}</div>
      <b>{title}</b>
      {subtitle && <p>{subtitle}</p>}
      {action}
    </div>
  );
}

export function ToastStack({ toasts, onDismiss }) {
  if (!toasts?.length) return null;
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type || 'info'}`}>
          <CheckCircle2 size={18} />
          <span>{t.message}</span>
          <button type="button" onClick={() => onDismiss(t.id)} aria-label="Tutup">
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
