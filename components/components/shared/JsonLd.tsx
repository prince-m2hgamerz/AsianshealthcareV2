type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export function JsonLd({ data }: { data: Record<string, JsonValue> | Record<string, JsonValue>[] }) {
  const json = Array.isArray(data)
    ? { "@context": "https://schema.org", "@graph": data }
    : { "@context": "https://schema.org", ...data };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}
