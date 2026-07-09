/**
 * GA4 Event tracking utility.
 *
 * Provides type-safe event tracking functions that align with
 * the Google skill recommendations (event-and-key-event-mapping.md).
 *
 * All events respect Consent Mode v2 - if consent has not been granted
 * for analytics_storage, gtag will queue the events but they won't
 * be sent until consent is granted.
 */

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

/**
 * Safely call gtag if available.
 */
function gtag(...args: unknown[]) {
  try {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag(...args);
    }
  } catch {
    // Silently fail in environments without gtag
  }
}

/**
 * Track user sign-up / registration.
 *
 * Recommended event: sign_up
 *
 * @param method - The method used to sign up (e.g., 'website_form', 'google', 'email')
 * @param accountType - The type of account (e.g., 'shopper', 'patient')
 */
export function trackSignUp(method: string = "website_form", accountType?: string) {
  gtag("event", "sign_up", {
    method,
    ...(accountType ? { account_type: accountType } : {}),
  });
}

/**
 * Track lead generation (form submissions, inquiries, newsletter).
 *
 * Recommended event: generate_lead
 *
 * @param leadType - Type of lead (e.g., 'newsletter', 'store_owner_registration', 'inquiry')
 * @param value - Optional monetary value
 * @param currency - ISO 4217 currency code (required if value is set)
 * @param formId - Optional form identifier
 */
export function trackGenerateLead(
  leadType: string,
  value?: number,
  currency?: string,
  formId?: string
) {
  gtag("event", "generate_lead", {
    method: "website_form",
    lead_type: leadType,
    ...(value !== undefined ? { value } : {}),
    ...(currency ? { currency } : {}),
    ...(formId ? { form_id: formId } : {}),
  });
}

/**
 * Track login success.
 *
 * Recommended event: login
 *
 * @param method - The login method (e.g., 'password', 'google', 'otp')
 */
export function trackLogin(method: string = "password") {
  gtag("event", "login", { method });
}

/**
 * Track site search.
 *
 * Recommended event: search
 *
 * @param searchTerm - The user's search query
 */
export function trackSearch(searchTerm: string) {
  gtag("event", "search", { search_term: searchTerm });
}

/**
 * Track content selection (CTA clicks, navigation, etc.).
 *
 * Recommended event: select_content
 *
 * @param contentType - Type of content selected (e.g., 'doctor', 'treatment', 'hospital')
 * @param itemId - Identifier for the selected item
 */
export function trackSelectContent(contentType: string, itemId?: string) {
  gtag("event", "select_content", {
    content_type: contentType,
    ...(itemId ? { item_id: itemId } : {}),
  });
}

/**
 * Track a lead close/convert event (for store owner approval flow).
 *
 * Recommended event: close_convert_lead
 *
 * @param leadType - The type of lead converted
 * @param value - Optional monetary value
 */
export function trackCloseConvertLead(leadType: string, value?: number) {
  gtag("event", "close_convert_lead", {
    lead_type: leadType,
    ...(value !== undefined ? { value } : {}),
  });
}

/**
 * Track an inquiry form submission.
 *
 * Custom event using recommended generate_lead pattern.
 *
 * @param formId - Identifier for the form
 * @param inquiryType - Type of inquiry (e.g., 'doctor', 'hospital', 'treatment')
 */
export function trackInquirySubmission(formId: string, inquiryType: string) {
  trackGenerateLead("inquiry", undefined, undefined, `${formId}_${inquiryType}`);
}

/**
 * Track newsletter subscription.
 *
 * Uses recommended generate_lead event.
 *
 * @param formId - Newsletter form identifier
 */
export function trackNewsletterSubscription(formId: string = "newsletter") {
  trackGenerateLead("newsletter", undefined, undefined, formId);
}