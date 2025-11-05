# Primes App Architecture Guide (English)

## Overview

Primes app is the highest priority main application in the MSA React monorepo structure. 
It's designed with modern architecture to replace LTS5, using Tailwind CSS + Radix UI combination.

### Monorepo Context
- **Turborepo** based build system
- **Package Priority**: `@repo/radix-ui` > `@repo/moornmo-ui` > `@repo/falcon-ui`
- **Application Status**: Primes (highest) > ESG (production) > Demo (dev tool) > LTS5 (deprecated)
- **Development Strategy**: Test UI in Demo → Develop Radix UI package → Apply in Primes

## Tech Stack

- **Frontend**: React 18.3.1 + TypeScript 5.8.3
- **Build Tool**: Vite 6.2.0
- **Styling**: Tailwind CSS 3.4.3 + Radix UI
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: React Router DOM 7.5.0
- **Icons**: Lucide React

## Directory Structure

```
apps/primes/src/
├── components/             # Reusable components
│   ├── common/            # Common components
│   ├── datatable/         # DataTable components
│   ├── form/              # Form components
│   └── charts/            # Chart components
├── pages/                 # Page components
│   ├── ini/               # Initial/Basic data pages
│   ├── sales/             # Sales pages
│   ├── purchase/          # Purchase pages
│   ├── production/        # Production pages
│   └── machine/           # Machine/Equipment pages
├── tabs/                  # Tab Navigation components
├── hooks/                 # Custom React hooks
├── services/              # API service layer
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## Template Patterns

### Tab Content Types

#### Master-Detail Pattern
Represents master-detail relationships with related lists.

```typescript
const MasterDetailPage: React.FC = () => {
  const [selectedMaster, setSelectedMaster] = useState<MasterData | null>(null);
  const { list: masterList } = useMasters({ page, size });
  const { list: detailList } = useDetails({ masterId: selectedMaster?.id });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="master-section">
        <DatatableComponent data={masterList} onRowSelect={setSelectedMaster} />
      </div>
      <div className="detail-section">
        {selectedMaster && (
          <DatatableComponent data={detailList} />
        )}
      </div>
    </div>
  );
};
```

#### Single Page List Pattern
Simple list view with CRUD operations.

```typescript
const SingleListPage: React.FC = () => {
  const { list, create, update, remove } = useItems({ page, size });
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  return (
    <PageTemplate>
      <div className="actions-bar mb-4">
        <Button onClick={() => setOpenCreateModal(true)}>Register</Button>
        <Button onClick={() => handleBulkDelete(selectedRows)}>Delete</Button>
      </div>
      <DatatableComponent
        data={list.data}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
      />
    </PageTemplate>
  );
};
```

#### Analysis Pattern
Data visualization and reporting pages.

### Data Handling Patterns

#### Page Navigation Pattern
Uses separate register/edit pages for complex forms.

```typescript
const PageNavigationHandling: React.FC = () => {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate('/ini/items/register');
  };

  const handleEdit = (id: number) => {
    navigate(`/ini/items/edit/${id}`);
  };

  return (
    <div className="actions-bar">
      <Button onClick={handleCreate}>Register</Button>
      <Button onClick={() => handleEdit(selectedId)}>Edit</Button>
    </div>
  );
};
```

#### Modal Pattern
Uses modal dialogs for simple forms.

```typescript
const ModalHandling: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const { create } = useItems();

  return (
    <DraggableDialog
      open={openModal}
      onOpenChange={setOpenModal}
      title="Register"
      content={
        <SimpleForm
          onSubmit={(data) => {
            create.mutate(data);
            setOpenModal(false);
          }}
          onCancel={() => setOpenModal(false)}
        />
      }
    />
  );
};
```

## Hook Architecture (Single Responsibility Principle)

Hooks follow single responsibility principle with atomic operations.

### Atomic Hooks

```typescript
// useCreateItem.ts - Creation only
export const useCreateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateItemPayload) => createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item-fields'] });
    },
  });
};

// useUpdateItem.ts - Update only
export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateItemPayload }) => 
      updateItem(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item', id] });
      queryClient.invalidateQueries({ queryKey: ['item-fields'] });
    },
  });
};

// useDeleteItem.ts - Deletion only
export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item-fields'] });
    },
  });
};

// useItemListQuery.ts - List fetching only
export const useItemListQuery = (params: ItemListParams) => {
  return useQuery({
    queryKey: ['items', params],
    queryFn: () => getItemList(params),
    placeholderData: keepPreviousData,
  });
};

// useItemByIdQuery.ts - Single item fetching only
export const useItemByIdQuery = (id: number, enabled = true) => {
  return useQuery({
    queryKey: ['item', id],
    queryFn: () => getItemById(id),
    enabled: enabled && !!id,
  });
};

