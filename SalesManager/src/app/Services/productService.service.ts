import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.development";
import { Product } from "../Models/Product";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  public myAppUrl: string = environment.urlService;
  public myApiUrl = "Products/";
  public productsWithName = "GetProductsWithName?partialName=";

  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  constructor(private http: HttpClient) {}

  getListProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.myAppUrl + this.myApiUrl);
  }

  getListProductsWthName(name: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      this.myAppUrl + this.myApiUrl + this.productsWithName + name
    );
  }
}