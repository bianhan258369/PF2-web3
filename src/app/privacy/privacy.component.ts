import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {

  constructor(private cookieService : CookieService) { }

  ngOnInit() {
  }

  nextMainStep(){
		this.cookieService.set('mainStep','PrivacyFinished');
		location.href="http://localhost:4200/workflow";
	}

}
