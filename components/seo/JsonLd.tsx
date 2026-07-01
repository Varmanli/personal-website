/**
 * Renders a JSON-LD <script> for structured data. Safe to use in server
 * components; the payload is serialized and injected as a string.
 */
export function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
