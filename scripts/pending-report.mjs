/**
 * pending-report.mjs — what the client still owes.
 *
 * The pending-input pattern only works if the pending list stays VISIBLE. A guard
 * that silently hides a missing field is indistinguishable from a field that was
 * never needed, and six months later nobody remembers the site is running without
 * an address. This prints the ledger on every build.
 *
 * Nothing here fails a build. These are owner inputs, not code defects.
 */
import { business, pendingFields } from '../src/data/business.ts';
import { locations } from '../src/data/locations.ts';
import { CONFIRMED_TIERS, territoryLocations, buildableLocations, stagedLocations } from '../src/lib/geo.ts';

const pending = pendingFields();

console.log('\n─── Pending client input ' + '─'.repeat(44));

if (pending.length === 0) {
  console.log('  ✓ business.ts is fully populated.');
} else {
  console.log(`  ${pending.length} field(s) outstanding:\n`);
  const blockers = {
    B1: 'address, hours, legal name — LocalBusiness + GBP entity connection',
    B2: 'NAP primary phone — 713 (Houston) currently leads on a Brownsville business',
    B3: 'named expert + credentials — Person node, hasCredential, E-E-A-T block',
  };
  for (const f of pending) console.log(`    · ${f}`);
  console.log('');
  for (const [k, v] of Object.entries(blockers)) console.log(`    ${k}: ${v}`);
}

console.log('\n─── Territory (B4) ' + '─'.repeat(50));
console.log(`  Confirmed tiers : ${CONFIRMED_TIERS.join(', ')}`);
console.log(`  In territory    : ${territoryLocations().length} location(s)`);
console.log(`  Buildable now   : ${buildableLocations().length} (in territory AND researched)`);
console.log(`  Staged, blocked : ${stagedLocations().length} (awaiting B4 confirmation)`);

const unresearched = territoryLocations().filter((l) => !l.researched);
if (unresearched.length) {
  console.log(`\n  areaServed-only until researched (capacity gate):`);
  for (const l of unresearched) console.log(`    · ${l.name}`);
}

console.log('\n─── NAP in use ' + '─'.repeat(54));
const nap = business.phone.napPrimary ? business.phone : business.phoneSpanish;
console.log(`  Primary : ${nap.display}${business.phone.napPrimary ? '  ⚠ Houston area code — see B2' : ''}`);
console.log(`  Spanish : ${business.phoneSpanish.display}`);
console.log(`  Email   : ${business.email}${business.email.endsWith('@gmail.com') ? '  ⚠ free mailbox — see P1-2' : ''}`);
console.log('');
