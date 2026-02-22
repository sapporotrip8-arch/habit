import { db } from "./db";
import {
  activities,
  logs,
  settings,
  type Activity,
  type InsertActivity,
  type Log,
  type PointsSummary,
  type Setting
} from "@shared/schema";
import { eq, gte, sql } from "drizzle-orm";

export interface IStorage {
  getActivities(): Promise<Activity[]>;
  getActivity(id: number): Promise<Activity | undefined>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  deleteActivity(id: number): Promise<void>;
  
  getLogs(): Promise<Log[]>;
  createLog(activityId: number, points: number): Promise<Log>;
  
  getSummary(): Promise<PointsSummary>;

  getSetting(key: string): Promise<string | undefined>;
  updateSetting(key: string, value: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getActivities(): Promise<Activity[]> {
    return await db.select().from(activities);
  }

  async getActivity(id: number): Promise<Activity | undefined> {
    const [activity] = await db.select().from(activities).where(eq(activities.id, id));
    return activity;
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db.insert(activities).values(insertActivity).returning();
    return activity;
  }

  async deleteActivity(id: number): Promise<void> {
    await db.delete(activities).where(eq(activities.id, id));
  }

  async getLogs(): Promise<Log[]> {
    return await db.select().from(logs);
  }

  async createLog(activityId: number, points: number): Promise<Log> {
    const [log] = await db.insert(logs).values({ activityId, points }).returning();
    return log;
  }

  async getSummary(): Promise<PointsSummary> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayResult] = await db
      .select({ sum: sql<number>`COALESCE(SUM(points), 0)` })
      .from(logs)
      .where(gte(logs.createdAt, today));

    const [totalResult] = await db
      .select({ sum: sql<number>`COALESCE(SUM(points), 0)` })
      .from(logs);

    return {
      todayPoints: Number(todayResult?.sum || 0),
      totalPoints: Number(totalResult?.sum || 0),
    };
  }

  async getSetting(key: string): Promise<string | undefined> {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting?.value;
  }

  async updateSetting(key: string, value: string): Promise<void> {
    await db.insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({ target: settings.key, set: { value } });
  }
}

export const storage = new DatabaseStorage();