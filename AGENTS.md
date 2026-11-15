# Architecture
- Event URL submissions parse publisher JSON-LD first, with extraction regression tests beside the function, so complete event data does not depend on AI output.
- Keep the Void standalone from the public layout to avoid newsletter and tracking side effects.
- Route Void writes through a validating Edge Function; deny direct raw table access and publish only thresholded aggregates.
- Protect Void administration using the existing server-verified admin JWT, not client-side identity claims.
- Keep Void policy helpers shared between server code and focused tests to enforce privacy thresholds and redaction consistently.
- Leave the Void's retired arena column unused: the question was removed, so never collect it, filter on it, or split published counts by it. Theme counts pool across all shouters per theme and month so the five-shout privacy floor is measured on the real audience.- Coffee personal emails (confirmations, match intros, check-ins, personal notes) are only drafted into the outbox table and sent after admin approval; matching rules live in supabase/functions/_shared/coffee-match.ts with tests, so behavior stays reviewable and human-in-the-loop.
- Intelligence page writes (event tracking, lifecycle edits, pulse posts, agrees, track follows) go through the `intelligence` Edge Function; lifecycle edits require a per-browser edit token instead of login, and the token column is never granted to public roles. Forecast math lives in src/lib/forecast.ts with tests.
