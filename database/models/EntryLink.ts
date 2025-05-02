import { Model, Relation } from "@nozbe/watermelondb";
import {
  field,
  date,
  readonly,
  relation,
} from "@nozbe/watermelondb/decorators";
import JournalEntry from "./JournalEntry";

export default class EntryLink extends Model {
  static table = "entry_links";

  @field("source_entry_id") sourceEntryId!: string;
  @field("target_entry_id") targetEntryId!: string;
  @field("similarity_score") similarityScore!: number;
  @field("keywords") keywords?: string;
  @readonly @date("created_at") createdAt!: Date;

  @relation("journal_entries", "source_entry_id")
  sourceEntry!: Relation<JournalEntry>;
  @relation("journal_entries", "target_entry_id")
  targetEntry!: Relation<JournalEntry>;
}
