// src/database/repositories/JournalEntryRepository.ts
import { Q } from "@nozbe/watermelondb";
import * as FileSystem from "expo-file-system";
import { database, journalEntryCollection } from "../index";
import JournalEntry from "../models/JournalEntry";
import RecordingService from "../../services/RecordingService";
import TranscriptionQueueManager from "../../services/TranscriptionQueueManager";
import { RecordingResult } from "../../types";

interface CreateEntryParams {
  tempAudioUri: string;
  duration: number;
  title?: string;
}

class JournalEntryRepository {
  async createEntry({
    tempAudioUri,
    duration,
    title,
  }: CreateEntryParams): Promise<JournalEntry> {
    // Move audio file to permanent storage
    const audioPath = await RecordingService.moveRecordingToStorage(
      tempAudioUri
    );

    // Create entry in database
    let entry!: JournalEntry;

    await database.action(async () => {
      entry = await journalEntryCollection.create((record) => {
        record.audioPath = audioPath;
        record.duration = duration;
        record.title = title || "";
        record.isTranscribed = false;
        record.isProcessed = false;
        record.isSynced = false;
      });
    });

    // Add to transcription queue
    TranscriptionQueueManager.addToQueue(entry.id);

    return entry;
  }

  async getAllEntries() {
    return await journalEntryCollection
      .query(Q.sortBy("created_at", Q.desc))
      .fetch();
  }

  async getEntryById(id: string) {
    return await journalEntryCollection.find(id);
  }

  async updateTranscript(id: string, transcript: string): Promise<void> {
    const entry = await journalEntryCollection.find(id);

    await database.action(async () => {
      await entry.update((record) => {
        record.transcript = transcript;
      });
    });
  }

  async deleteEntry(id: string): Promise<void> {
    const entry = await journalEntryCollection.find(id);

    // Delete the audio file
    try {
      await FileSystem.deleteAsync(entry.audioPath);
    } catch (error) {
      console.error("Error deleting audio file:", error);
    }

    // Delete from database
    await database.action(async () => {
      await entry.destroyPermanently();
    });
  }
}

export default new JournalEntryRepository();
