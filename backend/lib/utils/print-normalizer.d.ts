import type { Products } from '../services/products/products.schema'
export interface PrintInfo {
  key: string
  label: string
}
export declare const isFinishKey: (key?: string | null) => boolean
export declare const isFoilVariantKey: (key?: string | null) => boolean
export declare const deriveFinishKey: (key?: string | null) => string
export declare const normalizePrint: (raw?: string | null) => PrintInfo
type ExtendedDataEntry = {
  name?: string
  display_name?: string
  value?: unknown
}
type VariantDetectionInput = {
  name?: string
  short_name?: string
  extended_data?: ExtendedDataEntry[]
}
export declare const detectPrintVariant: (input?: VariantDetectionInput | null) => PrintInfo
export declare const derivePrintFromProduct: (product?: Partial<Products> | null) => PrintInfo
export declare const getPrintLabel: (key: string) => string
export declare const knownPrintLabels: () => Record<string, string>
export {}
