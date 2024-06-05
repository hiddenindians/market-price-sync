import { Component, OnInit, ViewChild } from '@angular/core'
import { DataService } from '../../services/data/data.service'
import { DataTableComponent } from '../../shared/data-table/data-table.component'
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { MatTableModule } from '@angular/material/table'
import { MatSortModule } from '@angular/material/sort'
import { MatSelectChange, MatSelectModule } from '@angular/material/select'
import { FormsModule } from '@angular/forms'
import { SelectionChange } from '@angular/cdk/collections'
import { MatSlideToggleChange } from '@angular/material/slide-toggle'

@Component({
  selector: 'app-manage-tcg-products',
  standalone: true,
  imports: [FormsModule, DataTableComponent,MatSelectModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './manage-tcg-products.component.html',
  styleUrl: './manage-tcg-products.component.scss'
})
export class ManageTCGProductsComponent implements OnInit {
  games: any[] = []
  sets: any[] = []
  products: any[] = []
  displayedColumns: string[]  = ['store_status.selling.enabled','store_status.selling.quantity','image_url','name', 'collector_number', 'market_price', 'store_status.buying.enabled', 'store_status.buying.quantity']
  pageSize: number = 10;
  pageIndex: number = 0;
  totalLength: number = 0;
  defaultSort =  {active: "collector_number", direction: "ASC"}
  selectedGame!: string;
  selectedSet!: string;
  constructor(private data: DataService) {}
  ngOnInit() {
    this.fetchGames(100000, this.pageIndex * this.pageSize, {active: "external_id.tcgcsv_id", direction: "ASC"});
  }

  fetchGames(limit: number, skip: number, sort: {active: string, direction: string} | null  ) {
    this.data.getGames(limit, skip, sort).subscribe((data: any) => {
      this.games = data.data
      this.selectedGame = this.games[0]._id;
      this.fetchProducts(this.pageSize, skip, this.defaultSort, "", this.games[0]._id,)
      this.fetchSets(this.selectedGame)
    })
  }

  fetchSets(gameId: string){
    this.data.getSetsForGame(gameId).subscribe((data: any)=> {
      this.sets = data.data;
      console.log(this.sets)

    })
  }

  fetchProducts(limit: number, skip: number, sort: {active: string, direction: string} | null, setId?: string, gameId?: string){
    if(setId && setId != ""){
      console.log('getting for set')
      this.data.getProductsForSet(setId, limit, skip, sort ).subscribe((data: any) => {
        this.products = data.data;
        this.totalLength = data.total

      })
    } else if (gameId && gameId != "") {
      console.log('getting for game')
      this.data.getProductsForGame(gameId, limit, skip, sort).subscribe((data: any) => {
        this.products = data.data;
        this.totalLength = data.total
        console.log(this.products)
      })
    } 
  }
  

  onPageChange(event: PageEvent) {
    console.log(event)
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    const limit = event.pageSize;
    const skip = event.pageIndex * event.pageSize;
    if(this.selectedSet){
      console.log("think there's a set")
      console.log(this.selectedSet)
      this.fetchProducts(limit, skip, this.defaultSort,this.selectedSet, "");

    } else {
    this.fetchProducts(limit, skip, this.defaultSort, "", this.selectedGame);
    }
  }

  onSortChange(event: {active: string, direction: string } | null ){
    console.log(event)
    this.fetchProducts(this.pageSize, this.pageIndex * this.pageSize, event)
  }

  onGameSelectionChange(event: MatSelectChange){
    this.selectedGame = event.value
    this.fetchProducts(this.pageSize, this.pageIndex, this.defaultSort, "", event.value)
    this.fetchSets(event.value)

  }

  onSetSelectionChange(event: MatSelectChange){
    this.selectedSet = event.value
    this.fetchProducts(this.pageSize, this.pageIndex, this.defaultSort, event.value, "")
  }

  onSellToggle(event: {id: string, storeId: string, value: boolean}){
    this.data.updateSellingStatus(event.id, event.storeId, event.value);
  }

  onBuyToggle(event: MatSlideToggleChange){
    console.log(event)
  }

}
