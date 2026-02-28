

## Move "I want to start a company" to Resource Page Feature Cards

### What's changing
The "I want to start a company" link will be added as a third card on the Resources page, alongside the existing "Learning & Development" and "Fractional Services" cards in the feature call-outs section.

### Changes

**File: `src/pages/ResourcesPage.tsx`**

Add a third card in the feature call-outs section that links to the same page with the `?section=I+want+to+start+a+company` query parameter. It will match the styling of the existing two cards -- a rounded bordered box with a title, description, and arrow indicator. Clicking it will scroll the page to the resource list filtered to that category.

Instead of navigating to a new page, this card will simply update the `activeSection` state to "I want to start a company" and scroll to the resource list, since the content is already on the same page.

### Technical detail

- Add a `<button>` or clickable `<div>` styled identically to the Learning and Fractional cards
- On click, set `activeSection` to `'I want to start a company'`
- Title: "I want to start a company", Description: "Resources to help you get started"
- Same arrow indicator (`→`) as the other cards
