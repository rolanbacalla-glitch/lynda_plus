# LyndaPlus Firestore Security Specification (Phase 0 TDD)

## 1. Data Invariants
1. **Strict Owner Isolation & Verified Admin RBAC**: Every document across `/projects`, `/insights`, `/sessions`, `/participants`, `/tasks`, and `/driveExports` carries an immutable `ownerId`. Standard users may only access documents where `ownerId == request.auth.uid`. The verified root administrator (`request.auth.token.email_verified == true && request.auth.token.email.lower() == 'rolan.bacalla@gmail.com'`) and delegated administrators in `/admins/{uid}` possess full workspace governance rights (`get`, `create`, `update`, `delete`), while `allow list` remains O(1) with zero DB lookups (`resource.data.ownerId == request.auth.uid || isBootstrappedAdmin()`).
2. **Relational Integrity**: Creating an `/insights/{insightId}` or `/sessions/{sessionId}` document requires that the referenced `/projects/{projectId}` exists and belongs to `request.auth.uid` (or the caller is a verified administrator).
3. **Terminal State Locking with Admin Override**: Once a `/projects/{projectId}` or `/sessions/{sessionId}` reaches `status == 'Completed'`, standard user updates are rejected; only verified administrators may override or reopen completed records.
4. **Strict Key & Size Enforcement**: Every create and update validates `hasAll` and `hasOnly` allowed keys, string lengths, numeric ranges, immutable `ownerId`/`createdAt`, and `updatedAt == request.time`.
5. **Bounded Arrays**: `participants/{participantId}.tags` is bounded to `size() <= 10` with type validation.
6. **Immutable Audit Trail**: `/driveExports/{exportId}` records cannot be mutated after creation (`allow update: if false`); owners and verified administrators may delete stale audit logs.
7. **Workspace Governance Isolation**: `/workspaceSettings/{settingId}` is readable by signed-in users (`get`) and writable (`create`/`update`) exclusively by verified administrators (`delete` forbidden).
8. **Zero Self-Escalation on `/admins/{adminUid}`**: Non-admin users can never write to `/admins/{adminUid}` or list all admins; a user may only `get` their own `/admins/$(request.auth.uid)` record to verify delegated admin status.

## 2. Adversarial Payloads (All Must Return PERMISSION_DENIED)
1. **Identity Spoofing on Create**: `POST /projects/p1` with `ownerId: "victim-uid"` while signed in as a non-admin `"attacker-uid"`.
2. **Unverified Admin Email Spoofing**: Request with `email: "rolan.bacalla@gmail.com"` and `email_verified: false` attempting to list `/projects` or write `/workspaceSettings/global`.
3. **Shadow Field Injection**: `POST /projects/p3` or `PATCH /workspaceSettings/global` containing an extra ghost field `superAdmin: true`.
4. **Path ID Poisoning**: `POST /projects/../../../etc/passwd` or a 300-character document ID.
5. **Denial-of-Wallet String Bloat**: `POST /insights/i1` with a 50KB `description` string exceeding `maxLength: 1500`.
6. **Orphaned Insight Creation**: `POST /insights/i2` referencing a non-existent or another user's `projectId` by a non-admin.
7. **Terminal State Mutation by Non-Admin**: `PATCH /projects/completed-study` attempting to change `status` from `'Completed'` back to `'Live'` as a standard user.
8. **Immutable Field Tampering**: `PATCH /projects/p1` attempting to modify `ownerId` or `createdAt` (even by an admin).
9. **Client Timestamp Forgery**: `POST /tasks/t1` with a backdated `createdAt` not equal to `request.time`.
10. **Array Overflow / Type Poisoning**: `POST /participants/part1` with 15 tags or `tags: [12345]`.
11. **Cross-Tenant PII Read / Scrape**: `GET` or `LIST` on `/participants` by a non-admin without `ownerId == request.auth.uid`.
12. **Audit Trail Tampering**: `PATCH /driveExports/exp1` trying to alter `driveFileId` or `action` after creation.
13. **Admin Privilege Self-Escalation**: Non-admin user attempting `PUT /admins/{ownUid}` to grant themselves Admin status.
14. **Unauthorised Governance Mutation**: Standard user attempting `PATCH /workspaceSettings/global` to disable `samlSsoEnforced` or inflate `synthesisHoursPool`.
