# LyndaPlus Firestore Security Specification (Phase 0 TDD)

## 1. Data Invariants
1. **Strict Owner Isolation**: Every document across `/projects`, `/insights`, `/sessions`, `/participants`, `/tasks`, and `/driveExports` carries an immutable `ownerId` matching `request.auth.uid`. Verified email (`request.auth.token.email_verified == true`) is required for all writes.
2. **Relational Integrity**: Creating an `/insights/{insightId}` or `/sessions/{sessionId}` document requires that the referenced `/projects/{projectId}` exists and belongs to the same `request.auth.uid`.
3. **Terminal State Locking**: Once a `/projects/{projectId}` or `/sessions/{sessionId}` reaches `status == 'Completed'`, client updates are rejected (unless executed by a verified workspace admin).
4. **Strict Key & Size Enforcement**: Every create verifies `hasAll` and `hasOnly` allowed keys; every update verifies `isValid[Entity](incoming())`, `affectedKeys().hasOnly(...)`, `ownerId == existing().ownerId`, `createdAt == existing().createdAt`, and `updatedAt == request.time`.
5. **Bounded Arrays**: `participants/{participantId}.tags` is bounded to `size() <= 10` with type validation.
6. **Immutable Audit Trail**: `/driveExports/{exportId}` records are append-only (updates rejected; owner can read/list/delete their own records).
7. **Secure List Queries**: Every `allow list` checks `resource.data.ownerId == request.auth.uid` directly with zero `get()`/`exists()` lookups inside `list` blocks.

## 2. The "Dirty Dozen" Adversarial Payloads (All Must Return PERMISSION_DENIED)
1. **Identity Spoofing on Create**: `POST /projects/p1` with `ownerId: "victim-uid"` while signed in as `"attacker-uid"`.
2. **Unverified Email Write**: `POST /projects/p2` with `request.auth.token.email_verified == false`.
3. **Shadow Field Injection**: `POST /projects/p3` containing all valid fields plus extra ghost field `isAdmin: true`.
4. **Path ID Poisoning**: `POST /projects/../../../etc/passwd` or a 300-character document ID.
5. **Denial-of-Wallet String Bloat**: `POST /insights/i1` with a 50KB `description` string exceeding `maxLength: 1500`.
6. **Orphaned Insight Creation**: `POST /insights/i2` referencing a non-existent or another user's `projectId`.
7. **Terminal State Mutation**: `PATCH /projects/completed-study` attempting to change `status` from `'Completed'` back to `'Live'`.
8. **Immutable Field Tampering**: `PATCH /projects/p1` attempting to modify `ownerId` or `createdAt`.
9. **Client Timestamp Forgery**: `POST /tasks/t1` with a backdated `createdAt` not equal to `request.time`.
10. **Array Overflow / Type Poisoning**: `POST /participants/part1` with 15 tags or `tags: [12345]`.
11. **Cross-Tenant PII Read / Scrape**: `GET` or `LIST` on `/participants` without `ownerId == request.auth.uid`.
12. **Audit Trail Tampering**: `PATCH /driveExports/exp1` trying to alter `driveFileId` or `action` after creation.
