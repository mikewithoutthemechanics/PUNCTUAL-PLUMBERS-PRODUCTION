# Pre-Push Audit Report
## Punctual Plumbers Production Codebase
**Date:** 2026-08-19  
**Auditor:** Kilo  
**Scope:** Full repository audit before GitHub push

---

## Executive Summary

| Project | Status | Critical | High | Medium | Low |
|---------|--------|----------|------|--------|-----|
| Main (React/Vite) | PASS | 0 | 3 | 0 | 1 |
| Mobile (React/Vite) | PASS | 0 | 2 | 0 | 1 |

Both projects compile cleanly, build successfully, and contain no exposed secrets. All findings are advisory — the codebase is safe to push.

---

## 1. Main Project

### 1.1 Tech Stack
- **React** 19.2.6
- **React DOM** 19.2.6
- **Framer Motion** ^12.42.0
- **Tailwind CSS** 4.1.17
- **TypeScript** 5.9.3
- **Vite** 7.3.2
- **Build plugin:** vite-plugin-singlefile (single inlined HTML output)

### 1.2 Security Scan
- **Result:** CLEAN
- No exposed credentials, API keys, tokens, or passwords found in source files
- Only npm package references matched pattern scans

### 1.3 Dependency Vulnerabilities (npm audit)
| Package | Severity | Issue | Fix |
|---------|----------|-------|-----|
| esbuild 0.27.3-0.28.0 | Low | Arbitrary file read on Windows dev server | `npm audit fix` |
| nanoid <=3.3.17 | High | Custom generators can loop indefinitely when size is zero | `npm audit fix` |
| postcss <=8.5.22 | High | Node API in browsers | `npm audit fix` |
| vite 7.0.0-7.3.3 | High | NTLMv2 hash disclosure via UNC path; `server.fs.deny` bypass on Windows | `npm audit fix --force` |

**Recommendation:** Run `npm audit fix` to resolve 3 of 4 issues. The Vite issue requires `--force` to upgrade to 7.3.6, which is outside the stated dependency range — evaluate compatibility before forcing.

### 1.4 TypeScript Compilation
- **Result:** CLEAN
- `tsc --noEmit` produced no output
- Strict mode enabled

### 1.5 Production Build
- **Result:** SUCCESS (3.22s)
- Output: `dist/index.html`
- Size: 438.94 kB (gzip: 134.45 kB)

### 1.6 Git Hygiene
- **Result:** CLEAN
- `.gitignore` covers: `node_modules`, `dist`, `.vite`, `*.local`, `.env*`, `.DS_Store`, `Thumbs.db`, `.vercel`, `CLAUDE.md`, `CLAUDE.md.original.md`, `tool-output`

### 1.7 Source Files Reviewed
- `src/App.tsx` — main application component
- `src/main.tsx` — React entry point
- `src/components/CarouselCylindricalVariant1.tsx` — carousel component
- `src/utils/cn.ts` — utility helper
- `src/index.css` — global styles

---

## 2. Mobile Project (`mobile/`)

### 2.1 Tech Stack
- **React** (via Vite)
- **Tailwind CSS** (via `@tailwindcss/vite`)
- **TypeScript** 5.x
- **Vite** 7.3.2
- **Dev server port:** 5177

### 2.2 Configuration
- `tsconfig.json`: Strict mode, ESNext, bundler module resolution, path alias `@/*` → `src/*`
- `vite.config.ts`: React + Tailwind plugins, alias configured
- `index.html`: Standard entry with `theme-color` meta tag
- `.gitignore`: Covers `node_modules`, `dist`, `.vite`, `*.local`, `.env`, `.DS_Store`, `Thumbs.db`, `.vercel`

### 2.3 Security Scan
- **Result:** CLEAN
- No exposed credentials found

### 2.4 Dependency Vulnerabilities (npm audit)
| Package | Severity | Issue | Fix |
|---------|----------|-------|-----|
| esbuild 0.27.3-0.28.0 | Low | Arbitrary file read on Windows dev server | `npm audit fix` |
| nanoid <3.3.18 | High | Custom generators can loop indefinitely when size is zero | `npm audit fix` |
| vite 7.0.0-7.3.3 | High | NTLMv2 hash disclosure; `server.fs.deny` bypass on Windows | `npm audit fix --force` |

