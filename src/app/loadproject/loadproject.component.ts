import { Component, OnInit } from '@angular/core';
import { ServiceService} from '../service/service.service';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { strictEqual } from 'assert';

@Component({
  selector: 'app-loadproject',
  templateUrl: './loadproject.component.html',
  styleUrls: ['./loadproject.component.css']
})
export class LoadprojectComponent implements OnInit {

  constructor(private service : ServiceService,private cookieService:CookieService, private route : ActivatedRoute) { }

  ngOnInit() {
  }

  getFileList(folderPath : string){
    console.log(this.service.getFileList(folderPath));
    return this.service.getFileList(folderPath);
  }
}
