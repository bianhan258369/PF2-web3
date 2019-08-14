import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload'
import { ServiceService} from '../service/service.service'
import { Phenomenon } from '../entity/Phenomenon';


@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  interval;
  phenomena : Array<Phenomenon>;
  diagramCount : number;
  constructor(private service:ServiceService) { }

  ngOnInit() {
  }

  uploader:FileUploader = new FileUploader({
    url:"http://localhost:8080/client/upload",
    method:"POST",
    itemAlias:"uploadedFiles"
  });

  selectedXMLFileOnChanged(event:any) {
    this.uploadXMLFile();
  }

  uploadXMLFile(){
    this.uploader.queue[0].onSuccess = function (response, status, headers) {
      if (status == 200) {
        
      } else {
        alert('Failure');
      }
    };
    for(let i = 0;i < this.uploader.queue.length;i++) this.uploader.queue[i].upload();
    var that = this;
    setTimeout(function(){
      location.reload(true);
    },1000);
  }

  selectedOWLFileOnChanged(event:any) {
    this.uploadXMLFile();
  }

  uploadOWLFile(){
    this.uploader.queue[0].onSuccess = function (response, status, headers) {
      if (status == 200) {
        
      } else {
        alert('Failure');
      }
    };
    for(let i = 0;i < this.uploader.queue.length;i++) this.uploader.queue[i].upload();
    var that = this;
    setTimeout(function(){
      location.reload(true);
    },1000);
  }

}
