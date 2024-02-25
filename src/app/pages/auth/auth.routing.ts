import { RouterModule, Routes } from "@angular/router";
import { UsersTableComponent } from "./containers/users-table/users-table.component";

const routes: Routes = [
    {
        path: '',
        component: UsersTableComponent
    }
]
export const AuthRoutes = RouterModule.forChild(routes);
