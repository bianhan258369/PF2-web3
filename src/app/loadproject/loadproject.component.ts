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
  filelist : Array<string>;
  selectedFolder : string;

  constructor(private service : ServiceService,private cookieService:CookieService, private route : ActivatedRoute,private location : Location,private router : Router) { }

  ngOnInit() {
    this.filelist = new Array<string>();
    this.getFileList('asset');
  }

  getFileList(folderPath : string){
    this.service.getFileList(folderPath).subscribe(data =>{
      this.filelist = data["filelist"];
      for(let i = 0;i < this.filelist.length;i++){
        var str = this.filelist[i];
        if(str === 'MyCCSL.zip') this.filelist.pop();
      }
    });
  }

  loadProject(){
    this.router.navigate(['']).then(() => {
      window.location.reload();
    });
    this.cookieService.set('step','1');
    this.cookieService.set('projectPath','asset/' + this.selectedFolder)
  }

  goBack(){
    this.location.back();
  }
}
