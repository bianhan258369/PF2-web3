import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  constructor() {
    console.log('ngOnInit in constructor');
   }

  ngOnInit() {
    console.log('ngOnInit in help');
  }

}
