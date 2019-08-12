import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload'
import { ServiceService} from '../service/service.service'
import { Phenomenon } from '../class/Phenomenon';


@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  phenomena : Array<Phenomenon>;
  diagramCount : number;
  constructor(private service:ServiceService) { }

  ngOnInit() {
    this.getPhenomenon();
    this.getDiagramCount();
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

  getDiagramCount() : void{
    this.service.getDiagramCount().subscribe(data => {
      this.diagramCount = data;
    })
  }

  showPhenomenon() : void{
    for(let i = 0;i < this.phenomena.length;i++) console.log(this.phenomena[i].name);
  }

  showDiagramCount() : void{
    console.log(this.diagramCount);
  }
}
