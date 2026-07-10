# Derive Mission Telemetry On The Server

Mission Control stores normalized mission inputs and derives progress, risk score, at-risk state, checkpoint counts, and portfolio summaries in the API router. The mobile app consumes those values rather than implementing a second scoring model. This keeps every client consistent when risk weights or completion rules change and makes lifecycle preconditions enforceable at the mutation boundary. Presentation-only concepts such as labels, search matching, and relative date copy remain in the app because they do not change mission truth.
