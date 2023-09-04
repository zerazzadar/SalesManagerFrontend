import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment.development";
import { Observable } from "rxjs";
import { Account } from "../Models/Account";

@Injectable({
  providedIn: "root",
})
export class AccountService {
  private currentAccountId: number = 0;
  public myAppUrl: string = environment.urlService; //esta es la ruta de mi backend
  public myApiUrl = "Accounts/"; //esta es la API direccion del controller a donde quiero apuntar
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  constructor(private http: HttpClient) {}

  getListAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.myAppUrl + this.myApiUrl);
  }

  public setCurrentAccountId(accountId: number): void {
    this.currentAccountId = accountId;
  }

  public getCurrentAccountId(): number {
    return this.currentAccountId;
  }
}
