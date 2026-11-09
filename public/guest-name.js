(function (root) {
  'use strict';
  const clean = value => String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);
  const aliases = new Set(['index.html', 'golden-floral-story-invitation.html', 'golden_floral_story.html']);
  function invitationGuestName(location, fallback = '', directory = root.INVITATION_GUESTS || {}) {
    const query = clean(new URLSearchParams(location.search || '').get('guest'));
    if (query) return query;
    const parts = String(location.pathname || '').split('/').filter(Boolean);
    if (parts.length === 1 && !aliases.has(parts[0])) {
      try {
        const slug = decodeURIComponent(parts[0]);
        const registered = Object.entries(directory).find(([key]) => key.toLowerCase() === slug.toLowerCase());
        if (registered && typeof registered[1] === 'string') return clean(registered[1]);
        // Decode after replacing separators to retain percent-encoded literal _.
        const name = clean(decodeURIComponent(parts[0].replace(/_/g, ' ')));
        if (name) return name;
      } catch (_) { /* A malformed URL keeps the invitation's default greeting. */ }
    }
    return clean(fallback);
  }
  if (typeof module === 'object' && module.exports) module.exports = invitationGuestName;
  else root.invitationGuestName = invitationGuestName;
})(typeof window === 'object' ? window : globalThis);