**Note:** Mobile project does not have the `postcss` high vulnerability present in the main project.

### 2.5 TypeScript Compilation
- **Result:** CLEAN
- `tsc --noEmit` produced no output
- Strict mode enabled

### 2.6 Production Build
- **Result:** SUCCESS (3.30s)
- Output: `dist/index.html`
- Sizes:
  - HTML: 0.58 kB (gzip: 0.37 kB)
  - CSS: 35.83 kB (gzip: 6.61 kB)
  - JS: 372.07 kB (gzip: 118.72 kB)

### 2.7 Source Files Reviewed
- `mobile/src/App.tsx` — mobile application component
- `mobile/src/main.tsx` — React entry point

---

## 3. Recommendations

### Before Push
1. **Run `npm audit fix`** in both `C:\Users\Nate\PUNCTUAL-PLUMBERS-PRODUCTION` and `mobile/` to resolve 6 of 7 vulnerabilities
2. **Evaluate Vite upgrade** — the remaining high vulnerability in Vite requires `--force` to 7.3.6. Test compatibility before forcing.
3. **Verify CLAUDE.md is gitignored** — confirmed in main project `.gitignore`

### Post-Push
1. **Enable Dependabot** on GitHub to automate future dependency updates
2. **Consider adding `npm audit` to CI** to catch new vulnerabilities early
3. **Review bundle size** — main project output is 438.94 kB. Consider code splitting if not already optimized.

---

## 5. OWASP Top 10 Risk Analysis

### 5.1 A01:2021 – Broken Access Control
| Risk | Severity | Finding |
|------|----------|---------|
| N/A | — | Static marketing site. No authentication, authorization, or sensitive endpoints present. |

### 5.2 A02:2021 – Cryptographic Failures
| Risk | Severity | Finding |
|------|----------|---------|
| None | — | No passwords, tokens, or secrets in source. All external media URLs are public CDN assets (Pexels). No sensitive data at rest. |

### 5.3 A03:2021 – Injection
| Risk | Severity | Finding |
|------|----------|---------|
| None | — | No `dangerouslySetInnerHTML`, `eval`, `innerHTML`, `document.write`, or user-controlled string interpolation found. Form uses `e.preventDefault()` with client-side `alert()` only. No server-side processing. |

### 5.4 A04:2021 – Insecure Design
| Risk | Severity | Finding |
|------|----------|---------|
| Medium | Form has no backend action — `onSubmit` only shows `alert("Thank you!")`. Data is never collected or transmitted. This is a functional gap, not a direct vulnerability, but visitors may believe their details are being submitted. |

### 5.5 A05:2021 – Security Misconfiguration
| Risk | Severity | Finding |
|------|----------|---------|
| **High** | No Content-Security-Policy (CSP) header configured. Single-file bundle from `vite-plugin-singlefile` maximizes XSS impact. |
| **High** | No `X-Frame-Options` or `frame-ancestors` directive. Site could be framed for clickjacking. |
| **Medium** | No `X-Content-Type-Options: nosniff` header. MIME-type sniffing attacks possible on missing/bad content types. |
| **Medium** | External resources (Pexels videos/images, Google Fonts) loaded without Subresource Integrity (SRI) hashes. CDN compromise could serve malicious assets. |
| **Low** | No `Referrer-Policy` header. Browser may leak full URL with query params on outbound links. |

### 5.6 A06:2021 – Vulnerable and Outdated Components
| Risk | Severity | Finding |
|------|----------|---------|
| High | `nanoid <=3.3.17` — custom generators can loop indefinitely when size is zero |
| High | `postcss <=8.5.22` — Node API in browsers (main project only) |
| High | `vite 7.0.0-7.3.3` — NTLMv2 hash disclosure via UNC path; `server.fs.deny` bypass on Windows |
| Low | `esbuild 0.27.3-0.28.0` — arbitrary file read on Windows dev server |

