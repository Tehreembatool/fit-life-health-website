const SUPABASE_URL = 'https://fldlhdvgbmserbazswoj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_jt_cPtAmHSb8_mXnoFNQyw_aZ63sRAC';

// Create Supabase client
window.supabase = window.supabase.createClient('https://fldlhdvgbmserbazswoj.supabase.co', 'sb_publishable_jt_cPtAmHSb8_mXnoFNQyw_aZ63sRAC');

// Auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event);
  if (event === 'SIGNED_IN') {
    console.log('User signed in:', session.user.email);
    // Redirect to home page after login
    window.location.href = 'index.html';
  }
});