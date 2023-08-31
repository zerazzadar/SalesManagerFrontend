import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  private accountId: number = 0;
  constructor(private http: HttpClient) {}

  public setAccountId(accountId: number): void {
    this.accountId = accountId;
  }
}
