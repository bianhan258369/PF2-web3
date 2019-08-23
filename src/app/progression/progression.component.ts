import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-progression',
  templateUrl: './progression.component.html',
  styleUrls: ['./progression.component.css']
})
export class ProgressionComponent implements OnInit {

  constructor(private cookieService : CookieService) { }

  ngOnInit() {
  }

  nextMainStep(){
		this.cookieService.set('mainStep','ProgressionFinished');
		location.href="http://localhost:4200/workflow";
	}

}
