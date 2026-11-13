import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Droplets,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  User,
} from 'lucide-react';
import { BrandLogo } from '../components/ui.jsx';
import { apiRequest } from '../lib/api.js';

export default function AuthPage({
  initialMode = 'login',
  onBack,
  onSuccess,
}) {
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');

    if (mode === 'register') {
      if (password !== confirm) {
        setErr('Konfirmasi password tidak sama.');
        return;
      }
      if (password.length < 8) {
        setErr('Password minimal 8 karakter.');
        return;
      }
    }

    setBusy(true);
    try {
      const payload =
        mode === 'register'
          ? { name: name.trim(), phone: phone.trim(), email: email.trim(), password }
          : { email: email.trim(), password };
      const res = await apiRequest(`/auth/${mode === 'register' ? 'register' : 'login'}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      onSuccess(res);
    } catch (error) {
      setErr(error.message || 'Autentikasi gagal.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-left">
        <div className="auth-topbar">
          <button type="button" className="btn-back" onClick={onBack}>
            <ArrowLeft size={16} /> Kembali ke Beranda
          </button>
          <BrandLogo size="sm" onClick={onBack} />
        </div>

        <div className="auth-card">
          <div className="auth-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => {
                setMode('login');
                setErr('');
              }}
            >
              Masuk
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => {
                setMode('register');
                setErr('');
              }}
            >
              Daftar Warga
            </button>
          </div>

          <h1>
            {mode === 'login'
              ? 'Air bersih, dimulai dari kepedulian.'
              : 'Buat akun pelapor warga'}
          </h1>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Masuk untuk melaporkan masalah air & sanitasi serta memantau penanganannya.'
              : 'Daftar gratis untuk mengirimkan laporan kerusakan dan melacak progres petugas.'}
          </p>

          {err && <div className="alert-error">{err}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'register' && (
              <>
                <div className="field">
                  <label htmlFor="auth-name">Nama lengkap</label>
                  <div className="input-icon-wrap">
                    <User size={16} />
                    <input
                      id="auth-name"
                      type="text"
                      placeholder="Contoh: Rina Putri"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoComplete="name"
                    />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="auth-phone">Nomor telepon</label>
                  <div className="input-icon-wrap">
                    <Phone size={16} />
                    <input
                      id="auth-phone"
                      type="tel"
                      placeholder="0812xxxxxxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="field">
              <label htmlFor="auth-email">Email</label>
              <div className="input-icon-wrap">
                <Mail size={16} />
                <input
                  id="auth-email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="auth-password">Password</label>
              <div className="input-icon-wrap">
                <Lock size={16} />
                <input
                  id="auth-password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Minimal 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  className="input-trail-btn"
                  onClick={() => setShowPass(!showPass)}
                  aria-label="Tampilkan sandi"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div className="field">
                <label htmlFor="auth-confirm">Konfirmasi password</label>
                <div className="input-icon-wrap">
                  <Lock size={16} />
                  <input
                    id="auth-confirm"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Ulangi password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={busy}>
              {busy ? (
                <>
                  <Loader2 size={18} className="spin" /> Memproses…
                </>
              ) : mode === 'login' ? (
                'Masuk ke CleanFlow'
              ) : (
                'Buat Akun Sekarang'
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-watermark" aria-hidden="true">
          <Droplets size={320} strokeWidth={1.2} />
        </div>
        <div className="auth-art-content">
          <span className="auth-art-pill">KOMUNITAS UNTUK AIR BERSIH</span>
          <h2>Setiap laporan punya tindak lanjut.</h2>
          <p>
            Bersama menjaga infrastruktur air bersih dan fasilitas sanitasi tetap berfungsi baik
            dengan pelacakan status yang transparan dan akuntabel.
          </p>

          <div className="auth-art-highlights">
            <div>
              <CheckCircle2 size={18} />
              <span>Verifikasi transparan oleh administrator kota</span>
            </div>
            <div>
              <CheckCircle2 size={18} />
              <span>Penugasan petugas lapangan berbasis wilayah &amp; beban kerja</span>
            </div>
            <div>
              <CheckCircle2 size={18} />
              <span>Konfirmasi langsung oleh pelapor sebelum laporan ditutup</span>
            </div>
          </div>

          <div className="auth-art-footer">
            <strong>SDG 6</strong>
            <span>Clean Water &amp; Sanitation · Target Pembangunan Berkelanjutan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
