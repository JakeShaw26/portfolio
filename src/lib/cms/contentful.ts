import "server-only";

type ContentfulEntry<TFields> = {
  sys: { id: string };
  fields: TFields;
};

type ContentfulEntriesResponse<TFields> = {
  items: ContentfulEntry<TFields>[];
};

/**
 * Reads Contentful config from `process.env` on every call rather than once at
 * module scope, so a missing var throws when the fetch is actually attempted
 * (surfacing in build/test output) instead of at arbitrary import time.
 */
function getConfig() {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const environment = process.env.CONTENTFUL_ENVIRONMENT ?? "master";
  const deliveryToken = process.env.CONTENTFUL_DELIVERY_TOKEN;

  if (!spaceId || !deliveryToken) {
    throw new Error(
      "Contentful is not configured: set CONTENTFUL_SPACE_ID and CONTENTFUL_DELIVERY_TOKEN.",
    );
  }

  return { spaceId, environment, deliveryToken };
}

/**
 * Fetches all entries of a content type from the Contentful Content Delivery
 * API. Token is sent via the `Authorization` header (not `?access_token=`) so
 * it never ends up in a logged URL.
 */
export async function fetchEntries<TFields>(
  contentType: string,
  query: Record<string, string> = {},
): Promise<ContentfulEntry<TFields>[]> {
  const { spaceId, environment, deliveryToken } = getConfig();

  const params = new URLSearchParams({ content_type: contentType, ...query });
  const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}/entries?${params}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${deliveryToken}` },
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Contentful responded ${res.status}: ${detail}`);
  }

  const data = (await res.json()) as ContentfulEntriesResponse<TFields>;
  return data.items;
}
