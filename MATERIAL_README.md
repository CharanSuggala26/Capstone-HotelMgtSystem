# Hotel Management System - Angular Frontend with Material Design

A modern Angular application with Material Design for hotel reservation management featuring role-based access control, pagination, and sorting.

## ✨ New Features Added

### Angular Material Integration
- **Material Design Components**: Cards, tables, forms, buttons, navigation
- **Data Tables**: Sortable columns with pagination for all list views
- **Modern UI**: Professional Material Design interface
- **Responsive Layout**: Mobile-friendly Material components
- **Icons & Typography**: Material icons and Roboto font

### Enhanced Components
- **Login/Register**: Material cards with form fields and validation
- **Dashboard**: Material sidenav with toolbar navigation
- **Hotels**: Material table with sorting and pagination
- **Reservations**: Sortable table with status chips and pagination
- **Room Booking**: Material date pickers and radio buttons
- **Bills**: Paginated table with payment status indicators

## Technology Stack

- **Angular 21** - Latest version with standalone components
- **Angular Material 21** - Material Design components
- **Angular CDK** - Component development kit
- **TypeScript** - Type-safe development
- **Material Icons** - Comprehensive icon library
- **Reactive Forms** - Form handling with Material form fields
- **HTTP Client** - API communication with interceptors
- **JWT Authentication** - Secure token-based authentication

## Material Components Used

### Navigation & Layout
- `MatToolbar` - Application header
- `MatSidenav` - Side navigation menu
- `MatList` - Navigation lists with icons

### Data Display
- `MatTable` - Data tables with sorting
- `MatPaginator` - Pagination controls
- `MatSort` - Column sorting functionality
- `MatCard` - Content containers
- `MatChips` - Status indicators

### Form Controls
- `MatFormField` - Form field containers
- `MatInput` - Text inputs
- `MatDatepicker` - Date selection
- `MatRadioButton` - Radio button groups
- `MatButton` - Action buttons

### Feedback
- `MatProgressSpinner` - Loading indicators
- `MatIcon` - Material Design icons

## Project Structure

```
src/
├── app/
│   ├── components/          # Material-enhanced components
│   │   ├── login/          # Material card with form fields
│   │   ├── register/       # Material registration form
│   │   ├── dashboard/      # Material sidenav layout
│   │   ├── hotels/         # Material table with pagination
│   │   ├── room-booking/   # Material date pickers & forms
│   │   ├── reservations/   # Sortable Material table
│   │   ├── bills/          # Paginated bills table
│   │   └── unauthorized/   # Material error page
│   ├── services/           # Business logic services
│   ├── guards/             # Route protection
│   ├── interceptors/       # HTTP interceptors
│   ├── models/             # TypeScript interfaces
│   └── app.routes.ts       # Application routing
├── styles.css              # Global styles with Material theme
└── material-theme.scss     # Material theme configuration
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- Angular CLI (v21 or higher)
- Backend API running on https://localhost:7018

### Installation

1. **Clone and navigate to the project**
   ```bash
   cd client-hotel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   ng serve
   ```

4. **Access the application**
   - Open browser to `http://localhost:4200`
   - Experience the Material Design interface

### Build for Production

```bash
# Build the application
ng build

# Build with production optimizations
ng build --configuration production
```

## Material Design Features

### Data Tables with Pagination & Sorting

All list views now include:
- **Sortable Columns**: Click headers to sort data
- **Pagination**: Navigate through large datasets
- **Responsive Design**: Tables adapt to screen size
- **Loading States**: Material spinners during data fetch

#### Hotels Table
- Sort by name, city, total rooms
- Pagination with configurable page sizes
- Action buttons for booking and management

#### Reservations Table
- Sort by hotel, dates, amount
- Status chips with color coding
- Check-in/out actions for staff

#### Bills Table
- Sort by amount, date, status
- Payment status indicators
- Pay now buttons for pending bills

### Enhanced Forms

- **Material Form Fields**: Consistent styling with labels
- **Date Pickers**: Material date selection for bookings
- **Validation**: Real-time form validation with Material styling
- **Loading States**: Spinners in buttons during submission

### Navigation

- **Material Sidenav**: Collapsible side navigation
- **Role-based Menu**: Different options per user role
- **Material Icons**: Intuitive navigation icons
- **Active States**: Visual feedback for current page

## Component Details

