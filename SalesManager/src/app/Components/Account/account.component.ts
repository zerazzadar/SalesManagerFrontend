import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable, map, startWith } from "rxjs";
import { Account } from "src/app/Models/Account";
import { AccountService } from "src/app/Services/accountService.service";
import { Router } from "@angular/router";
import { OrderService } from "src/app/Services/orderService.service";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.css"],
})
export class AccountComponent implements OnInit {
  protected accounts: Account[] = [];
  public loading: boolean = false;

  myControl = new FormControl<Account>(new Account());
  filteredAccounts: Observable<Account[]> | undefined;

  constructor(private accountService: AccountService, private router: Router) {
    this.accounts = [];
  }

  ngOnInit() {
    this.LoadAccounts();
  }

  LoadAccounts(): void {
    this.loading = true;
    this.accountService.getListAccounts().subscribe((data) => {
      this.loading = false;
      this.accounts = data;
      this.FillFilteredAccounts();
    });
  }

  private FillFilteredAccounts(): void {
    this.filteredAccounts = this.myControl.valueChanges.pipe(
      startWith(""),
      map((value) => {
        const name = typeof value === "string" ? value : value?.name;
        return name ? this._filter(name as string) : this.accounts.slice();
      })
    );
  }

  displayFn(user: Account): string {
    return user && user.name ? user.name : "";
  }

  private _filter(name: string): Account[] {
    const filterValue = name.toLowerCase();

    return this.accounts.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  public selectAccountToProcess() {
    let accountId = this.myControl.value?.id;

    if (accountId != null) {
      this.accountService.setCurrentAccountId(accountId);
    }

    this.router.navigate(["/Order"]);
  }
}
