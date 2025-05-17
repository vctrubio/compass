import { pgTable, serial, text } from "drizzle-orm/pg-core";

//later be migrated to userAuthTable from auth system
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  role: text("role").notNull(),
});