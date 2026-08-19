import { useRef, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
const VERIFY_EMAIL = process.env.NEXT_PUBLIC_VERIFY_EMAIL || '';

const VERIFY_TTL_MS = 10 * 60 * 1000;
const VERIFY_STORAGE_KEY = 'quoteVerifiedAt';

function getVerifiedAt() {
  try {
    const ts = Number(window.localStorage.getItem(VERIFY_STORAGE_KEY));
    return ts || null;
  } catch {
    return null;
  }
}

function isVerifiedRecently() {
  const ts = getVerifiedAt();
  return Boolean(ts) && Date.now() - ts < VERIFY_TTL_MS;
}

function markVerified() {
  try {
    window.localStorage.setItem(VERIFY_STORAGE_KEY, String(Date.now()));
  } catch {
    // localStorage unavailable — verification just won't persist across reloads
  }
}

function clearVerification() {
  try {
    window.localStorage.removeItem(VERIFY_STORAGE_KEY);
  } catch {
    // localStorage unavailable — nothing to clear
  }
}

function unlockPage() {
  document.getElementById('authGate').style.display = 'none';
  document.getElementById('pageWrap').style.display = 'flex';
}

function lockPage() {
  document.getElementById('pageWrap').style.display = 'none';
  document.getElementById('authGate').style.display = 'flex';
}

function parseMoney(str) {
  return parseFloat(String(str).replace(/[^0-9.-]/g, '')) || 0;
}

function fmtMoney(num) {
  return 'Rs ' + Math.round(num).toLocaleString('en-US');
}

function recalcGrand() {
  const rows = document.querySelectorAll('#itemsBody tr.item-row');
  let sum = 0;
  rows.forEach((tr) => { sum += parseMoney(tr.querySelector('.total').textContent); });
  const gt = document.getElementById('grandTotal');
  if (gt) gt.textContent = fmtMoney(sum);
}

function recalcRow(tr) {
  if (!tr) return;
  const qty = parseFloat(tr.querySelector('.qty').textContent) || 0;
  const price = parseMoney(tr.querySelector('.price').textContent);
  tr.querySelector('.total').textContent = fmtMoney(qty * price);
  recalcGrand();
}

function renumberRows() {
  const rows = document.querySelectorAll('#itemsBody tr.item-row');
  rows.forEach((tr, i) => { tr.querySelector('.rownum').textContent = i + 1; });
}

function delRow(tr) {
  tr.parentNode.removeChild(tr);
  renumberRows();
  recalcGrand();
}

function addRow() {
  const tbody = document.getElementById('itemsBody');
  const tr = document.createElement('tr');
  tr.className = 'item-row';
  tr.innerHTML =
    '<td class="rownum"></td>' +
    '<td><div class="ititle" contenteditable="true">New Item</div></td>' +
    '<td class="c qty" contenteditable="true">1</td>' +
    '<td class="r price" contenteditable="true">Rs 0</td>' +
    '<td class="r total">Rs 0</td>' +
    '<td class="edit-ui action-cell"><button class="del-row">✕</button></td>';
  tr.querySelector('.qty').addEventListener('input', (e) => recalcRow(e.target.closest('tr')));
  tr.querySelector('.price').addEventListener('input', (e) => recalcRow(e.target.closest('tr')));
  tr.querySelector('.del-row').addEventListener('click', (e) => delRow(e.target.closest('tr')));
  tbody.insertBefore(tr, document.querySelector('.gt-row'));
  renumberRows();
  recalcGrand();
}

function downloadPDF() {
  if (!window.html2pdf) return;
  const btn = document.querySelector('.dl-btn');
  const page = document.querySelector('.page');
  btn.textContent = 'Generating…';
  btn.disabled = true;
  page.classList.add('pdf-mode');
  const qname = (document.getElementById('quoteNum').textContent || 'Quote').trim();
  const opt = {
    margin: 0,
    filename: 'Quote-' + qname + '.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait' },
  };
  window.html2pdf().set(opt).from(page).save().then(() => {
    page.classList.remove('pdf-mode');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px"><path d="M12 3v13M7 11l5 5 5-5"/><rect x="3" y="18" width="18" height="3" rx="1.5"/></svg> Download PDF';
    btn.disabled = false;
  });
}

