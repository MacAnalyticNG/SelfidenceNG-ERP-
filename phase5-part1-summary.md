# Laundry ERP Development - Phase 5 (Inventory & Analytics) Part 1

This phase focused on establishing the Inventory System and linking it to Services (Recipes).

## Progress

### 1. Inventory Management System
- [x] **Database Schema**:
    - Created `inventory_items` table (track stock, unit, cost).
    - Created `service_materials` table (link services to inventory items with quantity).
- [x] **Inventory UI**:
    - Created `InventoryManagement` component (List, Search, Low Stock Alerts).
    - Created `CreateInventoryForm` & `EditInventoryForm` with Zod validation.
    - Implemented full CRUD (Create, Read, Update, Delete) via Server Actions.
- [x] **Page**:
    - Created `app/dashboard/inventory/page.tsx` to fetch and display options.

### 2. Service-Inventory Linkage (Recipes)
- [x] **Service UI Enhancements**:
    - Updated `CreateServiceForm` and `EditServiceForm` to include a "Service Recipe" section.
    - Users can now select inventory items and specify the quantity used per service unit (e.g., "50ml Detergent per Wash").
- [x] **Back-End Logic**:
    - Updated `createService` and `updateService` actions to handle `materials` data.
    - Implemented logic to insert/update records in the `service_materials` junction table.

## Next Steps (Phase 5 Part 2)
### 1. Stock Deduction Logic
- Implement automation to deduct inventory when an Order is processed.
- Logic: `New Stock = Current Stock - (Order Item Qty * Service Material Qty)`.
- Trigger: Likely on "Status Update" (Pending -> In Progress).

### 2. Dashboard Analytics
- Implement visual charts using `recharts`.
- Revenue over time.
- Most popular services.

### 3. Settings & Auth
- Refine user profile management.
