# Development Notes & Architecture Evolution

## 2025-01-08: Primes Architecture Guide Creation

### Context
- Created comprehensive architecture guides for Primes app
- Added both Korean and English versions for international team collaboration
- Documented template patterns, hook architecture, and type system organization

### Key Architectural Decisions

#### 1. Template Patterns
- **Master-Detail**: For related data with parent-child relationships
- **Single Page List**: For simple CRUD operations
- **Analysis**: For data visualization and reporting

#### 2. Data Handling Strategies
- **Page Navigation**: Complex forms use separate register/edit pages
- **Modal**: Simple forms use in-place modal dialogs

#### 3. Hook Architecture (Single Responsibility Principle)
- Atomic hooks for specific operations:
  - `useCreateItem` - Creation only
  - `useUpdateItem` - Update only  
  - `useDeleteItem` - Deletion only
  - `useItemListQuery` - List fetching only
- Composite hooks combining all operations:
  - `useItems` - Combines all atomic hooks

#### 4. Type System Organization
- Domain-based structure: `types/[solution]/[service].ts`
- Hierarchical exports: service → solution → root
- Clear separation of concerns

### Files Created
- `.kiro/steering/primes-architecture-guide-ko.md` - Korean version
- `.kiro/steering/primes-architecture-guide-en.md` - English version
- `.kiro/steering/development-notes.md` - This file

### Integration with Cursor Rules
- Updated `.cursorrules` with template patterns
- Added hook architecture principles
- Documented type system structure
- Included practical code examples

### Benefits
1. **Consistency**: Standardized patterns across the application
2. **Maintainability**: Single responsibility principle in hooks
3. **Scalability**: Domain-based type organization
4. **Developer Experience**: Clear guidelines and examples
5. **International Collaboration**: Bilingual documentation

### Next Steps
- Monitor adoption of these patterns in new feature development
- Collect feedback from development team
- Iterate on patterns based on real-world usage
- Consider creating code generators for common patterns

### Technical Debt Addressed
- Inconsistent hook patterns → Single responsibility atomic hooks
- Mixed data handling approaches → Clear modal vs page navigation guidelines
- Scattered type definitions → Organized domain-based structure
- Lack of template standardization → Defined template patterns

### Performance Considerations
- React Query caching strategies documented
- Lazy loading patterns established
- Bundle optimization through Vite configuration

### Accessibility Improvements
- Radix UI prioritization for WCAG compliance
- Keyboard navigation patterns
- Screen reader compatibility guidelines

---

## 2025-01-08: Monorepo Structure Documentation

### Context
- Documented comprehensive monorepo structure using Turborepo
- Clarified application priorities and package ecosystem
- Added migration strategy from LTS5 to Primes

### Key Monorepo Insights

#### Application Priorities
1. **Primes** (Highest Priority) - Modern replacement for LTS5
2. **ESG** (Production) - ESG reporting system
3. **Demo** (Development Tool) - UI component showcase
4. **LTS5** (Deprecated) - To be removed soon

#### Package Ecosystem Strategy
- **UI Libraries**: Radix UI > Moornmo UI > Falcon UI > Bootstrap UI
- **Functional Packages**: EChart, Editor-JS, i18n, Toasto, Utils
- **Development Focus**: Radix UI for Primes, Falcon UI for ESG

#### Migration Strategy
- LTS5 → Primes gradual migration
- Feature-by-feature transfer
- Architecture modernization (Bootstrap → Radix UI)

### Files Created
- `.kiro/steering/monorepo-structure-guide-ko.md` - Korean monorepo guide
- `.kiro/steering/monorepo-structure-guide-en.md` - English monorepo guide

### Development Workflow Clarification
- Demo app for UI component testing
- Primes app for main feature development
- ESG app for production maintenance
- Package development for shared components

### Technical Architecture Decisions
- Turborepo for build orchestration
- Workspace-based package management
- Script-based code generation in Primes
- Accessibility-first approach with Radix UI

---

## 2025-01-08: Hook Architecture Improvement

### Context
- Enhanced Hook architecture with atomic separation and Field API pattern
- Implemented single responsibility principle more thoroughly
- Added Field API pattern for Custom Select components

### Key Improvements

#### 1. Atomic Hook Separation
- **Before**: `useVendor` returned all CRUD operations
- **After**: Separate hooks for each operation
  - `useCreateVendor` - Creation only
  - `useUpdateVendor` - Update only
  - `useDeleteVendor` - Deletion only
  - `useVendorListQuery` - List fetching only
  - `useVendorByIdQuery` - Single item fetching only

#### 2. Field API Pattern Introduction
- **Purpose**: Provide simplified data for Custom Select, Autocomplete
- **Hook Pattern**: `use[Entity]FieldQuery`
- **Data Structure**: `{ id, name, code?, disabled? }`
- **Caching**: 5-minute stale time for performance
- **Independence**: Separate from main entity hooks

#### 3. Composite Hook Restructuring
- **Maintained**: `useVendors` as composite hook
- **Excluded**: Field hooks from composite hooks
- **Benefit**: Developers can choose atomic or composite based on needs

#### 4. Performance Optimizations
- **Selective Loading**: Import only needed hooks
- **Cache Separation**: Field API has independent caching
- **Query Key Hierarchy**: Efficient cache invalidation

### Implementation Benefits
1. **Reduced Bundle Size**: Only import necessary hooks
2. **Better Performance**: No unnecessary API calls
3. **Improved Developer Experience**: Clear hook purposes
4. **Enhanced Maintainability**: Single responsibility principle
5. **Type Safety**: Hook-specific types and parameters

### Files Updated
- `.cursorrules` - Added atomic hook patterns and Field API examples
- `.kiro/steering/primes-architecture-guide-ko.md` - Korean documentation
- `.kiro/steering/primes-architecture-guide-en.md` - English documentation
- `.kiro/specs/hook-architecture-improvement/` - Complete specification

### Usage Examples
```typescript
// Before: Unnecessary imports
const CreateVendorPage = () => {
  const { create } = useVendor({ page: 0, size: 10 }); // Unnecessary list query
};

// After: Atomic hook usage
const CreateVendorPage = () => {
  const { mutate: createVendor } = useCreateVendor(); // Only creation
};

// Field API usage
const VendorSelect = () => {
  const { data: options } = useVendorFieldQuery(); // Simplified data
};
```

### Migration Strategy
- New features: Use atomic hooks from start
- Existing features: Gradual migration
- Composite hooks: Maintain for backward compatibility
- Field API: Implement for new select components

---

## Future Architecture Evolution Notes

### Planned Improvements
- [ ] Code generation templates for new patterns
- [ ] Performance monitoring integration
- [ ] Automated testing patterns for templates
- [ ] Design system component library expansion

### Monitoring Points
- Hook reusability across different domains
- Template pattern adoption rate
- Type system maintainability
- Developer onboarding efficiency

### Feedback Collection
- Regular architecture review sessions
- Developer experience surveys
- Code review pattern analysis
- Performance metrics tracking