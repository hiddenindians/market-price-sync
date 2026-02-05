import { CommonModule } from '@angular/common'
import { Component, Inject, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { DataService } from '../../services/data/data.service'

@Component({
  selector: 'app-unmatched-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './unmatched-product-dialog.component.html',
  styleUrl: './unmatched-product-dialog.component.scss'
})
export class UnmatchedProductDialogComponent implements OnInit {
  searchTerm = ''
  results: any[] = []
  isLoading = false
  errorMessage = ''
  gameLookup: Record<string, string> = {}
  setLookup: Record<string, string> = {}

  constructor(
    private data: DataService,
    private dialogRef: MatDialogRef<UnmatchedProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public dialogData: { initialTerm?: string; gameLookup?: Record<string, string>; setLookup?: Record<string, string> }
  ) {}

  ngOnInit() {
    this.searchTerm = this.dialogData?.initialTerm ?? ''
    this.gameLookup = this.dialogData?.gameLookup ?? {}
    this.setLookup = this.dialogData?.setLookup ?? {}
    if (this.searchTerm) {
      this.search()
    }
  }

  async search() {
    const term = this.searchTerm.trim()
    if (!term) {
      this.results = []
      return
    }

    this.isLoading = true
    this.errorMessage = ''
    try {
      const response = await this.data.search(
        term,
        { active: 'sort_number', direction: 'ASC' },
        {},
        { limit: 25, skip: 0 }
      )
      this.results = response?.data ?? []
      await this.enrichResults(this.results)
      if (!this.results.length) {
        this.errorMessage = 'No products found.'
      }
    } catch (error) {
      console.error('Search failed', error)
      this.errorMessage = 'Search failed. Try a different term.'
      this.results = []
    } finally {
      this.isLoading = false
    }
  }

  selectProduct(product: any) {
    this.dialogRef.close(product)
  }

  private async enrichResults(results: any[]) {
    await Promise.all(
      results.map(async (product) => {
        const gameId = product?.game_id
        const setId = product?.set_id
        let gameName = gameId ? this.gameLookup[gameId] : ''
        let setName = setId ? this.setLookup[setId] : ''

        if (!gameName && gameId) {
          gameName = await this.data.getGameNameFromId(gameId)
          if (gameName) {
            this.gameLookup[gameId] = gameName
          }
        }

        if (!setName && setId) {
          setName = await this.data.getSetNameFromId(setId)
          if (setName) {
            this.setLookup[setId] = setName
          }
        }

        product._resolvedGameName = gameName || gameId || 'n/a'
        product._resolvedSetName = setName || setId || 'n/a'
      })
    )
  }

  cancel() {
    this.dialogRef.close()
  }
}
