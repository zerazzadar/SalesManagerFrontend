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
  protected orderLineItemList: OrderLineItem[] = [];
  protected products: Product[] = [];
  public loading: boolean = false;
  public productName: string = "";

  private obs$!: Subscription;
  public products$: Subject<Product[]> = new Subject<Product[]>();
  public orderLineItemList$: Subject<OrderLineItem[]> = new Subject<
    OrderLineItem[]
  >();
  private searchText$ = new Subject<string>();

  constructor(
    private accountService: AccountService,
    private orderService: OrderService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAllProducts();
    this.ProductFilterLoad();
  }

  ngOnDestroy() {
    this.obs$.unsubscribe();
  }

  private ProductFilterLoad(): void {
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
        this.products = valor;
        this.fillOrderLineItemArray(8);
        this.products$.next(valor);
      },
      error: (err) => console.log(err),
    });
  }

  protected searchProductbyId(productId: number): Product {
    return this.products.find((product) => product.id === productId)!;
  }

  protected addProductToCar(event: Event): void {
    console.log((event.target as HTMLInputElement).value);
  }

  protected updateProductFilteredList(packageName: string) {
    this.searchText$.next(packageName);
  }

  protected resetProductFilterList(): void {
    this.productName = "";
    this.loadAllProducts();
  }

  protected setOrderLineItemLQuantity(event: Event): void {
    let input = event.target as HTMLInputElement;
    let orderItemId = input.getAttribute("data-orderItem")!;
    let value = input.value;

    const index = this.orderLineItemList.findIndex(
      (item) => item.id! === Number(orderItemId)
    );

    let product = this.searchProductbyId(
      this.orderLineItemList[index].productId
    );

    this.orderLineItemList[index].quantity = Number(value);
    this.orderLineItemList[index].lineItemPrice = product.price * Number(value);
  }

  keyPressNumbers(event: KeyboardEvent) {
    const key = event.key;
    if (!/[0-9]/.test(key)) {
      event.preventDefault();
    }
  }

  protected getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  fillOrderLineItemArray(lineItemCount: number): void {
    for (let i = 0; i < lineItemCount; i++) {
      const lineItem = new OrderLineItem();
      lineItem.id = Math.floor(Math.random() * 1000);
      lineItem.productId = i + 1;
      lineItem.orderId = Math.floor(Math.random() * 1000);
      lineItem.quantity = Math.floor(Math.random() * 10);
      lineItem.lineItemPrice = Math.floor(Math.random() * 100);
      this.orderLineItemList.push(lineItem);
    }
  }
}
