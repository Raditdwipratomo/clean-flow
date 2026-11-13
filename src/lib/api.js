const API_BASE = '/api';

export async function apiRequest(path, { token, ...opts } = {}) {
  const isFormData = opts.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...opts.headers,
  };

  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : await res.text();

  if (!res.ok) {
    const fallback =
      typeof data === 'string' && data.trim().length > 0 && data.length < 140
        ? data
        : `Permintaan gagal (${res.status})`;
    throw new Error(data?.error || fallback);
  }
  return data;
}

export async function downloadCsvExport(token) {
  const res = await fetch(`${API_BASE}/admin/reports/export`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    throw new Error(`Gagal mengekspor CSV (${res.status})`);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cleanflow-reports-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
