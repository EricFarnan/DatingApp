import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';

// Declares roots and their components
export const appRoutes: Routes = [
    // Localhost route
    { path: '', component: HomeComponent },

    // Parent route where a guard/resolver can be applied to multiple routes (children)
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            // Resolvers will retrieve the data needed inside this route when the route is activated
            { path: 'members', component: MemberListComponent,
                resolve: {users: MemberListResolver}},

            { path: 'members/:id', component: MemberDetailComponent,
                resolve: {user: MemberDetailResolver}},

            // Can deactivate will perform something when the route is attempting to change from this
            { path: 'member/edit', component: MemberEditComponent,
                resolve: {user: MemberEditResolver},
                canDeactivate: [PreventUnsavedChanges]},

            { path: 'messages', component: MessagesComponent },

            { path: 'lists', component: ListsComponent },
        ]
    },

    // Wildcard if route request does not exist
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
