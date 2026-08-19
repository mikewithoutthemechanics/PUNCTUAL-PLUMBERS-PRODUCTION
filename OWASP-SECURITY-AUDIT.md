# OWASP Top 10 Security Audit Report
## Punctual Plumbers Production Codebase
**Date:** 2026-08-19  
**Auditor:** Kilo Security Review  
**Scope:** `src/` and `mobile/` React applications  
**Repository:** `C:\Users\Nate\PUNCTUAL-PLUMBERS-PRODUCTION`

---

## Executive Summary

| Category | Risk Level | Finding |
|----------|-----------|---------|
| A01: Broken Access Control | **Low** | No backend; static site with no authz requirements |
| A02: Cryptographic Failures | **None** | No cryptographic operations in client code |
| A03: Injection | **Low** | No dynamic rendering; form is cosmetic (alerts only) |
| A04: Insecure Design | **Low** | Contact form has no validation or backend processing |
| A05: Security Misconfiguration | **Medium** | Missing CSP headers; 2 links missing `rel="noopener"` |
| A06: Vulnerable Components | **High** | 4 known npm vulnerabilities (3 High, 1 Low) |
| A07: Auth Failures | **None** | No authentication system present |
| A08: Integrity Failures | **Medium** | External Google Fonts loaded without SRI |
| A09: Logging Failures | **Low** | No security logging or monitoring |
| A10: SSRF | **None** | No server-side request capability |

---

## Detailed Findings

### A05: Security Misconfiguration — Medium

**Finding 1: Missing Content-Security-Policy (CSP)**
- **Location:** `index.html` (no `<meta>` CSP tag), `vite.config.ts` (no security headers)
- **Risk:** The app bundles into a single HTML file via `vite-plugin-singlefile`. Without CSP, any XSS injection (unlikely but possible via future changes) would have full DOM access.
- **Remediation:** Add CSP meta tag to `index.html`:
  ```html
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'none';">
  ```
  Note: `'unsafe-inline'` and `'unsafe-eval'` required for Framer Motion and Vite HMR; tighten further for production builds.

**Finding 2: Missing `rel="noopener"` on External Links**
- **Location:** `src/App.tsx:248`, `mobile/src/App.tsx:274`
- **Risk:** Tabnabbing. The emergency WhatsApp link uses `target="_blank" rel="noreferrer"` but omits `noopener`. The floating WhatsApp button correctly uses `rel="noopener noreferrer"`.
- **Remediation:** Change `rel="noreferrer"` to `rel="noopener noreferrer"` on both lines.

**Finding 3: No Security Headers**
- **Location:** `index.html`, `vite.config.ts`
- **Risk:** Missing `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.
- **Remediation:** Add meta tags or configure headers in hosting platform (Vercel/Netlify):
  ```html
  <meta http-equiv="X-Content-Type-Options" content="nosniff">
  <meta http-equiv="X-Frame-Options" content="DENY">
  <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
  ```

---

### A06: Vulnerable and Outdated Components — High

**Finding 4: Known npm Vulnerabilities**
- **Location:** Root `package.json` and `mobile/package.json`
- **Vulnerable Dependencies:**
  | Package | Severity | Issue | Fix |
  |---------|----------|-------|-----|
  | `nanoid` < 3.3.18 | High | Infinite loop with size=0 | `npm audit fix` |
  | `postcss` <= 8.5.22 | High | Node API exposed in browsers | `npm audit fix` |
  | `vite` 7.0.0-7.3.3 | High | NTLMv2 hash disclosure; `fs.deny` bypass on Windows | `npm audit fix --force` |
  | `esbuild` 0.27.3-0.28.0 | Low | Arbitrary file read on Windows dev server | `npm audit fix` |
- **Remediation:**
  1. Run `npm audit fix` in both root and `mobile/`
  2. For Vite, evaluate compatibility before running `npm audit fix --force` to upgrade to 7.3.6+
  3. Add `npm audit` to CI pipeline

---

### A08: Software and Data Integrity Failures — Medium

**Finding 5: External Fonts Without Subresource Integrity (SRI)**
- **Location:** `index.html:8-10`
- **Risk:** Google Fonts are loaded from `fonts.googleapis.com` and `fonts.gstatic.com` without SRI hashes. A CDN compromise could inject malicious CSS/JS.
- **Remediation:** Use `integrity` attributes with known SHA hashes, or self-host fonts:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet" integrity="sha384-..." crossorigin="anonymous">
  ```

---

### A03/A04: Injection & Insecure Design — Low

**Finding 6: Cosmetic Contact Form**
- **Location:** `src/App.tsx:687-708`, `mobile/src/App.tsx` (similar)
- **Risk:** Form accepts Name, Phone, Town, Service type, and message. `onSubmit` only shows `alert("Thank you!")`. No validation, no sanitization, no backend. Risk is low because input is never processed, stored, or rendered dynamically.
- **Remediation:** If form is ever connected to a backend:
  - Add client-side validation (required fields, phone format)
  - Sanitize all inputs server-side
  - Implement rate limiting and CSRF tokens
  - Consider honeypot for bot prevention

---

### A09: Security Logging and Monitoring — Low

**Finding 7: No Security Logging**
- **Risk:** No client-side error logging or monitoring. Security events (if any) would be invisible.
- **Remediation:** Add basic error boundary logging or integrate a monitoring service (Sentry, LogRocket) if the app scales.

---

## Non-Findings (Verified Safe)

| Check | Result |
|-------|--------|
| `dangerouslySetInnerHTML` | Not used |
| `eval()` / `new Function()` | Not used |
| Hardcoded secrets/passwords/tokens | None found |
| `localStorage` / `sessionStorage` | Not used |
| `innerHTML` / `document.write` | Not used |
| `Math.random()` for security | Not used |
| `atob()` / `btoa()` | Not used |
| XML parsing | Not used |
| `window.location` manipulation | Not used |
| `console.log` statements | None found |
| CSRF tokens | Not applicable (no backend) |
| Mixed content (HTTP URLs) | None; all external URLs use HTTPS |
| `.env` files in repo | Properly gitignored |

---

## Prioritized Remediation Plan

| Priority | Action | Effort | Impact |
|----------|--------|--------|--------|
| P0 | Run `npm audit fix` in root + mobile | 5 min | Resolves 3 High + 1 Low |
| P1 | Add `rel="noopener noreferrer"` to 2 links | 2 min | Prevents tabnabbing |
| P2 | Add CSP meta tag to `index.html` | 10 min | Reduces XSS impact |
| P2 | Add security headers (X-Frame-Options, etc.) | 10 min | Hardens browser protections |
| P3 | Add SRI to Google Fonts or self-host | 15 min | Prevents CDN compromise |
| P4 | Add `npm audit` to CI | 20 min | Catches future vulnerabilities |

---

## Overall Risk Assessment

**Current Risk: MEDIUM**

The application is a static marketing site with no backend, which significantly reduces attack surface. The primary risks are:
1. **Known dependency vulnerabilities** (High severity in nanoid, postcss, vite)
2. **Missing security headers** (CSP, X-Frame-Options)
3. **Minor link security issue** (missing `noopener` on 2 links)

No critical application-level vulnerabilities (injection, auth bypass, data exposure) were identified. The codebase is **safe to push** after addressing the P0 and P1 items above.
