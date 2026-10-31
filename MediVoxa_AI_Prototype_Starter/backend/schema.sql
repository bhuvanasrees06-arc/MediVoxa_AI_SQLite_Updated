CREATE TABLE IF NOT EXISTS health_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  record_type TEXT NOT NULL CHECK (record_type IN ('blood_pressure', 'blood_sugar', 'weight')),
  value_text TEXT NOT NULL CHECK (length(value_text) <= 100),
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_health_records_created_at
ON health_records(created_at DESC);

CREATE TABLE IF NOT EXISTS reminders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  medicine_name TEXT NOT NULL CHECK (length(medicine_name) <= 160),
  instructions TEXT NOT NULL DEFAULT '',
  reminder_time TEXT NOT NULL,
  start_date TEXT NOT NULL DEFAULT (date('now')),
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reminders_time
ON reminders(active, reminder_time);
