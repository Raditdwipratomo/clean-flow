export const STATUS_LABELS = {
  SUBMITTED: 'Menunggu Verifikasi',
  VERIFIED: 'Terverifikasi',
  NEEDS_INFORMATION: 'Butuh Informasi',
  REJECTED: 'Ditolak',
  DUPLICATE: 'Duplikat',
  ASSIGNED: 'Ditugaskan',
  IN_PROGRESS: 'Sedang Diproses',
  RESOLUTION_SUBMITTED: 'Menunggu Validasi',
  AWAITING_CONFIRMATION: 'Menunggu Konfirmasi',
  REINSPECTION_REQUESTED: 'Perlu Inspeksi Ulang',
  CLOSED: 'Selesai',
};

export const PRIORITY_LABELS = {
  LOW: 'Rendah',
  MEDIUM: 'Sedang',
  HIGH: 'Tinggi',
  CRITICAL: 'Kritis',
};

export const CATEGORIES = [
  {
    value: 'Water Pipe Leakage',
    label: 'Pipa Bocor',
    shortDesc: 'Kebocoran pipa distribusi utama, sambungan retak, atau rembesan di jalan.',
    tag: 'Infrastruktur Pipa',
  },
  {
    value: 'Water Supply Disruption',
    label: 'Aliran Terganggu',
    shortDesc: 'Pasokan air bersih terhenti, tekanan sangat lemah, atau giliran tidak mengalir.',
    tag: 'Distribusi Air',
  },
  {
    value: 'Suspected Water Contamination',
    label: 'Air Tercemar',
    shortDesc: 'Air keran keruh, berbau menyengat, berubah warna, atau terindikasi limbah.',
    tag: 'Kualitas Air',
  },
  {
    value: 'Damaged Sanitation Facility',
    label: 'Sanitasi Rusak',
    shortDesc: 'Kerusakan toilet umum, tangki septik, atau fasilitas MCK komunal warga.',
    tag: 'Fasilitas Umum',
  },
  {
    value: 'Wastewater Drainage Problem',
    label: 'Drainase Tersumbat',
    shortDesc: 'Saluran air limbah mampet, meluap saat hujan, atau menimbulkan genangan.',
    tag: 'Sistem Drainase',
  },
  {
    value: 'Other Water and Sanitation Issues',
    label: 'Lainnya',
    shortDesc: 'Kendala air bersih dan sanitasi lingkungan lainnya yang butuh perhatian petugas.',
    tag: 'Umum',
  },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.value, c]));

export const WORKFLOW_STEPS = [
  { key: 'SUBMITTED', label: 'Terkirim' },
  { key: 'VERIFIED', label: 'Terverifikasi' },
  { key: 'ASSIGNED', label: 'Ditugaskan' },
  { key: 'IN_PROGRESS', label: 'Diperbaiki' },
  { key: 'AWAITING_CONFIRMATION', label: 'Konfirmasi' },
  { key: 'CLOSED', label: 'Selesai' },
];

export function getStepIndex(status) {
  switch (status) {
    case 'SUBMITTED':
    case 'NEEDS_INFORMATION':
      return 0;
    case 'VERIFIED':
      return 1;
    case 'ASSIGNED':
    case 'REINSPECTION_REQUESTED':
      return 2;
    case 'IN_PROGRESS':
    case 'RESOLUTION_SUBMITTED':
      return 3;
    case 'AWAITING_CONFIRMATION':
      return 4;
    case 'CLOSED':
      return 5;
    default:
      return -1;
  }
}

export const DEMO_ACCOUNTS = [
  {
    role: 'CITIZEN',
    label: 'Warga',
    name: 'Rina Putri',
    email: 'rina@cleanflow.id',
    desc: 'Buat laporan & lacak progres',
  },
  {
    role: 'ADMIN',
    label: 'Admin',
    name: 'Admin CleanFlow',
    email: 'admin@cleanflow.id',
    desc: 'Verifikasi, tugaskan & analitik',
  },
  {
    role: 'OFFICER',
    label: 'Petugas',
    name: 'Budi Santoso',
    email: 'budi@cleanflow.id',
    desc: 'Inspeksi lapangan & perbaikan',
  },
];

export function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Baru saja';
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return formatDate(dateStr);
}