**Remediation:** Run `npm audit fix` in both root and `mobile/`. The Vite issue requires `--force` to upgrade to 7.3.6 — evaluate compatibility first.

### 5.7 A07:2021 – Identification and Authentication Failures
| Risk | Severity | Finding |
|------|----------|---------|
| N/A | — | No login, session management, or authentication flow. Static site. |

### 5.8 A08:2021 – Software and Data Integrity Failures
| Risk | Severity | Finding |
|------|----------|---------|
| **Medium** | No SRI hashes on `<link>` (Google Fonts) or `<video>/<img>` (Pexels CDN) tags. Assets fetched over HTTPS but unverifiable. |
| **Low** | `vite-plugin-singlefile` inlines all JS/CSS into one HTML file. If build pipeline is compromised, injected code ships as a single artifact with no further integrity check. |

### 5.9 A09:2021 – Security Logging and Monitoring Failures
| Risk | Severity | Finding |
|------|----------|---------|
| N/A | — | No server-side component, logs, or monitoring to configure. |

### 5.10 A10:2021 – Server-Side Request Forgery (SSRF)
| Risk | Severity | Finding |
|------|----------|---------|
| N/A | — | No server-side requests, backends, or API proxies. |

---

## 6. Additional Security Observations

### 6.1 Privacy / OSINT Exposure
- Phone number `+27 83 237 9132` and email `punctualplumbers@outlook.com` are publicly visible in source and footer.
- **Recommendation:** Consider a contact form that submits to a backend, or use obfuscation if scraping/spam is a concern.

### 6.2 External Media Loading
| Asset | Count | Notes |
|-------|-------|-------|
| Pexels images | 9 | Loaded via `<img>` tags; no `crossorigin` needed. |
| Pexels videos | 2 | Loaded via `<video>` with `autoPlay muted loop playsInline`. No `crossorigin` attribute. |
| Google Fonts | 3 families | Loaded via `<link rel="preconnect">` + stylesheet. No SRI. |

### 6.3 Form Behavior
- The quote form on line 687 uses `onSubmit={e => { e.preventDefault(); alert("Thank you!"); }}`.
- **Impact:** Form is cosmetic. No data reaches any backend. Visitors receive no follow-up.

### 6.4 Missing Browser Security Headers
The following headers should be added at the hosting/CDN layer (e.g., Vercel, Netlify, Cloudflare):

```
Content-Security-Policy: default-src 'self'; img-src 'self' https://images.pexels.com https://videos.pexels.com; media-src 'self' https://videos.pexels.com; font-src 'self' https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self'; connect-src 'self'; frame-ancestors 'none';
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

**Note:** CSP above uses `'unsafe-inline'` for `style-src` because Framer Motion injects inline styles dynamically. A nonce-based CSP would require build-time integration.

---

## 7. Recommendations

### Before Push
1. **Run `npm audit fix`** in both root and `mobile/` to resolve 6 of 7 vulnerabilities.
2. **Evaluate Vite upgrade** to 7.3.6 (`--force`) — test compatibility.
3. **Add security headers** via hosting provider or `vercel.json` / `netlify.toml`:
   - `Content-Security-Policy`
   - `X-Frame-Options: DENY`
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`
4. **Add SRI hashes** to Google Fonts `<link>` and consider self-hosting fonts.
5. **Wire form to backend** or replace with a mailto/tel CTA if no backend exists.

### Post-Push
1. Enable Dependabot on GitHub.
2. Add `npm audit` to CI.
3. Review bundle size (438.94 kB) for code-splitting opportunities.
4. Consider `vite-plugin-singlefile` trade-off: single-file simplifies deployment but magnifies any XSS or supply-chain compromise.

---

## 8. Audit Verdict

**SAFE TO PUSH with noted gaps.** No blocking vulnerabilities found in application code. All high/critical npm issues have available fixes. Primary risks are:
- Missing security headers (mitigate at hosting layer)
- Unverified external assets (SRI recommendation)
- Cosmetic form (functional gap, not exploitable)

The codebase is production-ready from a code-quality standpoint. Apply header and dependency fixes before or immediately after deployment.
