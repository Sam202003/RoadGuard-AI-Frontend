# @rg/utils — Pure Utility Functions

Stateless, side-effect-free, framework-free utilities. **Zero** browser-only APIs.

| Folder | Examples |
|--------|----------|
| `date/` | format, parse, diff, isWithin, age |
| `string/` | slugify, truncate, mask, sanitize |
| `number/` | clamp, round, percentage |
| `currency/` | format, parse, convert |
| `distance/` | meters → km, km → miles, format |
| `geo/` | haversine, bbox, midpoint, polyline encode/decode |
| `formatting/` | phone, address, vehicle plate |
| `validation/` | isEmail, isPhone, isVehiclePlate |
| `crypto/` | hash, base64, uuid (framework-agnostic) |
| `platform/` | isWeb, isServer, isMobileBrowser (read-only flags) |
| `logger/` | Structured logger interface (no transport — adapters provide that) |
| `array/` | chunk, groupBy, partition, uniqBy |
| `object/` | pick, omit, deepGet, deepSet |
| `error/` | normalizeError, isDomainError, errorCode |
| `promise/` | retry, timeout, withCancellation |
| `functional/` | pipe, compose, debounce, throttle, memoize |
| `parsing/` | safeJsonParse, parseQueryString |
| `regex/` | Reusable regex constants |
| `constants/` | Math/format constants |

## Rules

- ✗ **No** `window`, `document`, `navigator`, `localStorage`
- ✗ **No** React imports
- ✗ **No** axios / RTK / Redux imports
- ✓ Every util has unit tests
- ✓ Every util is a **pure function** — same input → same output
- ✓ Utilities that need I/O belong elsewhere (`services/` in `apps/web`)
