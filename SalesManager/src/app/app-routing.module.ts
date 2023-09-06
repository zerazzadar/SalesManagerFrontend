import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountComponent } from "./Components/Account/account.component";
import { OrderComponent } from "./Components/Order/order.component";
import { SuccessfulComponent } from "./Components/successful/successful.component";

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
    path: "Summary",
    component: SuccessfulComponent,
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
