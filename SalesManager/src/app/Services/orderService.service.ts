import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Order } from "../Models/Order";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.development";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  public appUrl: string = environment.urlService;
  public apiOrderUrl = "Order/";

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  constructor(private http: HttpClient) {}

  public saveOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(
      this.appUrl + this.apiOrderUrl,
      order,
      this.httpOptions
    );
  }
}
