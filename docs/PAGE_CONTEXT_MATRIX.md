# Page Context Matrix

| Route | Context | Purpose | Copy Tone | Allowed |
|---|---|---|---|---|
| `/` | maintenance | Planned maintenance / recovery | Calm, direct | Yes |
| `/deploy` | deploy | Deployment notice | Clear, minimal | Yes |
| `/outage` | outage | Broken target notice | Truthful, concise | Yes |
| `/security` | security | Restricted notice | Cautious, generic | Yes |
| `/coming-soon` | coming-soon | Placeholder before launch | Light, honest | Yes |

## Context rules

- Route context must never imply live success if the host is still under repair.
- Routes are informational only.
- No context may mention backend details that are not verified in the repository.

