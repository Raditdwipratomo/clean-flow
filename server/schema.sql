CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS users (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), full_name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
 phone TEXT DEFAULT '', password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'CITIZEN' CHECK(role IN ('CITIZEN','ADMIN','OFFICER')),
 address TEXT DEFAULT '', created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS reports (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), report_no TEXT UNIQUE NOT NULL, citizen_id UUID NOT NULL REFERENCES users(id),
 title TEXT NOT NULL, category TEXT NOT NULL, description TEXT NOT NULL, location TEXT NOT NULL,
 latitude DOUBLE PRECISION, longitude DOUBLE PRECISION, incident_date DATE NOT NULL, impact TEXT NOT NULL DEFAULT 'MEDIUM',
 priority TEXT NOT NULL DEFAULT 'MEDIUM', status TEXT NOT NULL DEFAULT 'SUBMITTED', image_url TEXT,
 admin_note TEXT DEFAULT '', officer_id UUID REFERENCES users(id), created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS status_history (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
 changed_by UUID REFERENCES users(id), previous_status TEXT, new_status TEXT NOT NULL, notes TEXT DEFAULT '', created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS assignments (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
 officer_id UUID NOT NULL REFERENCES users(id), assigned_by UUID REFERENCES users(id), status TEXT NOT NULL DEFAULT 'PENDING',
 notes TEXT DEFAULT '', decline_reason TEXT DEFAULT '', assigned_at TIMESTAMPTZ DEFAULT now(), responded_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS inspections (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
 officer_id UUID NOT NULL REFERENCES users(id), findings TEXT NOT NULL, damage_severity TEXT DEFAULT 'MEDIUM',
 maintenance_required BOOLEAN DEFAULT true, inspected_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS maintenance_updates (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
 officer_id UUID REFERENCES users(id), description TEXT NOT NULL, progress_status TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS notifications (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 report_id UUID REFERENCES reports(id) ON DELETE CASCADE, title TEXT NOT NULL, message TEXT NOT NULL,
 is_read BOOLEAN NOT NULL DEFAULT false, created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS feedback (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(), report_id UUID UNIQUE NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
 citizen_id UUID NOT NULL REFERENCES users(id), rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5), comment TEXT DEFAULT '', created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS reports_citizen_idx ON reports(citizen_id, created_at DESC);
CREATE INDEX IF NOT EXISTS reports_status_idx ON reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS assignments_officer_idx ON assignments(officer_id, status);
