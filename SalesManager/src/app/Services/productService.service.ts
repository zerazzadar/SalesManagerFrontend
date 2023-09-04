import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.development";
import { Product } from "../Models/Product";
import { Order } from "../Models/Order";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  public appUrl: string = environment.urlService;
  public apiProductUrl = "Products/";
  public apiOrderUrl = "Order/";
  public productsWithName = "GetProductsWithName?partialName=";

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  constructor(private http: HttpClient) {}

  public getListProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.appUrl + this.apiProductUrl);
  }

  public getListProductsWithName(name: string): Observable<Product[]> {
    if (typeof name != "undefined" && name) {
      return this.http.get<Product[]>(
        this.appUrl + this.apiProductUrl + this.productsWithName + name
      );
    } else {
      return this.getListProducts();
    }
  }
}
