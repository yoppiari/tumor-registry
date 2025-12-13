import React, { useState, useEffect } from 'react';
import { referenceService, BoneLocation, SoftTissueLocation } from '../../../../services';

export interface AnatomicalLocation {
  id: string;
  name: string;
  code?: string;
  parent?: string;
  level?: number;
  region?: string;
  category?: string;
  children?: AnatomicalLocation[];
}

interface LocationSelectorProps {
  type: 'bone' | 'soft_tissue';
  selectedId?: string;
  onSelect: (id: string, location: AnatomicalLocation) => void;
  error?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  type,
  selectedId,
  onSelect,
  error,
}) => {
  const [locations, setLocations] = useState<AnatomicalLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(new Set());
  const [expandedBones, setExpandedBones] = useState<Set<string>>(new Set());

  // Fetch locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        setFetchError(null);

        if (type === 'bone') {
          const boneLocations = await referenceService.getBoneLocations();
          // Build hierarchical structure for bone locations
          const hierarchical = buildBoneHierarchy(boneLocations);
          setLocations(hierarchical);
        } else {
          const softTissueLocations = await referenceService.getSoftTissueLocations();
          // Group soft tissue locations by region
          const grouped = groupSoftTissueByRegion(softTissueLocations);
          setLocations(grouped);
        }
      } catch (error: any) {
        console.error('Error fetching locations:', error);
        setFetchError(error.message || 'Failed to load locations');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [type]);

  // Build 3-level hierarchy for bone locations: Region → Bone → Segment
  const buildBoneHierarchy = (boneLocations: BoneLocation[]): AnatomicalLocation[] => {
    // Level 0: Regions
    const regions = boneLocations.filter((loc) => loc.level === 0);

    return regions.map((region) => {
      // Level 1: Bones within this region
      const bones = boneLocations.filter(
        (loc) => loc.level === 1 && loc.parentId === region.id
      );

      return {
        id: region.id,
        name: region.name,
        code: region.code,
        level: 0,
        region: region.region,
        children: bones.map((bone) => {
          // Level 2: Segments within this bone
          const segments = boneLocations.filter(
            (loc) => loc.level === 2 && loc.parentId === bone.id
          );

          return {
            id: bone.id,
            name: bone.name,
            code: bone.code,
            level: 1,
            region: bone.region,
            children: segments.length > 0 ? segments.map((segment) => ({
              id: segment.id,
              name: segment.name,
              code: segment.code,
              level: 2,
              region: segment.region,
            })) : undefined,
          };
        }),
      };
    });
  };

  // Group soft tissue locations by region
  const groupSoftTissueByRegion = (
    softTissueLocations: SoftTissueLocation[]
  ): AnatomicalLocation[] => {
    const regionMap = new Map<string, AnatomicalLocation>();

    softTissueLocations.forEach((loc) => {
      if (!regionMap.has(loc.region)) {
        regionMap.set(loc.region, {
          id: `region-${loc.region}`,
          name: loc.region,
          level: 0,
          children: [],
        });
      }

      const region = regionMap.get(loc.region)!;
      region.children!.push({
        id: loc.id,
        name: loc.name,
        code: loc.code,
        region: loc.region,
        category: loc.category,
      });
    });

    return Array.from(regionMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  };

  // Filter locations based on search query
  const filteredLocations = locations
    .map((region) => {
      if (!searchQuery) return region;

      if (type === 'bone') {
        // For bone: search in all 3 levels
        const filteredBones = region.children
          ?.map((bone) => {
            const matchesSegments = bone.children?.filter((segment) =>
              segment.name.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (matchesSegments && matchesSegments.length > 0) {
              return { ...bone, children: matchesSegments };
            }

            if (bone.name.toLowerCase().includes(searchQuery.toLowerCase())) {
              return bone;
            }

            return null;
          })
          .filter(Boolean);

        if (filteredBones && filteredBones.length > 0) {
          return { ...region, children: filteredBones as AnatomicalLocation[] };
        }
      } else {
        // For soft tissue: search in location names
        const filteredChildren = region.children?.filter((child) =>
          child.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (filteredChildren && filteredChildren.length > 0) {
          return { ...region, children: filteredChildren };
        }
      }

      return null;
    })
    .filter(Boolean) as AnatomicalLocation[];

  // Toggle region expansion
  const toggleRegion = (regionId: string) => {
    const newExpanded = new Set(expandedRegions);
    if (newExpanded.has(regionId)) {
      newExpanded.delete(regionId);
    } else {
      newExpanded.add(regionId);
    }
    setExpandedRegions(newExpanded);
  };

  // Toggle bone expansion (for bone locations only)
  const toggleBone = (boneId: string) => {
    const newExpanded = new Set(expandedBones);
    if (newExpanded.has(boneId)) {
      newExpanded.delete(boneId);
    } else {
      newExpanded.add(boneId);
    }
    setExpandedBones(newExpanded);
  };

  // Expand all
  const expandAll = () => {
    setExpandedRegions(new Set(locations.map((r) => r.id)));
    if (type === 'bone') {
      const allBones = locations.flatMap((r) => r.children || []).map((b) => b.id);
      setExpandedBones(new Set(allBones));
    }
  };

  // Collapse all
  const collapseAll = () => {
    setExpandedRegions(new Set());
    setExpandedBones(new Set());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading anatomical locations...</span>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">
          <strong>Error:</strong> {fetchError}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and controls */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Location list */}
      <div className="border border-gray-300 rounded-lg max-h-96 overflow-y-auto">
        {filteredLocations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No locations found matching your search.
          </div>
        ) : (
          filteredLocations.map((region) => (
            <div key={region.id} className="border-b last:border-b-0">
              {/* Region header */}
              <button
                onClick={() => toggleRegion(region.id)}
                className="w-full px-4 py-3 flex items-center justify-between bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <span className="font-semibold text-gray-800">{region.name}</span>
                <span className="text-sm text-gray-500">
                  {expandedRegions.has(region.id) ? '▼' : '▶'}
                  {' '}({region.children?.length || 0})
                </span>
              </button>

              {/* Region children (bones or soft tissue locations) */}
              {expandedRegions.has(region.id) && region.children && (
                <div className="bg-white">
                  {region.children.map((item) => (
                    <div key={item.id}>
                      {type === 'bone' && item.children && item.children.length > 0 ? (
                        /* Bone with segments */
                        <>
                          <button
                            onClick={() => toggleBone(item.id)}
                            className="w-full px-6 py-2 flex items-center justify-between hover:bg-gray-50 border-b"
                          >
                            <span className="font-medium text-gray-700">{item.name}</span>
                            <span className="text-sm text-gray-500">
                              {expandedBones.has(item.id) ? '▼' : '▶'}
                              {' '}({item.children.length})
                            </span>
                          </button>

                          {/* Segments */}
                          {expandedBones.has(item.id) && (
                            <div className="bg-gray-50">
                              {item.children.map((segment) => (
                                <button
                                  key={segment.id}
                                  onClick={() => onSelect(segment.id, segment)}
                                  className={`w-full px-10 py-2 text-left hover:bg-blue-50 transition-colors border-b last:border-b-0 ${
                                    selectedId === segment.id
                                      ? 'bg-blue-100 border-l-4 border-l-blue-600'
                                      : ''
                                  }`}
                                >
                                  <span className="text-gray-700">{segment.name}</span>
                                  {segment.code && (
                                    <span className="ml-2 text-xs text-gray-500">
                                      ({segment.code})
                                    </span>
                                  )}
                                  {selectedId === segment.id && (
                                    <span className="ml-2 text-blue-600">✓</span>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        /* Direct selectable item (bone without segments or soft tissue) */
                        <button
                          onClick={() => onSelect(item.id, item)}
                          className={`w-full px-6 py-2 text-left hover:bg-blue-50 transition-colors border-b last:border-b-0 ${
                            selectedId === item.id
                              ? 'bg-blue-100 border-l-4 border-l-blue-600'
                              : ''
                          }`}
                        >
                          <span className="text-gray-700">{item.name}</span>
                          {item.code && (
                            <span className="ml-2 text-xs text-gray-500">({item.code})</span>
                          )}
                          {item.category && (
                            <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {item.category}
                            </span>
                          )}
                          {selectedId === item.id && (
                            <span className="ml-2 text-blue-600">✓</span>
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Error message */}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      {/* Selected info */}
      {selectedId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Selected:</strong>{' '}
            {
              locations
                .flatMap((r) => [
                  ...(r.children || []),
                  ...(r.children?.flatMap((b) => b.children || []) || []),
                ])
                .find((item) => item.id === selectedId)?.name
            }
          </p>
        </div>
      )}
    </div>
  );
};
