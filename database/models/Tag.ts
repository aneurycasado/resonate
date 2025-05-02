import { Model } from "@nozbe/watermelondb";
import { field, date, readonly } from "@nozbe/watermelondb/decorators";

export default class Tag extends Model {
  static table = "tags";

  @field("name") name!: string;
  @readonly @date("created_at") createdAt!: Date;
}
