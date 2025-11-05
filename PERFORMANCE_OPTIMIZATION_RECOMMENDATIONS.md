# Performance Optimization Recommendations

## Immediate Actions Completed ✅

1. **Fixed Atomic Hook Usage**: Replaced composite `useItem` with specific hooks (`useCreateItem`, `useUpdateItem`) when only specific operations are needed
2. **Implemented Field API Pattern**: Replaced large page size queries (1000 items) with efficient `useItemFieldQuery` for select components
3. **Optimized Caching**: Field API uses 5-minute cache vs 3-minute for full queries

## Additional Optimizations to Consider

### 1. Implement Debounced Search

For search components, implement debounced search to prevent excessive API calls:

```typescript
// In search components
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearchTerm = useDebounce(searchTerm, 300);

const { data } = useItemFieldQuery('itemName', {
	search: debouncedSearchTerm,
	isUse: true,
});
```

### 2. Optimize Large List Pages

Files still using large page sizes for legitimate list views:

- `pages/production/working/ProductionWorkingListPage.tsx` - uses `size: 1000` for users
- Consider pagination or virtual scrolling for large datasets

### 3. Implement Query Prefetching

For commonly accessed data, implement prefetching:

```typescript
// In main layout or app initialization
const queryClient = useQueryClient();

useEffect(() => {
	// Prefetch common code values
	queryClient.prefetchQuery({
		queryKey: ['code-field', 'PRD-001'],
		queryFn: () => getCodeFieldName('PRD-001'),
	});
}, []);
```

### 4. Add Request Deduplication

Ensure React Query's built-in deduplication is working properly by using consistent query keys.

### 5. Monitor and Measure

Implement performance monitoring:

```typescript
// Add to React Query client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			onSuccess: (data, query) => {
				console.log(
					`Query ${query.queryKey} completed in ${Date.now() - query.state.dataUpdatedAt}ms`
				);
			},
		},
	},
});
```

## Architecture Patterns to Follow

### 1. Hook Selection Guidelines

- **List Display**: Use `useItemListQuery` with appropriate page size
- **Select Components**: Use `useItemFieldQuery` for dropdown options
- **Create Operations**: Use `useCreateItem` only
- **Update Operations**: Use `useUpdateItem` only
- **Delete Operations**: Use `useDeleteItem` only
- **Multiple Operations**: Use composite `useItem` only when you need multiple operations

### 2. Caching Strategy

- **Field API**: 5-minute cache for select options
- **List Queries**: 3-minute cache with `keepPreviousData`
- **Single Item**: Cache until mutation invalidates

### 3. Query Key Patterns

```typescript
// Consistent query key patterns
['item-field', fieldName, searchParams][('item', id)][ // Field API // Single item
	('items', page, size, searchRequest)
]; // List query
```

## Performance Metrics to Track

1. **Network Requests**: Monitor request count per page load
2. **Response Times**: Track API response times
3. **Cache Hit Rates**: Monitor React Query cache effectiveness
4. **Bundle Size**: Track component bundle sizes
5. **Memory Usage**: Monitor memory consumption

## Testing Strategy

1. **Load Testing**: Test with realistic data volumes
2. **Network Throttling**: Test on slow connections
3. **Cache Testing**: Verify cache invalidation works correctly
4. **User Experience**: Measure perceived performance
