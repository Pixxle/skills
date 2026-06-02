# Surface Discovery — building the route inventory

Goal: a precise map of `endpoint → auth requirement → authorization check → object/tenant-scope
parameter`, so the access-control agent attacks with intent instead of fuzzing blindly. Combine the
**live** surface (what the running app exposes) with the **source** surface (what the code declares,
if the project source is in the CWD).

## 1. Live surface

- **OpenAPI/Swagger**: try `/swagger/v1/swagger.json`, `/openapi.json`, `/v3/api-docs`,
  `/swagger/index.html`, `/api-docs`. Record every path, method, parameter, request/response schema.
- **GraphQL**: try `/graphql`; if present, run an introspection query to enumerate queries,
  mutations, and types (each field is an authorization decision point).
- **Robots/sitemap/JS bundles**: for a browser app, pull the SPA bundle and grep for API paths.
- Record which endpoints are reachable through the public base URL vs only on internal/service
  ports — exposure-by-assumption is itself attack surface.

## 2. Source surface (if code is present in the CWD)

Use whatever the project is. Map the framework's routing + auth idioms to the inventory:

- **Routes + verbs**: route decorators/attributes/registration (e.g. Express `app.get`, Flask
  `@app.route`, Spring `@GetMapping`, ASP.NET `[HttpGet]`, Rails routes, Django urls, Go mux).
- **Authentication gate**: middleware/guards/attributes that require a logged-in principal
  (`@Authorize`, `requireAuth`, `login_required`, `before_action :authenticate`, auth middleware),
  and which routes are explicitly public (`AllowAnonymous`, `@PublicRoute`, no guard).
- **Authorization check**: the in-handler call that decides *whether this principal may act on this
  object* — role/permission checks, policy calls, ownership checks (`if (resource.ownerId !=
  currentUser.id)`), tenant-scope filters in the query (`where org_id = ?`). Record the exact
  check and the object/tenant field it keys on.
- **Scope-consistency risk**: handler checks permission on object X but the data-access query takes
  an ID straight from the request, or filters on a different field than the check used. Flag these.

## 3. Merge into the inventory

Write `red-team-output/surface/route-inventory.json`, one object per endpoint:

```json
{
  "service": "api",
  "method": "GET",
  "path": "/api/orgs/{orgId}/invoices/{invoiceId}",
  "auth": "required",
  "authz_check": "membership(currentUser, orgId) && invoice.orgId == orgId",
  "scope_params": ["orgId", "invoiceId"],
  "object_type": "invoice",
  "in_live_surface": true,
  "publicly_reachable": true,
  "notes": "verify the query filters by orgId, not just invoiceId"
}
```

## 4. Prioritize for the access-control agent

1. **No authz check but reads/writes owned or tenant data** → likely missing check / IDOR. Highest.
2. **Authz check + a scope/ID sourced from the request** → scope-inconsistency / BOLA candidate.
3. **Read-level check guarding a write, or coarse check guarding a sensitive op** → privilege
   escalation candidate.
4. **Public / unauthenticated** endpoints returning data or mutating state → hand to authn agent.

Endpoints found in source but absent from the live surface are still attacked — undocumented does
not mean unreachable. If neither OpenAPI nor source is available, fall back to crawling links/forms
and observing the app's own client traffic to enumerate endpoints.