// useItemFieldQuery.ts - Field API for custom selects
export const useItemFieldQuery = (params?: FieldQueryParams) => {
  return useQuery({
    queryKey: ['item-fields', params],
    queryFn: () => getItemFields(params),
    staleTime: 1000 * 60 * 5, // 5-minute cache retention
  });
};
```

### Composite Hook

```typescript
// useItems.ts - Composite hook combining all operations (excludes field hook)
export const useItems = (params: ItemListParams) => {
  const list = useItemListQuery(params);
  const create = useCreateItem();
  const update = useUpdateItem();
  const remove = useDeleteItem();

  return { list, create, update, remove };
};
```

### Field API Pattern

Field API provides simplified data for Custom Select, Autocomplete, etc.

```typescript
// Field API type definitions
interface FieldOption {
  id: number | string;
  name: string;
  code?: string;
  disabled?: boolean;
}

interface FieldQueryParams {
  search?: string;
  limit?: number;
  active?: boolean;
}

// Field API usage example
const ItemSelect: React.FC = () => {
  const { data: itemOptions } = useItemFieldQuery({ active: true });
  
  return (
    <CustomSelect
      options={itemOptions}
      placeholder="Select an item"
    />
  );
};

// Field Hook is used independently from main Entity Hook
const CreateOrderPage: React.FC = () => {
  const { create } = useCreateOrder(); // Only need order creation
  const { data: itemOptions } = useItemFieldQuery(); // For item selection
  const { data: vendorOptions } = useVendorFieldQuery(); // For vendor selection
  
  // No need to import entire useItems or useVendors
};
```

## Type System Organization

Types are organized by solution/service pattern.

### Structure Example

```typescript
// types/ini/items.ts - Domain-specific types
export interface ItemData {
  id: number;
  name: string;
  code: string;
  // ... other fields
}

export interface CreateItemPayload {
  name: string;
  code: string;
  // ... required fields for creation
}

export interface UpdateItemPayload extends Partial<CreateItemPayload> {
  id: number;
}

// types/ini/index.ts - Solution-level exports
export * from './items';
export * from './vendor';
export * from './terminal';

// types/index.ts - Root-level exports
export * from './ini';
export * from './sales';
export * from './production';
// ... other solutions
```

## Domain Organization

The app is organized by business domains (solutions):

- `ini/` - Initial/Basic data management
- `sales/` - Sales management
- `purchase/` - Purchase management
- `production/` - Production management
- `machine/` - Machine/Equipment management
- `mold/` - Mold management

## Routing Patterns

### Solution-based Routing Structure
```
/[solution]/[entity]/[action]

Examples:
/ini/vendor/list        # Initial > Vendor > List
/sales/order/register   # Sales > Order > Register
/production/plan/edit   # Production > Plan > Edit
```

### Tab Navigation Routing
- Navigate to corresponding path when tab is clicked
- Automatically activate corresponding tab when URL changes

## Styling Guide

### Tailwind CSS Usage
- Use custom color system (Colors-Brand-*, Colors-Gray-*, etc.)
- Responsive design (sm:, md:, lg:, xl:)
- Dark mode support (dark: prefix)

### Component Styling Example
```typescript
// Radix UI + Tailwind combination
<RadixButton className="bg-Colors-Brand-700 hover:bg-Colors-Brand-800 text-white px-4 py-2 rounded-lg">
  Register
</RadixButton>
```

## Import Order

1. React and external libraries
2. Internal components and hooks
3. Types and interfaces
4. Relative imports

```typescript
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import DatatableComponent from '@primes/components/datatable/DatatableComponent';
import { useItems } from '@primes/hooks';
import { PageTemplate } from '@primes/templates';
import { ItemData, CreateItemPayload } from '@primes/types/ini';
```

## Best Practices

### 1. Accessibility First
- WCAG compliance through Radix UI usage
- Keyboard navigation support
- Screen reader compatibility

### 2. Type Safety
- Strict TypeScript configuration
- API response type definitions
- Component Props interfaces

### 3. Performance Optimization
- React Query caching
- Lazy Loading
- Bundle optimization (Vite)

### 4. Developer Experience
- Automatic code generation
- Hot Module Replacement
- TypeScript auto-completion

### 5. Scalability
- Monorepo structure
- Package-based architecture
- Solution-based modularization

## Code Generation Patterns

### Auto-generatable Components
- Tab Navigation components
- CRUD pages (List, Register, MasterDetail)
- API Service functions
- React Query Hooks
- TypeScript type definitions

### Generator Usage
```bash
cd apps/primes
npm run page    # Generate pages
npm run tab     # Generate tabs
npm run generate # Configuration-based generation
```

This guide serves as a comprehensive reference document for maintaining consistent architecture and code quality when developing the Primes app.