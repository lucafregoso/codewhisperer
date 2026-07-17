/**
 * Matching podcast ↔ rassegna (contratto docs/INGESTION.md): l'audio di
 * un'edizione è `input/podcast/<basename>.mp3`, stesso basename del
 * markdown. Il nome del file .md resta libero da contratto: il matching
 * non presuppone date nel filename.
 */
export function podcastFileFor(
  mdFile: string,
  podcastDirFiles: string[],
): string | undefined {
  const candidate = `${mdFile.replace(/\.md$/, "")}.mp3`;
  return podcastDirFiles.includes(candidate) ? candidate : undefined;
}
