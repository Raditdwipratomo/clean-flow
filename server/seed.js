import bcrypt from 'bcryptjs';
import { query, pool } from './db.js';
const hash = await bcrypt.hash('cleanflow123', 10);
for (const u of [
 ['Rina Putri','rina@cleanflow.id','CITIZEN','081234567890','Jakarta Selatan'],
 ['Admin CleanFlow','admin@cleanflow.id','ADMIN','081111111111','Jakarta'],
 ['Budi Santoso','budi@cleanflow.id','OFFICER','082222222222','Jakarta Selatan'],
 ['Siti Rahma','siti@cleanflow.id','OFFICER','083333333333','Jakarta Selatan']
]) await query('INSERT INTO users(full_name,email,role,phone,address,password_hash) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(email) DO NOTHING',[...u,hash]);
const {rows:[citizen]}=await query("SELECT id FROM users WHERE email='rina@cleanflow.id'");
const samples=[['Pipa bocor di Jl. Melati','Water Pipe Leakage','Pipa distribusi bocor dan menggenangi jalan sejak pagi.','Cilandak, Jakarta Selatan','2026-11-10','HIGH','IN_PROGRESS','HIGH'],['Air keran keruh & berbau','Suspected Water Contamination','Air berubah keruh dan berbau sejak kemarin.','Kebayoran Baru, Jakarta Selatan','2026-11-09','CRITICAL','AWAITING_CONFIRMATION','CRITICAL'],['Toilet umum rusak','Damaged Sanitation Facility','Pintu dan saluran air toilet umum rusak.','Pasar Minggu, Jakarta Selatan','2026-11-12','MEDIUM','SUBMITTED','MEDIUM'],['Saluran drainase tersumbat','Wastewater Drainage Problem','Saluran tersumbat sampah dan air meluap saat hujan.','Tebet, Jakarta Selatan','2026-11-02','LOW','CLOSED','LOW']];
for(let i=0;i<samples.length;i++){const s=samples[i];await query(`INSERT INTO reports(report_no,citizen_id,title,category,description,location,incident_date,impact,status,priority) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT(report_no) DO NOTHING`,[`CF-2026-${String(125-i*7).padStart(6,'0')}`,citizen.id,...s.slice(0,6),s[6],s[7]]);}
console.log('Demo users seeded (password: cleanflow123).'); await pool.end();
