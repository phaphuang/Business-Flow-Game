import { type Student, type InsertStudent } from "@shared/schema";

export interface IStorage {
  getStudentByStudentId(studentId: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
}

export class MemStorage implements IStorage {
  async getStudentByStudentId(studentId: string): Promise<Student | undefined> {
    return undefined;
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    throw new Error("Use database storage instead");
  }
}

export const storage = new MemStorage();
