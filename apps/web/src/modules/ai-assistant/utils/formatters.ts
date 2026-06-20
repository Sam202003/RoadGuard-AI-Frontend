export function formatDiagnosisTime(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function buildAssistantSummary(probableIssue: string): string {
  return `Based on your description, the most likely issue is: ${probableIssue}. See the detailed assessment below.`;
}
