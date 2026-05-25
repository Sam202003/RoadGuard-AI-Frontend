# @rg/types — Domain Types & DTOs

Single source of truth for **every** TypeScript type that crosses a module boundary.

| Folder | Contents |
|--------|----------|
| `auth/` | Session, Token, OTP, AuthResult |
| `user/` | User, UserProfile, UserPreferences |
| `provider/` | Provider, ProviderProfile, ProviderStats |
| `admin/` | AdminUser, AdminPermissions |
| `vehicle/` | Vehicle, VehicleMake, VehicleModel, Insurance |
| `breakdown/` | BreakdownRequest, BreakdownStatus, BreakdownPhotos |
| `request/` | ServiceRequest, RequestType, RequestStatus |
| `tracking/` | LocationUpdate, TrackingSession, RouteData |
| `membership/` | Plan, Subscription, Benefit |
| `payment/` | Payment, PaymentMethod, Invoice, Refund |
| `wallet/` | Wallet, WalletTransaction, TopUp |
| `notification/` | Notification, NotificationChannel, NotificationPrefs |
| `chat/` | ChatMessage, ChatThread, ChatParticipant |
| `ai/` | AIMessage, AIConversation, AITool, AIAgent |
| `maps/` | LatLng, BBox, Place, Route, Marker |
| `kyc/` | KycDocument, KycStatus, KycSubmission |
| `review/` | Review, Rating, ReviewResponse |
| `analytics/` | Metric, Dimension, Funnel |
| `cms/` | CmsArticle, CmsPage, CmsBlock |
| `websocket/` | SocketEvent, SocketChannel, SocketPayload |
| `api/` | ApiResponse, ApiError, PaginatedResponse |
| `dtos/` | Wire-format DTOs (separate from domain models) |
| `enums/` | Cross-cutting enums (Currency, Country, Language, …) |
| `shared/` | Primitives: ID, Timestamp, Money, Phone, Email |

## Conventions

- **Domain model vs DTO:** UI consumes domain models. Wire format is in `dtos/`. Transformers in `@rg/api/endpoints/*/adapter.ts` convert between them.
- **Branded types** for IDs (`UserId`, `BreakdownId`) prevent mixing.
- **Zod schemas** that mirror these types live in `@rg/api/schemas/` for runtime validation.
- **No** `as` casts crossing the package boundary — all conversions go through adapters.
