import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sessionTable, userTable } from "./lib/db/schema/user";

const user = createInsertSchema(userTable);
const session = createInsertSchema(sessionTable);

export type User = z.infer<typeof user>;
export type Session = z.infer<typeof session>;

interface ExternalUrls {
  spotify: string;
}

interface Followers {
  href: any;
  total: number;
}

interface ExplicitContent {
  filter_enabled: boolean;
  filter_locked: boolean;
}

interface Images {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyUser {
  display_name: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
  followers: Followers;
  images: Images[];
  country: string;
  product: string;
  explicit_content: ExplicitContent;
  email: string;
}
