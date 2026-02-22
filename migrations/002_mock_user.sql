-- Mock user voor lokale dev (AUTH_MODE=mock)
-- @Floyd — Mock login flow
-- Run: docker compose exec -i db psql -U postgres -d subscription_tracker < migrations/002_mock_user.sql
-- Of: bij verse docker setup wordt dit automatisch uitgevoerd (migrations folder gemount)

INSERT INTO users (id, firebase_uid, email, display_name, provider)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'mock-dev-user',
  'dev@example.com',
  'Dev User',
  'mock'
)
ON CONFLICT (firebase_uid) DO NOTHING;

-- Bestaande subscriptions (user_id=null) toewijzen aan mock user voor dev
UPDATE subscriptions SET user_id = '11111111-1111-1111-1111-111111111111' WHERE user_id IS NULL;
