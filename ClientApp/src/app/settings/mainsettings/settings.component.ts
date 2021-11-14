import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(
    private _user: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit(): void {
  }

  public menus = [
    {
      name: "Profile",
      color: "#FFFFFF",
      icon: "person",
      onClick: () => {
        this.router.navigate([
          { 
            outlets: { 
              settings: [''] 
            }
          }], {
            relativeTo: this.activatedRoute 
        });
      }
    },
    {
      name: "Privacy",
      color: "#FFFFFF",
      icon: "security",
      onClick: () => {
        this.router.navigate([
          { 
            outlets: { 
              settings: ['privacy'] 
            }
          }], {
            relativeTo: this.activatedRoute 
        });
      }
    },
    {
      name: "Log out",
      color: "#ff0000",
      icon: "logout",
      onClick: () => { 
        this._user.logOut();
      }
    },
  ];

  public currentRoute: string = this.menus[0].name;

  changeRoute(index: number) {
    this.menus[index].onClick();
    this.currentRoute = this.menus[index].name;
  }

}
