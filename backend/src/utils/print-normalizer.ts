import type { Products } from '../services/products/products.schema'

export interface PrintInfo {
  key: string
  label: string
}

const PRINT_LABEL_LOOKUP: Record<string, string> = {
  base: 'Base',
  foil: 'Foil',
  reverse_holofoil: 'Reverse Holofoil',
  reverse_holo: 'Reverse Holo',
  alternate_art: 'Alternate Art',
  borderless: 'Borderless',
  extended_art: 'Extended Art',
  full_art: 'Full Art',
  illustration_rare: 'Illustration Rare',
  showcase: 'Showcase',
  etched_foil: 'Etched Foil',
  textured_foil: 'Textured Foil',
  galaxy_foil: 'Galaxy Foil',
  pirate_foil: 'Pirate Foil',
  jolly_roger_foil: 'Jolly Roger Foil',
  rainbow_foil: 'Rainbow Foil',
  parallel: 'Parallel',
  promo: 'Promo',
  standard: 'Standard',
  sp: 'SP',
  manga: 'Manga',
  wanted_poster: 'Wanted Poster',
  super_alternate_art: 'Super Alternate Art'
}

const SYNONYMS: Record<string, string> = {
  normal: 'base',
  'non foil': 'base',
  'non-foil': 'base',
  nonfoil: 'base',
  base: 'base',
  foil: 'foil',
  holofoil: 'foil',
  'holo foil': 'foil',
  'premium foil': 'foil',
  'reverse holofoil': 'reverse_holofoil',
  'reverse foil': 'reverse_holofoil',
  'reverse holo': 'reverse_holo',
  'alternate art': 'alternate_art',
  'alt art': 'alternate_art',
  'alt-art': 'alternate_art',
  alternate: 'alternate_art',
  'extended art': 'extended_art',
  'full art': 'full_art',
  borderless: 'borderless',
  showcase: 'showcase',
  'etched foil': 'etched_foil',
  'textured foil': 'textured_foil',
  'galaxy foil': 'galaxy_foil',
  'pirate foil': 'pirate_foil',
  'jolly roger foil': 'jolly_roger_foil',
  'jolly-roger foil': 'jolly_roger_foil',
  'rainbow foil': 'rainbow_foil',
  parallel: 'parallel',
  promo: 'promo',
  'illustration rare': 'illustration_rare',
  'illustration-rare': 'illustration_rare',
  standard: 'standard',
  sp: 'sp',
  manga: 'manga',
  'manga rare': 'manga',
  'manga art': 'manga',
  'wanted poster': 'wanted_poster',
  'wanted-poster': 'wanted_poster'
}

const FINISH_KEYS = new Set(['foil'])

const FOIL_VARIANT_KEYS = new Set([
  'reverse_holofoil',
  'reverse_holo',
  'etched_foil',
  'textured_foil',
  'galaxy_foil',
  'pirate_foil',
  'jolly_roger_foil',
  'rainbow_foil'
])

export const isFinishKey = (key?: string | null): boolean => (key ? FINISH_KEYS.has(key) : false)

export const isFoilVariantKey = (key?: string | null): boolean => (key ? FOIL_VARIANT_KEYS.has(key) : false)

export const deriveFinishKey = (key?: string | null): string => {
  if (!key || key === 'base') {
    return 'base'
  }

  if (key === 'foil' || isFoilVariantKey(key)) {
    return 'foil'
  }

  return key
}

const VARIANT_KEYWORDS: Array<{ key: string; keywords: string[] }> = [
  { key: 'alternate_art', keywords: ['alternate art', 'alt art'] },
  { key: 'borderless', keywords: ['borderless'] },
  { key: 'extended_art', keywords: ['extended art', 'extended-art'] },
  { key: 'full_art', keywords: ['full art'] },
  { key: 'showcase', keywords: ['showcase'] },
  { key: 'parallel', keywords: ['parallel', 'super parallel'] },
  { key: 'illustration_rare', keywords: ['illustration rare', 'special illustration'] },
  { key: 'sp', keywords: ['sp', 'sp rare'] },
  { key: 'manga', keywords: ['manga', 'manga rare', 'manga art'] },
  { key: 'wanted_poster', keywords: ['wanted poster'] },
  { key: 'reverse_holofoil', keywords: ['reverse holofoil', 'reverse foil'] },
  { key: 'reverse_holo', keywords: ['reverse holo'] },
  { key: 'etched_foil', keywords: ['etched foil'] },
  { key: 'textured_foil', keywords: ['textured foil'] },
  { key: 'galaxy_foil', keywords: ['galaxy foil'] },
  { key: 'pirate_foil', keywords: ['pirate foil'] },
  { key: 'jolly_roger_foil', keywords: ['jolly roger foil'] },
  { key: 'rainbow_foil', keywords: ['rainbow foil'] },
  { key: 'super_alternate_art', keywords: ['super alternate art'] }
]

