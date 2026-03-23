

## Plan: Add Digest Send Log

### What we're building
A `digest_send_log` table to record every digest send, plus a new "Digest Log" tab in the admin panel to view send history.

### Database changes

**New table: `digest_send_log`**
- `id` (uuid, PK)
- `sent_at` (timestamptz, default now())
- `total_subscribers` (integer)
- `total_sent` (integer)
- `errors` (jsonb, nullable) — array of error strings
- `triggered_by` (text, nullable) — e.g. "admin"
- RLS: SELECT blocked publicly (false), no INSERT/UPDATE/DELETE for public — only accessible via service role in edge functions and admin-list-all

Add `'digest_send_log'` to the allowed tables in `admin-list-all` edge function.

### Edge function changes

**`send-digest/index.ts`**: After sending all batches, insert a row into `digest_send_log` with the subscriber count, sent count, and any errors.

### Admin UI changes

**`src/pages/Admin.tsx`**:
- Add a "Digest Log" tab (with a mail/send icon)
- Fetch from `admin-list-all?table=digest_send_log` on tab load
- Display a simple table: Date/Time, Subscribers, Sent, Errors (show count or "None")
- Sorted by `sent_at` descending (newest first)

### Technical details

1. **Migration**: Create `digest_send_log` table with RLS policy blocking public SELECT
2. **`admin-list-all`**: Add `'digest_send_log'` to the allowed tables array
3. **`send-digest`**: Insert log row using the service-role supabase client after batch loop completes
4. **Admin.tsx**: Add state, fetch logic, tab trigger, and tab content for digest log display

