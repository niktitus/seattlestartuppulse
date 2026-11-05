type RecordValue = Record<string, unknown>;

function record(value: unknown): RecordValue | undefined {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as RecordValue : undefined;
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.replace(/<[^>]*>/g, '').trim() : '';
}

function findEvent(value: unknown): RecordValue | undefined {
  if (Array.isArray(value)) {
    for (const item of value) {
      const event = findEvent(item);
      if (event) return event;
    }
    return;
  }
  const item = record(value);
  if (!item) return;
  const types = Array.isArray(item['@type']) ? item['@type'] : [item['@type']];
  if (types.includes('Event') && text(item.name) && text(item.startDate)) return item;
  return findEvent(item['@graph']);
}

/** Read complete, publisher-provided event data before attempting AI extraction. */
export function extractEventMetadata(html: string) {
  const scripts = html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  for (const script of scripts) {
    let event: RecordValue | undefined;
    try { event = findEvent(JSON.parse(script[1])); } catch { continue; }
    if (!event) continue;
    const start = text(event.startDate);
    const match = start.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/);
    if (!match || Number.isNaN(Date.parse(start))) continue;
    // Keep the published local day and time, not the edge server's UTC day.
    const date = new Date(`${match[1]}-${match[2]}-${match[3]}T12:00:00Z`);
    const hour = Number(match[4]);
    const time = match[4] ? `${hour % 12 || 12}:${match[5]} ${hour >= 12 ? 'PM' : 'AM'}` : 'TBD';
    const location = record(event.location);
    const address = record(location?.address);
    const mode = text(event.eventAttendanceMode);
    const format = mode.includes('Mixed') ? 'hybrid' : mode.includes('Online') || location?.['@type'] === 'VirtualLocation' ? 'virtual' : 'inperson';
    const organizers = Array.isArray(event.organizer) ? event.organizer : [event.organizer];
    const names = [...new Set(organizers.map(value => text(record(value)?.name)).filter(Boolean))];
    const offers = Array.isArray(event.offers) ? event.offers : [event.offers];
    const prices = offers.map(value => record(value)?.price).filter(value => value !== undefined && value !== null && value !== '').map(Number).filter(Number.isFinite);
    return {
      title: text(event.name).slice(0, 200),
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
      time,
      organizer: names.join(', ').slice(0, 100) || 'Unknown',
      description: text(event.description).slice(0, 500),
      format,
      type: 'Event',
      city: format === 'virtual' ? 'Virtual' : text(address?.addressLocality) || text(location?.name) || 'Seattle',
      cost: prices.length ? Math.min(...prices) === 0 ? 'Free' : `$${Math.min(...prices)}` : 'Varies',
      confidence: 'high',
    };
  }
  return undefined;
}