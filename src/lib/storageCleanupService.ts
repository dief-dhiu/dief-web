import { supabase } from './supabase';

/**
 * ==============================================================================
 * DIEF Portal — Supabase Storage Automatic Cleanup Service
 *
 * Provides safe, multi-bucket object path extraction, shared reference checking,
 * storage deletion before database record deletion, and post-update asset cleanup.
 * ==============================================================================
 */

export const DIEF_BUCKETS = [
  'activities',
  'faculty',
  'journal-covers',
  'journal-published',
  'journal-submissions'
] as const;

export type DiefBucket = typeof DIEF_BUCKETS[number];

export interface StorageTarget {
  bucket: string;
  path: string;
  rawUrl?: string;
}

export interface DeleteFilesResult {
  success: boolean;
  deleted: string[];
  skipped: string[];
  errors: { path: string; error: string }[];
}

export interface OrphanedFileItem {
  bucket: string;
  path: string;
  sizeBytes?: number;
  createdAt?: string;
  publicUrl?: string;
  reason: string;
}

export interface OrphanedFilesReport {
  scannedAt: string;
  totalBucketsScanned: number;
  totalStorageFiles: number;
  totalActiveReferencedFiles: number;
  totalOrphanedFiles: number;
  orphanedFiles: OrphanedFileItem[];
  detailsByBucket: Record<string, { total: number; referenced: number; orphaned: number }>;
}

/**
 * Safely parses any file reference (public URL, authenticated/signed URL, or relative path)
 * to identify whether it is a Supabase Storage asset.
 *
 * Returns null if the URL is external (e.g. Unsplash, data URI, placeholder, or external domain).
 */
