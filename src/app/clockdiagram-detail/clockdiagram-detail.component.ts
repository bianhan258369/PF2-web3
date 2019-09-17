import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { Scenario } from '../entity/Scenario';
import { Interaction } from '../entity/Interaction';
import { ActivatedRoute } from '@angular/router';
import * as joint from 'node_modules/jointjs/dist/joint.js';
import { Phenomenon } from '../entity/Phenomenon';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-clockdiagram-detail',
  templateUrl: './clockdiagram-detail.component.html',
  styleUrls: ['./clockdiagram-detail.component.css']
})
export class ClockdiagramDetailComponent implements OnInit {
  interval;
  scenarioDiagram : Array<Object>;
  paper : joint.dia.Paper;
  phenomena : Array<Phenomenon>;
  graph : joint.dia.Graph;
  colour : string;

  constructor(private service : ServiceService, private route: ActivatedRoute, private cookieService:CookieService) {
   }

  ngOnInit() {
    this.scenarioDiagram = new Array<Object>();
    this.phenomena = new Array<Phenomenon>();
    this.getPhenomenonList();
    this.getScenarioDiagramByDomain();
    var that = this;
    that.interval = setInterval(function(){
      clearInterval(that.interval);
      that.initPaper();
      that.showDiagram();
    },300);

  }

  initPaper(){
    this.graph = new joint.dia.Graph();
    let d = $("#content");
    let wid = d.width();
    let hei =d.height();
    this.paper = new joint.dia.Paper({
      el: $("#content"),
      width:wid,
      height:hei,
      model: this.graph,
      gridSize: 10,
      drawGrid: true,
      background: {
          color: 'rgb(240,255,255)'
        }
    });
    var that = this;
    this.paper.on('blank:mousewheel', (event,x ,y ,delta) => {
			let scale = that.paper.scale();
			that.paper.scale(scale.sx + (delta * 0.01), scale.sy + (delta * 0.01));
		});
  }

  getScenarioDiagramByDomain() : void{
    let indexAndDomainTextAndColour : string = this.route.snapshot.paramMap.get('indexAndDomainTextAndColour');
    let projectPath : string = this.route.snapshot.paramMap.get('projectPath');
    let splitted = indexAndDomainTextAndColour.split(',');
    let index : number = +splitted[0];
    let domainText : string = splitted[1];
    this.colour = splitted[2];
    domainText = domainText.replace("&","%26");
    this.service.getScenarioDiagramByDomainText(projectPath, index, domainText).subscribe(data=>{
      this.scenarioDiagram = data;
    });
  }

  getPhenomenonList(){
    let projectPath = this.cookieService.get('projectPath');
    let indexAndDomainTextAndColour : string = this.route.snapshot.paramMap.get('indexAndDomainTextAndColour');
    let splitted = indexAndDomainTextAndColour.split(',');
    let index : number = +splitted[0];
    this.service.getPhenomenonList(projectPath,index).subscribe(phe => {
      this.phenomena = phe;
    })
  }

