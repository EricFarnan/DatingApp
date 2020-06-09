import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  // Set a users property for this component to an array of the User interface
  users: User[];

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    // Subscribe to the route data passed in to load the users
    // Works due to ActivatedRoute
    this.route.data.subscribe(data => {
      this.users = data.users;
    });
  }
}
