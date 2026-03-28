import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const initDB = async () => {
  if (db) return db;
  
  try {
    db = await SQLite.openDatabaseAsync('nilababy_chat.db');

    // Enable foreign keys
    await db.execAsync('PRAGMA foreign_keys = ON;');

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        lastMessageAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        conversationId TEXT NOT NULL,
        sender TEXT NOT NULL, 
        content TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        isPending INTEGER DEFAULT 0,
        FOREIGN KEY (conversationId) REFERENCES conversations (id) ON DELETE CASCADE
      );
    `);
    
    // Create indexes for faster queries
    await db.execAsync('CREATE INDEX IF NOT EXISTS idx_messages_conversationId ON messages (conversationId);');
    await db.execAsync('CREATE INDEX IF NOT EXISTS idx_conversations_lastMessageAt ON conversations (lastMessageAt DESC);');

    console.log('SQLite database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing SQLite db:', error);
    throw error;
  }
};

export const getDB = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error('Database not initialized. Call initDB first.');
  }
  return db;
};
