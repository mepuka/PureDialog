import type { JobId, JobStatus, TranscriptId } from "@puredialog/domain"

/**
 * A centralized module for generating GCS object keys (indices).
 * This ensures a consistent and maintainable prefix structure.
 */
export const Index = {
  /**
   * Generates the full GCS path for a specific TranscriptionJob document.
   * @param status The status of the job, used for prefixing.
   * @param jobId The ID of the job.
   * @returns The full GCS object key, e.g., `jobs/Queued/job_123.json`
   */
  job: (status: JobStatus, jobId: JobId): string => `jobs/${status}/${jobId}.json`,

  /**
   * Generates the full GCS path for an idempotency record.
   * @param hashedKey The hashed idempotency key.
   * @returns The full GCS object key, e.g., `idempotency/abc123def456.json`
   */
  idempotency: (hashedKey: string): string => `idempotency/${hashedKey}.json`,

  /**
   * Generates the full GCS path for a completed Transcript document.
   * @param transcriptId The ID of the transcript.
   * @returns The full GCS object key, e.g., `transcripts/trn_123.json`
   */
  transcript: (transcriptId: TranscriptId): string => `transcripts/${transcriptId}.json`,

  /**
   * Generates the prefix for listing all jobs of a specific status.
   * @param status The status to list jobs for.
   * @returns The GCS prefix, e.g., `jobs/Queued/`
   */
  jobs: (status: JobStatus): string => `jobs/${status}/`,

  /**
   * Returns the prefix for listing all idempotency records.
   */
  idempotencyPrefix: (): string => `idempotency/`,

  /**
   * Returns the prefix for listing all transcript documents.
   */
  transcriptsPrefix: (): string => `transcripts/`
}
