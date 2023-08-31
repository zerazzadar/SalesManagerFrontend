import { Component, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";
import {
  Observable,
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from "rxjs";
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
  protected products: Product[] = [];
  public loading: boolean = false;
  private obs$!: Subscription;
  public productName: string = "";

  private searchText$ = new Subject<string>();

  constructor(
    private accountService: AccountService,
    private orderService: OrderService,
    private productService: ProductService,
    private router: Router
  ) {
    this.products = [];
  }

  ngOnInit() {
    this.obs$ = this.searchText$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((text) => {
          return this.productService.getListProductsWthName(text);
        })
      )
      .subscribe((response) => {
        console.log(response);
      });
  }

  ngOnDestroy() {
    this.obs$.unsubscribe();
  }

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  search(packageName: string) {
    this.searchText$.next(packageName);
  }

  LoadAccounts(): void {
    this.loading = true;
    this.productService.getListProducts().subscribe((data) => {
      this.loading = false;
      this.products = data;
    });
  }
}
