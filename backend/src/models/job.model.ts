import { db } from '../config/database';
import { Job } from '../types';

export class JobModel {
  static async create(
    title: string,
    description: string,
    requirements: string,
    location: string,
    salary_range: string,
    created_by: number
  ): Promise<Job> {
    const result = await new Promise<any>((resolve, reject) => {
      db.run(
        'INSERT INTO jobs (title, description, requirements, location, salary_range, created_by) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, requirements, location, salary_range, created_by],
        function (err) {
          if (err) reject(err);
          else resolve({ lastID: this.lastID });
        }
      );
    });
    return (await this.findById(result.lastID))!;
  }

  static async findById(id: number): Promise<Job | undefined> {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM jobs WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row as Job | undefined);
      });
    });
  }

  static async getAll(): Promise<Job[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM jobs ORDER BY created_at DESC', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows as Job[]);
      });
    });
  }

  static async getActive(): Promise<Job[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM jobs WHERE status = ? ORDER BY created_at DESC', ['active'], (err, rows) => {
        if (err) reject(err);
        else resolve(rows as Job[]);
      });
    });
  }

  static async update(
    id: number,
    title: string,
    description: string,
    requirements: string,
    location: string,
    salary_range: string,
    status: 'active' | 'closed'
  ): Promise<Job | undefined> {
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE jobs SET title = ?, description = ?, requirements = ?, location = ?, salary_range = ?, status = ? WHERE id = ?',
        [title, description, requirements, location, salary_range, status, id],
        (err) => {
          if (err) reject(err);
          else resolve(null);
        }
      );
    });
    return this.findById(id);
  }

  static async delete(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM jobs WHERE id = ?', [id], function (err) {
        if (err) reject(err);
        else resolve(this.changes > 0);
      });
    });
  }
}
