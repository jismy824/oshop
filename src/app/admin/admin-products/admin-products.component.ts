import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataTableResource } from 'angular5-data-table';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/product.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit,OnDestroy {
 
  product:Product[];  
  subscription: Subscription;
  tableResource:DataTableResource<Product>;
  items:Product[]=[];
  itemCount:number;

  constructor(private productService : ProductService) 
  {

    this.subscription=this.productService.getAll().subscribe(product=>
      {
        this.product=product;
        this.initializeTable(product);
      });

  }

  private initializeTable(products:Product[])
  {
    this.tableResource=new DataTableResource(products);
    this.tableResource.query({offset: 0})
    .then(items=>this.items=items);
    this.tableResource.count()
    .then(count=>this.itemCount=count);

  }

  reloadItems(params)
  {
    if(!this.tableResource) return;

    this.tableResource.query(params)
    .then(items=>this.items=items);
  }

  filter(query :string)
  {
    let filterdProducts = (query)?
    this.product.filter(p=>p.title.toLowerCase().includes(query.toLowerCase()))
    : this.product;
    this.initializeTable(filterdProducts);
  }
  ngOnInit(): void {
  }
  ngOnDestroy()
  {
    this.subscription.unsubscribe();
  }

}
