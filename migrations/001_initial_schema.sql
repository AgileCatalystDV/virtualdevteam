-- Subscription Tracker — Initial Schema
-- Cloud SQL PostgreSQL
-- @Floyd — Sprint 5

-- Users (SSO via Firebase)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid VARCHAR(128) UNIQUE NOT NULL,
  email VARCHAR(255),
  display_name VARCHAR(255),
  provider VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories (seed data)
CREATE TABLE categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(20) DEFAULT '📦',
  color VARCHAR(7) DEFAULT '#6B7280'
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name VARCHAR(100) NOT NULL,
  price DECIMAL(12, 2) NOT NULL CHECK (price >= 0 AND price <= 999999.99),
  currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
  billing_cycle VARCHAR(20) NOT NULL CHECK (billing_cycle IN ('monthly', 'quarterly', 'yearly')),
  category_id VARCHAR(50) NOT NULL REFERENCES categories(id),
  next_billing_date DATE,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_category_id ON subscriptions(category_id);

-- Seed categories (zelfde als mock)
INSERT INTO categories (id, name, icon, color) VALUES
  ('cat-streaming', 'Streaming', '🎬', '#E50914'),
  ('cat-software', 'Software', '💻', '#3B82F6'),
  ('cat-fitness', 'Fitness', '💪', '#10B981'),
  ('cat-media', 'Nieuws & Media', '📰', '#F59E0B'),
  ('cat-cloud', 'Cloud Storage', '☁️', '#8B5CF6'),
  ('cat-insurance', 'Verzekeringen', '🛡️', '#0EA5E9'),
  ('cat-fixed', 'Vaste lasten', '🏠', '#84CC16'),
  ('cat-vehicle', 'Voertuig', '🚗', '#6366F1'),
  ('cat-health', 'Gezondheid', '🏥', '#EC4899'),
  ('cat-finance', 'Bank & Financiën', '🏦', '#14B8A6'),
  ('cat-other', 'Overig', '📦', '#6B7280');
