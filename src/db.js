// src/db.js
import * as SQLite from 'expo-sqlite';

let db = null;

async function openDB() {
  if (db) return db;

  // tenta a API async (novo expo-sqlite) e faz fallback para a API antiga
  if (SQLite.openDatabaseAsync) {
    db = await SQLite.openDatabaseAsync('quiz.db');
  } else if (SQLite.openDatabase) {
    db = SQLite.openDatabase('quiz.db');
  } else {
    throw new Error('expo-sqlite não oferece openDatabase/openDatabaseAsync');
  }

  // --- helpers async quando não existirem (normaliza API) ---
  if (!db.execAsync) {
    db.execAsync = (sql) =>
      new Promise((resolve, reject) => {
        db.transaction(
          (tx) => {
            tx.executeSql(
              sql,
              [],
              (_, res) => resolve(res),
              (_, err) => reject(err)
            );
          },
          (err) => reject(err)
        );
      });
  }

  if (!db.runAsync) {
    db.runAsync = (sql, params = []) =>
      new Promise((resolve, reject) => {
        db.transaction(
          (tx) => {
            tx.executeSql(
              sql,
              params,
              (_, res) => resolve(res),
              (_, err) => reject(err)
            );
          },
          (err) => reject(err)
        );
      });
  }

  if (!db.getAllAsync) {
    db.getAllAsync = (sql, params = []) =>
      new Promise((resolve, reject) => {
        db.transaction(
          (tx) => {
            tx.executeSql(
              sql,
              params,
              (_, res) => resolve(res.rows && res.rows._array ? res.rows._array : []),
              (_, err) => reject(err)
            );
          },
          (err) => reject(err)
        );
      });
  }

  if (!db.getFirstAsync) {
    db.getFirstAsync = (sql, params = []) =>
      new Promise((resolve, reject) => {
        db.transaction(
          (tx) => {
            tx.executeSql(
              sql,
              params,
              (_, res) => {
                const arr = res.rows && res.rows._array ? res.rows._array : [];
                resolve(arr[0] || null);
              },
              (_, err) => reject(err)
            );
          },
          (err) => reject(err)
        );
      });
  }

  return db;
}

// Inicializa o DB e cria tabelas
export async function initDB() {
  const database = await openDB();

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS themes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
  `);

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      theme_id INTEGER NOT NULL,
      FOREIGN KEY(theme_id) REFERENCES themes(id)
    );
  `);

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS alternatives (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_id INTEGER NOT NULL,
      text TEXT NOT NULL,
      is_correct INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY(question_id) REFERENCES questions(id)
    );
  `);

  return database;
}

// Inserir tema
export async function insertTheme(name) {
  if (!name) throw new Error('Nome do tema é obrigatório');
  const database = await openDB();
  try {
    const res = await database.runAsync('INSERT INTO themes (name) VALUES (?);', [name]);
    // tenta recuperar insertId (sua API pode denominar diferente)
    return res.insertId ?? res.insertId === 0 ? res.insertId : res;
  } catch (err) {
    // Propaga o erro para a UI tratar (ex.: UNIQUE constraint)
    throw err;
  }
}

export async function insertQuestion(themeId, questionText, alternatives, correctIndex) {
  if (!db) await initDB();

  const result = await db.runAsync(
    'INSERT INTO questions (text, theme_id) VALUES (?, ?)',
    [questionText, themeId]
  );
  const questionId = result.lastInsertRowId;

  for (let i = 0; i < alternatives.length; i++) {
    await db.runAsync(
      'INSERT INTO alternatives (question_id, text, is_correct) VALUES (?, ?, ?)',
      [questionId, alternatives[i], i === correctIndex ? 1 : 0]
    );
  }

  return questionId;
}


// Buscar temas com contagem de perguntas
export async function getThemesWithCount() {
  const database = await openDB();
  const rows = await database.getAllAsync(`
    SELECT t.id, t.name, 
      (SELECT COUNT(*) FROM questions q WHERE q.theme_id = t.id) AS qcount
    FROM themes t
    ORDER BY t.name;
  `);
  return rows;
}

// Busca só temas simples (id, name)
export async function getThemes() {
  const database = await openDB();
  return await database.getAllAsync('SELECT id, name FROM themes ORDER BY name;');
}


// Retorna X perguntas aleatórias de um tema
export async function getRandomQuestions(themeId, limit) {
  const db = await openDB();
  const questions = await db.getAllAsync(
    'SELECT id, text FROM questions WHERE theme_id = ? ORDER BY RANDOM() LIMIT ?',
    [themeId, limit]
  );

  // Carrega alternativas para cada pergunta
  for (const q of questions) {
    const alts = await db.getAllAsync(
      'SELECT id, text, is_correct FROM alternatives WHERE question_id = ? ORDER BY id',
      [q.id]
    );
    q.alts = alts;
  }

  return questions;
}

// Remove um tema pelo id
export async function deleteTheme(themeId) {
  const db = await openDB();

  try {
    // 1. Remove alternativas das perguntas do tema
    await db.runAsync(
      `DELETE FROM alternatives WHERE question_id IN (SELECT id FROM questions WHERE theme_id = ?)`,
      [themeId]
    );

    // 2. Remove perguntas do tema
    await db.runAsync(
      `DELETE FROM questions WHERE theme_id = ?`,
      [themeId]
    );

    // 3. Remove o tema
    await db.runAsync(
      `DELETE FROM themes WHERE id = ?`,
      [themeId]
    );

    return true;
  } catch (err) {
    console.error('Erro ao remover tema:', err);
    throw err;
  }
}

// Remove pergunta pelo id (também remove alternativas)
export async function deleteQuestion(questionId) {
  const db = await openDB();
  try {
    // Remove alternativas da pergunta
    await db.runAsync(
      'DELETE FROM alternatives WHERE question_id = ?',
      [questionId]
    );

    // Remove a própria pergunta
    await db.runAsync(
      'DELETE FROM questions WHERE id = ?',
      [questionId]
    );

    return true;
  } catch (err) {
    console.error('Erro ao remover pergunta:', err);
    throw err;
  }
}

// Buscar perguntas de um tema
export async function getQuestionsByTheme(themeId) {
  const db = await openDB();
  const rows = await db.getAllAsync(
    'SELECT id, text FROM questions WHERE theme_id = ? ORDER BY id',
    [themeId]
  );
  return rows;
}

export default {
  initDB,
  insertTheme,
  getThemes,
  getThemesWithCount,
};
