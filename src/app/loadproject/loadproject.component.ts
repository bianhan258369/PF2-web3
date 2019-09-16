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
  folderlist : Array<string>;
  versionlist : Array<string>;
  selectedFolder : string;
  selectedVersion : string;
  branch : string;
  rootAddress : string;

  constructor(private service : ServiceService,private cookieService:CookieService, private route : ActivatedRoute,private location : Location,private router : Router) { }

  ngOnInit() {
    this.folderlist = new Array<string>();
    this.versionlist = new Array<string>();
    this.branch = 'test';
    this.getFolderList();
    this.getRootAddress();
  }

  getFolderList(){
    this.service.getFolderList(this.branch).subscribe(data =>{
      if(typeof(data["folderlist"]) === 'string'){
        this.folderlist.push(data["folderlist"]);
      }
      else{
        this.folderlist = data["folderlist"];
      }
    });
  }

  gerVersionList(folder : string){
    this.selectedFolder = folder;
    this.service.getVersionList(this.branch,folder).subscribe(data => {
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
    this.service.gitRollBack(this.branch, this.selectedFolder, this.selectedVersion).subscribe(gitrollback => {
      this.service.gitChange(this.branch).subscribe(gitchange => {
        this.cookieService.deleteAll();
        this.cookieService.set('open','true');
        this.cookieService.set('step','1');
        this.cookieService.set('projectPath',this.rootAddress + this.selectedFolder);
        this.service.getAddedConstraints(this.cookieService.get('projectPath')).subscribe(data => {
          if(data["constraints"] !== ""){
            this.cookieService.set('constraints',data["constraints"]);
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
