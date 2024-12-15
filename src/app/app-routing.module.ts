import { ErrorHandler, NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CommonUIElementsModule } from 'common-ui-elements'
import { HomeComponent } from './home/home.component'

import { ShowDialogOnErrorErrorHandler } from './common/UIToolsService'
import { DemoDataControlAndDataAreaComponent } from './demo-data-control-and-data-area/demo-data-control-and-data-area.component'
import { TaskListComponent } from './route/task/task-list/task-list.component'
import { terms } from './terms'
import { AdminGuard } from './users/AdminGuard'
import { UsersComponent } from './users/users.component'

const defaultRoute = 'tasks'
const routes: Routes = [
  // { path: 'home', component: HomeComponent },
  { path: 'tasks', component: TaskListComponent, data: {name: 'משימות מערב ממוקד חבר '} },
  // {
  //   path: terms.userAccounts,
  //   component: UsersComponent,
  //   canActivate: [AdminGuard],
  // },
  // { path: 'demo', component: DemoDataControlAndDataAreaComponent },
  { path: '**', redirectTo: '/' + defaultRoute, pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonUIElementsModule],
  providers: [
    AdminGuard,
    { provide: ErrorHandler, useClass: ShowDialogOnErrorErrorHandler }
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