### LoginComponent
```typescript
// Material imports
MatCardModule, MatFormFieldModule, MatInputModule, 
MatButtonModule, MatProgressSpinnerModule

// Features
- Material card layout
- Form field validation
- Loading spinner in button
- Error message display
```

### HotelsComponent
```typescript
// Material imports
MatTableModule, MatPaginatorModule, MatSortModule,
MatButtonModule, MatCardModule, MatIconModule

// Features
- Sortable data table
- Pagination controls
- Action buttons with icons
- Loading spinner
```

### DashboardComponent
```typescript
// Material imports
MatToolbarModule, MatSidenavModule, MatListModule,
MatIconModule, MatButtonModule

// Features
- Material toolbar header
- Side navigation menu
- Role-based navigation items
- Material list styling
```

## Pagination Configuration

All tables include pagination with:
- **Page Sizes**: [5, 10, 20] items per page
- **Navigation**: First, previous, next, last buttons
- **Page Info**: Current page and total pages display
- **Responsive**: Adapts to screen size

## Sorting Configuration

Tables support sorting on:
- **Text Columns**: Alphabetical sorting
- **Number Columns**: Numerical sorting
- **Date Columns**: Chronological sorting
- **Visual Feedback**: Sort direction indicators

## Material Theme

The application uses the **Indigo-Pink** Material theme:
- **Primary**: Indigo (#3F51B5)
- **Accent**: Pink (#E91E63)
- **Warn**: Red (#F44336)
- **Typography**: Roboto font family

## Performance Optimizations

- **Lazy Loading**: Material modules loaded on demand
- **Tree Shaking**: Unused Material components excluded
- **Bundle Optimization**: Increased size limits for Material
- **Font Optimization**: Disabled for faster builds

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Material Design**: Full support for Material components
- **Responsive**: Mobile and desktop optimized
- **Accessibility**: Material a11y features included

## Development Guidelines

### Adding New Material Components

1. **Import Module**: Add to component imports
2. **Use in Template**: Follow Material design patterns
3. **Style Consistently**: Use Material theme colors
4. **Test Responsiveness**: Ensure mobile compatibility

### Pagination Implementation

```typescript
// Component setup
@ViewChild(MatPaginator) paginator!: MatPaginator;
dataSource = new MatTableDataSource<T>();

// After view init
ngAfterViewInit(): void {
  this.dataSource.paginator = this.paginator;
}
```

### Sorting Implementation

```typescript
// Component setup
@ViewChild(MatSort) sort!: MatSort;

// After view init
ngAfterViewInit(): void {
  this.dataSource.sort = this.sort;
}

// Template
<th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
```

## Testing Credentials

Use these test accounts with your backend:

```typescript
// Admin Account
{
  email: "admin@hotel.com",
  password: "Admin@123"
}

// Guest Account
{
  email: "john@example.com", 
  password: "Password@123"
}
```

## Material Design Benefits

### User Experience
- **Consistent Interface**: Material Design language
- **Intuitive Navigation**: Familiar Material patterns
- **Visual Feedback**: Hover states, animations
- **Accessibility**: Built-in a11y features

### Developer Experience
- **Pre-built Components**: Faster development
- **Consistent Styling**: Unified design system
- **Responsive Design**: Mobile-first approach
- **Documentation**: Comprehensive Material docs

### Performance
- **Optimized Components**: Efficient rendering
- **Tree Shaking**: Only used components included
- **CDK Integration**: Advanced component features
- **Bundle Splitting**: Lazy-loaded modules

## Troubleshooting

### Common Material Issues

1. **Missing Animations**: Ensure `provideAnimationsAsync()` in app.config
2. **Theme Not Applied**: Check Material theme import in styles.css
3. **Icons Not Loading**: Verify Material Icons font loading
4. **Table Not Sorting**: Check MatSort ViewChild setup

### Build Issues
- **Bundle Size**: Increased limits for Material components
- **Font Loading**: Disabled optimization for offline builds
- **Memory**: Material builds require more memory

## Future Enhancements

- **Advanced Filtering**: Material filter components
- **Data Export**: Export tables to CSV/PDF
- **Dark Theme**: Material dark mode support
- **Mobile App**: Material components for mobile
- **Accessibility**: Enhanced a11y features
- **Internationalization**: Material i18n support

## Support

For Material Design issues:
1. Check Angular Material documentation
2. Verify component imports and setup
3. Test responsive behavior
4. Review Material theme configuration

The application now provides a professional, modern interface with Material Design components, comprehensive pagination, and sorting capabilities throughout all data views.