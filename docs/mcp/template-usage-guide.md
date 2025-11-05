# 🎯 Enhanced Template System Usage Guide

## 📋 Overview

This guide covers the enhanced template system that provides project-specific code generation for both Primes and ESG projects, with unified schema systems and Swagger integration.

## 🚀 Quick Start

### **Primes Project Development**

```bash
# Generate a complete Primes module
pp "Vendor 리스트 페이지 만들어줘"

# Result: Full Primes-style module with:
✅ SinglePage with modal CRUD
✅ TabNavigation structure
✅ CustomSelect with Field API
✅ Atomic Hooks pattern
✅ Zod validation schema
✅ Error boundary handling
✅ Translation keys
```

### **ESG Project Development**

```bash
# Generate a complete ESG dashboard
pp "CarbonEmission 대시보드 만들어줘"

# Result: Full ESG-style module with:
✅ Dashboard with KPI cards
✅ Chart widgets for data visualization
✅ Multi-step form wizards
✅ Progress tracking
✅ ESG-specific hooks
✅ Framework compliance validation
```

## 📋 **Primes Templates**

### **1. SinglePage Template**

**Use Case**: Simple CRUD operations with modal-based editing

```typescript
// Generated structure:
VendorListPage.tsx
├── DatatableComponent (with search/filter)
├── SearchSlotComponent (unified search fields)
├── ActionButtonsComponent (in endSlot)
├── DraggableDialog (for create/edit modal)
└── DynamicForm (with validation)

// Features:
- Modal-based CRUD
- Unified search/table/form fields
- Action buttons in table header
- Real-time validation
- Translation integration
```

### **2. MasterDetailPage Template**

**Use Case**: Complex relationships with navigation-based editing

```typescript
// Generated structure:
OrderMasterDetailPage.tsx
├── Master list (left panel)
├── Detail view (right panel)
├── Navigation-based editing
└── Relationship management

// Features:
- Split-panel layout
- Master-detail relationships
- Navigation-based CRUD
- Related data management
```

### **3. TabNavigation Template**

**Use Case**: Multi-tab interfaces with URL synchronization

```typescript
// Generated structure:
VendorTabNavigation.tsx
├── TabLayout component
├── URL synchronization
├── Dynamic tab content
└── Action button integration

// Features:
- URL-based tab state
- Dynamic content loading
- Integrated action buttons
- Responsive design
```

### **4. CustomSelect Template**

**Use Case**: Field API integrated select components

```typescript
// Generated structure:
VendorSelectComponent.tsx
├── RadixSelect base
├── Field API integration
├── Loading/error states
└── Translation support

// Features:
- Field API data source
- Configurable value/label keys
- Loading and error handling
- Translation integration
```

### **5. Atomic Hooks Template**

**Use Case**: Single responsibility hooks pattern

```typescript
// Generated hooks:
useCreateVendor()     // Creation only
useUpdateVendor()     // Update only
useDeleteVendor()     // Deletion only
useVendorListQuery()  // List fetching only
useVendorByIdQuery()  // Single item fetching only
useVendorFieldQuery() // Field API only
useVendors()          // Composite hook

// Features:
- Single responsibility principle
- Independent caching
- Optimized bundle size
- Type safety
```

## 🌱 **ESG Templates**

### **1. DashboardPage Template**

**Use Case**: ESG metrics dashboard with KPI visualization

```typescript
// Generated structure:
CarbonEmissionDashboardPage.tsx
├── KPI Cards (emissions, targets, trends)
├── Chart Widgets (line, bar, pie charts)
├── Filter Controls (date, category, region)
└── Real-time data updates

// Features:
- ESG-specific KPI cards
- Interactive charts
- Advanced filtering
- Real-time WebSocket data
```

### **2. ChartWidget Template**

**Use Case**: ESG-optimized data visualization

```typescript
// Generated structure:
CarbonEmissionChartWidget.tsx
├── Multiple chart types (line, bar, area, pie)
├── ESG-specific configurations
├── Loading/error states
└── Responsive design

// Features:
- ESG data optimization
- Custom color schemes
- Unit formatting (tCO2e, MWh, etc.)
- Interactive tooltips
```

### **3. KPICard Template**

