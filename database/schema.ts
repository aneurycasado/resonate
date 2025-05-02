import { tableSchema } from "@nozbe/watermelondb";

export const journalEntrySchema = tableSchema({
  name: "journal_entries",
  columns: [
    { name: "title", type: "string", isOptional: true },
    { name: "audio_path", type: "string" },
    { name: "duration", type: "number" },
    { name: "transcript", type: "string", isOptional: true },
    { name: "created_at", type: "number" },
    { name: "updated_at", type: "number" },
    { name: "is_transcribed", type: "boolean" },
    { name: "is_processed", type: "boolean" },
    { name: "is_synced", type: "boolean" },
  ],
});

export const tagSchema = tableSchema({
  name: "tags",
  columns: [
    { name: "name", type: "string" },
    { name: "created_at", type: "number" },
  ],
});

export const entryTagSchema = tableSchema({
  name: "entry_tags",
  columns: [
    { name: "entry_id", type: "string", isIndexed: true },
    { name: "tag_id", type: "string", isIndexed: true },
  ],
});

export const entryLinkSchema = tableSchema({
  name: "entry_links",
  columns: [
    { name: "source_entry_id", type: "string", isIndexed: true },
    { name: "target_entry_id", type: "string", isIndexed: true },
    { name: "similarity_score", type: "number" },
    { name: "keywords", type: "string", isOptional: true },
    { name: "created_at", type: "number" },
  ],
});

export default [journalEntrySchema, tagSchema, entryTagSchema, entryLinkSchema];
