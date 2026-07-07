export function sanitizeHtml(html: string): string {
  const ALLOWED_TAGS = new Set([
    "p", "br", "b", "i", "em", "strong", "a", "ul", "ol", "li",
    "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "pre", "code",
    "img", "figure", "figcaption", "hr", "div", "span", "table", "thead",
    "tbody", "tr", "th", "td", "sub", "sup", "small",
  ]);

  const ALLOWED_ATTRS = new Set(["href", "target", "rel", "src", "alt", "title", "class", "width", "height"]);

  const ALLOWED_PROTOCOLS = ["http:", "https:", "mailto:"];

  let result = html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/on\w+\s*=\s*'[^']*'/gi, "")
    .replace(/on\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/<(\/?)(\w+)[^>]*>/g, (match, slash, tag) => {
      const lowerTag = tag.toLowerCase();
      if (!ALLOWED_TAGS.has(lowerTag)) return "";
      if (slash) return `</${lowerTag}>`;

      const attrs: string[] = [];
      const attrRegex = /(\w+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+))/g;
      let attrMatch;
      while ((attrMatch = attrRegex.exec(match)) !== null) {
        const attrName = attrMatch[1].toLowerCase();
        if (ALLOWED_ATTRS.has(attrName)) {
          const attrVal = attrMatch[2] || attrMatch[3] || attrMatch[4] || "";
          if (attrName === "href" || attrName === "src") {
            const lower = attrVal.toLowerCase();
            if (ALLOWED_PROTOCOLS.some((p) => lower.startsWith(p))) {
              attrs.push(`${attrName}="${attrVal.replace(/"/g, "&quot;")}"`);
            }
          } else {
            attrs.push(`${attrName}="${attrVal.replace(/"/g, "&quot;")}"`);
          }
        }
      }
      return attrs.length ? `<${lowerTag} ${attrs.join(" ")}>` : `<${lowerTag}>`;
    });

  return result;
}
