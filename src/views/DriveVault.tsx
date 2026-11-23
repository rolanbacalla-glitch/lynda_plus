import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileSearch,
  FileText,
  FileUp,
  FolderOpen,
  Pencil,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useResearch } from '../contexts/ResearchContext';
import { firebaseProjectId } from '../firebase';
import GoogleSignInButton from '../components/GoogleSignInButton';
import {
  buildStudyBriefMarkdown,
  deleteDriveFile,
  DriveAuthExpiredError,
  exportStudyBriefToDrive,
  formatDriveMimeType,
  listDriveFiles,
  readDriveScriptText,
  renameDriveFile,
  type DriveFileItem,
} from '../services/googleDriveService';
import { auditResearchQuestion, type BiasAuditResult } from '../data/biasAnalyzer';

interface AuditedDriveLine {
  line: string;
  audit: BiasAuditResult;
}

const DriveVault: React.FC = () => {
  const { driveAccessToken, connectGoogleDrive, clearDriveToken } = useAuth();
  const { projects, insights, driveExports, logDriveExport } = useResearch();

  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mimeFilter, setMimeFilter] = useState<'all' | 'docs' | 'folders'>('all');

  // Export brief controls
  const [selectedStudyId, setSelectedStudyId] = useState<string>(projects[0]?.id || '');
  const [exporting, setExporting] = useState(false);

  // Script import + bias audit drawer state
  const [auditedFileName, setAuditedFileName] = useState<string | null>(null);
  const [auditedLines, setAuditedLines] = useState<AuditedDriveLine[]>([]);
  const [auditingFileId, setAuditingFileId] = useState<string | null>(null);

  // Mandatory explicit user confirmation modal for destructive / mutating Drive actions
  const [confirmDeleteFile, setConfirmDeleteFile] = useState<DriveFileItem | null>(null);
  const [confirmRenameFile, setConfirmRenameFile] = useState<DriveFileItem | null>(null);
  const [renameDraft, setRenameDraft] = useState('');
  const [mutating, setMutating] = useState(false);

  // Actionable auth/unauthorized-domain helper + 100% free local file audit/export
  const [isUnauthorisedDomainError, setIsUnauthorisedDomainError] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const localFileInputRef = useRef<HTMLInputElement | null>(null);
  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const firebaseAuthSettingsUrl = `https://console.firebase.google.com/project/${firebaseProjectId}/authentication/settings`;

  const loadFiles = useCallback(async () => {
    if (!driveAccessToken) return;
    setLoading(true);
    setError(null);
    try {
      const results = await listDriveFiles(driveAccessToken, {
        searchQuery,
        mimeFilter,
        pageSize: 25,
      });
      setFiles(results);
    } catch (err) {
      if (err instanceof DriveAuthExpiredError) {
        clearDriveToken();
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : 'Could not load Google Drive files.');
      }
    } finally {
      setLoading(false);
    }
  }, [driveAccessToken, searchQuery, mimeFilter, clearDriveToken]);

  useEffect(() => {
    if (!driveAccessToken) return;
    let cancelled = false;
    listDriveFiles(driveAccessToken, {
      searchQuery,
      mimeFilter,
      pageSize: 25,
    })
      .then((results) => {
        if (!cancelled) {
          setFiles(results);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof DriveAuthExpiredError) {
          clearDriveToken();
          setError(err.message);
        } else {
          setError(err instanceof Error ? err.message : 'Could not load Google Drive files.');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [driveAccessToken, searchQuery, mimeFilter, clearDriveToken]);

  const handleConnect = async () => {
    setError(null);
    setIsUnauthorisedDomainError(false);
    try {
      await connectGoogleDrive();
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Google sign-in popup was cancelled before connecting Drive.';
      if (msg.includes('auth/unauthorized-domain')) {
        setIsUnauthorisedDomainError(true);
        setError(
          `Google Sign-In is blocked for “${currentHostname}” because this domain is not yet listed in your Firebase Authentication Authorised Domains.`
        );
      } else if (msg.includes('auth/popup-closed-by-user')) {
        setError('Google sign-in popup was closed before finishing. Try again whenever you are ready.');
      } else {
        setError(msg);
      }
    }
  };

  const handleCopyHostname = async () => {
    if (!currentHostname) return;
    try {
      await navigator.clipboard.writeText(currentHostname);
      setCopiedDomain(true);
      window.setTimeout(() => setCopiedDomain(false), 2000);
    } catch {
      // Clipboard API unavailable
    }
  };

  const handleLocalScriptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setStatusMessage(null);
    try {
      const text = (await file.text()).trim();
      const candidateLines = text
        .split(/\r?\n/)
        .map((l) => l.replace(/^[\d.\-*•\s]+/, '').trim())
        .filter((l) => l.length >= 12)
        .slice(0, 12);

      const results =
        candidateLines.length > 0
          ? candidateLines.map((line) => ({ line, audit: auditResearchQuestion(line) }))
          : [{ line: text.slice(0, 240) || '(Empty file)', audit: auditResearchQuestion(text) }];

      setAuditedFileName(`${file.name} (Local)`);
      setAuditedLines(results);
      setStatusMessage(`Audited “${file.name}” locally in your browser — zero cloud calls used.`);
    } catch {
      setError('Could not read the selected file. Upload a plain text (.txt) or Markdown (.md) script.');
    } finally {
      e.target.value = '';
    }
  };

  const handleDownloadLocalBrief = () => {
    const study = projects.find((p) => p.id === selectedStudyId) || projects[0];
    if (!study) return;
    const markdown = buildStudyBriefMarkdown(study, insights);
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeFileName = study.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    link.href = url;
    link.download = `${safeFileName || 'lyndaplus'}-compliance-brief.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatusMessage(`Downloaded “${study.name}” brief locally (.md) — no cloud storage or API cost.`);
  };

  const handleExportBrief = async () => {
    if (!driveAccessToken) return;
    const study = projects.find((p) => p.id === selectedStudyId) || projects[0];
    if (!study) return;
    setExporting(true);
    setError(null);
    setStatusMessage(null);
    try {
      const created = await exportStudyBriefToDrive(driveAccessToken, study, insights);
      logDriveExport({
        driveFileId: created.id,
        fileName: created.name,
        mimeType: created.mimeType,
        action: 'export_brief',
        studyName: study.name,
        webViewLink: created.webViewLink || '',
      });
      setStatusMessage(`Exported “${created.name}” to your Google Drive as a Google Doc.`);
      await loadFiles();
    } catch (err) {
      if (err instanceof DriveAuthExpiredError) {
        clearDriveToken();
      }
      setError(err instanceof Error ? err.message : 'Failed to export brief to Google Drive.');
    } finally {
      setExporting(false);
    }
  };

  const handleAuditDriveScript = async (file: DriveFileItem) => {
    if (!driveAccessToken) return;
    setAuditingFileId(file.id);
    setError(null);
    setStatusMessage(null);
    try {
      const text = await readDriveScriptText(driveAccessToken, file);
      const candidateLines = text
        .split(/\r?\n/)
        .map((l) => l.replace(/^[\d.\-*•\s]+/, '').trim())
        .filter((l) => l.length >= 12)
        .slice(0, 12);

      const results =
        candidateLines.length > 0
          ? candidateLines.map((line) => ({ line, audit: auditResearchQuestion(line) }))
          : [{ line: text.slice(0, 240) || '(Empty file)', audit: auditResearchQuestion(text) }];

      setAuditedFileName(file.name);
      setAuditedLines(results);

      logDriveExport({
        driveFileId: file.id,
        fileName: file.name,
        mimeType: file.mimeType,
        action: 'import_script',
        studyName: projects[0]?.name || 'Script Audit',
        webViewLink: file.webViewLink || '',
      });
    } catch (err) {
      if (err instanceof DriveAuthExpiredError) {
        clearDriveToken();
      }
      setError(
        err instanceof Error
          ? err.message
          : 'Could not read text from this file. Select a Google Doc or plain text script.'
      );
    } finally {
      setAuditingFileId(null);
    }
  };

  const executeConfirmedDelete = async () => {
    if (!driveAccessToken || !confirmDeleteFile) return;
    setMutating(true);
    setError(null);
    try {
      await deleteDriveFile(driveAccessToken, confirmDeleteFile.id);
      setStatusMessage(`Deleted “${confirmDeleteFile.name}” from Google Drive.`);
      setConfirmDeleteFile(null);
      await loadFiles();
    } catch (err) {
      if (err instanceof DriveAuthExpiredError) {
        clearDriveToken();
      }
      setError(err instanceof Error ? err.message : 'Failed to delete file from Drive.');
    } finally {
      setMutating(false);
    }
  };

  const executeConfirmedRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveAccessToken || !confirmRenameFile || !renameDraft.trim()) return;
    setMutating(true);
    setError(null);
    try {
      const updated = await renameDriveFile(
        driveAccessToken,
        confirmRenameFile.id,
        renameDraft.trim()
      );
      setStatusMessage(`Renamed file to “${updated.name}” in Google Drive.`);
      setConfirmRenameFile(null);
      setRenameDraft('');
      await loadFiles();
    } catch (err) {
      if (err instanceof DriveAuthExpiredError) {
        clearDriveToken();
      }
      setError(err instanceof Error ? err.message : 'Failed to rename file in Drive.');
    } finally {
      setMutating(false);
    }
  };

  const canAuditFile = (mimeType: string) =>
    mimeType === 'application/vnd.google-apps.document' ||
    mimeType === 'text/plain' ||
    mimeType === 'text/markdown';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--sys-on-surface)]">
            Google Drive Vault
          </h1>
          <p className="text-sm text-[var(--sys-on-surface-secondary)] mt-1">
            Audit discussion guides directly from Google Drive and export compliance-ready synthesis briefs as Google Docs.
          </p>
        </div>

        {driveAccessToken && (
          <button
            type="button"
            onClick={() => void loadFiles()}
            disabled={loading}
            className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 text-xs sys-btn-secondary whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Drive</span>
          </button>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="p-4 rounded-[var(--sys-radius-md)] border border-[var(--sys-outline-variant)] space-y-3 text-sm"
          style={{ backgroundColor: 'var(--sys-danger-bg)', color: 'var(--sys-danger-fg)' }}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>

          {isUnauthorisedDomainError && (
            <div className="pl-7 space-y-2.5 text-xs text-[var(--sys-on-surface)]">
              <p className="leading-relaxed">
                To enable live Google Drive sign-in here (free — no per-call charges), add{' '}
                <code className="px-1.5 py-0.5 rounded bg-[var(--sys-surface-lowest)] border border-[var(--sys-outline-variant)] font-mono">
                  {currentHostname}
                </code>{' '}
                under <strong>Firebase Console → Authentication → Settings → Authorised domains</strong>, or use the free local mode below right now.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => void handleCopyHostname()}
                  className="inline-flex items-center gap-1.5 min-h-[34px] px-3 py-1 text-xs sys-btn-secondary cursor-pointer"
                >
                  {copiedDomain ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDomain ? 'Domain Copied' : 'Copy Domain'}</span>
                </button>
                <a
                  href={firebaseAuthSettingsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 min-h-[34px] px-3 py-1 text-xs sys-btn-secondary no-underline"
                >
                  <span>Open Firebase Auth Settings</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {statusMessage && (
        <div
          role="status"
          className="p-4 rounded-[var(--sys-radius-md)] border border-[var(--sys-outline-variant)] flex items-start gap-3 text-sm"
          style={{ backgroundColor: 'var(--sys-success-bg)', color: 'var(--sys-success-fg)' }}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Hidden local file input for 100% free browser-only script audits */}
      <input
        ref={localFileInputRef}
        type="file"
        accept=".txt,.md,text/plain,text/markdown"
        onChange={(e) => void handleLocalScriptUpload(e)}
        className="hidden"
        aria-label="Upload local script file for bias audit"
      />

      {/* Auth Gate if Drive OAuth token is not present in memory */}
      {!driveAccessToken ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Google Drive OAuth Connection Card */}
            <div className="lg:col-span-7 rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-[var(--sys-on-surface)]">
                  Connect your Google Drive workspace
                </h2>
                <p className="text-sm text-[var(--sys-on-surface-secondary)] leading-relaxed">
                  Sign in with Google to browse discussion guides, run Observer Bias Audits on Google Docs, and export redacted study synthesis briefs straight into your Drive. Access tokens remain strictly in browser memory for your current session.
                </p>
              </div>

              <div className="max-w-xs">
                <GoogleSignInButton onClick={handleConnect} label="Sign in with Google" />
              </div>

              <div className="pt-4 border-t border-[var(--sys-outline-variant)] flex items-start gap-2.5 text-xs text-[var(--sys-on-surface-secondary)] leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-[var(--sys-primary)] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[var(--sys-on-surface)]">Zero API fee:</strong> Google Drive API calls carry no per-request charges and exported briefs are saved directly in your own Google Drive storage quota.
                </span>
              </div>
            </div>

            {/* 100% Free Local Offline Alternative */}
            <div className="lg:col-span-5 rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 md:p-8 space-y-5">
              <div className="space-y-1.5">
                <h2 className="text-base font-bold text-[var(--sys-on-surface)]">
                  Free Local Mode (No Sign-In Needed)
                </h2>
                <p className="text-xs text-[var(--sys-on-surface-secondary)] leading-relaxed">
                  Audit scripts and export study briefs directly in your browser without connecting Google Drive or using any cloud quota.
                </p>
              </div>

              <button
                type="button"
                onClick={() => localFileInputRef.current?.click()}
                className="w-full min-h-[42px] px-4 py-2 text-xs sys-btn-secondary inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileUp className="w-4 h-4" />
                <span>Upload Local Script (.txt / .md) to Audit</span>
              </button>

              <div className="pt-4 border-t border-[var(--sys-outline-variant)] space-y-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor="local-export-study"
                    className="text-xs font-semibold text-[var(--sys-on-surface-secondary)]"
                  >
                    Download Study Brief (.md)
                  </label>
                  <select
                    id="local-export-study"
                    value={selectedStudyId}
                    onChange={(e) => setSelectedStudyId(e.target.value)}
                    className="w-full h-10 px-3 text-sm sys-input"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  disabled={projects.length === 0}
                  onClick={handleDownloadLocalBrief}
                  className="w-full min-h-[42px] px-4 py-2 text-xs sys-btn-primary inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Local Brief (.md)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Local Script Bias Audit Results (when audited without Drive sign-in) */}
          {auditedFileName && (
            <section className="rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 space-y-4">
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-[var(--sys-outline-variant)]">
                <div>
                  <h2 className="text-base font-bold text-[var(--sys-on-surface)]">
                    Observer Bias Audit — {auditedFileName}
                  </h2>
                  <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-0.5">
                    Evaluated {auditedLines.length} line(s) locally in your browser.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAuditedFileName(null);
                    setAuditedLines([]);
                  }}
                  className="w-8 h-8 rounded-[var(--sys-radius-sm)] sys-btn-secondary flex items-center justify-center cursor-pointer"
                  aria-label="Dismiss audit results"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {auditedLines.map((item, idx) => (
                  <div
                    key={`${idx}-${item.line.slice(0, 20)}`}
                    className="p-4 rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-low)] border border-[var(--sys-outline-variant)] space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs tabular-nums">
                      <span
                        className="font-semibold"
                        style={{
                          color:
                            item.audit.status === 'biased'
                              ? 'var(--sys-danger-fg)'
                              : item.audit.status === 'warning'
                              ? 'var(--sys-warning-fg)'
                              : 'var(--sys-success-fg)',
                        }}
                      >
                        {item.audit.category}
                      </span>
                      <span className="font-mono text-[var(--sys-on-surface-tertiary)]">
                        {item.audit.score}/100
                      </span>
                    </div>
                    <p className="text-sm text-[var(--sys-on-surface)]">“{item.line}”</p>
                    {item.audit.suggestion && (
                      <p className="text-xs text-[var(--sys-on-surface-secondary)] pt-1 border-t border-[var(--sys-outline-variant)]">
                        Suggested rewrite:{' '}
                        <span className="font-semibold text-[var(--sys-on-surface)]">
                          “{item.audit.suggestion}”
                        </span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 8 Cols: Live Drive Browser + Audited Script Results */}
          <div className="lg:col-span-8 space-y-6">
            {/* Search & Filter Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[var(--sys-on-surface-tertiary)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void loadFiles();
                  }}
                  placeholder="Search Google Drive files..."
                  aria-label="Search Google Drive files"
                  className="w-full h-10 pl-9 pr-3 text-sm sys-input"
                />
              </div>

              <div
                role="tablist"
                aria-label="Filter Drive file types"
                className="inline-flex items-center gap-1 p-1 rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-container)] border border-[var(--sys-outline-variant)] self-start"
              >
                {(
                  [
                    { id: 'all', label: 'All Files' },
                    { id: 'docs', label: 'Docs & Scripts' },
                    { id: 'folders', label: 'Folders' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={mimeFilter === tab.id}
                    onClick={() => setMimeFilter(tab.id)}
                    className={`min-h-[34px] px-3 py-1 text-xs font-semibold rounded-[var(--sys-radius-sm)] transition-colors whitespace-nowrap cursor-pointer ${
                      mimeFilter === tab.id
                        ? 'bg-[var(--sys-surface-lowest)] text-[var(--sys-on-surface)] shadow-xs'
                        : 'text-[var(--sys-on-surface-secondary)] hover:text-[var(--sys-on-surface)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Drive Files Table */}
            <section className="rounded-[var(--sys-radius-lg)] sys-surface-lowest overflow-hidden">
              <div className="p-5 border-b border-[var(--sys-outline-variant)] flex items-center justify-between">
                <h2 className="text-base font-bold text-[var(--sys-on-surface)]">
                  Your Google Drive Files
                </h2>
                <span className="text-xs font-mono text-[var(--sys-on-surface-tertiary)] tabular-nums">
                  {loading ? 'Loading...' : `${files.length} items`}
                </span>
              </div>

              {loading && files.length === 0 ? (
                <div className="p-10 text-center text-sm text-[var(--sys-on-surface-secondary)]">
                  Fetching files from Google Drive...
                </div>
              ) : files.length === 0 ? (
                <div className="p-10 text-center space-y-2">
                  <FolderOpen className="w-8 h-8 text-[var(--sys-on-surface-tertiary)] mx-auto" />
                  <p className="text-sm font-semibold text-[var(--sys-on-surface)]">
                    No matching Drive files found
                  </p>
                  <p className="text-xs text-[var(--sys-on-surface-secondary)]">
                    Export a LyndaPlus research brief on the right or adjust your filter.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--sys-outline-variant)]">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--sys-surface-low)]/50 transition-colors"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <FileText className="w-4 h-4 text-[var(--sys-primary)] shrink-0 mt-1" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[var(--sys-on-surface)] truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-[var(--sys-on-surface-tertiary)] tabular-nums">
                            {formatDriveMimeType(file.mimeType)}
                            {file.modifiedTime
                              ? ` · Updated ${new Date(file.modifiedTime).toLocaleDateString()}`
                              : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {canAuditFile(file.mimeType) && (
                          <button
                            type="button"
                            disabled={auditingFileId === file.id}
                            onClick={() => void handleAuditDriveScript(file)}
                            className="inline-flex items-center gap-1.5 min-h-[34px] px-3 py-1 text-xs font-semibold sys-btn-secondary whitespace-nowrap cursor-pointer disabled:opacity-50"
                          >
                            <FileSearch className="w-3.5 h-3.5" />
                            <span>{auditingFileId === file.id ? 'Auditing...' : 'Audit Script'}</span>
                          </button>
                        )}
                        {file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Open ${file.name} in Google Drive`}
                            className="w-8 h-8 rounded-[var(--sys-radius-sm)] sys-btn-secondary inline-flex items-center justify-center no-underline"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmRenameFile(file);
                            setRenameDraft(file.name);
                          }}
                          aria-label={`Rename ${file.name}`}
                          className="w-8 h-8 rounded-[var(--sys-radius-sm)] sys-btn-secondary inline-flex items-center justify-center cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteFile(file)}
                          aria-label={`Delete ${file.name}`}
                          className="w-8 h-8 rounded-[var(--sys-radius-sm)] sys-btn-secondary inline-flex items-center justify-center cursor-pointer hover:text-[var(--sys-danger-fg)]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Imported Script Bias Audit Results */}
            {auditedFileName && (
              <section className="rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 space-y-4">
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-[var(--sys-outline-variant)]">
                  <div>
                    <h2 className="text-base font-bold text-[var(--sys-on-surface)]">
                      Observer Bias Audit — {auditedFileName}
                    </h2>
                    <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-0.5">
                      Evaluated {auditedLines.length} line(s) extracted directly from Google Drive.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAuditedFileName(null);
                      setAuditedLines([]);
                    }}
                    className="w-8 h-8 rounded-[var(--sys-radius-sm)] sys-btn-secondary flex items-center justify-center cursor-pointer"
                    aria-label="Dismiss audit results"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {auditedLines.map((item, idx) => (
                    <div
                      key={`${idx}-${item.line.slice(0, 20)}`}
                      className="p-4 rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-low)] border border-[var(--sys-outline-variant)] space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2 text-xs tabular-nums">
                        <span
                          className="font-semibold"
                          style={{
                            color:
                              item.audit.status === 'biased'
                                ? 'var(--sys-danger-fg)'
                                : item.audit.status === 'warning'
                                ? 'var(--sys-warning-fg)'
                                : 'var(--sys-success-fg)',
                          }}
                        >
                          {item.audit.category}
                        </span>
                        <span className="font-mono text-[var(--sys-on-surface-tertiary)]">
                          {item.audit.score}/100
                        </span>
                      </div>
                      <p className="text-sm text-[var(--sys-on-surface)]">“{item.line}”</p>
                      {item.audit.suggestion && (
                        <p className="text-xs text-[var(--sys-on-surface-secondary)] pt-1 border-t border-[var(--sys-outline-variant)]">
                          Suggested rewrite:{' '}
                          <span className="font-semibold text-[var(--sys-on-surface)]">
                            “{item.audit.suggestion}”
                          </span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right 4 Cols: Export Study Brief + Firestore Audit Log */}
          <div className="lg:col-span-4 space-y-6">
            <section className="rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 space-y-4">
              <div>
                <h2 className="text-base font-bold text-[var(--sys-on-surface)]">
                  Export Compliance Brief
                </h2>
                <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-1 leading-relaxed">
                  Create a formatted Google Doc containing your study’s audited prompts, neutrality score, and redacted evidence clips.
                </p>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="drive-export-study"
                  className="text-xs font-semibold text-[var(--sys-on-surface-secondary)]"
                >
                  Select Study
                </label>
                <select
                  id="drive-export-study"
                  value={selectedStudyId}
                  onChange={(e) => setSelectedStudyId(e.target.value)}
                  className="w-full h-10 px-3 text-sm sys-input"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                disabled={exporting || projects.length === 0}
                onClick={() => void handleExportBrief()}
                className="w-full min-h-[42px] px-4 py-2 text-sm sys-btn-primary inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>{exporting ? 'Exporting to Drive...' : 'Export Brief as Google Doc'}</span>
              </button>
            </section>

            {/* Synced Drive Activity Log (Firestore-backed) */}
            <section className="rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 space-y-4">
              <h2 className="text-base font-bold text-[var(--sys-on-surface)]">
                Recent Drive Activity
              </h2>

              {driveExports.length === 0 ? (
                <p className="text-xs text-[var(--sys-on-surface-tertiary)]">
                  Exported briefs and audited Drive scripts are logged to your Firestore audit trail here.
                </p>
              ) : (
                <ul className="divide-y divide-[var(--sys-outline-variant)]">
                  {driveExports.slice(0, 6).map((item) => (
                    <li key={item.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-[var(--sys-on-surface)] truncate">
                          {item.fileName}
                        </p>
                        {item.webViewLink && (
                          <a
                            href={item.webViewLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-[var(--sys-primary)] hover:underline shrink-0"
                          >
                            Open
                          </a>
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--sys-on-surface-tertiary)]">
                        {item.action === 'export_brief' ? 'Exported Brief' : 'Audited Script'} ·{' '}
                        {item.studyName}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      )}

      {/* Mandatory Confirmation Dialog: Rename Google Drive File */}
      {confirmRenameFile && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="rename-drive-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => !mutating && setConfirmRenameFile(null)}
            aria-hidden="true"
          />
          <form
            onSubmit={executeConfirmedRename}
            className="relative z-10 w-full max-w-md rounded-[var(--sys-radius-lg)] bg-[var(--sys-surface-lowest)] border border-[var(--sys-outline)] p-6 space-y-4 shadow-xl"
          >
            <h2 id="rename-drive-title" className="text-lg font-bold text-[var(--sys-on-surface)]">
              Rename file in Google Drive?
            </h2>
            <p className="text-xs text-[var(--sys-on-surface-secondary)] leading-relaxed">
              This will update the filename of <strong className="text-[var(--sys-on-surface)]">“{confirmRenameFile.name}”</strong> directly in your Google Drive account.
            </p>
            <input
              type="text"
              required
              value={renameDraft}
              onChange={(e) => setRenameDraft(e.target.value)}
              className="w-full h-10 px-3 text-sm sys-input"
              aria-label="New filename"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={mutating}
                onClick={() => setConfirmRenameFile(null)}
                className="px-4 py-2 text-xs sys-btn-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutating || !renameDraft.trim()}
                className="px-4 py-2 text-xs sys-btn-primary cursor-pointer disabled:opacity-50"
              >
                {mutating ? 'Updating...' : 'Confirm Rename'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mandatory Confirmation Dialog: Delete Google Drive File */}
      {confirmDeleteFile && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-drive-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => !mutating && setConfirmDeleteFile(null)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-md rounded-[var(--sys-radius-lg)] bg-[var(--sys-surface-lowest)] border border-[var(--sys-outline)] p-6 space-y-4 shadow-xl">
            <h2 id="delete-drive-title" className="text-lg font-bold text-[var(--sys-on-surface)]">
              Delete file from Google Drive?
            </h2>
            <p className="text-sm text-[var(--sys-on-surface-secondary)] leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-[var(--sys-on-surface)]">“{confirmDeleteFile.name}”</strong>{' '}
              from your Google Drive? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={mutating}
                onClick={() => setConfirmDeleteFile(null)}
                className="px-4 py-2 text-xs sys-btn-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={mutating}
                onClick={() => void executeConfirmedDelete()}
                className="px-4 py-2 text-xs font-semibold rounded-[var(--sys-radius-sm)] cursor-pointer disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--sys-danger-fg)',
                  color: '#ffffff',
                }}
              >
                {mutating ? 'Deleting...' : 'Delete from Drive'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriveVault;
