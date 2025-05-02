import { Model } from "@nozbe/watermelondb";
import {
  field,
  date,
  readonly,
  children,
} from "@nozbe/watermelondb/decorators";

export default class JournalEntry extends Model {
  static table = "journal_entries";

  @field("title") title!: string;
  @field("audio_path") audioPath!: string;
  @field("duration") duration!: number;
  @field("transcript") transcript?: string;
  @readonly @date("created_at") createdAt!: Date;
  @readonly @date("updated_at") updatedAt!: Date;
  @field("is_transcribed") isTranscribed!: boolean;
  @field("is_processed") isProcessed!: boolean;
  @field("is_synced") isSynced!: boolean;

  @children("entry_tags") entryTags: any;
  @children("entry_links") outgoingLinks: any;
}
