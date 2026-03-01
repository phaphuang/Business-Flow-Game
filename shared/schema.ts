import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  studentId: varchar("student_id", { length: 20 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const gameSessions = pgTable("game_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => students.id),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  totalScore: integer("total_score").default(0),
  timeSpentMinutes: integer("time_spent_minutes").default(0),
  isCompleted: boolean("is_completed").default(false),
});

export const challengeResponses = pgTable("challenge_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => gameSessions.id),
  challengeId: varchar("challenge_id").notNull(),
  sector: text("sector").notNull(),
  userAnswer: jsonb("user_answer").notNull(),
  correctAnswer: jsonb("correct_answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  pointsEarned: integer("points_earned").notNull(),
  timeSpentSeconds: integer("time_spent_seconds").notNull(),
  answeredAt: timestamp("answered_at").defaultNow().notNull(),
});

export const insertStudentSchema = createInsertSchema(students, {
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  studentId: z.string().min(5, "Student ID must be at least 5 characters").max(20),
}).pick({
  fullName: true,
  studentId: true,
});

export const insertGameSessionSchema = createInsertSchema(gameSessions).pick({
  studentId: true,
});

export const insertChallengeResponseSchema = createInsertSchema(challengeResponses).pick({
  sessionId: true,
  challengeId: true,
  sector: true,
  userAnswer: true,
  correctAnswer: true,
  isCorrect: true,
  pointsEarned: true,
  timeSpentSeconds: true,
});

export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type GameSession = typeof gameSessions.$inferSelect;
export type InsertGameSession = z.infer<typeof insertGameSessionSchema>;
export type ChallengeResponse = typeof challengeResponses.$inferSelect;
export type InsertChallengeResponse = z.infer<typeof insertChallengeResponseSchema>;
