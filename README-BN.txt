WEBSITESDEAL ADMIN STARTER — READ FIRST

Files:
- index.html         Public storefront preview
- admin-login.html   Login screen preview (NOT secure authentication)
- admin.html         Admin Studio UI with banner/listing editor
- dashboard.html    Dashboard preview

IMPORTANT SECURITY LIMITATIONS
1. This is a static HTML starter, not a production-secure admin system.
2. admin-login.html intentionally has no default password and does not authenticate users.
3. admin.html is directly accessible if uploaded to public static hosting. Do not publish it as a real admin system until server-side authentication and authorization are connected.
4. Listing and banner edits use browser localStorage. They affect only that browser and do not publish content to all visitors/devices.
5. A real shared marketplace requires a backend/database and protected API rules. Keep secret keys and admin passwords on the server, never in HTML/JavaScript.

LOCAL PREVIEW
Open index.html in a browser. Open admin.html to test the listing editor. Because localStorage is browser-specific, the storefront preview will only reflect changes when both pages share the same origin (for example, served locally from the same folder using a local static server).

This package preserves the green/dark WebsitesDeal visual direction and provides a starting UI, not a complete production backend.
