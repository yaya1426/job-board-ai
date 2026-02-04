import { db } from '../config/database';
import { Application } from '../types';

export class ApplicationModel {
  static async create(
    job_id: number,
    applicant_id: number | null,
    full_name: string,
    email: string,
    phone: string,
    resume_path: string
  ): Promise<Application> {
    const result = await new Promise<any>((resolve, reject) => {
      db.run(
        'INSERT INTO applications (job_id, applicant_id, full_name, email, phone, resume_path) VALUES (?, ?, ?, ?, ?, ?)',
        [job_id, applicant_id, full_name, email, phone, resume_path],
        function (err) {
          if (err) reject(err);
          else resolve({ lastID: this.lastID });
        }
      );
    });
    return (await this.findById(result.lastID))!;
  }

  static async findById(id: number): Promise<Application | undefined> {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM applications WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row as Application | undefined);
      });
    });
  }

  static async getAll(): Promise<Application[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM applications ORDER BY created_at DESC', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows as Application[]);
      });
    });
  }

  static async getByApplicant(applicant_id: number): Promise<Application[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM applications WHERE applicant_id = ? ORDER BY created_at DESC', [applicant_id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows as Application[]);
      });
    });
  }

  static async getByJob(job_id: number): Promise<Application[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM applications WHERE job_id = ? ORDER BY created_at DESC', [job_id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows as Application[]);
      });
    });
  }

  static async updateOpenAIFileId(id: number, openai_file_id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run('UPDATE applications SET openai_file_id = ? WHERE id = ?', [openai_file_id, id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  static async updateStatus(id: number, status: Application['status']): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run('UPDATE applications SET status = ? WHERE id = ?', [status, id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  static async updateEvaluation(
    id: number,
    ai_score: number,
    ai_feedback: string,
    status: Application['status']
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE applications SET ai_score = ?, ai_feedback = ?, status = ?, evaluated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [ai_score, ai_feedback, status, id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  static async getWithJobDetails(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          a.*,
          j.title as job_title,
          j.location as job_location
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        ORDER BY a.created_at DESC
      `, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}
