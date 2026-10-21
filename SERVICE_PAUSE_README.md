# Temporary service pause switch

1. Deploy these files to the existing Vercel project with DATABASE_URL and SESSION_SECRET configured.
2. Log in to `/admin` and turn **Temporarily Pause Services** ON. The default is OFF until you toggle it.
3. The setting persists in Neon (`site_settings` table, created on first access). The database user needs CREATE TABLE permission on first use.
4. Homepage and services show the announcement, booking page hides the form, and `/api/booking` plus `/api/availability` block new customer bookings. Existing admin booking records and enquiries remain available.
5. Turn the switch OFF to resume online booking.

The server rechecks status before inserting a booking; an already-running booking submission could still race with the switch. For strict atomic enforcement, implement a database transaction/lock around both the status check and booking insert.

Test on Vercel Preview before production; verify ON/OFF state, mobile pages, customer booking API, admin login, and database permissions.
