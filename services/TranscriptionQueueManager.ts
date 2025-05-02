// src/services/TranscriptionQueueManager.ts
import { database, journalEntryCollection } from "../database";
import TranscriptionService from "./TranscriptionService";
import { QueueItem } from "../types";

class TranscriptionQueueManager {
  private queue: QueueItem[] = [];
  private isProcessing: boolean = false;
  private maxAttempts: number = 3;

  addToQueue(entryId: string): void {
    // Check if already in queue
    if (!this.queue.some((item) => item.entryId === entryId)) {
      this.queue.push({ entryId, attempts: 0 });

      // Start processing if not already running
      if (!this.isProcessing) {
        this.processQueue();
      }
    }
  }

  private async processQueue(): Promise<void> {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const item = this.queue.shift();

    if (!item) {
      this.isProcessing = false;
      return;
    }

    try {
      // Increment attempt counter
      item.attempts += 1;

      // Get the entry from the database
      const entry = await journalEntryCollection.find(item.entryId);

      if (!entry) {
        console.warn(`Entry ${item.entryId} not found`);
        this.processQueue();
        return;
      }

      // Skip if already transcribed
      if (entry.isTranscribed) {
        this.processQueue();
        return;
      }

      // Transcribe the audio
      const result = await TranscriptionService.transcribeAudio(
        entry.audioPath
      );

      if (result.success) {
        // Update the entry with the transcription
        await database.action(async () => {
          await entry.update((record) => {
            record.transcript = result.text;
            record.isTranscribed = true;
          });
        });
      } else if (item.attempts < this.maxAttempts) {
        // Put back in queue for retry with exponential backoff
        setTimeout(() => {
          this.queue.push(item);
          if (!this.isProcessing) {
            this.processQueue();
          }
        }, Math.pow(2, item.attempts) * 1000); // Exponential backoff
      } else {
        console.error(
          `Failed to transcribe entry ${item.entryId} after ${this.maxAttempts} attempts`
        );
      }
    } catch (error) {
      console.error("Error processing transcription queue item:", error);

      // Retry if under max attempts
      if (item.attempts < this.maxAttempts) {
        setTimeout(() => {
          this.queue.push(item);
          if (!this.isProcessing) {
            this.processQueue();
          }
        }, Math.pow(2, item.attempts) * 1000);
      }
    }

    // Process next item
    this.processQueue();
  }
}

export default new TranscriptionQueueManager();
