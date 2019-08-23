import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-text-description',
  templateUrl: './text-description.component.html',
  styleUrls: ['./text-description.component.css']
})
export class TextDescriptionComponent implements OnInit {

  constructor(private cookieService : CookieService) { }

  ngOnInit() {
  }

  nextMainStep(){
		this.cookieService.set('mainStep','TextDescriptionFinished');
		location.href="http://localhost:4200/workflow?from=textdescription";
	}

}
