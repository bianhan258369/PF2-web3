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
  
  selectedFolder : string;

  constructor(private service : ServiceService,private cookieService:CookieService, private route : ActivatedRoute,private location : Location,private router : Router) { }

  ngOnInit() {
    this.folderlist = new Array<string>();
    this.getFileList('asset');
  }

  getFileList(folderPath : string){
    this.service.getFileList(folderPath).subscribe(data =>{
      this.folderlist = data["filelist"];
      for(let i = 0;i < this.folderlist.length;i++){
        var folder = this.folderlist[i];
        if(folder === 'MyCCSL.zip') this.folderlist.pop();
      }
    });
  }

  loadProject(){
    this.cookieService.deleteAll();
    this.cookieService.set('step','1');
    this.cookieService.set('projectPath','asset/' + this.selectedFolder);
    this.service.getAddedConstraints(this.cookieService.get('projectPath')).subscribe(data => {
      if(data["constraints"] !== ""){
        this.cookieService.set('constraints',data["constraints"]);
      }
    });
    this.router.navigate(['']).then(() => {
      window.location.reload();
    });
  }

  goBack(){
    this.location.back();
  }
}
