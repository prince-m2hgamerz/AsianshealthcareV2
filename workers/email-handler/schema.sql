-- Full schema for medsolution-emails D1 database

CREATE TABLE IF NOT EXISTS emails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message_id TEXT UNIQUE,
  from_name TEXT,
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  subject TEXT,
  text_body TEXT,
  html_body TEXT,
  is_read INTEGER DEFAULT 0,
  parent_id INTEGER,
  status TEXT NOT NULL DEFAULT 'inbox',
  starred INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (parent_id) REFERENCES emails(id)
);

CREATE TABLE IF NOT EXISTS labels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS email_labels (
  email_id INTEGER NOT NULL,
  label_id INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (email_id, label_id),
  FOREIGN KEY (email_id) REFERENCES emails(id) ON DELETE CASCADE,
  FOREIGN KEY (label_id) REFERENCES labels(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS attachments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email_id INTEGER NOT NULL,
  filename TEXT NOT NULL,
  content_type TEXT,
  size INTEGER,
  url TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (email_id) REFERENCES emails(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_emails_created_at ON emails(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_emails_parent_id ON emails(parent_id);
CREATE INDEX IF NOT EXISTS idx_emails_status ON emails(status);
CREATE INDEX IF NOT EXISTS idx_emails_starred ON emails(starred);
CREATE INDEX IF NOT EXISTS idx_attachments_email_id ON attachments(email_id);
CREATE INDEX IF NOT EXISTS idx_email_labels_label_id ON email_labels(label_id);

-- FTS5 for full-text search
CREATE VIRTUAL TABLE IF NOT EXISTS emails_fts USING fts5(
  subject,
  text_body,
  from_name,
  from_address,
  to_address,
  content='emails',
  content_rowid='id',
  tokenize='porter unicode61'
);

CREATE TRIGGER IF NOT EXISTS emails_ai AFTER INSERT ON emails BEGIN
  INSERT INTO emails_fts(rowid, subject, text_body, from_name, from_address, to_address)
  VALUES (new.id, new.subject, new.text_body, new.from_name, new.from_address, new.to_address);
END;

CREATE TRIGGER IF NOT EXISTS emails_ad AFTER DELETE ON emails BEGIN
  INSERT INTO emails_fts(emails_fts, rowid, subject, text_body, from_name, from_address, to_address)
  VALUES ('delete', old.id, old.subject, old.text_body, old.from_name, old.from_address, old.to_address);
END;

CREATE TRIGGER IF NOT EXISTS emails_au AFTER UPDATE ON emails BEGIN
  INSERT INTO emails_fts(emails_fts, rowid, subject, text_body, from_name, from_address, to_address)
  VALUES ('delete', old.id, old.subject, old.text_body, old.from_name, old.from_address, old.to_address);
  INSERT INTO emails_fts(rowid, subject, text_body, from_name, from_address, to_address)
  VALUES (new.id, new.subject, new.text_body, new.from_name, new.from_address, new.to_address);
END;

-- Default labels
INSERT OR IGNORE INTO labels (id, name, color) VALUES (1, 'Important', '#ef4444');
INSERT OR IGNORE INTO labels (id, name, color) VALUES (2, 'Work', '#3b82f6');
INSERT OR IGNORE INTO labels (id, name, color) VALUES (3, 'Personal', '#10b981');
INSERT OR IGNORE INTO labels (id, name, color) VALUES (4, 'Inquiry', '#f59e0b');
INSERT OR IGNORE INTO labels (id, name, color) VALUES (5, 'Follow-up', '#8b5cf6');
