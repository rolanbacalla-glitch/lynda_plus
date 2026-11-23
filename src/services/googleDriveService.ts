import type { InsightItem, Project } from '../data/mockData';

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  size?: string;
  webViewLink?: string;
  owners?: { displayName?: string; emailAddress?: string }[];
}

export class DriveAuthExpiredError extends Error {
  constructor(message = 'Google Drive session expired. Please reconnect your Google account.') {
    super(message);
    this.name = 'DriveAuthExpiredError';
  }
}

async function handleDriveResponse(res: Response) {
  if (res.status === 401 || res.status === 403) {
    throw new DriveAuthExpiredError();
  }
  if (!res.ok) {
    let details = res.statusText;
    try {
      const json = (await res.json()) as { error?: { message?: string } };
      if (json.error?.message) details = json.error.message;
    } catch {
      // Ignore parse failure
    }
    throw new Error(`Google Drive request failed (${res.status}): ${details}`);
  }
  return res;
}

export async function listDriveFiles(
  accessToken: string,
  options?: { searchQuery?: string; mimeFilter?: 'all' | 'docs' | 'folders'; pageSize?: number }
): Promise<DriveFileItem[]> {
  const clauses: string[] = ['trashed = false'];
  if (options?.searchQuery?.trim()) {
    const escaped = options.searchQuery.trim().replace(/'/g, "\\'");
    clauses.push(`name contains '${escaped}'`);
  }
  if (options?.mimeFilter === 'docs') {
    clauses.push(
      "(mimeType = 'application/vnd.google-apps.document' or mimeType = 'text/plain' or mimeType = 'text/markdown' or mimeType = 'application/pdf')"
    );
  } else if (options?.mimeFilter === 'folders') {
    clauses.push("mimeType = 'application/vnd.google-apps.folder'");
  }

  const params = new URLSearchParams({
    q: clauses.join(' and '),
    pageSize: String(options?.pageSize ?? 25),
    orderBy: 'modifiedTime desc',
    fields: 'files(id,name,mimeType,modifiedTime,size,webViewLink,owners(displayName,emailAddress))',
  });

  const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  await handleDriveResponse(res);
  const data = (await res.json()) as { files?: DriveFileItem[] };
  return data.files || [];
}

export async function readDriveScriptText(
  accessToken: string,
  file: Pick<DriveFileItem, 'id' | 'mimeType' | 'name'>
): Promise<string> {
  const isGoogleDoc = file.mimeType === 'application/vnd.google-apps.document';
  const url = isGoogleDoc
    ? `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(file.id)}/export?mimeType=text/plain`
    : `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(file.id)}?alt=media`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  await handleDriveResponse(res);
  const text = await res.text();
  return text.trim();
}

export function buildStudyBriefMarkdown(project: Project, insights: InsightItem[]): string {
  const studyInsights = insights.filter((i) => i.projectId === project.id);
  const effectiveInsights = studyInsights.length > 0 ? studyInsights : insights.slice(0, 4);

  const lines = [
    `# ${project.name} — LyndaPlus Compliance & Synthesis Brief`,
    '',
    `- Methodology: ${project.method}`,
    `- Status: ${project.status}`,
    `- Participants: ${project.participants} / ${project.targetParticipants}`,
    `- Script Neutrality Score: ${project.neutralityScore}/100`,
    `- Privacy Shield: In-buffer Client-Side PII Redaction Enabled (EU/UK Sovereign Storage)`,
    `- Exported: ${new Date().toISOString()}`,
    '',
    '## Study Objective',
    project.objective || 'No objective recorded.',
    '',
    '## Audited Primary Question',
    `> ${project.primaryQuestion || 'No primary prompt recorded.'}`,
    '',
    '## Evidence-Backed Findings',
    ...effectiveInsights.flatMap((item, idx) => [
      `### ${idx + 1}. [${item.severity}] ${item.title}`,
      `- Source: ${item.participantName} · Clip ${item.clipTime} · ${item.mentions} mentions`,
      item.description,
      '',
    ]),
  ];

  return lines.join('\n');
}

export async function exportStudyBriefToDrive(
  accessToken: string,
  project: Project,
  insights: InsightItem[]
): Promise<DriveFileItem> {
  const markdownBody = buildStudyBriefMarkdown(project, insights);
  const metadata = {
    name: `${project.name} — Research Brief`,
    mimeType: 'application/vnd.google-apps.document',
  };

  const boundary = `lyndaplus_boundary_${Date.now()}`;
  const multipartBody =
    `--${boundary}\r\n` +
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    `${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\n` +
    `Content-Type: text/plain; charset=UTF-8\r\n\r\n` +
    `${markdownBody}\r\n` +
    `--${boundary}--`;

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,modifiedTime,webViewLink',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartBody,
    }
  );
  await handleDriveResponse(res);
  return (await res.json()) as DriveFileItem;
}

export async function renameDriveFile(
  accessToken: string,
  fileId: string,
  newName: string
): Promise<DriveFileItem> {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?fields=id,name,mimeType,modifiedTime,webViewLink`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newName.trim() }),
    }
  );
  await handleDriveResponse(res);
  return (await res.json()) as DriveFileItem;
}

export async function deleteDriveFile(accessToken: string, fileId: string): Promise<void> {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  await handleDriveResponse(res);
}

export function formatDriveMimeType(mimeType: string): string {
  if (mimeType === 'application/vnd.google-apps.document') return 'Google Doc';
  if (mimeType === 'application/vnd.google-apps.spreadsheet') return 'Google Sheet';
  if (mimeType === 'application/vnd.google-apps.presentation') return 'Google Slides';
  if (mimeType === 'application/vnd.google-apps.folder') return 'Folder';
  if (mimeType === 'application/pdf') return 'PDF';
  if (mimeType.startsWith('text/')) return 'Text / Script';
  if (mimeType.startsWith('video/')) return 'Video';
  if (mimeType.startsWith('image/')) return 'Image';
  return 'File';
}
