
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertResponseSchema } from "@shared/schema";
import { Resend } from 'resend';

const resend = new Resend("re_V5tAbJm8_Gs1Mn1tC4paE8UsVmUiT1JX4");

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  
  app.post("/api/responses", async (req, res) => {
    try {
      const data = insertResponseSchema.parse(req.body);
      const response = await storage.createResponse(data);
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ error: "Invalid response data" });
    }
  });

  app.get("/api/responses", async (req, res) => {
    const responses = await storage.getResponses();
    res.json(responses);
  });

  app.post("/api/notify-acceptance", async (req, res) => {
    const { name } = req.body;
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'rantimesh@gmail.com',
        subject: 'She said YES! ❤️',
        html: `<p>Great news! <strong>${name}</strong> has accepted your Valentine's proposal! ❤️</p>`
      });
      res.json({ success: true });
    } catch (error) {
      console.error('Resend error:', error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  return httpServer;
}