const titleCase = (value: string): string =>
  value
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

const slugify = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

const ensureLabel = (key: string): string => {
  if (!PRINT_LABEL_LOOKUP[key]) {
    PRINT_LABEL_LOOKUP[key] = titleCase(key)
  }
  return PRINT_LABEL_LOOKUP[key]
}

export const normalizePrint = (raw?: string | null): PrintInfo => {
  if (!raw) {
    return { key: 'base', label: ensureLabel('base') }
  }

  const cleaned = raw.trim().toLowerCase()
  const canonicalKey = SYNONYMS[cleaned] ?? SYNONYMS[cleaned.replace(/\s+/g, ' ')]

  if (canonicalKey) {
    return { key: canonicalKey, label: ensureLabel(canonicalKey) }
  }

  const slug = slugify(cleaned)
  const key = slug || 'base'
  return { key, label: ensureLabel(key) }
}

type ExtendedDataEntry = {
  name?: string
  display_name?: string
  value?: unknown
}

const isExtendedDataEntry = (entry: any): entry is ExtendedDataEntry => entry && typeof entry === 'object'

const extractCandidateFromExtendedData = (product: Partial<Products>): string | undefined => {
  const extended = Array.isArray(product.extended_data) ? product.extended_data : []
  for (const entry of extended) {
    if (!isExtendedDataEntry(entry)) continue
    const fields = [entry.name, entry.display_name, entry.value]
      .filter(Boolean)
      .map((value) => value?.toString() ?? '')
    for (const field of fields) {
      const lower = field.toLowerCase()
      if (lower.includes('foil') || lower.includes('alternate') || lower.includes('borderless')) {
        return field
      }
      if (lower.includes('finish') || lower.includes('treatment') || lower.includes('print')) {
        return entry.value?.toString()
      }
    }
  }
  return undefined
}

const extractFromName = (name?: string): string | undefined => {
  if (!name) return undefined
  const matches = name.match(/\(([^()]+)\)/g)
  if (!matches) return undefined

  for (let i = matches.length - 1; i >= 0; i -= 1) {
    const inner = matches[i].slice(1, -1)
    const candidate = inner.split(',')[0]?.trim()
    if (candidate) {
      return candidate
    }
  }

  return undefined
}

const collectVariantSegments = (value?: string, options: { includeFull?: boolean } = {}): string[] => {
  if (!value) {
    return []
  }

  const segments = new Set<string>()
  const trimmed = value.trim()
  if (!trimmed) {
    return []
  }

  if (options.includeFull) {
    segments.add(trimmed)
  }

  const parenRegex = /\(([^()]+)\)/g
  let match: RegExpExecArray | null
  while ((match = parenRegex.exec(trimmed)) !== null) {
    const inner = match[1]
    inner
      .split(/[,/]/)
      .map((segment) => segment.trim())
      .filter(Boolean)
      .forEach((segment) => segments.add(segment))
  }

  const hyphenMatch = trimmed.match(/ - ([^-()]+)$/)
  if (hyphenMatch && hyphenMatch[1]) {
    segments.add(hyphenMatch[1].trim())
  }

  return Array.from(segments)
}

const keywordMatchesSegment = (segment: string, keyword: string): boolean => {
  const segmentTokens = segment
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
  const keywordTokens = keyword
    .toLowerCase()
    .trim()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)

  if (segmentTokens.length === 0 || keywordTokens.length === 0) {
    return false
  }

  return keywordTokens.every((token) => segmentTokens.includes(token))
}

type VariantSourceOrigin = 'name' | 'short_name' | 'extended'

