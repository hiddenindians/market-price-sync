import assert from 'assert'
import { describe, it } from 'mocha'
import {
  deriveFinishKey,
  derivePrintFromProduct,
  detectPrintVariant,
  normalizePrint
} from '../../src/utils/print-normalizer'

describe('print-normalizer utility', () => {
  it('normalizes known synonyms to canonical keys', () => {
    const foil = normalizePrint('Foil')
    assert.strictEqual(foil.key, 'foil')
    assert.strictEqual(foil.label, 'Foil')

    const alt = normalizePrint('Alternate Art')
    assert.strictEqual(alt.key, 'alternate_art')
    assert.strictEqual(alt.label, 'Alternate Art')
  })

  it('falls back to base when value is missing', () => {
    const result = normalizePrint(undefined)
    assert.strictEqual(result.key, 'base')
  })

  it('derives print from product name when available', () => {
    const product = {
      name: 'Sample Card - 001 (Full Art, Rare)'
    }

    const derived = derivePrintFromProduct(product)
    assert.strictEqual(derived.key, 'full_art')
  })

  it('detects print variants from parentheses segments', () => {
    const variant = detectPrintVariant({
      name: 'Example Card (Alternate Art)'
    })

    assert.strictEqual(variant.key, 'alternate_art')
  })

  it('detects print variants from hyphenated suffixes', () => {
    const variant = detectPrintVariant({
      name: 'Example Card - Borderless'
    })

    assert.strictEqual(variant.key, 'borderless')
  })

  it('ignores keywords outside structured markers in names', () => {
    const variant = detectPrintVariant({
      name: 'Mangara the Diplomat'
    })

    assert.strictEqual(variant.key, 'base')
  })

  it('detects variants from extended metadata values', () => {
    const variant = detectPrintVariant({
      extended_data: [{ value: 'Reverse Holofoil' }]
    })

    assert.strictEqual(variant.key, 'reverse_holofoil')
  })

  it('detects SP variants', () => {
    const variant = detectPrintVariant({
      name: 'One Piece Character (SP)'
    })

    assert.strictEqual(variant.key, 'sp')
  })

  it('detects Manga variants', () => {
    const variant = detectPrintVariant({
      name: 'One Piece Character (Manga)'
    })

    assert.strictEqual(variant.key, 'manga')
  })

  it('detects Wanted Poster variants', () => {
    const variant = detectPrintVariant({
      name: 'One Piece Character (Wanted Poster)'
    })

    assert.strictEqual(variant.key, 'wanted_poster')
  })

  it('maps foil variants to the foil finish bucket', () => {
    const finish = deriveFinishKey('textured_foil')
    assert.strictEqual(finish, 'foil')
  })

  it('derives foil variants from finish metadata when present', () => {
    const product = {
      finish: 'textured_foil'
    }

    const derived = derivePrintFromProduct(product)
    assert.strictEqual(derived.key, 'textured_foil')
  })

  it('prefers explicit print keys over finish mapping', () => {
    const product = {
      finish: 'foil',
      print: 'reverse_holofoil'
    }

    const derived = derivePrintFromProduct(product)
    assert.strictEqual(derived.key, 'reverse_holofoil')
  })
})
