import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class AccountServiceService {
  constructor(private http: HttpClient) {}

  public myAppUrl: string = "https://localhost:7000/"; //esta es la ruta de mi backend
  public myApiUrl = "api/Comentario/"; //esta es la API direccion del controller a donde quiero apuntar
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };
}
