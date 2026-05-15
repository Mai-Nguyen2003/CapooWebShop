## CapooWebShop 

This project contains a small Java Azure Functions backend and a React (Vite) frontend. The file layout and build flows below are the important facts an automated coding agent needs to be productive immediately.

Key locations
- `capooBackend/pom.xml` — Maven build for the Azure Java Functions; Java 21. Packaging goal `azure-functions:package` is wired in the plugin and creates deployable content under `target/azure-functions/<functionAppName>/`.
- `capooBackend/src/main/java/com/capoo/function/` — HTTP-triggered Azure Functions (e.g. `Function.java`, `BuyOrder.java`). These are the primary backend entry points.
- `capooBackend/host.json`, `capooBackend/local.settings.json` — function host and local settings used when running functions locally.
- `capooFrontend/package.json` and `capooFrontend/src/` — Vite + React frontend. `npm run dev` starts the dev server; `npm run build` creates production assets.

Big-picture architecture
- Backend: implemented as Azure Functions in Java using `azure-functions-java-library`. Functions are simple HTTP endpoints that parse JSON payloads (see `BuyOrder.java` which expects a `RequestedOrder` payload and sends email using Azure Communication Services). The Maven plugin packages the jar and scaffolding under `target/azure-functions/<app>/` which is what Azure Functions host expects.
- Frontend: Vite React app that calls backend HTTP APIs. No server-side rendering; static assets are built with `vite build` and can be hosted separately.
- Integration points: Email is sent with the Azure Communication Email SDK. Database connectivity is included via `mssql-jdbc` dependency but the code referencing DB connections should be searched if modifying persistence.

Developer workflows (commands an agent may suggest or run)
- Build and package backend (produces artifacts in `target/azure-functions/...`):
  - `mvn clean package` (or run the VS Code task labeled `package (functions)`). The Apache Maven plugin `azure-functions-maven-plugin` has a `package` execution that prepares the function folder.
- Run functions locally (after package):
  - The workspace includes a task `func: host start` which expects the packaged function app under `target/azure-functions/<functionAppName>/`. In VS Code run the task `package (functions)` then `func: host start` (or run `mvn azure-functions:run` if added). The project includes `local.settings.json` for local environment variables like `EMAIL_SERVICE_CONNECTION_STRING`.
- Frontend dev & build:
  - `cd capooFrontend` then `npm install` then `npm run dev` (Vite dev server). Build with `npm run build`.

Project-specific conventions and gotchas
- Java version: project uses Java 21 in `pom.xml`. Use a matching JDK when compiling or running tests.
- Azure Functions packaging: the Azure Functions maven plugin outputs a function folder under `target/azure-functions/<functionAppName>/`. The `func: host start` task in this workspace uses that folder as its CWD. Any code edits require re-running `mvn package` (or the package task) before local function host start will pick up changes.
- Secrets and env vars: `local.settings.json` and environment variables are used for secret values (for example `EMAIL_SERVICE_CONNECTION_STRING`). Do not hardcode secrets into source files.
- HTTP request/response patterns: Functions use `HttpRequestMessage<Optional<T>>` and return `HttpResponseMessage` builders (see `BuyOrder.java` and `Function.java`). Preserve these patterns when adding new endpoints.
- Entities and DTOs: Domain types (e.g., `RequestedOrder`, `OrderedItem`) live under `capooBackend/src/main/java/com/capoo/entities/` — use these rather than duplicating shapes.

Where to look when changing behavior
- Email sending: `BuyOrder.java` uses `EmailClientBuilder` and `beginSend(...).waitForCompletion()`. If you change email behavior, update usage of `EMAIL_SERVICE_CONNECTION_STRING` in `local.settings.json` and tests/mocks.
- Database usage: check for any classes referencing `com.microsoft.sqlserver:mssql-jdbc` under `src/main/java` before modifying data access.
- Function bindings: check `target/azure-functions/<app>/function` JSON files under `target/azure-functions/.../` to understand the function names exposed by the host.

Examples & quick-reference
- Build & run locally (recommended sequence):
  1. In backend: `mvn clean package` (creates `target/azure-functions/<app>/`)
  2. Run function host: use VS Code task `func: host start` (workspace has a task configured pointing at the packaged folder). Ensure `local.settings.json` provides `EMAIL_SERVICE_CONNECTION_STRING`.
  3. Frontend: `cd capooFrontend` then `npm install` then `npm run dev`.

