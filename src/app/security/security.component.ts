import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {

  constructor(private cookieService : CookieService) { }

  ngOnInit() {
  }

  nextMainStep(){
		this.cookieService.set('mainStep','SecurityFinished');
		location.href="http://localhost:4200/workflow";
	}

}
