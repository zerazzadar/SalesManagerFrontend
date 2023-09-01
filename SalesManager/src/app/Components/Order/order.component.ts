import { Component, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";
import {
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from "rxjs";
import { OrderLineItem } from "src/app/Models/OrderLineItem";
import { Product } from "src/app/Models/Product";
import { AccountService } from "src/app/Services/accountService.service";
import { OrderService } from "src/app/Services/orderService.service";
import { ProductService } from "src/app/Services/productService.service";

@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.css"],
})
export class OrderComponent implements OnInit {
  protected products: OrderLineItem[] = [];

  public loading: boolean = false;
  private obs$!: Subscription;
  public productName: string = "";

  public products$: Subject<Product[]> = new Subject<Product[]>();
  private searchText$ = new Subject<string>();

  constructor(
    private accountService: AccountService,
    private orderService: OrderService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAllProducts();
    this.LinkRefreshProductsForFilter();
  }

  ngOnDestroy() {
    this.obs$.unsubscribe();
  }

  private LinkRefreshProductsForFilter(): void {
    this.obs$ = this.searchText$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((text) => {
          return this.productService.getListProductsWthName(text);
        })
      )
      .subscribe((response) => {
        this.products$.next(response);
      });
  }

  private loadAllProducts(): void {
    this.productService.getListProducts().subscribe({
      next: (valor: Product[]) => {
        this.products$.next(valor);
      },
      error: (err) => console.log(err),
    });
  }

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  public addProductToCart(event: Event): void {
    console.log((event.target as HTMLInputElement).value);
  }

  search(packageName: string) {
    this.searchText$.next(packageName);
  }

  public resetFilter(): void {
    this.productName = "";
    this.loadAllProducts();
  }
}
