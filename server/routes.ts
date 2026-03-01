import type { Express } from "express";
import type { Server } from "http";
import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import { students, gameSessions, challengeResponses, insertStudentSchema, insertChallengeResponseSchema } from "@shared/schema";

const cache = new Map<string, { data: any; expiry: number }>();

function getCached(key: string) {
  const entry = cache.get(key);
  if (entry && Date.now() < entry.expiry) return entry.data;
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any, ttlMs = 30000) {
  cache.set(key, { data, expiry: Date.now() + ttlMs });
}

function invalidateCache(prefix: string) {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/students/register", async (req, res) => {
    try {
      const data = insertStudentSchema.parse(req.body);
      const existing = await db.select().from(students).where(eq(students.studentId, data.studentId));
      if (existing.length > 0) {
        return res.json(existing[0]);
      }
      const [student] = await db.insert(students).values(data).returning();
      res.json(student);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/students/:studentId", async (req, res) => {
    try {
      const cacheKey = `student:${req.params.studentId}`;
      const cached = getCached(cacheKey);
      if (cached) return res.json(cached);

      const [student] = await db.select().from(students).where(eq(students.studentId, req.params.studentId));
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      setCache(cacheKey, student, 60000);
      res.json(student);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/sessions/start", async (req, res) => {
    try {
      const { studentId } = req.body;
      const [session] = await db.insert(gameSessions).values({ studentId }).returning();
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/sessions/:sessionId", async (req, res) => {
    try {
      const cacheKey = `session:${req.params.sessionId}`;
      const cached = getCached(cacheKey);
      if (cached) return res.json(cached);

      const [session] = await db.select().from(gameSessions).where(eq(gameSessions.id, req.params.sessionId));
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      setCache(cacheKey, session, 10000);
      res.json(session);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/sessions/:sessionId", async (req, res) => {
    try {
      const { totalScore, timeSpentMinutes, isCompleted, completedAt } = req.body;
      const updateData: any = {};
      if (totalScore !== undefined) updateData.totalScore = totalScore;
      if (timeSpentMinutes !== undefined) updateData.timeSpentMinutes = timeSpentMinutes;
      if (isCompleted !== undefined) updateData.isCompleted = isCompleted;
      if (completedAt !== undefined) updateData.completedAt = new Date(completedAt);

      const [session] = await db.update(gameSessions)
        .set(updateData)
        .where(eq(gameSessions.id, req.params.sessionId))
        .returning();

      invalidateCache(`session:${req.params.sessionId}`);
      invalidateCache("leaderboard");
      res.json(session);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/responses", async (req, res) => {
    try {
      const data = insertChallengeResponseSchema.parse(req.body);
      const [response] = await db.insert(challengeResponses).values(data).returning();
      invalidateCache(`responses:${data.sessionId}`);
      res.json(response);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/sessions/:sessionId/responses", async (req, res) => {
    try {
      const cacheKey = `responses:${req.params.sessionId}`;
      const cached = getCached(cacheKey);
      if (cached) return res.json(cached);

      const responses = await db.select()
        .from(challengeResponses)
        .where(eq(challengeResponses.sessionId, req.params.sessionId))
        .orderBy(desc(challengeResponses.answeredAt));

      setCache(cacheKey, responses, 15000);
      res.json(responses);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/students/:studentId/sessions", async (req, res) => {
    try {
      const sessions = await db.select()
        .from(gameSessions)
        .where(eq(gameSessions.studentId, req.params.studentId))
        .orderBy(desc(gameSessions.startedAt));
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/leaderboard", async (req, res) => {
    try {
      const cacheKey = "leaderboard";
      const cached = getCached(cacheKey);
      if (cached) return res.json(cached);

      const results = await db
        .select({
          sessionId: gameSessions.id,
          studentDbId: students.id,
          fullName: students.fullName,
          studentNumber: students.studentId,
          totalScore: gameSessions.totalScore,
          timeSpentMinutes: gameSessions.timeSpentMinutes,
          completedAt: gameSessions.completedAt,
        })
        .from(gameSessions)
        .innerJoin(students, eq(gameSessions.studentId, students.id))
        .where(eq(gameSessions.isCompleted, true))
        .orderBy(desc(gameSessions.totalScore))
        .limit(10);

      setCache(cacheKey, results, 30000);
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  return httpServer;
}