type VariantSource = {
  value: string
  origin: VariantSourceOrigin
}

const resolveVariantFromSources = (sources: VariantSource[]): PrintInfo | null => {
  for (const { value, origin } of sources) {
    const segments = collectVariantSegments(value, {
      includeFull: origin === 'extended'
    })

    for (const segment of segments) {
      for (const { key, keywords } of VARIANT_KEYWORDS) {
        if (keywords.some((keyword) => keywordMatchesSegment(segment, keyword))) {
          return { key, label: ensureLabel(key) }
        }
      }
    }
  }

  return null
}

type VariantDetectionInput = {
  name?: string
  short_name?: string
  extended_data?: ExtendedDataEntry[]
}

/**
 * Extracts variant sources from product data for print variant detection.
 * 
 * This function collects possible sources of print variant information from:
 * - Product name (e.g., "Card Name (Showcase)")
 * - Short name (if different from name)
 * - Extended data "Rarity" field ONLY (to avoid false positives from gameplay text)
 * 
 * @param input - Product data containing name, short_name, and extended_data
 * @returns Array of variant sources with their origin (name, short_name, or extended)
 * 
 * @example
 * // Returns sources from name and rarity only, ignoring attack text
 * extractVariantSources({
 *   name: "Beautifly",
 *   extended_data: [
 *     { name: "Rarity", value: "Holo Rare" },
 *     { name: "Attack 2", value: "Parallel Gain" } // This is ignored
 *   ]
 * })
 */
const extractVariantSources = (input?: VariantDetectionInput | null): VariantSource[] => {
  if (!input) {
    return []
  }

  const sources: VariantSource[] = []
  const { name, short_name, extended_data } = input

  if (typeof name === 'string') {
    sources.push({ value: name, origin: 'name' })
  }

  if (typeof short_name === 'string' && short_name !== name) {
    sources.push({ value: short_name, origin: 'short_name' })
  }

  // Only check the 'Rarity' field in extended data to avoid false positives
  // from gameplay text (e.g., "Parallel Gain" attack, "Showcase" in flavor text)
  const extended = Array.isArray(extended_data) ? extended_data : []
  for (const entry of extended) {
    if (!isExtendedDataEntry(entry)) continue
    
    // Whitelist: Only process the "Rarity" field
    if (entry.name && entry.name.toLowerCase() === 'rarity') {
      const values = [entry.name, entry.display_name, entry.value]
        .filter(Boolean)
        .map((value) => value?.toString() ?? '')

      for (const value of values) {
        if (value.trim().length > 0) {
          sources.push({ value, origin: 'extended' })
        }
      }
    }
  }

  return sources
}

export const detectPrintVariant = (input?: VariantDetectionInput | null): PrintInfo => {
  const sources = extractVariantSources(input)
  const variant = resolveVariantFromSources(sources)

  if (variant) {
    return variant
  }

  return { key: 'base', label: ensureLabel('base') }
}

export const derivePrintFromProduct = (product?: Partial<Products> | null): PrintInfo => {
  if (!product) {
    return normalizePrint()
  }

  const variant = detectPrintVariant(product as VariantDetectionInput)
  if (variant.key && !isFinishKey(variant.key)) {
    return variant
  }

  if (product.finish) {
    const finishCandidate = normalizePrint(product.finish)
    if (isFoilVariantKey(finishCandidate.key)) {
      return finishCandidate
    }
  }

  if (product.print) {
    const normalized = normalizePrint(product.print)
    if (!isFinishKey(normalized.key)) {
      return normalized
    }
  }

  const extendedCandidate = extractCandidateFromExtendedData(product)
  if (extendedCandidate) {
    const normalized = normalizePrint(extendedCandidate)
    if (!isFinishKey(normalized.key)) {
      return normalized
    }
  }

  const nameCandidate = extractFromName(product.name)
  if (nameCandidate) {
    const normalized = normalizePrint(nameCandidate)
    if (!isFinishKey(normalized.key)) {
      return normalized
    }
  }

  return normalizePrint()
}

export const getPrintLabel = (key: string): string => ensureLabel(key)

export const knownPrintLabels = (): Record<string, string> => ({ ...PRINT_LABEL_LOOKUP })
