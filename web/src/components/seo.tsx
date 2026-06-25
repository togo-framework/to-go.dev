import { Helmet } from "react-helmet-async";

const SITE = "https://to-go.dev";
const DEFAULT_DESC =
  "ToGO is an open-source, API-first full-stack framework: a Laravel-artisan-grade CLI for the Go + sqlc + Atlas + React stack. One binary, one repo, zero glue.";

export function Seo({
  title,
  description = DEFAULT_DESC,
  path = "/",
  type = "website",
  jsonLd,
}: {
  title?: string;
  description?: string;
  path?: string;
  type?: string;
  jsonLd?: Record<string, unknown>;
}) {
  const url = `${SITE}${path}`;
  const full = title ? `${title} — ToGO` : "ToGO — ship your Go backend and React frontend as one binary";
  return (
    <Helmet>
      <title>{full}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:site_name" content="ToGO" />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={`${SITE}/og-image.png`} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="togo — full-stack Go + React framework" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={full} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE}/og-image.png`} />
      <script type="application/ld+json">
        {JSON.stringify(
          jsonLd ?? {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "ToGO",
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Linux, macOS, Windows",
            description: DEFAULT_DESC,
            url: SITE,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            license: "https://opensource.org/licenses/MIT",
          },
        )}
      </script>
    </Helmet>
  );
}