  showDiagram() : void{
    if(this.graph.getCells().length === 0){
      let interactions : Array<Interaction> = new Array<Interaction>();
      let scenarios : Array<Scenario> = new Array<Scenario>();
      for(let i = 0 ;i < this.scenarioDiagram.length;i++){
        if(this.scenarioDiagram[i].hasOwnProperty('number')){
          let interaction : Interaction = this.scenarioDiagram[i] as Interaction;
          interactions.push(interaction); 
        }
        else{
          let scenario : Scenario = this.scenarioDiagram[i] as Scenario;
          scenarios.push(scenario);
        }
      }
      if(interactions.length === 1){
        let interaction : Interaction = interactions[0];
        let ellipse = null;
        if(interaction.state === 1){
          ellipse = new joint.shapes.basic.Ellipse({
            position: {x: interaction.x1,y : interaction.y1},
            size: {width: interaction.x2,height: interaction.y2},
            attrs: { ellipse: {strokeWidth:1,strokeDasharray : '10,5', fill: this.colour }, text: { text: 'int' + interaction.number, fill: 'white' },root:{id:'int' + interaction.state.toString() + interaction.number.toString()}},
          })
        }
        else{
          ellipse = new joint.shapes.basic.Ellipse({
            position: {x: interaction.x1,y : interaction.y1},
            size: {width: interaction.x2,height: interaction.y2},
            attrs: { ellipse: {strokeWidth:1, fill: this.colour }, text: { text: 'int' + interaction.number, fill: 'white' },root:{id:'int' + interaction.state.toString() + interaction.number.toString()}},
          })
        }
        let text = new joint.shapes.standard.Rectangle();
        for(let j = 0;j < this.phenomena.length;j++){
          if(this.phenomena[j].biaohao === interaction.number){
            text.attr({
              body: {
                ref: 'label',
                refX: -5,
                refY: 0,
                x: 0,
                y: 0,
                refWidth: 10,
                refHeight: '120%',
                fill: 'none',
                stroke:'none',
                strokeWidth: 1,
              },
              label: {
                text: this.phenomena[j].name,
                fontSize: 15,
                textAnchor: 'middle',
                textVerticalAnchor: 'middle',
              },
              root: {
                id:interaction.state.toString() +interaction.number.toString(),
              }
            });
            text.position(interaction.x1 + 60, interaction.y1 - 15);
            text.addTo(this.graph);
            break;
          }
        };
        ellipse.addTo(this.graph);
      }
      else{
        let textList = new Array<joint.shapes.standard.Rectangle>();
        let ellipseGraphList = new Array<joint.shapes.basic.Ellipse>();
        for(let i = 0;i < interactions.length;i++){
          let text = new joint.shapes.standard.Rectangle();
          let ellipse = null;
          if(interactions[i].state === 1){
            ellipse = new joint.shapes.basic.Ellipse({
              position: {x: interactions[i].x1,y : interactions[i].y1},
              size: {width: interactions[i].x2,height: interactions[i].y2},
              attrs: { ellipse: {strokeWidth:1,strokeDasharray : '10,5', fill: this.colour }, text: { text: 'int' + interactions[i].number, fill: 'white' },root:{id:'int' + interactions[i].state.toString() + interactions[i].number.toString()}},
            })
          }
          else{
            ellipse = new joint.shapes.basic.Ellipse({
              position: {x: interactions[i].x1,y : interactions[i].y1},
              size: {width: interactions[i].x2,height: interactions[i].y2},
              attrs: { ellipse: {strokeWidth:1, fill: this.colour }, text: { text: 'int' + interactions[i].number, fill: 'white' },root:{id:'int' + interactions[i].state.toString() + interactions[i].number.toString()}},
            })
          }
          for(let j = 0;j < this.phenomena.length;j++){
            if(this.phenomena[j].biaohao === interactions[i].number){
              text.attr({
                body: {
                  ref: 'label',
                  refX: -5,
                  refY: 0,
                  x: 0,
                  y: 0,
                  refWidth: 10,
                  refHeight: '120%',
                  fill: 'none',
                  stroke:'none',
                  strokeWidth: 1,
                },
                label: {
                  text: this.phenomena[j].name,
                  fontSize: 15,
                  textAnchor: 'middle',
                  textVerticalAnchor: 'middle',
                },
                root: {
                  id:interactions[i].state.toString() +interactions[i].number.toString(),
                }
              });
              text.position(interactions[i].x1 + 60, interactions[i].y1 - 15);
              text.addTo(this.graph);
              break;
            }
          };
          ellipseGraphList[i] = ellipse;
          textList[i] = text;
        }
        for(let i = 0;i < scenarios.length;i++){
          let scenario : Scenario = scenarios[i];
          let interactionFrom : Interaction = scenario.from;
          let interactionTo : Interaction = scenario.to;
          let interactionFromIndex = -1;
          let interactionToIndex = -1;
          for(let j = 0;j < interactions.length;j++){
            let tempInteraction : Interaction = interactions[j];
            if(tempInteraction.number === interactionFrom.number && tempInteraction.state === interactionFrom.state) interactionFromIndex = j;
            if(tempInteraction.number === interactionTo.number && tempInteraction.state === interactionTo.state) interactionToIndex = j;
          }
          if(scenario.state === 4){
            let link = new joint.shapes.standard.Link();
				    link.source(ellipseGraphList[interactionToIndex]);
				    link.target(ellipseGraphList[interactionFromIndex]);
				    link.attr({
					    line: {
						    strokeWidth: 1,
						    targetMarker:{
							    'fill': 'black',
							    'stroke': 'black',
						    }
					    },
			    	});     
            this.graph.addCells([ellipseGraphList[interactionFromIndex],ellipseGraphList[interactionToIndex],link]);
          }
          else if(scenario.state ===2){
            let link = new joint.shapes.standard.Link();
				    link.source(ellipseGraphList[interactionFromIndex]);
				    link.target(ellipseGraphList[interactionToIndex]);	
				    link.attr({
					    line: {
						    strokeWidth: 1,
						    targetMarker:{
							    'fill': 'none',
							    'stroke': 'none',
						    }
					    },
				    });
            this.graph.addCells([ellipseGraphList[interactionFromIndex],ellipseGraphList[interactionToIndex],link]);
          }
          else{
            let link = new joint.shapes.standard.Link();
            link.source(ellipseGraphList[interactionFromIndex]);
            link.target(ellipseGraphList[interactionToIndex]);	
            link.attr({
              line: {
                strokeWidth: 1,
                targetMarker:{
                  'fill': 'black',
                  'stroke': 'black',
                }
              },
            });
            this.graph.addCells([ellipseGraphList[interactionFromIndex],ellipseGraphList[interactionToIndex],link]);		
          }	
        }
      }
      var that = this;
          this.graph.on('change:position', function(elementView, position) {
            if(elementView.attributes.type === 'basic.Ellipse'){
              var id = elementView.attributes.attrs.root.id.substring(3);
              for(let n = 0;n < that.graph.getCells().length;n++){
                if(that.graph.getCells()[n].attributes.type === 'standard.Rectangle' && that.graph.getCells()[n].attributes.attrs.root.id === id){
                  that.graph.getCells()[n].set("position",{x: position.x + 60,y: position.y - 15});
                }
              }
            }
          });
    }
  }
}
