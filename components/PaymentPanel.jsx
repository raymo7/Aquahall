'use client';

import { useState } from 'react';
import {
  Smartphone,
  Copy,
  QrCode,
  Loader2,
  Check,
  Download,
} from 'lucide-react';
import {
  UPI_ID,
  buildUpiUri,
  buildAndroidGooglePayIntent,
  buildIosGooglePayUrl,
  qrSrc,
  qrDownloadUrl,
} from '../lib/upi';

function isIosDevice() {
  if (typeof navigator === 'undefined') return false;

  return (
    /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

function isAndroidDevice() {
  if (typeof navigator === 'undefined') return false;
  return /Android/i.test(navigator.userAgent);
}

export default function PaymentPanel({
  amount,
  note,
  editableAmount = false,
  onAmountChange,
  onMarkPaid,
  paid = false,
  busy = false,
}) {
  const [copied, setCopied] = useState(false);
  const [launchMessage, setLaunchMessage] = useState('');

  async function copyUpi() {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setLaunchMessage(`Copy this UPI ID manually: ${UPI_ID}`);
    }
  }

  function openUpiApp() {
    setLaunchMessage('');

    if (isIosDevice()) {
      // Google documents the gpay:// scheme for launching Google Pay on iOS.
      window.location.href = buildIosGooglePayUrl(amount, note);

      window.setTimeout(() => {
        if (document.visibilityState === 'visible') {
          setLaunchMessage(
            'Google Pay did not open. Make sure it is installed, or download the QR code and scan it from Google Pay.',
          );
        }
      }, 1800);

      return;
    }

    if (isAndroidDevice()) {
      window.location.href = buildAndroidGooglePayIntent(amount, note);

      window.setTimeout(() => {
        if (document.visibilityState === 'visible') {
          setLaunchMessage(
            'No compatible UPI app opened. Scan or download the QR code, or copy the UPI ID.',
          );
        }
      }, 1800);

      return;
    }

    // Generic fallback for other mobile browsers and devices.
    window.location.href = buildUpiUri(amount, note);

    window.setTimeout(() => {
      if (document.visibilityState === 'visible') {
        setLaunchMessage(
          'UPI app launch is not supported on this browser. Download the QR code or copy the UPI ID.',
        );
      }
    }, 1800);
  }

  return (
    <div id="payment">
      <p
        className="font-label mb-1 flex items-center gap-1.5 text-xs"
        style={{ color: 'var(--teal-900)' }}
      >
        <QrCode size={14} /> PAY VIA GOOGLE PAY / UPI
      </p>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <div className="flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrSrc(amount, note)}
            alt="UPI payment QR code"
            className="h-40 w-40 rounded-2xl border-2 bg-white p-1"
            style={{ borderColor: 'var(--teal-100)' }}
          />

          <a
            href={qrDownloadUrl(amount, note)}
            className="btn-ghost-teal mt-3 inline-flex items-center gap-2 text-sm no-underline"
          >
            <Download size={16} />
            Download QR
          </a>
        </div>

        <div className="w-full flex-1">
          {editableAmount ? (
            <>
              <label
                className="font-body text-sm font-bold"
                style={{ color: 'var(--teal-900)' }}
              >
                Amount (₹, optional)
              </label>
              <input
                className="field mt-1.5"
                type="number"
                min="0"
                value={amount}
                onChange={(event) => onAmountChange?.(event.target.value)}
                placeholder="Leave blank to enter in app"
              />
            </>
          ) : (
            <p
              className="font-display text-2xl"
              style={{ color: 'var(--teal-900)' }}
            >
              ₹{amount}
            </p>
          )}

          <button
            type="button"
            onClick={openUpiApp}
            className="btn-primary-sm mt-3 inline-flex items-center gap-2"
          >
            <Smartphone size={16} /> Open Google Pay / UPI app
          </button>

          <p
            className="font-body mt-2 text-xs leading-5"
            style={{ color: 'var(--ink-muted)' }}
          >
            On iPhone, this attempts to open Google Pay. When app launching is
            unavailable, download the QR and scan it inside Google Pay.
          </p>

          <div
            className="font-body mt-3 flex flex-wrap items-center gap-2 text-sm"
            style={{ color: 'var(--ink-muted)' }}
          >
            <span className="break-all">{UPI_ID}</span>
            <button
              type="button"
              onClick={copyUpi}
              className="inline-flex items-center gap-1 font-bold"
              style={{ color: 'var(--teal-700)' }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          {launchMessage && (
            <p
              className="font-body mt-3 rounded-xl px-3 py-2 text-xs leading-5"
              style={{
                color: 'var(--terracotta-600)',
                background: 'var(--terracotta-100)',
              }}
            >
              {launchMessage}
            </p>
          )}

          {onMarkPaid &&
            (paid ? (
              <p
                className="font-body mt-3 text-xs font-bold"
                style={{ color: 'var(--teal-700)' }}
              >
                Payment reported — we will verify it shortly.
              </p>
            ) : (
              <button
                type="button"
                onClick={onMarkPaid}
                disabled={busy}
                className="font-body mt-3 flex items-center gap-1.5 text-xs font-bold"
                style={{
                  color: 'var(--teal-700)',
                  textDecoration: 'underline',
                }}
              >
                {busy ? (
                  <>
                    <Loader2 size={12} className="animate-spin" /> Recording…
                  </>
                ) : (
                  'I have completed the payment'
                )}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
