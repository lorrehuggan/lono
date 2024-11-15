import type { Config } from "drizzle-kit";

export default {
	schema: "./src/lib/db/schema/*",
	out: "./src/lib/db/migrations",
	dialect: "turso",
	migrations: {
		prefix: "timestamp",
	},
	dbCredentials: {
		url: process.env.DATABASE_URL ?? "",
		authToken: process.env.DATABASE_AUTH_TOKEN ?? "",
	},
} satisfies Config;
