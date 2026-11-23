import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, EyeOff, Lock, ShieldCheck } from 'lucide-react';
import { ASSETS } from '../data/mockData';

const PrivacyShieldDemo: React.FC = () => {
  const [mode, setMode] = useState<'simulator' | 'webcam'>('simulator');
  const [maskFace, setMaskFace] = useState(true);
  const [maskFinancial, setMaskFinancial] = useState(true);
  const [maskIdentity, setMaskIdentity] = useState(true);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const releaseMediaTracks = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const stopCamera = () => {
    releaseMediaTracks();
    setCameraActive(false);
  };

  const handleModeChange = (nextMode: 'simulator' | 'webcam') => {
    if (nextMode !== 'webcam') {
      stopCamera();
    }
    setMode(nextMode);
  };

  useEffect(() => {
    return () => {
      releaseMediaTracks();
    };
  }, []);

  useEffect(() => {
    if (!cameraActive || mode !== 'webcam') return;

    const renderFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState >= 2) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 360;
          ctx.save();
          ctx.filter = maskFace ? 'blur(18px)' : 'none';
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          ctx.restore();

          if (maskFace) {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
            ctx.fillRect(16, 16, 250, 32);
            ctx.fillStyle = '#ffffff';
            ctx.font = '600 12px monospace';
            ctx.fillText('CLIENT-SIDE BUFFER REDACTED', 28, 36);
          }
        }
      }
      rafRef.current = requestAnimationFrame(renderFrame);
    };

    rafRef.current = requestAnimationFrame(renderFrame);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [cameraActive, mode, maskFace]);

  const startLocalWebcam = async () => {
    setCameraError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Local camera API is unavailable in this browser context.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 360 },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch {
      setCameraError(
        'Camera permission was declined or no webcam was detected. Switch to Production Flow Simulator to inspect DOM & face masking.'
      );
    }
  };

  const activeProtectionsCount = [maskFace, maskFinancial, maskIdentity].filter(Boolean).length;

  return (
    <section
      id="privacy-shield"
      className="py-16 md:py-24 border-b border-[var(--sys-outline-variant)]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-[var(--sys-primary)] mb-3">
              02. Client-Side Privacy Shield
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--sys-on-surface)] leading-tight mb-3">
              Mask faces, cards, and account PII before bytes leave the browser.
            </h2>
            <p className="text-base text-[var(--sys-on-surface-secondary)] leading-relaxed">
              Post-hoc blurring still leaks raw customer data into cloud storage. Toggle each protection below to inspect how LyndaPlus redacts live production flows inside the participant’s browser buffer.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Privacy Shield preview mode"
            className="inline-flex items-center gap-1 p-1 rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-container)] border border-[var(--sys-outline-variant)] self-start lg:self-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'simulator'}
              onClick={() => handleModeChange('simulator')}
              className={`min-h-[38px] px-4 py-1.5 text-xs font-semibold rounded-[var(--sys-radius-sm)] transition-colors whitespace-nowrap cursor-pointer ${
                mode === 'simulator'
                  ? 'bg-[var(--sys-surface-lowest)] text-[var(--sys-on-surface)] shadow-xs'
                  : 'text-[var(--sys-on-surface-secondary)] hover:text-[var(--sys-on-surface)]'
              }`}
            >
              Production Flow Simulator
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'webcam'}
              onClick={() => handleModeChange('webcam')}
              className={`min-h-[38px] px-4 py-1.5 text-xs font-semibold rounded-[var(--sys-radius-sm)] transition-colors whitespace-nowrap cursor-pointer ${
                mode === 'webcam'
                  ? 'bg-[var(--sys-surface-lowest)] text-[var(--sys-on-surface)] shadow-xs'
                  : 'text-[var(--sys-on-surface-secondary)] hover:text-[var(--sys-on-surface)]'
              }`}
            >
              Local Webcam Test
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Interactive Redaction Controls & Audit Proof */}
          <div className="lg:col-span-4 rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 flex flex-col justify-between gap-6">
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-[var(--sys-on-surface)]">
                  In-Buffer Redaction Rules
                </h3>
                <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-1">
                  Enforced locally via browser canvas and DOM mask rules prior to UK/EU upload.
                </p>
              </div>

              <div className="divide-y divide-[var(--sys-outline-variant)]">
                <label className="flex items-start justify-between gap-3 py-3.5 cursor-pointer">
                  <div>
                    <p className="text-sm font-semibold text-[var(--sys-on-surface)]">
                      Biometric Face Blur
                    </p>
                    <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-0.5">
                      Gaussian blur on participant camera stream
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={maskFace}
                    onChange={(e) => setMaskFace(e.target.checked)}
                    className="w-4 h-4 mt-1 accent-[var(--sys-primary)]"
                  />
                </label>

                <label className="flex items-start justify-between gap-3 py-3.5 cursor-pointer">
                  <div>
                    <p className="text-sm font-semibold text-[var(--sys-on-surface)]">
                      Card, IBAN & Sort Code Mask
                    </p>
                    <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-0.5">
                      Redacts live banking inputs & balances
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={maskFinancial}
                    onChange={(e) => setMaskFinancial(e.target.checked)}
                    className="w-4 h-4 mt-1 accent-[var(--sys-primary)]"
                  />
                </label>

                <label className="flex items-start justify-between gap-3 py-3.5 cursor-pointer">
                  <div>
                    <p className="text-sm font-semibold text-[var(--sys-on-surface)]">
                      Customer Email & Account ID
                    </p>
                    <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-0.5">
                      Scrubs personal identifiers in DOM headers
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={maskIdentity}
                    onChange={(e) => setMaskIdentity(e.target.checked)}
                    className="w-4 h-4 mt-1 accent-[var(--sys-primary)]"
                  />
                </label>
              </div>
            </div>

            <div className="p-4 rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-low)] border border-[var(--sys-outline-variant)] space-y-2 text-xs tabular-nums">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--sys-on-surface)]">
                  <ShieldCheck className="w-4 h-4 text-[var(--sys-primary)]" />
                  Pre-Ingestion Proof
                </span>
                <span className="font-mono text-[var(--sys-primary)] font-semibold">
                  {activeProtectionsCount}/3 Active
                </span>
              </div>
              <p className="text-[var(--sys-on-surface-secondary)] leading-relaxed">
                {activeProtectionsCount === 3
                  ? '0 raw PII fields exposed to storage · Ready for FCA, GDPR & HIPAA compliance sign-off.'
                  : `${3 - activeProtectionsCount} sensitive field group(s) currently unmasked in preview.`}
              </p>
            </div>
          </div>

          {/* Right: Live Preview Surface */}
          <div className="lg:col-span-8 rounded-[var(--sys-radius-lg)] sys-surface-lowest p-6 flex flex-col justify-between gap-5">
            {mode === 'simulator' ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[var(--sys-outline-variant)] text-xs">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[var(--sys-on-surface-secondary)]">
                    <Lock className="w-3.5 h-3.5 text-[var(--sys-primary)]" />
                    app.finway-treasury.co.uk/payouts/confirm
                  </span>
                  <span className="font-mono text-[var(--sys-on-surface-tertiary)]">
                    Storage Target: europe-west2 (London)
                  </span>
                </div>

                {/* Simulated Regulated Production App Screen */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
                  <div className="md:col-span-8 p-5 rounded-[var(--sys-radius-md)] bg-[var(--sys-surface-low)] border border-[var(--sys-outline-variant)] space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--sys-outline-variant)]">
                      <div>
                        <p className="text-xs text-[var(--sys-on-surface-tertiary)]">
                          Treasury Transfer Review
                        </p>
                        <p className="text-sm font-bold text-[var(--sys-on-surface)] mt-0.5">
                          Confirm Supplier Settlement
                        </p>
                      </div>
                      <span
                        className={`text-xs font-mono transition-all ${
                          maskIdentity
                            ? 'bg-[var(--sys-on-surface)] text-transparent select-none rounded px-2 py-0.5'
                            : 'text-[var(--sys-on-surface-secondary)]'
                        }`}
                        aria-label={maskIdentity ? 'Email redacted' : 'h.lindqvist@finway.co.uk'}
                      >
                        h.lindqvist@finway.co.uk
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs tabular-nums">
                      <div className="p-3.5 rounded-[var(--sys-radius-sm)] bg-[var(--sys-surface-lowest)] border border-[var(--sys-outline-variant)]">
                        <p className="text-[var(--sys-on-surface-tertiary)]">Source IBAN</p>
                        <p
                          className={`font-mono font-semibold mt-1 transition-all ${
                            maskFinancial
                              ? 'blur-[6px] select-none text-[var(--sys-on-surface)]'
                              : 'text-[var(--sys-on-surface)]'
                          }`}
                        >
                          GB29 NWBK 6016 1331 9268 19
                        </p>
                      </div>

                      <div className="p-3.5 rounded-[var(--sys-radius-sm)] bg-[var(--sys-surface-lowest)] border border-[var(--sys-outline-variant)]">
                        <p className="text-[var(--sys-on-surface-tertiary)]">Corporate Card</p>
                        <p
                          className={`font-mono font-semibold mt-1 transition-all ${
                            maskFinancial
                              ? 'blur-[6px] select-none text-[var(--sys-on-surface)]'
                              : 'text-[var(--sys-on-surface)]'
                          }`}
                        >
                          4912 8830 1044 7291 · 09/28
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-[var(--sys-radius-sm)] bg-[var(--sys-surface-lowest)] border border-[var(--sys-outline-variant)] flex items-center justify-between text-xs tabular-nums">
                      <div>
                        <p className="text-[var(--sys-on-surface-tertiary)]">Beneficiary Holder</p>
                        <p
                          className={`font-semibold mt-0.5 transition-all ${
                            maskIdentity
                              ? 'blur-[6px] select-none text-[var(--sys-on-surface)]'
                              : 'text-[var(--sys-on-surface)]'
                          }`}
                        >
                          Hannah Lindqvist · Acct #882104
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[var(--sys-on-surface-tertiary)]">Settlement Total</p>
                        <p className="font-mono font-bold text-sm text-[var(--sys-on-surface)] mt-0.5">
                          £14,280.00
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Participant Camera Feed PIP */}
                  <div className="md:col-span-4 flex flex-col justify-between rounded-[var(--sys-radius-md)] overflow-hidden border border-[var(--sys-outline-variant)] bg-[var(--sys-surface-low)]">
                    <div className="relative flex-1 min-h-[190px] overflow-hidden">
                      <img
                        src={ASSETS.avatarSarah}
                        alt="Participant webcam stream under Privacy Shield"
                        referrerPolicy="no-referrer"
                        className={`w-full h-full object-cover transition-all duration-200 ${
                          maskFace ? 'blur-xl scale-110' : 'blur-0 scale-100'
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-3.5 text-white">
                        <p className="text-[11px] font-mono inline-flex items-center gap-1.5">
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>{maskFace ? 'Face Masked' : 'Raw Feed'}</span>
                        </p>
                        <p className="text-xs font-semibold mt-0.5">
                          {maskIdentity ? 'Participant P-014' : 'Sarah Chen'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[var(--sys-on-surface-tertiary)]">
                  UI hierarchy, click coordinates, and usability friction remain crystal clear for designers while regulated customer identifiers never reach recording storage.
                </p>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--sys-outline-variant)]">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--sys-on-surface)]">
                      Local Browser Canvas Redaction Test
                    </h3>
                    <p className="text-xs text-[var(--sys-on-surface-secondary)] mt-0.5">
                      Runs 100% locally on your device. No video frames are recorded or transmitted.
                    </p>
                  </div>
                  {!cameraActive ? (
                    <button
                      type="button"
                      onClick={startLocalWebcam}
                      className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 text-xs sys-btn-primary whitespace-nowrap cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Start Local Camera Test</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 text-xs sys-btn-secondary whitespace-nowrap cursor-pointer"
                    >
                      <CameraOff className="w-4 h-4" />
                      <span>Stop Camera</span>
                    </button>
                  )}
                </div>

                {cameraError && (
                  <div
                    className="p-4 rounded-[var(--sys-radius-md)] border border-[var(--sys-outline-variant)] text-xs"
                    style={{
                      backgroundColor: 'var(--sys-warning-bg)',
                      color: 'var(--sys-warning-fg)',
                    }}
                  >
                    {cameraError}
                  </div>
                )}

                <div className="relative rounded-[var(--sys-radius-md)] overflow-hidden border border-[var(--sys-outline-variant)] aspect-video bg-[var(--sys-surface-low)] flex items-center justify-center">
                  <video ref={videoRef} playsInline muted className="hidden" />
                  {cameraActive ? (
                    <canvas ref={canvasRef} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-8 space-y-2 max-w-sm">
                      <Camera className="w-8 h-8 text-[var(--sys-on-surface-tertiary)] mx-auto" />
                      <p className="text-sm font-semibold text-[var(--sys-on-surface)]">
                        Verify client-side canvas redaction on your own webcam
                      </p>
                      <p className="text-xs text-[var(--sys-on-surface-secondary)]">
                        Toggle “Biometric Face Blur” on the left while the local preview runs to inspect frame-by-frame client masking.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyShieldDemo;
