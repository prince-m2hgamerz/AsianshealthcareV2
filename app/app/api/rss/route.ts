import { createClient } from "@supabase/supabase-js";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://medsolutionhealthcare.com";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: posts } = await supabase
    .from("blogs")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(20);

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Med Solution Healthcare - Medical Tourism Blog</title>
    <link>${siteUrl}</link>
    <description>Guides and resources on medical tourism in India — treatment costs, hospital comparisons, visa tips, and patient stories.</description>
    <language>en</language>
    <atom:link href="${siteUrl}/api/rss" rel="self" type="application/rss+xml"/>
    ${(posts || []).map((p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${siteUrl}/blogs/${p.slug}</link>
      <description><![CDATA[${(p.content || "").replace(/<[^>]+>/g, "").substring(0, 300)}]]></description>
      <pubDate>${p.published_at ? new Date(p.published_at).toUTCString() : ""}</pubDate>
      <guid>${siteUrl}/blogs/${p.slug}</guid>
      <category>${p.category || "General"}</category>
    </item>`).join("\n")}
  </channel>
</rss>`,
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    }
  );
}
