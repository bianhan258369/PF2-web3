import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload'
import { ServiceService} from '../service.service'
import { Phenomenon } from '../phenomenon';


@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  phenomena : Array<Phenomenon>;
  constructor(private service:ServiceService) { }

  ngOnInit() {
    this.getPhenomenon();
  }

  uploader:FileUploader = new FileUploader({
    url:"http://localhost:8080/client/upload",
    method:"POST",
    itemAlias:"uploadedFiles"
  });

  selectedFileOnChanged(event:any) {
    for(var i = 0;i<this.uploader.queue.length;i++){
      console.log(this.uploader.queue[i].file.name);
    }
  }

  uploadFile(){
    this.uploader.queue[0].onSuccess = function (response, status, headers) {
      if (status == 200) {
        let tempRes = response;
        alert(response);
      } else {
        alert('上传失败');
      }
    };
    for(let i = 0;i < this.uploader.queue.length;i++) this.uploader.queue[i].upload();
    alert('上传之后');
  }

  getPhenomenon() : void{
    this.service.getPhenomenonList().subscribe(data =>{
      this.phenomena = data;
    });
  }

  showPhenomenon() : void{
    for(let i = 0;i < this.phenomena.length;i++) console.log(this.phenomena[i].name);
  }
}
