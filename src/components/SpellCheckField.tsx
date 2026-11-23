import React, { useMemo, useRef, useState } from 'react';
import { Check, RotateCcw, Sparkles } from 'lucide-react';
import {
  autoCorrectAtBoundary,
  autoCorrectTrailingWord,
  findSpellingIssues,
  type SpellingIssue,
} from '../data/spellChecker';

interface SpellCheckFieldProps {
  id: string;
  value: string;
  onChange: (nextValue: string) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  className?: string;
  autoCorrectEnabled?: boolean;
}

interface LastAutoCorrection {
  from: string;
  to: string;
  start: number;
}

const SpellCheckField: React.FC<SpellCheckFieldProps> = ({
  id,
  value,
  onChange,
  multiline = false,
  rows = 3,
  placeholder,
  className = '',
  autoCorrectEnabled = true,
}) => {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);

  const [ignoredWords, setIgnoredWords] = useState<Set<string>>(() => new Set());
  const [lastCorrection, setLastCorrection] = useState<LastAutoCorrection | null>(null);

  const issues = useMemo(() => findSpellingIssues(value, ignoredWords), [value, ignoredWords]);

  const syncScroll = () => {
    const el = inputRef.current;
    const mirror = backdropRef.current;
    if (!el || !mirror) return;
    mirror.scrollTop = el.scrollTop;
    mirror.scrollLeft = el.scrollLeft;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const rawNext = e.target.value;
    const cursorPos = e.target.selectionStart ?? rawNext.length;

    // Only auto-correct when the user is inserting characters (not deleting/backspacing)
    const isInserting = rawNext.length > value.length;

    if (autoCorrectEnabled && isInserting) {
      const result = autoCorrectAtBoundary(rawNext, cursorPos, ignoredWords);
      if (result.corrected) {
        setLastCorrection(result.corrected);
        onChange(result.text);
        requestAnimationFrame(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(result.cursorPos, result.cursorPos);
            syncScroll();
          }
        });
        return;
      }
    }

    if (lastCorrection && rawNext !== value) {
      setLastCorrection(null);
    }
    onChange(rawNext);
    requestAnimationFrame(syncScroll);
  };

  const handleBlur = () => {
    if (!autoCorrectEnabled || !value) return;
    const result = autoCorrectTrailingWord(value, ignoredWords);
    if (result.corrected) {
      setLastCorrection(result.corrected);
      onChange(result.text);
    }
  };

  const applyIssueFix = (issue: SpellingIssue, replacement = issue.suggestion) => {
    const next = value.slice(0, issue.start) + replacement + value.slice(issue.end);
    setLastCorrection({ from: issue.word, to: replacement, start: issue.start });
    onChange(next);
    requestAnimationFrame(() => {
      if (inputRef.current) {
        const nextCursor = issue.start + replacement.length;
        inputRef.current.focus();
        inputRef.current.setSelectionRange(nextCursor, nextCursor);
      }
    });
  };

  const applyAllFixes = () => {
    if (issues.length === 0) return;
    let next = value;
    // Apply from right to left so offsets stay intact
    for (let i = issues.length - 1; i >= 0; i--) {
      const item = issues[i];
      next = next.slice(0, item.start) + item.suggestion + next.slice(item.end);
    }
    setLastCorrection(null);
    onChange(next);
  };

  const handleUndoCorrection = () => {
    if (!lastCorrection) return;
    const { from, to, start } = lastCorrection;
    if (value.slice(start, start + to.length) === to) {
      const reverted = value.slice(0, start) + from + value.slice(start + to.length);
      onChange(reverted);
    }
    // Remember this word as intentional for this session so auto-correct won't re-trigger on it
    setIgnoredWords((prev) => {
      const next = new Set(prev);
      next.add(from.toLowerCase());
      return next;
    });
    setLastCorrection(null);
  };

  const handleIgnoreWord = (word: string) => {
    setIgnoredWords((prev) => {
      const next = new Set(prev);
      next.add(word.toLowerCase());
      return next;
    });
  };

  // Build highlighted mirror segments matching the exact character offsets
  const renderedMirror = useMemo(() => {
    if (!value) return null;
    if (issues.length === 0) {
      return <span>{value}</span>;
    }

    const parts: React.ReactNode[] = [];
    let cursor = 0;

    issues.forEach((issue, idx) => {
      if (issue.start > cursor) {
        parts.push(<span key={`t-${idx}`}>{value.slice(cursor, issue.start)}</span>);
      }
      parts.push(
        <mark
          key={`m-${idx}-${issue.start}`}
          className="bg-transparent text-inherit underline decoration-wavy decoration-[1.5px] underline-offset-2 rounded-[2px]"
          style={{
            backgroundColor: 'var(--sys-danger-bg)',
            textDecorationColor: 'var(--sys-danger-fg)',
          }}
        >
          {value.slice(issue.start, issue.end)}
        </mark>
      );
      cursor = issue.end;
    });

    if (cursor < value.length) {
      parts.push(<span key="t-end">{value.slice(cursor)}</span>);
    }

    // Trailing space prevents height collapse on trailing newline in multiline mode
    if (multiline && value.endsWith('\n')) {
      parts.push(<span key="t-nl"> </span>);
    }

    return parts;
  }, [value, issues, multiline]);

  const sharedTypography = multiline
    ? 'p-3.5 text-sm leading-relaxed whitespace-pre-wrap break-words'
    : 'h-11 px-3.5 text-sm leading-[42px] whitespace-pre overflow-hidden';

  return (
    <div className="space-y-1.5">
      <div
        className={`relative rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-lowest)] border border-[var(--sys-outline-variant)] focus-within:border-[var(--sys-primary)] focus-within:ring-2 focus-within:ring-[var(--sys-primary)]/15 transition-all ${className}`}
      >
        {/* Synchronised Highlight Backdrop */}
        <div
          ref={backdropRef}
          aria-hidden="true"
          className={`pointer-events-none select-none absolute inset-0 overflow-hidden text-[var(--sys-on-surface)] font-sans ${sharedTypography}`}
        >
          {renderedMirror}
        </div>

        {/* Interactive Transparent-Text Input Layer */}
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            id={id}
            rows={rows}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            onScroll={syncScroll}
            spellCheck={false}
            placeholder={placeholder}
            className={`relative z-10 block w-full bg-transparent text-transparent caret-[var(--sys-on-surface)] placeholder:text-[var(--sys-on-surface-tertiary)] resize-none outline-none font-sans selection:bg-[var(--sys-primary-container)]/70 selection:text-[var(--sys-on-surface)] ${sharedTypography}`}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            id={id}
            type="text"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            onScroll={syncScroll}
            spellCheck={false}
            placeholder={placeholder}
            className={`relative z-10 block w-full bg-transparent text-transparent caret-[var(--sys-on-surface)] placeholder:text-[var(--sys-on-surface-tertiary)] outline-none font-sans selection:bg-[var(--sys-primary-container)]/70 selection:text-[var(--sys-on-surface)] ${sharedTypography}`}
          />
        )}
      </div>

      {/* Inline Spelling Fix & Auto-Correct Feedback Bar */}
      {(issues.length > 0 || lastCorrection) && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
          {issues.length > 0 ? (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span
                className="font-medium inline-flex items-center gap-1"
                style={{ color: 'var(--sys-danger-fg)' }}
              >
                <Sparkles className="w-3 h-3" />
                Spelling:
              </span>
              {issues.slice(0, 3).map((issue) => (
                <span
                  key={`${issue.start}-${issue.word}`}
                  className="inline-flex items-center gap-1.5 text-[var(--sys-on-surface-secondary)]"
                >
                  <span className="line-through opacity-75">{issue.word}</span>
                  <span aria-hidden="true">→</span>
                  <button
                    type="button"
                    onClick={() => applyIssueFix(issue)}
                    className="font-semibold text-[var(--sys-primary)] hover:underline cursor-pointer"
                  >
                    {issue.suggestion}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleIgnoreWord(issue.word)}
                    className="text-[11px] text-[var(--sys-on-surface-tertiary)] hover:text-[var(--sys-on-surface)] cursor-pointer"
                    title={`Ignore "${issue.word}"`}
                  >
                    (ignore)
                  </button>
                </span>
              ))}
            </div>
          ) : lastCorrection ? (
            <div className="inline-flex items-center gap-2 text-[var(--sys-on-surface-secondary)]">
              <Check className="w-3.5 h-3.5 text-[var(--sys-primary)]" />
              <span>
                Auto-corrected “<span className="line-through opacity-75">{lastCorrection.from}</span>” →{' '}
                <strong className="text-[var(--sys-on-surface)]">{lastCorrection.to}</strong>
              </span>
              <button
                type="button"
                onClick={handleUndoCorrection}
                className="inline-flex items-center gap-1 font-semibold text-[var(--sys-primary)] hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Undo
              </button>
            </div>
          ) : null}

          {issues.length > 0 && (
            <button
              type="button"
              onClick={applyAllFixes}
              className="font-semibold text-[var(--sys-primary)] hover:underline whitespace-nowrap cursor-pointer"
            >
              {issues.length === 1 ? `Fix “${issues[0].word}”` : `Auto-correct all (${issues.length})`}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SpellCheckField;
