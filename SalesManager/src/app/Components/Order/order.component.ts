import { Component, OnInit, inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import {
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from "rxjs";
import { Order } from "src/app/Models/Order";
import { OrderLineItem } from "src/app/Models/OrderLineItem";
import { Product } from "src/app/Models/Product";
import { AccountService } from "src/app/Services/accountService.service";
import { OrderService } from "src/app/Services/orderService.service";
import { ProductService } from "src/app/Services/productService.service";
import { Utils } from "src/app/Utils/Utils";
import { environment } from "src/environments/environment.development";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";

@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.css"],
})
export class OrderComponent implements OnInit {
  protected orderError: boolean = false;

  protected currentAcountName: string = "";
  protected order: Order = new Order();

  protected utilClass: Utils;
  protected taxes: number;
  protected orderLineItemList: OrderLineItem[] = [];
  protected products: Product[] = [];
  public loading: boolean = false;
  public productName: string = "";

  protected subTotal: number = 0;
  protected taxesSubTotal: number = 0;
  protected total: number = 0;

  private obs$!: Subscription;
  public products$: Subject<Product[]> = new Subject<Product[]>();

  private searchText$ = new Subject<string>();

  constructor(
    private accountService: AccountService,
    private orderService: OrderService,
    private productService: ProductService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.utilClass = new Utils();
    this.taxes = environment.taxesValue;
  }

  ngOnInit() {
    this.loadAllProducts();
    this.ProductFilterLoad();
    this.validateHaveSelectedAccountId();
    this.currentAcountName = this.accountService.getCurrentAccountName();
  }

  ngOnDestroy() {
    this.obs$.unsubscribe();
  }

  private validateHaveSelectedAccountId() {
    var currentAccount = this.accountService.getCurrentAccountId();
    if (!currentAccount) {
      this.router.navigate(["/"]);
    }
  }

  private ProductFilterLoad(): void {
    this.obs$ = this.searchText$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((text) => {
          return this.productService.getListProductsWithName(text);
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
        this.products$.next(valor);
      },
      error: (err) => console.log(err),
    });
  }

  protected getProductbyId(productId: number): Product {
    return this.products.find((product) => product.id === productId)!;
  }

  protected existsOrderLineProduct(productId: number): boolean {
    var lineItem = this.orderLineItemList.find(
      (lineitem) => lineitem.productId === productId
    );

    return lineItem != null;
  }

  protected updateProductFilteredList(packageName: string) {
    this.searchText$.next(packageName);
  }

  protected resetProductFilterList(): void {
    this.productName = "";
    this.loadAllProducts();
  }

  protected setOrderLineItemLQuantity(
    orderItemId: string,
    value: string
  ): void {
    const index = this.orderLineItemList.findIndex(
      (item) => item.id! === Number(orderItemId)
    );

    let product = this.getProductbyId(this.orderLineItemList[index].productId);

    this.orderLineItemList[index].quantity = Number(value);
    this.orderLineItemList[index].lineItemPrice = product.price * Number(value);

    this.updateTotalValues();
  }

  protected addOrderLineItem(event: Event) {
    let productId = Number((event.target as HTMLInputElement).value);
    // debugger;
    if (!this.existsOrderLineProduct(productId)) {
      let lineItem = new OrderLineItem();
      lineItem.id = this.getNextOrderLineItemId();
      lineItem.productId = productId;
      lineItem.orderId = 0;
      lineItem.quantity = 1;
      lineItem.lineItemPrice = this.getProductbyId(productId).price;

      this.orderLineItemList.push(lineItem);
      this.updateTotalValues();
    }
  }

  protected deleteOrderLineItem(id: string): void {
    const itemIndex = this.orderLineItemList.findIndex(
      (item) => item.id === Number(id)
    );
    this.orderLineItemList.splice(itemIndex, 1);
    this.updateTotalValues();
  }

  private updateTotalValues(): void {
    this.updateSubTotal();
    this.updateTaxesTotal();
    this.updateTotal();

    this.order.OrderLineItems = this.orderLineItemList;
    this.order.accountId = this.accountService.getCurrentAccountId();
    this.order.subtotal = this.subTotal;
    this.order.taxes = this.taxesSubTotal;
    this.order.total = this.total;
  }

  private updateSubTotal() {
    this.subTotal = this.orderLineItemList.reduce((accumulator, lineItem) => {
      accumulator += lineItem.lineItemPrice;
      return accumulator;
    }, 0);
  }

  private updateTaxesTotal() {
    this.taxesSubTotal = (this.subTotal * this.taxes) / 100;
  }

  private updateTotal() {
    this.total = this.subTotal + this.taxesSubTotal;
  }

  private getNextOrderLineItemId(): number {
    const maxId = this.orderLineItemList.reduce(
      (max, item) => Math.max(max, item.id ?? 0),
      0
    );
    return maxId + 1;
  }

  protected SaveOrder(): void {
    this.orderService.saveOrder(this.order).subscribe({
      next: () => {
        this.router.navigate(["/"]);
        this.orderError = false;
      },
      error: () => (this.orderError = true),
    });
  }

  protected keyPressNumbers(event: KeyboardEvent) {
    const key = event.key;
    if (!this.utilClass.IsNumericKey(key)) {
      event.preventDefault();
    }
  }

  protected getInputElementFromEvent(event: Event): HTMLInputElement {
    return event.target as HTMLInputElement;
  }

  protected getInputAttrOrderId(input: HTMLInputElement): string {
    return input.getAttribute("data-orderItem")!;
  }

  protected openDialogConfirmOrder(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "260px",
      data: "Confirm submit this Order?",
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.SaveOrder();
      }
    });
  }
}
