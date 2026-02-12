
import { pgTable, text, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users);

export const responses = pgTable("responses", {
  id: serial("id").primaryKey(),
  recipientName: text("recipient_name").notNull(),
  accepted: boolean("accepted").default(false),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertResponseSchema = createInsertSchema(responses);

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Response = typeof responses.$inferSelect;
export type InsertResponse = z.infer<typeof insertResponseSchema>;
