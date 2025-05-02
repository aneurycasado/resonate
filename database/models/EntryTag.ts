import { Model, Relation } from "@nozbe/watermelondb";
import { field, relation } from "@nozbe/watermelondb/decorators";
import JournalEntry from "./JournalEntry";
import Tag from "./Tag";

export default class EntryTag extends Model {
  static table = "entry_tags";

  @field("entry_id") entryId!: string;
  @field("tag_id") tagId!: string;

  @relation("journal_entries", "entry_id") entry!: Relation<JournalEntry>;
  @relation("tags", "tag_id") tag!: Relation<Tag>;
}
