# Use Scenario-Explicit Test Builders

Tests should create app data with small builders that provide valid defaults while keeping scenario-defining fields visible in the test. Prefer `createTaskMock({ completed: true })` over shared fixtures or repeated object literals.

This starter intentionally keeps builders minimal. Add a builder when the shape is reused or when inline data would distract from the behavior under test; do not create global fixtures that hide business assumptions.
