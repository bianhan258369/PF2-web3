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
  branchList : Array<string>;
  versionlist : Array<string>;
  selectedBranch : string;
  selectedVersion : string;
  rootAddress : string;

  constructor(private service : ServiceService,private cookieService:CookieService, private route : ActivatedRoute,private location : Location,private router : Router) { }

  ngOnInit() {
    this.branchList = new Array<string>();
    this.versionlist = new Array<string>();
    this.getBranchList();
    this.getRootAddress();
  }

  getCurrentBranch(){
    this.service.getCurrentBranch().subscribe(bra => {
      var branch = bra["branch"];
      this.cookieService.set('branch',branch)
    })
  }

  getBranchList(){
    this.service.getBranchList().subscribe(data =>{
      if(typeof(data["branchlist"]) === 'string'){
        this.branchList.push(data["branchlist"]);
      }
      else{
        this.branchList = data["branchlist"];
      }
    });
  }

  gerVersionList(branch : string){
    this.selectedBranch = branch;
    this.service.getVersionList(this.selectedBranch).subscribe(data => {
      if(typeof(data["versionlist"]) === 'string'){
        var arr = new Array<string>();
        arr.push(data["versionlist"]);
        this.versionlist = arr;
      }
      else{
        this.versionlist = data["versionlist"];
      }
    })
  }

  getRootAddress(){
    this.service.getRootAddress().subscribe(data => {
      this.rootAddress = data["rootaddress"];
    })
  }

  loadProject(){
    this.service.gitRollBack(this.selectedBranch, this.selectedVersion).subscribe(gitrollback => {
      this.service.gitCheckout(this.selectedBranch).subscribe(gitchange => {
        this.cookieService.deleteAll();
        this.cookieService.set('open','true');
        this.cookieService.set('step','1');
        this.cookieService.set('projectPath',this.rootAddress);
        this.getCurrentBranch();
        this.service.getAddedConstraints().subscribe(data => {
          if(data["constraints"] !== "NotExist"){
            console.log(data["constraints"]);
            this.cookieService.set('constraints',data["constraints"]);
            this.cookieService.set('step','6');
          }
        });
        this.router.navigate(['']).then(() => {
          window.location.reload();
        });
      });
    })
  }

  goBack(){
    this.location.back();
  }
}
