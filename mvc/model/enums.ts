import { pgEnum } from "drizzle-orm/pg-core";

export const languagesEnum = pgEnum("languages", [
  "english",
  "spanish",
  "french",
  "german",
]);

