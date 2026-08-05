## Flight Service Routes & Roles

| **Airlines**        |                                |           |       |       |                      |
| GET                 | `/airlines/:id/flights`        |     ✅     |   ✅   |   ✅   | Airline flights      |



| **Aircraft**        |                                |           |       |       |                      |
| GET                 | `/aircraft/:id/flights`        |     ✅     |   ✅   |   ✅   | Aircraft flights     |



| **Manufacturers**   |                             |           |       |       |                      |
| GET                 | `/manufacturers/:id/models`    |     ✅     |   ✅   |   ✅   | Manufacturer models  |




### Role Summary

| Role          | Permissions                                                                                                                        |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **PASSENGER** | Read-only access. Search flights, airports, airlines, cities, countries, aircraft information.                                     |
| **AGENT**     | Same read permissions as Passenger. Typically books flights through the Booking Service rather than modifying Flight Service data. |
| **ADMIN**     | Full CRUD access to all Flight Service resources, plus dashboard and flight status management.                                     |



