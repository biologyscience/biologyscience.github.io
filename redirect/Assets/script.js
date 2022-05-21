const redirectTo = new URLSearchParams(window.location.search).get('to');

if (redirectTo === null || redirectTo === 'link') { window.location.href = 'oops'; }

else { window.location.href = redirectTo; }