import type { Media } from "@puredialog/domain"

/**
 * Prompt for LLM-based metadata enrichment.
 * Parses unstructured text (e.g., YouTube comments, descriptions) into structured fields.
 */

export const systemInstruction =
  `You are a metadata enrichment specialist. Extract structured information from unstructured text related to media content.`

export const enrichmentInstructions = (
  baseMetadata: Media.MediaMetadata,
  unstructuredText: string
) => `
# Metadata Enrichment Task

## Current Structured Metadata
Title: ${baseMetadata.title}
Format: ${baseMetadata.format}
Speakers: ${baseMetadata.speakers.map((s) => `${s.name} (${s.role})`).join(", ")}
Duration: ${baseMetadata.durationSec}s

## Unstructured Input
${unstructuredText}

## Instructions
Parse the unstructured text and extract additional information to enhance the metadata.
Focus on:
1. Additional speaker details (affiliations, credentials)
2. Specific topics or keywords not yet captured
3. Relevant links or references
4. Context that improves transcription accuracy

Output valid JSON with the enriched fields.
`
