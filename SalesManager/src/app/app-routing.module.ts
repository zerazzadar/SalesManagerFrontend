import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountComponent } from "./Components/Account/account.component";
import { OrderComponent } from "./Components/Order/order.component";

const routes: Routes = [
  {
    path: "Account",
    component: AccountComponent,
    pathMatch: "full",
  },
  {
    path: "Order",
    component: OrderComponent,
    pathMatch: "full",
  },
  {
    path: "",
    component: AccountComponent,
    pathMatch: "full",
  },
  {
    path: "**",
    component: AccountComponent,
    pathMatch: "full",
  },
  // {
  //   path: 'editar/:id',component: AgregarEditarComentarioComponent
  // },
  // {
  //   path: 'ver/:id',component: VerComentariosComponent
  // },
  // {
  //   path: '',component: ListComentariosComponent,pathMatch:'full'
  // },
  // {
  //   path: '**',component: Error404Component
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
