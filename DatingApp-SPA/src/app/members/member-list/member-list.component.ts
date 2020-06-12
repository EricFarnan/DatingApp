import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  // Set a users property for this component to an array of the User interface
  users: User[];
  user: User = JSON.parse(localStorage.getItem('user'));
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];
  userParams: any = {};
  userFilterEdit: any = {};
  pagination: Pagination;

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    // Subscribe to the route data passed in to load the users
    // Works due to ActivatedRoute
    this.route.data.subscribe(data => {
      this.users = data.users.result;
      this.pagination = data.users.pagination;
      this.userParams.orderBy = 'lastActive';
    });

    this.resetFilters();
  }

  pageChanged(event: any) {
      this.pagination.currentPage = event.page;
      this.loadUsers();
  }

  resetFilters() {
    this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;

    this.userFilterEdit.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userFilterEdit.minAge = 18;
    this.userFilterEdit.maxAge = 99;

    this.pagination.currentPage = 1;

    this.loadUsers();
  }

  // When the filter is pressed update the userParams using the user's filtered data
  setUserParamOnFilter() {
    this.userParams.gender = this.userFilterEdit.gender;
    this.userParams.minAge = this.userFilterEdit.minAge;
    this.userParams.maxAge = this.userFilterEdit.maxAge;

    this.pagination.currentPage = 1;
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
    .subscribe((res: PaginatedResult<User[]>) => {
      this.users = res.result;
      this.pagination = res.pagination;
    }, error => {
      this.alertify.error(error);
    });
  }
}
