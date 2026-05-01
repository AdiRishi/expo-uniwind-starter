# Use Scenario-Explicit Test Data

Frontend tests need realistic app data because meaningful behavior often depends on domain state, permissions, mutation results, and query loading state. Fixed global fixtures make those assumptions implicit, causing tests to read as if they cover one scenario while silently inheriting another.

Use explicit mock responses at the tRPC boundary and add small shape-based builders only when a data shape becomes large enough to justify them. This makes tests a little more verbose than global fixtures, but each test shows the conditions it depends on and adding a new scenario does not require decoding a shared happy path.
