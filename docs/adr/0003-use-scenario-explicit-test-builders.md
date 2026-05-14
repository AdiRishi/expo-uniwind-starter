# Use Scenario-Explicit Test Builders

Frontend tests need realistic app data because meaningful behavior depends on state such as task status, form values, query results, mutation results, loading states, and error states. Fixed fixtures or convenience helpers would make those assumptions implicit, causing tests to read as if they cover one scenario while silently inheriting another.

We will use shape-based configurable builders for app test data, paired with explicit tRPC mock responses at the test boundary. Builders provide boring structural defaults for DTOs; the test supplies the fields that define the scenario.

This makes tests a little more verbose than global fixtures, but the trade-off is intentional: each test shows the conditions it depends on, and adding a new scenario does not require decoding or modifying a shared happy path.
