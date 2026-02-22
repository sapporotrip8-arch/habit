import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.activities.list.path, async (req, res) => {
    const items = await storage.getActivities();
    res.json(items);
  });

  app.post(api.activities.create.path, async (req, res) => {
    try {
      const input = api.activities.create.input.parse(req.body);
      const activity = await storage.createActivity(input);
      res.status(201).json(activity);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.activities.delete.path, async (req, res) => {
    await storage.deleteActivity(Number(req.params.id));
    res.status(204).send();
  });

  app.get(api.logs.list.path, async (req, res) => {
    const items = await storage.getLogs();
    res.json(items);
  });

  app.post(api.logs.create.path, async (req, res) => {
    try {
      const input = api.logs.create.input.parse(req.body);
      const activity = await storage.getActivity(input.activityId);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      
      const log = await storage.createLog(activity.id, activity.points);
      res.status(201).json(log);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.summary.get.path, async (req, res) => {
    const summary = await storage.getSummary();
    res.json(summary);
  });

  app.get(api.settings.get.path, async (req, res) => {
    const value = await storage.getSetting(req.params.key);
    if (value === undefined) {
      return res.status(404).json({ message: "Setting not found" });
    }
    res.json({ value });
  });

  app.post(api.settings.update.path, async (req, res) => {
    const { value } = api.settings.update.input.parse(req.body);
    await storage.updateSetting(req.params.key, value);
    res.json({ value });
  });

  // Seed default activities
  async function seedDatabase() {
    try {
      const existing = await storage.getActivities();
      if (existing.length === 0) {
        const defaultActivities = [
          { name: "ジム", points: 10 },
          { name: "英語学習", points: 10 },
          { name: "早起き", points: 5 },
          { name: "コラーゲン", points: 5 },
          { name: "SNS", points: -5 },
          { name: "お菓子", points: -5 },
          { name: "寝坊", points: -10 },
        ];
        for (const act of defaultActivities) {
          await storage.createActivity(act);
        }
      }
    } catch (err) {
      console.error("Error seeding database:", err);
    }
  }

  seedDatabase();

  return httpServer;
}