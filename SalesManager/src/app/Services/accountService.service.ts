import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment.development";
import { Observable } from "rxjs";
import { Account } from "../Models/Account";

@Injectable({
  providedIn: "root",
})
export class AccountService {
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

  // deleteComentario(id: number): Observable<Comentario> {
  //   return this.http.delete<Comentario>(this.myAppUrl + this.myApiUrl + id);
  // }

  // guardarComentario(comentario: Comentario): Observable<Comentario> {
  //   return this.http.post<Comentario>(this.myAppUrl + this.myApiUrl,comentario,this.httpOptions);
  // }

  // cargarComentario(id: number): Observable<Comentario> {
  //   return this.http.get<Comentario>(this.myAppUrl + this.myApiUrl + id);
  // }

  // actualizarComentario(id: number,comentario: Comentario): Observable<Comentario> {
  //   return this.http.put<Comentario>(this.myAppUrl + this.myApiUrl + id,comentario,this.httpOptions
  //   );
  // }
}