**Use Case**: ESG metrics cards with trends and targets

```typescript
// Generated structure:
CarbonEmissionKPICard.tsx
├── Metric value display
├── Trend indicators (up/down/stable)
├── Target comparison
└── Status-based coloring

// Features:
- ESG metric formatting
- Trend analysis
- Target progress bars
- Status indicators
```

### **4. FormWizard Template**

**Use Case**: Multi-step ESG data collection

```typescript
// Generated structure:
CarbonEmissionFormWizard.tsx
├── Step-by-step forms
├── Progress tracking
├── Validation per step
└── Review step

// Features:
- Multi-step navigation
- Step validation
- Progress visualization
- Data review
```

### **5. ESG Hooks Template**

**Use Case**: ESG-specific data management

```typescript
// Generated hooks:
useCreateCarbonEmission()    // Standard CRUD
useCarbonEmissionDashboard() // Dashboard data
useCarbonEmissionRealTime()  // WebSocket data
useCarbonEmissionForm()      // Form management
useExportCarbonReport()      // Report generation

// Features:
- ESG data patterns
- Real-time updates
- Report generation
- Framework compliance
```

## 🔧 **Unified Schema System**

### **Field Schema Definition**

```typescript
// Single field definition:
FieldSchema({
  name: "carbonEmissions",
  label: "탄소 배출량",
  type: FieldType.NUMBER,
  required: true,
  unit: "tCO2e",
  validation: {
    min: 0,
    message: "배출량은 0 이상이어야 합니다"
  }
})

// Auto-generates:
1. Search field: { key: "carbonEmissions", type: "number" }
2. Table column: { accessorKey: "carbonEmissions", header: "탄소 배출량" }
3. Form field: { name: "carbonEmissions", type: "number", required: true }
```

### **Schema Benefits**

- **Consistency**: Single definition → Multiple outputs
- **Maintainability**: Change once, update everywhere
- **Type Safety**: Full TypeScript support
- **Validation**: Unified validation rules

## ✅ **Validation Patterns**

### **Primes Validation (Business Rules)**

```typescript
// Business-focused validation
const vendorSchema = z.object({
	vendorName: z.string().min(1, '거래처명은 필수입니다'),
	vendorCode: z.string().regex(/^V\d{4}$/, '거래처코드 형식: V0001'),
	companyRegNo: z
		.string()
		.regex(/^\d{3}-\d{2}-\d{5}$/, '사업자등록번호 형식 오류'),
});
```

### **ESG Validation (Framework Compliance)**

```typescript
// ESG standards compliance
const esgSchema = z.object({
	carbonEmissions: z.number().min(0, '배출량은 0 이상이어야 합니다'),
	unit: z.enum(['tCO2e', 'kgCO2e'], '지원되지 않는 단위입니다'),
	framework: z.enum(['GRI', 'SASB', 'TCFD'], 'ESG 프레임워크를 선택하세요'),
	dataQuality: z.object({
		accuracy: z.number().min(0).max(100),
		verificationStatus: z.enum(['verified', 'unverified', 'pending']),
	}),
});
```

## 🌐 **Translation System**

### **Hierarchical Key Structure**

```json
{
	"tabs": {
		"titles": { "vendorManagement": "거래처 관리" },
		"labels": { "list": "현황", "analysis": "분석" },
		"actions": { "register": "등록", "edit": "수정" }
	},
	"pages": {
		"titles": { "vendorList": "거래처 목록" },
		"vendor": { "register": "거래처 등록" }
	},
	"fields": { "vendorName": "거래처명" },
	"validation": { "required": "필수 항목입니다" },
	"select": { "vendorPlaceholder": "거래처를 선택하세요" }
}
```

### **Auto-Generation**

- **Korean First**: Primary language with business context
- **English Translation**: Professional, consistent terminology
- **Missing Detection**: Automatic detection of missing keys
- **Fallback Handling**: Graceful degradation

## 🚨 **Error Handling**

### **Component-Level Error Boundaries**

```typescript
// Primes: Radix UI based
<VendorErrorBoundary>
  <VendorListPage />
</VendorErrorBoundary>

// ESG: Falcon UI based
<CarbonEmissionErrorBoundary>
  <CarbonEmissionDashboard />
</CarbonEmissionErrorBoundary>
```

