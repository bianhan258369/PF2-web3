import { Component, OnInit } from '@angular/core';
import { ServiceService} from '../service/service.service';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Location } from '@angular/common';
import { RouterLink, Router } from '@angular/router';


@Component({
  selector: 'app-loadproject',
  templateUrl: './loadproject.component.html',
  styleUrls: ['./loadproject.component.css']
})
export class LoadprojectComponent implements OnInit {
  branchlist : Array<string>;
  
  selectedBranch : string;

  constructor(private service : ServiceService,private cookieService:CookieService, private route : ActivatedRoute,private location : Location,private router : Router) { }

  ngOnInit() {
    this.branchlist = new Array<string>();
    this.getFileList('GitRepository');
  }

  getFileList(folderPath : string){
    this.service.getBranchList().subscribe(data =>{
      this.branchlist = data["branchlist"];
    });
  }

  loadProject(){
    this.service.gitChange(this.selectedBranch).subscribe(data => {
      this.cookieService.deleteAll();
      this.cookieService.set('open','true');
      this.cookieService.set('step','1');
      this.cookieService.set('projectPath','GitRepository');
      this.service.getAddedConstraints(this.cookieService.get('projectPath')).subscribe(data => {
        if(data["constraints"] !== ""){
          this.cookieService.set('constraints',data["constraints"]);
        }
      });
      this.router.navigate(['']).then(() => {
        window.location.reload();
      });
    });
  }

  goBack(){
    this.location.back();
  }
}
