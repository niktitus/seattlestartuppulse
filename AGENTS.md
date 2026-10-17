# Architecture
- Keep the Void standalone from the public layout to avoid newsletter and tracking side effects.
- Route Void writes through a validating Edge Function; deny direct raw table access and publish only thresholded aggregates.
- Protect Void administration using the existing server-verified admin JWT, not client-side identity claims.
- Keep Void policy helpers shared between server code and focused tests to enforce privacy thresholds and redaction consistently.
- Leave the Void's retired arena column unused: the question was removed, so never collect it, filter on it, or split published counts by it. Theme counts pool across all shouters per theme and month so the five-shout privacy floor is measured on the real audience.