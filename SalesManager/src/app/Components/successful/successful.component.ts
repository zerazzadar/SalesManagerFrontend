import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AccountService } from "src/app/Services/accountService.service";
import { OrderService } from "src/app/Services/orderService.service";
import { Location } from "@angular/common";

@Component({
  selector: "app-successful",
  templateUrl: "./successful.component.html",
  styleUrls: ["./successful.component.css"],
})
export class SuccessfulComponent implements OnInit {
  constructor(
    private accountService: AccountService,
    private orderService: OrderService,
    private router: Router,
    private location: Location
  ) {
    console.log(accountService.getCurrentAccountId());
  }

  ngOnInit(): void {
    this.validateOrderDone();
  }

  private validateOrderDone(): void {
    if (!this.orderService.getOrderStatusDone()) {
      this.location.back();
    }
  }

  protected navigateToAccount() {
    this.accountService.setCurrentAccountId(0);
    this.accountService.setCurrentAccountName("");
    this.orderService.setOrderStatusDone(false);
    this.router.navigate(["/Account"]);
  }

  protected navigateToOrder() {
    this.orderService.setOrderStatusDone(false);
    this.router.navigate(["/Order"]);
  }
}
