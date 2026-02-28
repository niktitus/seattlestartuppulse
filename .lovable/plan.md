

## Change Digest "Worth Your Time" to "Check This Out" with Resource Links

### What's changing
The fallback section in the weekly digest email currently shows **learning resources** under the heading "Worth Your Time This Week." This will be replaced with a **"Check This Out"** section that pulls curated links from the **Startup Resources**, **Diagnostic Tools**, and **Operational** categories in the `resource_links` table.

### Changes

**File: `supabase/functions/send-digest/index.ts`**

1. **Replace learning resource fetch** with a query to `resource_links` filtered to categories: `'Startup Resources'`, `'Diagnostic Tools'`, `'Operational'`
2. **Update the HTML builder** to render resource links (name, description, URL) instead of learning course items
3. **Rename the section** from "Worth Your Time This Week" to "Check This Out" (with a different emoji, e.g. a star or link icon)
4. **Remove** the unused `learning` query and `learningItems` HTML builder since they're no longer needed
5. **Update the function signature** of `buildEmailHtml` to accept resource links instead of learning resources

### Technical details

- Query: `supabase.from('resource_links').select('*').eq('is_approved', true).in('category', ['Startup Resources', 'Diagnostic Tools', 'Operational']).order('sort_order').limit(5)`
- Each item renders as: **name** (bold), description text, and a "Check it out" link
- The fallback logic stays the same: only show when fewer than 2 primary sections have content
