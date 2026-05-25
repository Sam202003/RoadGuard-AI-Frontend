# src/components — Cross-Module Shared UI

Components that are reused across multiple modules. Organized by **UI taxonomy**, not by feature.

| Folder | Purpose | Examples |
|--------|---------|----------|
| `primitives/` | Re-exports from `packages/ui` (ShadCN primitives) | `Button`, `Input`, `Dialog` |
| `shared/` | Generic composed pieces | `UserAvatar`, `RoleBadge` |
| `layouts/` | Page chrome building blocks | `AppHeader`, `Sidebar`, `Footer` |
| `navigation/` | Navigation patterns | `Tabs`, `Breadcrumbs`, `BottomNav` |
| `forms/` | Generic form wrappers | `FormField`, `FormSection`, `FormError` |
| `data-display/` | Data presentation | `DataTable`, `KeyValueList`, `StatCard` |
| `feedback/` | User feedback | `Skeleton`, `Toast`, `Banner`, `Alert` |
| `overlays/` | Overlays | `Modal`, `Drawer`, `Sheet`, `Popover` |
| `maps/` | Map UI widgets (provider-agnostic) | `Map`, `RouteOverlay`, `LiveMarker` |
| `ai/` | AI-related UI | `ChatBubble`, `VoiceButton`, `StreamingMessage` |
| `charts/` | Analytics charts | `LineChart`, `BarChart`, `Heatmap` |
| `uploader/` | File upload UI | `DropZone`, `FilePreview` |
| `empty-states/` | Empty states | `NoResults`, `OfflineEmpty` |
| `loaders/` | Loading indicators | `Spinner`, `PageLoader` |
| `banners/` | Top-of-page banners | `OfflineBanner`, `MaintenanceBanner` |
| `badges/` | Status badges | `StatusBadge`, `PriorityBadge` |

## Rules

- Components here are **stateless** unless their state is purely visual (e.g., a controlled accordion).
- **No data fetching.** Components receive data via props.
- **No router-aware components.** Pass `href`/`onClick` from the consuming module.
- **Portability:** if a component can work on web AND native, it belongs in `packages/ui`, not here.
