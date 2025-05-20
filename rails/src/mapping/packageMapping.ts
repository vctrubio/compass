/**
 * Package mapping utilities
 */
import { TableEntity } from '@/rails/types';
import { Package } from '@/rails/model/package';
import { resolveRelation } from './relationMapping';

/**
 * Maps a package ID to a concise description (hours, capacity)
 * 
 * @param {number|string} packageId - The package ID
 * @param {TableEntity} packagesTable - The packages table data
 * @returns {string} A formatted string with hours and capacity
 */
export function mapPackageSummary(
  packageId: number | string | null | undefined,
  packagesTable: TableEntity | null | undefined
): string {
  if (packageId === null || packageId === undefined || !packagesTable || !packagesTable.data) {
    return 'Unknown package';
  }

  const pkg = packagesTable.data.find((p: any) => 
    p.id?.toString() === packageId.toString()
  );

  if (!pkg) return 'Unknown package';

  return `${pkg.hours}hrs, ${pkg.capacity} ppl`;
}

/**
 * Maps a package ID to a detailed description (hours, capacity, price, description)
 * 
 * @param {number|string} packageId - The package ID
 * @param {TableEntity} packagesTable - The packages table data
 * @returns {string} A detailed package description
 */
export function mapPackageDetail(
  packageId: number | string | null | undefined,
  packagesTable: TableEntity | null | undefined
): string {
  if (packageId === null || packageId === undefined || !packagesTable || !packagesTable.data) {
    return 'Unknown package';
  }

  const pkg = packagesTable.data.find((p: any) => 
    p.id?.toString() === packageId.toString()
  );

  if (!pkg) return 'Unknown package';

  const baseDescription = `${pkg.hours}hrs, ${pkg.capacity} ppl - $${pkg.price}`;
  
  return pkg.description
    ? `${baseDescription} (${pkg.description})`
    : baseDescription;
}
