import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-diagram-description',
  templateUrl: './diagram-description.component.html',
  styleUrls: ['./diagram-description.component.css']
})
export class DiagramDescriptionComponent implements OnInit {

  constructor(private cookieService : CookieService) { }

  ngOnInit() {
  }

  nextMainStep(){
		this.cookieService.set('mainStep','DiagramDescriptionFinished');
		location.href="http://localhost:4200/workflow?from=diagramdescription";
	}

}
