# MSA React Monorepo Structure Guide (English)

## Overview

MSA React Monorepo is a microservice architecture frontend project built on Turborepo.
It efficiently manages UI libraries and applications through package-based architecture.

## Overall Structure

```
msa-monorepo/
├── apps/                    # Applications
│   ├── demo/               # UI component showcase (Radix UI testing)
│   ├── esg/                # ESG reporting system (in production)
│   ├── primes/             # Main application (highest priority)
│   └── lts5/               # Legacy system (to be removed soon)
├── packages/               # Shared packages
│   ├── radix-ui/           # Radix-based UI components (highest priority)
│   ├── falcon-ui/          # Bootstrap-based UI components
│   ├── moornmo-ui/         # Material-UI based components
│   ├── bootstrap-ui/       # Bootstrap components
│   ├── echart/             # Chart components
│   ├── editor-js/          # Editor functionality
│   ├── i18n/               # Internationalization
│   ├── toasto/             # Toast notifications
│   └── utils/              # Common utilities
├── scripts/                # Build and release scripts
└── turbo.json              # Turborepo configuration
```

## Application Status

### 🚀 **Primes** (Highest Priority)
- **Purpose**: Modern main application replacing LTS5
- **Tech Stack**: React + TypeScript + Tailwind CSS + Radix UI
- **Status**: Active development
- **Features**: 
  - Modern architecture
  - Accessibility-first design
  - Script-based code generation

### 📊 **ESG** (In Production)
- **Purpose**: ESG reporting and data management system
- **Tech Stack**: React + Falcon UI (Bootstrap)
- **Status**: Production operation
- **Features**:
  - Data visualization focused
  - Charts and reporting functionality

### 🎨 **Demo** (Development Tool)
- **Purpose**: UI component showcase and testing
- **Tech Stack**: React + Radix UI
- **Status**: Development support tool
- **Features**:
  - Radix UI component testing
  - Accessibility validation
  - Component documentation

### ⚠️ **LTS5** (To be Removed)
- **Purpose**: Legacy enterprise system
- **Tech Stack**: React + Falcon UI (Bootstrap)
- **Status**: To be removed soon
- **Migration**: Features being transferred to Primes

## Package Ecosystem

### UI Library Priority

1. **🎯 Radix UI** (Highest Priority)
   - Accessibility-first design
   - Easy customization
   - Primary use in Primes app

2. **🎨 Moornmo UI**
   - Material-UI based
   - Modern design system

3. **📋 Falcon UI**
   - Bootstrap based
   - Enterprise UI patterns
   - Used in ESG, LTS5

4. **🔧 Bootstrap UI**
   - Pure Bootstrap components
   - Legacy support

### Functional Packages

#### 📈 **EChart**
- Charts and data visualization
- Primarily used in ESG app
- Integrates Chart.js, Recharts, ECharts

#### ✏️ **Editor-JS**
- Rich text editor
- Block-based editor functionality

#### 🌐 **i18n**
- Internationalization (Korean/English)
- Common use across all apps

#### 🔔 **Toasto**
- Toast notification system
- User feedback UI

#### 🛠️ **Utils**
- Common utility functions
- Type definitions
- Helper functions

## Turborepo Configuration

### Build Pipeline

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "outputs": []
    }
  }
}
```

### Key Commands

```bash
# Run all development servers
pnpm dev

# Run specific app only
pnpm dev --filter @repo/primes
pnpm dev --filter @repo/esg
pnpm dev --filter @repo/demo

# Build all
pnpm build

# Build specific app
pnpm build --filter @repo/primes

# Linting
pnpm lint

# Add package (to specific workspace)
pnpm add [package] --filter @repo/primes
```

## Development Workflow

### 1. New UI Component Development
```bash
# 1. Test component in Demo app
cd apps/demo
pnpm dev

# 2. Add component to Radix UI package
cd packages/radix-ui
# Develop component

# 3. Use in Primes app
cd apps/primes
# Apply component
```

### 2. New Feature Development (Primes)
```bash
# 1. Run Primes app development server
pnpm dev --filter @repo/primes

# 2. Script-based code generation
cd apps/primes
npm run page    # Generate pages
npm run tab     # Generate tabs

# 3. Extract common components to packages if needed
```

### 3. ESG App Maintenance
```bash
# ESG app development
pnpm dev --filter @repo/esg

# Use Falcon UI components
# Utilize EChart package
```

## Package Dependency Management

### Internal Package References
```json
{
  "dependencies": {
    "@repo/radix-ui": "workspace:^",
    "@repo/utils": "workspace:^",
    "@repo/i18n": "workspace:^"
  }
}
```

### Import Alias Configuration
```typescript
// Primes app
import { Button } from '@repo/radix-ui';
import { useTranslation } from '@repo/i18n';
import { formatDate } from '@repo/utils';

// ESG app
import { DataTable } from '@repo/falcon-ui';
import { LineChart } from '@repo/echart';
```

## Migration Strategy

### LTS5 → Primes Migration

1. **Feature Analysis**
   - Identify core LTS5 features
   - Extract business logic

2. **Architecture Modernization**
   - Falcon UI → Radix UI transition
   - Legacy patterns → Modern patterns

3. **Gradual Migration**
   - Sequential transfer by domain
   - Minimize parallel operation period

4. **Data Migration**
   - Maintain API compatibility
   - Preserve user data

## Performance Optimization

### Turborepo Caching
- Build result caching
- Dependency-based incremental builds
- Remote cache utilization

### Package Optimization
- Tree-shaking support
- Bundle size optimization
- Lazy loading implementation

## Deployment Strategy

### Individual App Deployment
```bash
# Deploy Primes app
pnpm build --filter @repo/primes
# Run deployment script

# Deploy ESG app
pnpm build --filter @repo/esg
# Run deployment script
```

### Package Version Management
- Use Changesets
- Semantic versioning
- Automated release notes

## Best Practices

### 1. Package Design
- Single responsibility principle
- Clear API design
- Type safety guarantee

### 2. Dependency Management
- Prevent circular dependencies
- Minimal dependency principle
- Maintain version compatibility

### 3. Code Quality
- Common linting rules
- TypeScript strict mode
- Automated testing

### 4. Developer Experience
- Fast development server
- Hot Module Replacement
- Automated code generation

This guide serves as a comprehensive reference document for understanding the overall structure and development workflow of the MSA React Monorepo.