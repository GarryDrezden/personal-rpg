import type { NextFunction, Request, Response } from 'express';
import { config } from '../config.js';
import { findValidSession } from '../services/authService.js';

export interface AuthedRequest extends Request {
  userId?: string;
  sessionToken?: string;
}

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.[config.sessionCookieName] as string | undefined;
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const session = await findValidSession(token);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  req.userId = session.userId;
  req.sessionToken = token;
  next();
}

export async function optionalAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const token = req.cookies?.[config.sessionCookieName] as string | undefined;
  if (token) {
    const session = await findValidSession(token);
    if (session) {
      req.userId = session.userId;
      req.sessionToken = token;
    }
  }
  next();
}