### **Error Recovery**

- **Retry Mechanisms**: Automatic retry with exponential backoff
- **User Feedback**: Clear error messages in Korean
- **Logging**: Comprehensive error logging for debugging
- **Fallback UI**: Graceful degradation when errors occur

## 🔗 **Integration Guidelines**

### **1. Template Selection**

- **Primes**: Use for general business applications
- **ESG**: Use for sustainability and compliance applications
- **Consider UI Framework**: Radix UI vs Falcon UI
- **Match Complexity**: Simple CRUD vs Complex dashboards

### **2. Schema Definition**

- **Start with Swagger**: Use Swagger schema as source of truth
- **Define Field Schema**: Create unified field definitions
- **Validate Early**: Implement validation at schema level
- **Consider Relationships**: Plan for related data

### **3. Hook Patterns**

- **Atomic First**: Use individual hooks for specific needs
- **Composite When Needed**: Use composite hooks for common patterns
- **Cache Strategy**: Plan cache invalidation strategy
- **Error Handling**: Implement consistent error handling

### **4. Validation Strategy**

- **Business Rules**: Apply appropriate business validation
- **Framework Compliance**: Use ESG standards for ESG projects
- **User Experience**: Provide clear, actionable error messages
- **Performance**: Optimize validation for user experience

### **5. Translation Management**

- **Hierarchical Keys**: Use structured key organization
- **Context Awareness**: Provide business context in translations
- **Consistency**: Maintain consistent terminology
- **Fallback Strategy**: Plan for missing translations

## 📊 **Best Practices**

### **Development Workflow**

1. **Start with MCP**: Use MCP commands for initial generation
2. **Review Generated Code**: Understand generated patterns
3. **Customize as Needed**: Adapt to specific requirements
4. **Test Thoroughly**: Validate all generated functionality
5. **Document Changes**: Update documentation for customizations

### **Code Quality**

- **Follow Patterns**: Stick to established patterns
- **Type Safety**: Maintain full TypeScript coverage
- **Performance**: Optimize for user experience
- **Accessibility**: Ensure accessible UI components
- **Testing**: Implement comprehensive testing

### **Maintenance**

- **Regular Updates**: Keep templates updated with latest patterns
- **Schema Evolution**: Plan for schema changes
- **Documentation**: Maintain up-to-date documentation
- **Training**: Ensure team understands patterns

## 🎯 **Common Use Cases**

### **Primes Examples**

```bash
# Basic CRUD module
pp "Product 리스트 페이지 만들어줘"

# Master-detail relationship
pp "Order 상세 페이지 만들어줘"

# Analysis dashboard
pp "Sales 분석 페이지 만들어줘"

# Custom select component
pp "Category 선택 컴포넌트 만들어줘"
```

### **ESG Examples**

```bash
# ESG dashboard
pp "WaterUsage 대시보드 만들어줘"

# Data collection
pp "EmissionData 수집 페이지 만들어줘"

# Compliance tracking
pp "Compliance 추적 페이지 만들어줘"

# Report generation
pp "Sustainability 리포트 페이지 만들어줘"
```

## 🔧 **Troubleshooting**

### **Common Issues**

1. **Template Not Found**: Ensure correct project type selection
2. **Schema Mismatch**: Verify Swagger schema alignment
3. **Translation Missing**: Check translation key generation
4. **Validation Errors**: Review validation schema definitions
5. **Hook Dependencies**: Verify hook dependency chains

### **Debug Steps**

1. **Check MCP Status**: Verify MCP server is running
2. **Review Generated Files**: Examine generated code structure
3. **Validate Schema**: Ensure schema definitions are correct
4. **Test Components**: Verify component functionality
5. **Check Translations**: Ensure translation keys exist

## 📚 **Additional Resources**

- **Primes Architecture Guide**: `.kiro/steering/primes-architecture-guide-ko.md`
- **ESG Development Guide**: Project-specific ESG documentation
- **MCP Command Reference**: `SWAGGER_SYNC_GUIDE.md`
- **Best Practices**: `mcp/best_practices_guide.md`
- **Component Inventory**: `mcp/patterns/packages_inventory.py`
