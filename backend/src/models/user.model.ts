import { db, runAsync, getAsync, allAsync } from '../config/database';
import { User } from '../types';

export class UserModel {
  static async create(email: string, password_hash: string, full_name: string, role: 'applicant' | 'hr'): Promise<User> {
    const result = await new Promise<any>((resolve, reject) => {
      db.run(
        'INSERT INTO users (email, password_hash, full_name, role) VALUES (?, ?, ?, ?)',
        [email, password_hash, full_name, role],
        function (err) {
          if (err) reject(err);
          else resolve({ lastID: this.lastID });
        }
      );
    });
    return (await this.findById(result.lastID))!;
  }

  static async findById(id: number): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row as User | undefined);
      });
    });
  }

  static async findByEmail(email: string): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row as User | undefined);
      });
    });
  }

  static async getAll(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM users ORDER BY created_at DESC', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows as User[]);
      });
    });
  }
}
