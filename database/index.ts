// // src/database/index.ts
// import { Database } from "@nozbe/watermelondb";
// import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

// import schema from "./schema";
// import JournalEntry from "./models/JournalEntry";
// import Tag from "./models/Tag";
// import EntryTag from "./models/EntryTag";
// import EntryLink from "./models/EntryLink";

// const adapter = new SQLiteAdapter({
//   schema,
//   jsi: false,
//   onSetUpError: (error) => {
//     console.error("Database setup error:", error);
//   },
// });

// export const database = new Database({
//   adapter,
//   modelClasses: [JournalEntry, Tag, EntryTag, EntryLink],
// });

// export const journalEntryCollection =
//   database.collections.get<JournalEntry>("journal_entries");
// export const tagCollection = database.collections.get<Tag>("tags");
// export const entryTagCollection =
//   database.collections.get<EntryTag>("entry_tags");
// export const entryLinkCollection =
//   database.collections.get<EntryLink>("entry_links");
