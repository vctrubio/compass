# Controller Components

This directory contains reusable controller components for building data-driven admin interfaces in the North Compass application.

## Components

### ControllerContent

`ControllerContent` is a high-order component that handles:
- State management for search, filter, and sorting
- Processing and filtering data based on user interactions
- Rendering the appropriate UI components

#### Usage

```tsx
import { ControllerContent } from '@/rails/controller/ControllerContent';
import { createTableData, getDefaultSearchFields } from '@/rails/utils/tableDataAdapter';

// Inside your page component:
const { tables } = useAdminContext()
const yourTable = tables.yourTableName;

// Handle error cases first...

// Convert DB table to TableEntity format
const tableData = createTableData('yourTableName', yourTable);

// Get appropriate search fields
const searchFields = getDefaultSearchFields(yourTable.fields);

return (
  <ControllerContent 
    title="Your Title"
    tableName="yourTableName" 
    tableData={tableData}
    searchFields={searchFields}
  />
);
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `title` | string | The display title for the page |
| `tableName` | string | The name of the table in the database |
| `tableData` | TableEntity | The table data formatted for use by the component |
| `searchFields` | string[] | Fields to include in search functionality |
| `showAddButton` | boolean | Whether to show the "Add" button (default: true) |
| `onAdd` | function | Custom handler for the "Add" button click |
| `children` | ReactNode | Optional custom content to render instead of the default table |

### ControllerBar

`ControllerBar` provides UI for:
- Search box
- Filter dropdowns
- Sort options
- Add button
- Active filters display

### FilterSortBar

Handles the UI for filter and sort dropdowns and badges.

### SearchBar

A customized search input with icon.

## Utilities

### tableDataAdapter

Utility functions that help convert database tables to the format required by `ControllerContent`:

- `createTableData`: Converts a DB table to TableEntity format
- `getDefaultSearchFields`: Extracts appropriate searchable fields from a table schema

## Configuration

Table filter and sort options are defined in `typesDictionary.ts`. To add filter or sort options to a table, update its entry in the dictionary:

```typescript
// Example
bookings: {
  // ...other properties
  filterBy: [
    { 
      field: 'status', 
      label: 'Status', 
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' }
      ]
    }
  ],
  sortBy: [
    { field: 'createdAt', label: 'Newest First', direction: 'desc' },
    { field: 'createdAt', label: 'Oldest First', direction: 'asc' }
  ]
}
```
