---
name: security-audit
description: 'Complete security audit met OWASP Top 10, vulnerability scanning en penetration testing preparation.'
---

# Security Audit Skill

## Wanneer te gebruiken
- Voor product releases
- Na security incidents
- Regelmatig (bijv. maandelijks)

## Tools Used
- **OWASP ZAP**: Automated vulnerability scanning
- **Snyk**: Dependency scanning
- **SonarQube**: Code quality & security
- **Burp Suite**: Manual penetration testing

## GCP-specifiek (Subscription Tracker)
- **Secret Manager**: Geen credentials in code; `db-url` voor DATABASE_URL
- **Cloud Run IAM**: Least privilege voor service account
- **CORS**: Beperk tot frontend Cloud Run URL
- **Firebase Auth**: Token verify via Admin SDK — nooit client vertrouwen

## Audit Procedure
1. **Automated Scan**: `npm run security:scan`
2. **Dependency Check**: `npm audit`
3. **Code Review**: PenPeter reviewt kritieke code
4. **Configuration Review**: Environment variables, secrets management
5. **Compliance Check**: GDPR, SOC 2, etc.

## OWASP Secure Headers (2025)

### Content-Security-Policy (CSP)
CSP beperkt resource loading en beschermt tegen XSS, clickjacking. **Vermijd wildcards** (`*`). Aanbevolen:

- `script-src 'nonce-r4nd0m' 'strict-dynamic'; object-src 'none'; base-uri 'none';`
- Valideer met Google CSP Evaluator

### Essentiële headers
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

## Output Format
```markdown
# Security Audit Report - [DATE]

## 🚨 Executive Summary
- **Critical Vulnerabilities**: 2
- **High Vulnerabilities**: 5
- **Medium Vulnerabilities**: 8
- **Overall Risk Score**: 7.2/10

## 🔍 Detailed Findings
### Critical
1. **[Vulnerability Name]**
   - **Location**: [File:line]
   - **Description**: [Wat is het probleem]
   - **Impact**: [Wat kan er misgaan]
   - **Remediation**: [Hoe op te lossen]
   - **References**: [OWASP, CVE, etc.]

## 📊 Compliance Matrix
| Requirement | Status | Notes |
|-------------|--------|-------|
| Input Validation | ❌ Failed | Multiple endpoints missing |
| Authentication | ✅ Passed | Using secure JWT implementation |
| Authorization | ⚠️ Partial | Some endpoints lack proper checks |

## 🛡️ Action Plan
1. **Immediate**: [Kritieke acties]
2. **Short-term**: [Binnen 2 weken]
3. **Long-term**: [Binnen 2 maanden]
```
