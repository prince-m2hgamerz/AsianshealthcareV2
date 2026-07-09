---
name: adsense-approval-audit
description: Audit a website for Google AdSense approval readiness by checking content quality, policy compliance, SEO, trust signals, UX, performance, and technical issues. Use this skill whenever the user asks about AdSense approval, website review, monetization readiness, or pre-launch audits.
version: 1.0.0
---

# Google AdSense Approval Audit

## Purpose

Evaluate a website against Google AdSense requirements and identify issues that may reduce the likelihood of approval.

This skill performs a structured review and provides actionable recommendations. It does **not** guarantee approval, as only Google can make the final decision.

---

## Inputs

- Website URL
- Optional:
  - Sitemap URL
  - Login credentials (if private pages should be reviewed)
  - Target country
  - Website type (Blog, SaaS, Documentation, Marketplace, Forum, Portfolio, etc.)

---

## Audit Workflow

### 1. Crawl the Website

Review:

- Home
- About
- Contact
- Privacy Policy
- Terms
- Blog
- Documentation
- Pricing
- FAQ
- All discoverable public pages

Ignore:

- Admin
- Authentication
- API endpoints

---

### 2. Review Content

Check for:

- Original content
- Thin pages
- Placeholder text
- Duplicate pages
- Grammar
- Readability
- Helpful information
- Enough unique content

---

### 3. Policy Review

Verify compliance with Google AdSense content policies.

Look for:

- Copyright infringement
- Adult content
- Dangerous content
- Misleading claims
- Spam
- AI-generated low-value pages
- Auto-generated content
- Excessive affiliate content

---

### 4. Trust Review

Confirm the presence of:

- About page
- Contact page
- Privacy Policy
- Terms of Service
- Brand identity
- Company information
- Support information

---

### 5. UX Review

Evaluate:

- Mobile responsiveness
- Navigation
- Accessibility
- Broken links
- Empty states
- Loading experience

---

### 6. Technical Review

Check:

- HTTPS
- Broken images
- Console errors
- Sitemap
- robots.txt
- Canonical tags
- Meta titles
- Meta descriptions

---

### 7. Performance Review

Review:

- Image optimization
- Core Web Vitals
- JavaScript size
- CSS size
- Lazy loading

---

### 8. AdSense Readiness

Identify common rejection risks, including:

- Low-value pages
- Insufficient content
- Under construction pages
- Duplicate content
- Poor navigation
- Lack of trust pages
- User-generated spam

---

## Output Format

Return:

### Summary

- Overall readiness (0–100)
- Estimated approval likelihood:
  - High
  - Moderate
  - Low

### Findings

For each issue provide:

- Severity
- Page
- Problem
- Reason
- Recommendation

### Strengths

Highlight what the site already does well.

### Final Checklist

Provide a prioritized list of remaining tasks before applying for AdSense.

---

## Guidelines

- Base recommendations on publicly available Google AdSense guidance.
- Do not guarantee approval.
- Separate confirmed issues from suggestions.
- Prioritize fixes that are most likely to improve review readiness.