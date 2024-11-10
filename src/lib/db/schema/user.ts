import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("user", {
  id: text("id").notNull().primaryKey().unique(),
  name: text("name"),
  email: text("email").notNull(),
  createdAt: integer("created_at").notNull().default(Date.now()),
  updatedAt: integer("updated_at").notNull().default(Date.now()),
});

export const sessionTable = sqliteTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at", {
    mode: "timestamp",
  }).notNull(),
});
