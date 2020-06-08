import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_guards/auth.guard';

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
            { path: 'members', component: MemberListComponent },
            { path: 'messages', component: MessagesComponent },
            { path: 'lists', component: ListsComponent },
        ]
    },

    // Wildcard if route request does not exist
    { path: '**', redirectTo: '', pathMatch: 'full' },
];
