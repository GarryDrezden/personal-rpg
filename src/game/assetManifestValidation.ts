import {
  ASSET_LIFECYCLE_STATUSES,
  ASSET_PRIORITIES,
  ASSET_REGISTRY_CATEGORIES,
  type AssetManifestEntry,
  type AssetManifestV2,
} from './assetManifestTypes';

export type ManifestValidationIssue = {
  assetId?: string;
  field?: string;
  message: string;
};

const REQUIRED_ENTRY_FIELDS: (keyof AssetManifestEntry)[] = [
  'id',
  'type',
  'category',
  'title',
  'status',
  'priority',
  'usedIn',
  'promptStatus',
  'fileStatus',
  'manifestStatus',
  'notes',
];

const PATH_REQUIRED_STATUSES = new Set(['in-app', 'done']);

export type ValidateAssetManifestOptions = {
  /** When provided, verifies paths for in-app/done assets */
  fileExists?: (absolutePath: string) => boolean;
  /** Prefix for resolving manifest paths (e.g. public/) */
  publicRoot?: string;
};

export function validateAssetManifest(
  manifest: AssetManifestV2,
  options?: ValidateAssetManifestOptions,
): ManifestValidationIssue[] {
  const issues: ManifestValidationIssue[] = [];
  const ids = new Set<string>();
  const publicRoot = options?.publicRoot?.replace(/\\/g, '/').replace(/\/$/, '') ?? '';
  const fileExists = options?.fileExists;

  if (manifest.version < 2) {
    issues.push({ message: 'manifest.version must be >= 2 for Asset Registry 2.0' });
  }

  for (const asset of manifest.assets) {
    for (const field of REQUIRED_ENTRY_FIELDS) {
      const value = asset[field];
      if (value === undefined) {
        issues.push({
          assetId: asset.id,
          field,
          message: `Missing required field "${field}"`,
        });
      } else if (field !== 'notes' && value === '') {
        issues.push({
          assetId: asset.id,
          field,
          message: `Empty required field "${field}"`,
        });
      }
    }

    if (ids.has(asset.id)) {
      issues.push({ assetId: asset.id, message: 'Duplicate asset id' });
    }
    ids.add(asset.id);

    if (!ASSET_REGISTRY_CATEGORIES.includes(asset.category)) {
      issues.push({
        assetId: asset.id,
        field: 'category',
        message: `Invalid category "${asset.category}"`,
      });
    }

    if (!ASSET_LIFECYCLE_STATUSES.includes(asset.status)) {
      issues.push({
        assetId: asset.id,
        field: 'status',
        message: `Invalid status "${asset.status}"`,
      });
    }

    if (!ASSET_PRIORITIES.includes(asset.priority)) {
      issues.push({
        assetId: asset.id,
        field: 'priority',
        message: `Invalid priority "${asset.priority}"`,
      });
    }

    if (PATH_REQUIRED_STATUSES.has(asset.status)) {
      if (!asset.path) {
        issues.push({
          assetId: asset.id,
          field: 'path',
          message: `path required for status "${asset.status}"`,
        });
      } else if (fileExists && publicRoot) {
        const diskPath = `${publicRoot}/${asset.path.replace(/^\//, '')}`;
        if (!fileExists(diskPath)) {
          issues.push({
            assetId: asset.id,
            field: 'path',
            message: `File not found: ${diskPath}`,
          });
        }
      }
    }
  }

  return issues;
}

export function assertValidAssetManifest(
  manifest: AssetManifestV2,
  options?: ValidateAssetManifestOptions,
): void {
  const issues = validateAssetManifest(manifest, options);
  if (issues.length > 0) {
    const summary = issues.map((i) => `${i.assetId ?? 'manifest'}: ${i.message}`).join('\n');
    throw new Error(`Invalid asset manifest:\n${summary}`);
  }
}

export function indexManifestById(
  manifest: AssetManifestV2,
): Map<string, AssetManifestEntry> {
  return new Map(manifest.assets.map((a) => [a.id, a]));
}

export function indexManifestByEntityId(
  manifest: AssetManifestV2,
): Map<string, AssetManifestEntry> {
  const map = new Map<string, AssetManifestEntry>();
  for (const asset of manifest.assets) {
    if (asset.relatedEntityId) {
      map.set(asset.relatedEntityId, asset);
    }
  }
  return map;
}
