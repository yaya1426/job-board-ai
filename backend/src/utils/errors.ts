export class AppError extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (err: any, req: any, res: any, next: any) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.error('Unexpected error:', err);
  return res.status(500).json({ error: 'Internal server error' });
};
