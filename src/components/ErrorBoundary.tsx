import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import type { FirestoreErrorInfo } from '../firebase';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
  firestoreInfo?: FirestoreErrorInfo;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    let firestoreInfo: FirestoreErrorInfo | undefined;
    try {
      const parsed = JSON.parse(error.message) as FirestoreErrorInfo;
      if (parsed && typeof parsed.operationType === 'string' && 'authInfo' in parsed) {
        firestoreInfo = parsed;
      }
    } catch {
      // Standard non-JSON runtime error
    }

    return {
      hasError: true,
      errorMessage: firestoreInfo?.error || error.message || 'An unexpected error occurred.',
      firestoreInfo,
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('Application ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: '', firestoreInfo: undefined });
    window.location.href = '/';
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const isQuotaError = this.state.errorMessage.includes('Quota exceeded');

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--sys-surface-canvas)] text-[var(--sys-on-surface)]">
        <div className="w-full max-w-lg rounded-[var(--sys-radius-lg)] sys-surface-lowest p-8 space-y-5">
          <div className="flex items-start gap-3.5">
            <AlertTriangle
              className="w-6 h-6 shrink-0 mt-0.5"
              style={{ color: 'var(--sys-danger-fg)' }}
            />
            <div className="space-y-1.5">
              <h1 className="text-lg font-bold text-[var(--sys-on-surface)]">
                {isQuotaError
                  ? 'Daily Firestore quota reached'
                  : 'Workspace request could not be completed'}
              </h1>
              <p className="text-sm text-[var(--sys-on-surface-secondary)] leading-relaxed">
                {isQuotaError
                  ? 'Your Firestore free-tier daily quota has been reached and resets tomorrow. You can review quota details in the Firebase console.'
                  : this.state.errorMessage}
              </p>
            </div>
          </div>

          {this.state.firestoreInfo && (
            <div className="p-4 rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-low)] border border-[var(--sys-outline-variant)] text-xs font-mono text-[var(--sys-on-surface-secondary)] space-y-1">
              <p>Operation: {this.state.firestoreInfo.operationType}</p>
              <p>Path: {this.state.firestoreInfo.path || 'unknown'}</p>
              <p>
                Signed-in user: {this.state.firestoreInfo.authInfo.email || 'Not authenticated'}
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 text-sm sys-btn-primary cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Return to Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