export default function QuotePage() {
  const currentCodeRef = useRef(null);
  const lockTimerRef = useRef(null);

  const clearScheduledLock = () => {
    if (lockTimerRef.current) {
      clearTimeout(lockTimerRef.current);
      lockTimerRef.current = null;
    }
  };

  const scheduleAutoLock = (delayMs) => {
    clearScheduledLock();
    lockTimerRef.current = setTimeout(() => {
      clearVerification();
      lockPage();
      sendVerificationCode();
    }, Math.max(delayMs, 0));
  };

  const generateCode = () => String(Math.floor(100000 + Math.random() * 900000));

  const sendVerificationCode = () => {
    currentCodeRef.current = generateCode();
    const msg = document.getElementById('authMsg');
    const label = document.getElementById('authEmailLabel');
    if (label) label.textContent = VERIFY_EMAIL;
    document.getElementById('codeInput').value = '';

    if (!EMAILJS_SERVICE_ID || !window.emailjs) {
      msg.textContent = 'EmailJS not configured — set NEXT_PUBLIC_EMAILJS_* in .env.local';
      msg.className = 'auth-msg err';
      return;
    }

    msg.textContent = 'Sending code…';
    msg.className = 'auth-msg';

    window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email: VERIFY_EMAIL,
      email: VERIFY_EMAIL,
      reply_to: VERIFY_EMAIL,
      recipient: VERIFY_EMAIL,
      to: VERIFY_EMAIL,
      user_email: VERIFY_EMAIL,
      code: currentCodeRef.current,
      passcode: currentCodeRef.current,
      otp: currentCodeRef.current,
    }).then(() => {
      msg.textContent = 'Code sent to ' + VERIFY_EMAIL;
      msg.className = 'auth-msg ok';
    }).catch((err) => {
      msg.textContent = 'Failed to send code. ' + (err && err.text ? err.text : 'Check EmailJS setup.');
      msg.className = 'auth-msg err';
    });
  };

  const verifyCode = () => {
    const input = document.getElementById('codeInput').value.trim();
    const msg = document.getElementById('authMsg');
    if (!currentCodeRef.current) {
      msg.textContent = 'Code not sent yet — click Resend Code.';
      msg.className = 'auth-msg err';
      return;
    }
    if (input === currentCodeRef.current) {
      markVerified();
      unlockPage();
      scheduleAutoLock(VERIFY_TTL_MS);
    } else {
      msg.textContent = 'Incorrect code, please try again.';
      msg.className = 'auth-msg err';
    }
  };

  useEffect(() => {
    const ts = getVerifiedAt();
    if (ts && Date.now() - ts < VERIFY_TTL_MS) {
      unlockPage();
      scheduleAutoLock(VERIFY_TTL_MS - (Date.now() - ts));
    }
    return clearScheduledLock;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEmailJsReady = () => {
    if (EMAILJS_PUBLIC_KEY && window.emailjs) window.emailjs.init(EMAILJS_PUBLIC_KEY);
    if (!isVerifiedRecently()) sendVerificationCode();
  };

  return (
    <>
      <Head>
        <title>Quote | Mujtaba Solar Solution</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" strategy="afterInteractive" />
      <Script
        src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"
        strategy="afterInteractive"
        onLoad={handleEmailJsReady}
      />

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        html, body {
          font-family: 'Inter', Arial, sans-serif;
          font-size: 12px;
          color: #0f172a;
          background: #dde3ed;
          min-height: 100%;
        }

        .page-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px 0 40px;
        }

        .page {
          width: 794px;
          min-height: 1123px;
          background: #ffffff;
          box-shadow: 0 4px 32px rgba(0,0,0,.12);
          overflow: clip;
          transform-origin: top center;
        }

        @media screen and (max-width: 860px) {
          .page { transform: scale(0.92); margin-bottom: -88px; }
        }
        @media screen and (max-width: 820px) {
          .page { transform: scale(0.88); margin-bottom: -120px; }
        }
        @media screen and (max-width: 794px) {
          .page { transform: scale(calc(100vw / 860)); margin-bottom: -160px; }
        }

        .top-bar {
          background: #0f4c8a;
          padding: 28px 40px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo-area { display: flex; align-items: center; gap: 14px; }

        .logo-circle {
          width: 56px; height: 56px;
          background: rgba(255,255,255,.12);
          border: 1.5px solid rgba(255,255,255,.35);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
        }

        .co-name { font-size: 21px; font-weight: 800; color: #fff; letter-spacing: -.3px; }
        .co-sub  { font-size: 11px; font-weight: 400; color: rgba(255,255,255,.7); margin-top: 2px; }

        .quote-badge { text-align: right; }
        .quote-badge .word {
          font-size: 30px; font-weight: 800;
          color: #fff; letter-spacing: 1px;
          display: block;
        }
        .quote-badge .num {
          font-size: 11px; font-weight: 500;
          color: rgba(255,255,255,.65);
          background: rgba(255,255,255,.12);
          border-radius: 20px;
          padding: 2px 10px;
          white-space: nowrap;
          display: inline-block;
          margin-top: 4px;
        }

        .accent-strip {
          height: 4px;
          background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 40%, #e8f1fb 100%);
        }

        .body { padding: 28px 40px 36px; }

        .meta-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          gap: 24px;
        }

        .to-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #0f4c8a;
          border-radius: 10px;
          padding: 14px 18px;
          flex: 1;
        }
        .to-card .to-label {
          font-size: 9px; font-weight: 700; letter-spacing: 1.2px;
          text-transform: uppercase; color: #64748b;
          margin-bottom: 6px;
        }
        .to-card .client { font-size: 14px; font-weight: 700; color: #0f172a; }
        .to-card .line   { font-size: 11.5px; color: #334155; line-height: 1.7; margin-top: 2px; }

        .meta-pills { display: flex; flex-direction: column; gap: 8px; align-items: flex-end; }
        .pill {
          display: flex; align-items: center; gap: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 8px 14px;
          white-space: nowrap;
        }
        .pill .pill-label { font-size: 10px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: .8px; }
        .pill .pill-val   { font-size: 12px; font-weight: 700; color: #0f4c8a; }

        .salutation { font-size: 12px; color: #334155; line-height: 1.8; margin-bottom: 20px; }

        .items-table { width: 100%; border-collapse: collapse; }

        .items-table thead tr { background: #0f4c8a; }
        .items-table thead th {
          padding: 10px 12px;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .9px;
          text-transform: uppercase;
        }
        .items-table thead th:first-child { border-radius: 10px 0 0 0; width: 32px; }
        .items-table thead th.r { text-align: right; }
        .items-table thead th.c { text-align: center; }
        .items-table thead th.action-col { border-radius: 0 10px 0 0; width: 30px; padding: 0; }
        .page.pdf-mode .items-table thead th.total-col { border-radius: 0 10px 0 0; }

        .items-table tbody tr { border-bottom: 1px solid #e2e8f0; }
        .items-table tbody tr:nth-child(even) td { background: #f8fafc; }

        .items-table tbody td {
          padding: 10px 12px;
          vertical-align: top;
          font-size: 11.5px;
          color: #334155;
        }
        .items-table tbody td.r { text-align: right; white-space: nowrap; color: #0f172a; font-weight: 500; }
        .items-table tbody td.c { text-align: center; }
        .items-table tbody td:first-child { color: #64748b; font-weight: 600; font-size: 11px; }

        .ititle { font-weight: 700; font-size: 12px; color: #0f172a; margin-bottom: 3px; }
        .isub   { font-size: 10.5px; color: #64748b; line-height: 1.65; }

        .gt-row td {
          background: #0f4c8a !important;
          color: #fff !important;
          font-weight: 700;
          font-size: 13px;
          padding: 12px 12px;
          border-bottom: none !important;
        }
        .gt-row td:first-child { border-radius: 0 0 0 10px; }
        .gt-row td.total-cell  { border-radius: 0 0 10px 0; text-align: right; white-space: nowrap; font-size: 14px; }
        .page.pdf-mode .gt-row td.total-cell { border-radius: 0 0 10px 0; }
        .gt-row .gt-label { text-align: right; letter-spacing: 1px; font-size: 11px; text-transform: uppercase; }

        [contenteditable="true"] { transition: outline-color .12s, outline-width .12s; cursor: text; outline: 0 dashed #f59e0b; outline-offset: 3px; }
        [contenteditable="true"]:hover { outline: 1.5px dashed #f59e0bb0; }
        [contenteditable="true"]:focus { outline: 2px solid #f59e0b; }
        .action-cell, .action-col { text-align: center; }
        .del-row {
          width: 20px; height: 20px; border-radius: 50%;
          border: none; background: #fee2e2; color: #dc2626;
          font-size: 11px; line-height: 1; cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center;
        }
        .del-row:hover { background: #fecaca; }
        .add-row-btn {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 10px;
          background: #e8f1fb; color: #0f4c8a;
          border: 1px dashed #1a6abf;
          border-radius: 8px; padding: 7px 14px;
          font-family: 'Inter', Arial, sans-serif; font-size: 11px; font-weight: 600;
          cursor: pointer;
        }
        .add-row-btn:hover { background: #dbe9fa; }
        .page.pdf-mode .edit-ui { display: none !important; }
        .edit-hint {
          font-size: 10.5px; color: #0f4c8a; background: #e8f1fb;
          border: 1px solid #cfe0f5; border-radius: 8px;
          padding: 7px 12px; margin-bottom: 16px;
          display: flex; align-items: center; gap: 6px;
        }

        .hope { font-size: 11.5px; color: #64748b; margin: 16px 0 24px; font-style: italic; }

        .contact-bar {
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          padding: 10px 40px;
          display: flex; gap: 28px; align-items: center;
          margin-top: 24px;
        }
        .contact-bar span { font-size: 11px; color: #64748b; }
        .contact-bar strong { color: #334155; font-weight: 600; }

        .pnum { font-size: 9.5px; color: #64748b; text-align: right; padding: 8px 40px 10px; background: #f8fafc; border-top: 1px solid #e2e8f0; }

        @media print {
          body { background: #fff; }
          .page-wrap { padding: 0; }
          .page { transform: none !important; margin: 0 !important; box-shadow: none; width: 100%; }
          .dl-bar { display: none !important; }
        }

        .dl-bar { width: 794px; margin-bottom: 10px; display: flex; justify-content: flex-end; }
        .dl-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: #0f4c8a; color: #fff;
          font-family: 'Inter', Arial, sans-serif;
          font-size: 13px; font-weight: 600;
          padding: 10px 22px; border: none; border-radius: 8px;
          cursor: pointer; letter-spacing: .3px;
        }
        .dl-btn:hover { background: #1a6abf; }
        .dl-btn svg { width: 16px; height: 16px; flex-shrink: 0; }

        .auth-gate { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .auth-card {
          width: 100%; max-width: 380px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 8px 40px rgba(0,0,0,.18);
          padding: 32px 30px;
          text-align: center;
        }
        .auth-icon {
          width: 52px; height: 52px; margin: 0 auto 16px;
          background: #e8f1fb;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        .auth-icon svg { width: 24px; height: 24px; color: #0f4c8a; }
        .auth-card h2 { font-size: 17px; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
        .auth-card p { font-size: 12px; color: #64748b; line-height: 1.6; margin-bottom: 20px; }
        .auth-card p strong { color: #0f4c8a; }
        #codeInput {
          width: 100%; text-align: center;
          font-family: 'Inter', Arial, sans-serif;
          font-size: 22px; font-weight: 700; letter-spacing: 8px;
          color: #0f172a;
          padding: 12px 10px 12px 18px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          margin-bottom: 14px;
          outline: none;
        }
        #codeInput:focus { border-color: #1a6abf; box-shadow: 0 0 0 3px #1a6abf22; }
        .auth-verify-btn {
          width: 100%;
          background: #0f4c8a; color: #fff;
          font-family: 'Inter', Arial, sans-serif;
          font-size: 13px; font-weight: 700;
          border: none; border-radius: 10px;
          padding: 12px; cursor: pointer;
          letter-spacing: .3px;
        }
        .auth-verify-btn:hover { background: #1a6abf; }
        .auth-verify-btn:disabled { opacity: .6; cursor: not-allowed; }
        .auth-msg { font-size: 11px; margin-top: 12px; min-height: 14px; }
        .auth-msg.ok  { color: #16a34a; }
        .auth-msg.err { color: #dc2626; }
        .resend-link { display: inline-block; margin-top: 14px; font-size: 11px; color: #0f4c8a; text-decoration: none; font-weight: 600; cursor: pointer; }
        .resend-link:hover { text-decoration: underline; }
      `}</style>

      <div id="authGate" className="auth-gate">
        <div className="auth-card">
          <div className="auth-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
          </div>
          <h2>Verification Required</h2>
          <p>We&apos;ve sent a 6-digit code to<br /><strong id="authEmailLabel">{VERIFY_EMAIL || 'your email'}</strong></p>
          <input
            id="codeInput"
            maxLength={6}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="••••••"
            onKeyDown={(e) => { if (e.key === 'Enter') verifyCode(); }}
          />
          <button className="auth-verify-btn" onClick={verifyCode}>Verify &amp; Continue</button>
          <div id="authMsg" className="auth-msg"></div>
          <a className="resend-link" onClick={sendVerificationCode}>Resend Code</a>
        </div>
      </div>

      <div className="page-wrap" id="pageWrap" style={{ display: 'none' }}>
        <div className="dl-bar">
          <button className="dl-btn" onClick={downloadPDF}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v13M7 11l5 5 5-5"/><rect x="3" y="18" width="18" height="3" rx="1.5"/>
            </svg>
            Download PDF
          </button>
        </div>

        <div className="page">
          <div className="top-bar">
            <div className="logo-area">
              <div className="logo-circle">
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="14" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="1.5"/>
                  <text x="3" y="21" fontFamily="Arial" fontWeight="900" fontSize="11" fill="#fff">M.S</text>
                  <polyline points="22,5 18,16 23,16 17,28" fill="none" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <div className="co-name" contentEditable suppressContentEditableWarning>M Solar</div>
                <div className="co-sub" contentEditable suppressContentEditableWarning>Mujtaba &middot; Dalmia Mujahid Colony, Karachi</div>
              </div>
            </div>
            <div className="quote-badge">
              <span className="word">Quotation</span>
              <span className="num" id="quoteNum" contentEditable suppressContentEditableWarning>LK-S00398</span>
            </div>
          </div>

          <div className="accent-strip"></div>

          <div className="body">
            <div className="meta-row">
              <div className="to-card">
                <div className="to-label">Issued To</div>
                <div className="client" contentEditable suppressContentEditableWarning>0315 2538625 10kw</div>
                <div className="line" contentEditable suppressContentEditableWarning style={{ marginTop: '4px', fontWeight: 600, color: '#0f4c8a', fontSize: '11.5px' }}>Karachi, Pakistan</div>
              </div>
              <div className="meta-pills">
                <div className="pill">
                  <span className="pill-label">Date</span>
                  <span className="pill-val" contentEditable suppressContentEditableWarning>2026-08-05</span>
                </div>
                <div className="pill">
                  <span className="pill-label">Expiration</span>
                  <span className="pill-val" contentEditable suppressContentEditableWarning>2026-09-04</span>
                </div>
              </div>
            </div>

            <div className="edit-hint edit-ui">✎ Click any text, name, price or quantity to edit it directly. Use the ✕ to remove a row and &quot;+ Add Item&quot; to add one.</div>

            <div className="salutation">
              <p contentEditable suppressContentEditableWarning>Dear Sir/Mam,</p>
              <p contentEditable suppressContentEditableWarning>Thank you for your valuable inquiry. We are pleased to quote as below:</p>
            </div>

            <table className="items-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Description</th>
                  <th className="c" style={{ width: '46px' }}>Qty</th>
                  <th className="r" style={{ width: '116px' }}>Unit Price</th>
                  <th className="r total-col" style={{ width: '116px' }}>Total</th>
                  <th className="edit-ui action-col"></th>
                </tr>
              </thead>
              <tbody id="itemsBody">
                <tr className="item-row">
                  <td className="rownum">1</td>
                  <td><div className="ititle" contentEditable suppressContentEditableWarning>Inverex Inverter Nitrox 10KW</div></td>
                  <td className="c qty" contentEditable suppressContentEditableWarning onInput={(e) => recalcRow(e.target.closest('tr'))}>1</td>
                  <td className="r price" contentEditable suppressContentEditableWarning onInput={(e) => recalcRow(e.target.closest('tr'))}>Rs 435,000</td>
                  <td className="r total">Rs 435,000</td>
                  <td className="edit-ui action-cell"><button className="del-row" onClick={(e) => delRow(e.target.closest('tr'))}>✕</button></td>
                </tr>

                <tr className="item-row">
                  <td className="rownum">2</td>
                  <td><div className="ititle" contentEditable suppressContentEditableWarning>Inverex Panel 720watt</div></td>
                  <td className="c qty" contentEditable suppressContentEditableWarning onInput={(e) => recalcRow(e.target.closest('tr'))}>16</td>
                  <td className="r price" contentEditable suppressContentEditableWarning onInput={(e) => recalcRow(e.target.closest('tr'))}>Rs 31,050</td>
                  <td className="r total">Rs 496,800</td>
                  <td className="edit-ui action-cell"><button className="del-row" onClick={(e) => delRow(e.target.closest('tr'))}>✕</button></td>
                </tr>

                <tr className="item-row">
                  <td className="rownum">3</td>
                  <td><div className="ititle" contentEditable suppressContentEditableWarning>DONGJIN Battery 48V 300Ah</div></td>
                  <td className="c qty" contentEditable suppressContentEditableWarning onInput={(e) => recalcRow(e.target.closest('tr'))}>2</td>
                  <td className="r price" contentEditable suppressContentEditableWarning onInput={(e) => recalcRow(e.target.closest('tr'))}>Rs 650,000</td>
                  <td className="r total">Rs 1,300,000</td>
                  <td className="edit-ui action-cell"><button className="del-row" onClick={(e) => delRow(e.target.closest('tr'))}>✕</button></td>
                </tr>

                <tr className="item-row">
                  <td className="rownum">4</td>
                  <td><div className="ititle" contentEditable suppressContentEditableWarning>Elevated Structure/Panel</div></td>
                  <td className="c qty" contentEditable suppressContentEditableWarning onInput={(e) => recalcRow(e.target.closest('tr'))}>16</td>
                  <td className="r price" contentEditable suppressContentEditableWarning onInput={(e) => recalcRow(e.target.closest('tr'))}>Rs 12,500</td>
                  <td className="r total">Rs 200,000</td>
                  <td className="edit-ui action-cell"><button className="del-row" onClick={(e) => delRow(e.target.closest('tr'))}>✕</button></td>
                </tr>

                <tr className="item-row">
                  <td className="rownum">5</td>
                  <td><div className="ititle" contentEditable suppressContentEditableWarning>Installation With Material to breaker wire etc accessories</div></td>
                  <td className="c qty" contentEditable suppressContentEditableWarning onInput={(e) => recalcRow(e.target.closest('tr'))}>1</td>
                  <td className="r price" contentEditable suppressContentEditableWarning onInput={(e) => recalcRow(e.target.closest('tr'))}>Rs 200,000</td>
                  <td className="r total">Rs 200,000</td>
                  <td className="edit-ui action-cell"><button className="del-row" onClick={(e) => delRow(e.target.closest('tr'))}>✕</button></td>
                </tr>

                <tr className="item-row">
                  <td className="rownum">6</td>
                  <td><div className="ititle" contentEditable suppressContentEditableWarning>Labour</div></td>
                  <td className="c qty" contentEditable suppressContentEditableWarning onInput={(e) => recalcRow(e.target.closest('tr'))}>1</td>
                  <td className="r price" contentEditable suppressContentEditableWarning onInput={(e) => recalcRow(e.target.closest('tr'))}>Rs 60,000</td>
                  <td className="r total">Rs 60,000</td>
                  <td className="edit-ui action-cell"><button className="del-row" onClick={(e) => delRow(e.target.closest('tr'))}>✕</button></td>
                </tr>

                <tr className="gt-row">
                  <td colSpan={3}></td>
                  <td className="gt-label">Grand Total</td>
                  <td className="total-cell" id="grandTotal">Rs 2,691,800</td>
                  <td className="edit-ui action-cell"></td>
                </tr>
              </tbody>
            </table>
            <button className="add-row-btn edit-ui" onClick={addRow}>+ Add Item</button>

            <p className="hope">We hope you find our offer to be in line with your requirements.</p>
          </div>

          <div className="contact-bar">
            <span>&#9990; <strong contentEditable suppressContentEditableWarning>+92 315 2538625</strong></span>
            <span>&#9993; <strong contentEditable suppressContentEditableWarning>mutabakhan123@gmail.com</strong></span>
            <span>&#128205; <strong contentEditable suppressContentEditableWarning>Dalmia Mujahid Colony, Karachi</strong></span>
          </div>

          <div className="pnum">Page 1 of 1</div>
        </div>
      </div>
    </>
  );
}