export function parseStorageUrl(input: string, fallbackBucket?: string): StorageTarget | null {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Immediately ignore external assets, placeholders, and mock data
  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    trimmed.includes('images.unsplash.com') ||
    trimmed.startsWith('/dief-') ||
    trimmed === '#'
  ) {
    return null;
  }

  // 1. Standard Supabase storage endpoint:
  // e.g. https://<project>.supabase.co/storage/v1/object/(public|sign|authenticated)/<bucket>/<path>
  const storageRegex = /\/storage\/v1\/object\/(?:public|sign|authenticated)\/([^/?#]+)\/([^?#]+)/i;
  const match = trimmed.match(storageRegex);
  if (match) {
    const bucket = match[1];
    let path = decodeURIComponent(match[2]);
    path = path.replace(/^\/+|\/+$/g, '');
    return { bucket, path, rawUrl: trimmed };
  }

  // 2. Pattern containing /<bucketName>/<path>
  for (const b of DIEF_BUCKETS) {
    const bucketPattern = new RegExp(`(?:^|[/?#])${b}\\/([^?#]+)`, 'i');
    const bMatch = trimmed.match(bucketPattern);
    if (bMatch) {
      let path = decodeURIComponent(bMatch[1]);
      path = path.replace(/^\/+|\/+$/g, '');
      return { bucket: b, path, rawUrl: trimmed };
    }
  }

  // 3. Relative path format (e.g. "covers/123.jpg", "posters/123.jpg", "photos/123.jpg")
  if (
    fallbackBucket &&
    trimmed.includes('/') &&
    !trimmed.startsWith('http://') &&
    !trimmed.startsWith('https://')
  ) {
    const cleanPath = trimmed.replace(/^\/+|\/+$/g, '');
    return { bucket: fallbackBucket, path: cleanPath, rawUrl: trimmed };
  }

  return null;
}

/**
 * Checks whether a given Storage object path or URL is referenced by another active record
 * in the database to prevent accidental deletion of shared files.
 */
export async function isFileReferencedElsewhere(options: {
  bucket: string;
  path: string;
  rawUrl?: string;
  excludeRecordId?: string;
  excludeTable?: string;
}): Promise<boolean> {
  const { bucket, path, rawUrl, excludeRecordId, excludeTable } = options;

  try {
    // 1. Activities bucket: check activities (featured_image_url) and activity_gallery (image_url)
    if (bucket === 'activities') {
      let actQuery = supabase.from('activities').select('id, featured_image_url');
      if (excludeTable === 'activities' && excludeRecordId) {
        actQuery = actQuery.neq('id', excludeRecordId);
      }
      const { data: actRows } = await actQuery;
      if (
        actRows?.some(
          r =>
            r.featured_image_url &&
            (r.featured_image_url.includes(path) || (rawUrl && r.featured_image_url === rawUrl))
        )
      ) {
        return true;
      }

      let galQuery = supabase.from('activity_gallery').select('id, activity_id, image_url');
      if (excludeTable === 'activity_gallery' && excludeRecordId) {
        galQuery = galQuery.neq('id', excludeRecordId);
      } else if (excludeTable === 'activities' && excludeRecordId) {
        galQuery = galQuery.neq('activity_id', excludeRecordId);
      }
      const { data: galRows } = await galQuery;
      if (
        galRows?.some(
          r =>
            r.image_url &&
            (r.image_url.includes(path) || (rawUrl && r.image_url === rawUrl))
        )
      ) {
        return true;
      }
    }

    // 2. Journal covers bucket: check journal_issues (cover_image_url)
    if (bucket === 'journal-covers') {
      let query = supabase.from('journal_issues').select('id, cover_image_url');
      if (excludeTable === 'journal_issues' && excludeRecordId) {
        query = query.neq('id', excludeRecordId);
      }
      const { data: rows } = await query;
      if (
        rows?.some(
          r =>
            r.cover_image_url &&
            (r.cover_image_url.includes(path) || (rawUrl && r.cover_image_url === rawUrl))
        )
      ) {
        return true;
      }
    }

    // 3. Journal published bucket: check journal_articles (pdf_url)
    if (bucket === 'journal-published') {
      let query = supabase.from('journal_articles').select('id, pdf_url');
      if (excludeTable === 'journal_articles' && excludeRecordId) {
        query = query.neq('id', excludeRecordId);
      }
      const { data: rows } = await query;
      if (
        rows?.some(
          r =>
            r.pdf_url &&
            (r.pdf_url.includes(path) || (rawUrl && r.pdf_url === rawUrl))
        )
      ) {
        return true;
      }
    }

    // 4. Journal submissions bucket: check journal_submissions (file_url)
    if (bucket === 'journal-submissions') {
      let query = supabase.from('journal_submissions').select('id, file_url');
      if (excludeTable === 'journal_submissions' && excludeRecordId) {
        query = query.neq('id', excludeRecordId);
      }
      const { data: rows } = await query;
      if (
        rows?.some(
          r =>
            r.file_url &&
            (r.file_url.includes(path) || (rawUrl && r.file_url === rawUrl))
        )
      ) {
        return true;
      }
    }

    // 5. Faculty bucket: check faculty_profiles (photo_url)
    if (bucket === 'faculty') {
      let query = supabase.from('faculty_profiles').select('id, photo_url');
      if (excludeTable === 'faculty_profiles' && excludeRecordId) {
        query = query.neq('id', excludeRecordId);
      }
      const { data: rows } = await query;
      if (
        rows?.some(
          r =>
            r.photo_url &&
            (r.photo_url.includes(path) || (rawUrl && r.photo_url === rawUrl))
        )
      ) {
        return true;
      }
    }

    return false;
  } catch (err) {
    console.warn('[StorageCleanupService] Reference check failed, defaulting to safe preserve:', err);
    return true; // Fail safe
  }
}

/**
 * Deletes one or more files from Supabase Storage using the official Storage API.
 *
 * Features:
 * - Multi-bucket support in a single invocation.
 * - Extracts object paths safely from Supabase URLs.
 * - Gracefully skips non-storage URLs (e.g. Unsplash placeholders).
 * - Checks whether any file is referenced elsewhere and skips shared files.
 * - Handles missing files gracefully.
 * - Writes audit log on successful file removals.
 */
export async function deleteStorageFiles(
  targets: Array<string | StorageTarget | null | undefined>,
  context?: {
    excludeRecordId?: string;
    excludeTable?: string;
    fallbackBucket?: string;
    actionDescription?: string;
  }
): Promise<DeleteFilesResult> {
  const result: DeleteFilesResult = {
    success: true,
    deleted: [],
    skipped: [],
    errors: []
  };

  if (!targets || targets.length === 0) {
    return result;
  }

  // 1. Group valid storage targets by bucket
  const bucketMap = new Map<string, StorageTarget[]>();

  for (const item of targets) {
    if (!item) continue;
    const parsed =
      typeof item === 'string'
        ? parseStorageUrl(item, context?.fallbackBucket)
        : item;

    if (!parsed || !parsed.bucket || !parsed.path) {
      if (typeof item === 'string') {
        result.skipped.push(item);
      }
      continue;
    }

    // Skip empty folder placeholders
    if (parsed.path.includes('.emptyFolderPlaceholder')) {
      result.skipped.push(parsed.path);
      continue;
    }

    if (!bucketMap.has(parsed.bucket)) {
      bucketMap.set(parsed.bucket, []);
    }
    bucketMap.get(parsed.bucket)!.push(parsed);
  }

  // 2. Process each bucket
  for (const [bucket, fileTargets] of bucketMap.entries()) {
    const pathsToDelete: string[] = [];

    for (const target of fileTargets) {
      const isShared = await isFileReferencedElsewhere({
        bucket: target.bucket,
        path: target.path,
        rawUrl: target.rawUrl,
        excludeRecordId: context?.excludeRecordId,
        excludeTable: context?.excludeTable
      });

      if (isShared) {
        console.info(`[StorageCleanupService] Preserving shared file: ${bucket}/${target.path}`);
        result.skipped.push(`${bucket}/${target.path} (shared file)`);
      } else {
        pathsToDelete.push(target.path);
      }
    }

    if (pathsToDelete.length === 0) {
      continue;
    }

    try {
      // Official Supabase Storage API call
      const { data, error } = await supabase.storage
        .from(bucket)
        .remove(pathsToDelete);

      if (error) {
        result.success = false;
        pathsToDelete.forEach(p => {
          result.errors.push({ path: `${bucket}/${p}`, error: error.message });
        });
        console.error(`[StorageCleanupService] Failed to delete files from "${bucket}":`, error.message);
      } else {
        pathsToDelete.forEach(p => {
          result.deleted.push(`${bucket}/${p}`);
        });

        // Audit log the storage deletion
        try {
          const { data: { user } } = await supabase.auth.getUser();
          await supabase.from('audit_logs').insert({
            user_id: user?.id || null,
            user_email: user?.email || 'Admin User',
            action: 'STORAGE_FILES_DELETED',
            entity_type: `storage/${bucket}`,
            entity_id: pathsToDelete.slice(0, 3).join(', '),
            details: {
              bucket,
              deleted_paths: pathsToDelete,
              count: pathsToDelete.length,
              context: context?.actionDescription || 'CMS content cleanup'
            }
          });
        } catch (auditErr) {
          console.warn('[StorageCleanupService] Could not write audit log:', auditErr);
        }
      }
    } catch (err: any) {
      result.success = false;
      pathsToDelete.forEach(p => {
        result.errors.push({ path: `${bucket}/${p}`, error: err?.message || String(err) });
      });
    }
  }

  return result;
}

/**
 * Scans all Supabase Storage buckets and compares against active database records
 * to generate a non-destructive audit report of potentially orphaned files.
 *
 * Does not delete any files automatically.
 */
export async function generateOrphanedFilesReport(): Promise<OrphanedFilesReport> {
  const report: OrphanedFilesReport = {
    scannedAt: new Date().toISOString(),
    totalBucketsScanned: DIEF_BUCKETS.length,
    totalStorageFiles: 0,
    totalActiveReferencedFiles: 0,
    totalOrphanedFiles: 0,
    orphanedFiles: [],
    detailsByBucket: {}
  };

  for (const bucket of DIEF_BUCKETS) {
    report.detailsByBucket[bucket] = { total: 0, referenced: 0, orphaned: 0 };

    try {
      // List root of the bucket
      const { data: rootItems, error: rootErr } = await supabase.storage.from(bucket).list('');
      if (rootErr || !rootItems) {
        console.warn(`[StorageAudit] Could not list bucket "${bucket}":`, rootErr?.message);
        continue;
      }

      const allFiles: { name: string; path: string; metadata?: any; created_at?: string }[] = [];

      for (const item of rootItems) {
        if (item.id === null) {
          // Folder: inspect subfolder
          const { data: subItems } = await supabase.storage.from(bucket).list(item.name);
          if (subItems) {
            for (const sub of subItems) {
              if (sub.name !== '.emptyFolderPlaceholder') {
                allFiles.push({
                  name: sub.name,
                  path: `${item.name}/${sub.name}`,
                  metadata: sub.metadata,
                  created_at: sub.created_at || undefined
                });
              }
            }
          }
        } else if (item.name !== '.emptyFolderPlaceholder') {
          allFiles.push({
            name: item.name,
            path: item.name,
            metadata: item.metadata,
            created_at: item.created_at || undefined
          });
        }
      }

      report.detailsByBucket[bucket].total = allFiles.length;
      report.totalStorageFiles += allFiles.length;

      for (const file of allFiles) {
        const isReferenced = await isFileReferencedElsewhere({
          bucket,
          path: file.path
        });

        if (isReferenced) {
          report.detailsByBucket[bucket].referenced++;
          report.totalActiveReferencedFiles++;
        } else {
          report.detailsByBucket[bucket].orphaned++;
          report.totalOrphanedFiles++;

          const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(file.path);

          report.orphanedFiles.push({
            bucket,
            path: file.path,
            sizeBytes: file.metadata?.size,
            createdAt: file.created_at,
            publicUrl,
            reason: 'Not referenced by any active database record in the DIEF CMS'
          });
        }
      }
    } catch (err: any) {
      console.error(`[StorageAudit] Error scanning bucket "${bucket}":`, err);
    }
  }

  return report;
}
