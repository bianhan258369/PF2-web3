import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { Scenario } from '../entity/Scenario';
import { Interaction } from '../entity/Interaction';
import { ActivatedRoute } from '@angular/router';
import { RouterLink, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpXsrfCookieExtractor } from '@angular/common/http/src/xsrf';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-z3check',
  templateUrl: './z3check.component.html',
  styleUrls: ['./z3check.component.css']
})
export class Z3checkComponent implements OnInit {

  constructor(private service : ServiceService, private route: ActivatedRoute, private router : Router, private location : Location) { }

  ngOnInit() {
  }

}
