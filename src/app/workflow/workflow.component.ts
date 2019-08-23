import { Component, OnInit } from '@angular/core';
import * as joint from 'node_modules/jointjs/dist/joint.js';
import { ServiceService } from '../service/service.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent implements OnInit {

  paper : joint.dia.Paper;
  graph : joint.dia.Graph;
  mainStep : string;

  constructor(private service : ServiceService,private cookieService : CookieService) {
   }

  ngOnInit() {
    this.initPaper();
  }

  initPaper() : void{
    if(location.search.indexOf('?') === -1) this.mainStep = 'start';
		else{
      this.mainStep = location.search.substring(6);//http://.......?from=.....
    }
    console.log(this.mainStep);
    this.graph = new joint.dia.Graph()
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
    let ellipse = new joint.shapes.standard.Ellipse({
      position: {x: 625, y: 25},
			size: {width: 50,height: 50},
			attrs: { body: { fill: 'none',strokeWidth:1}, label: { text: 'Start', fill: '#000000' }}
    });
    let polygon = new joint.shapes.standard.Polygon({
      position: {x: 600,y : 125},
      size: {width: 100,height: 50},
      attrs: { body: { stroke:'#000000', fill: 'none',strokeWidth:1,refPoints: '0,10 10,0 20,10 10,20' }}
    });
    let rect1 = new joint.shapes.standard.Rectangle({
      position: {x: 400,y : 250},
      size: {width: 120,height: 50},
      attrs: { body: { stroke:'#000000', fill: 'none',strokeWidth:1 }, label: { text: 'Text Description', fill: '#000000' }}
    });
    let rect2 = new joint.shapes.standard.Rectangle({
      position: {x: 800,y : 250},
      size: {width: 150,height: 50},
      attrs: { body: { stroke:'#000000', fill: 'none',strokeWidth:1 }, label: { text: 'Diagram Description', fill: '#000000' }}
    });
    let rect3 = new joint.shapes.standard.Rectangle({
      position: {x: 700,y : 375},
      size: {width: 100,height: 50},
      attrs: { body: { stroke:'#000000', fill: 'none',strokeWidth:1 }, label: { text: 'Progression', fill: '#000000' }}
    });
    let rect4 = new joint.shapes.standard.Rectangle({
      position: {x: 900,y : 375},
      size: {width: 100,height: 50},
      attrs: { body: { stroke:'#000000', fill: 'none',strokeWidth:1 }, label: { text: 'Projection', fill: '#000000' }}
    });
    let rect5 = new joint.shapes.standard.Rectangle({
      position: {x: 300,y : 375},
      size: {width: 100,height: 50},
      attrs: { body: { stroke:'#000000', fill: 'none',strokeWidth:1 }, label: { text: 'Privacy', fill: '#000000' }}
    });
    let rect6 = new joint.shapes.standard.Rectangle({
      position: {x: 500,y : 375},
      size: {width: 100,height: 50},
      attrs: { body: { stroke:'#000000', fill: 'none',strokeWidth:1 }, label: { text: 'Security', fill: '#000000' }}
    });
    let rect7 = new joint.shapes.standard.Rectangle({
      position: {x: 900,y : 500},
      size: {width: 100,height: 50},
      attrs: { body: { stroke:'#000000', fill: 'none',strokeWidth:1 }, label: { text: 'Clock Check', fill: '#000000' }}
    });
    let privacyFinish = new joint.shapes.standard.Ellipse({
      position: {x: 325, y: 500},
			size: {width: 50,height: 50},
			attrs: { body: { fill: 'none',strokeWidth:1}, label: { text: 'Finish', fill: '#000000' }}
    });
    let securityFinish = new joint.shapes.standard.Ellipse({
      position: {x: 525, y: 500},
			size: {width: 50,height: 50},
			attrs: { body: { fill: 'none',strokeWidth:1}, label: { text: 'Finish', fill: '#000000' }}
    });
    let progressionFinish = new joint.shapes.standard.Ellipse({
      position: {x: 725, y: 500},
			size: {width: 50,height: 50},
			attrs: { body: { fill: 'none',strokeWidth:1}, label: { text: 'Finish', fill: '#000000' }}
    });
    let clockcheckFinish = new joint.shapes.standard.Ellipse({
      position: {x: 925, y: 625},
			size: {width: 50,height: 50},
			attrs: { body: { fill: 'none',strokeWidth:1}, label: { text: 'Finish', fill: '#000000' }}
    });
    if(this.mainStep === 'start'){
      rect1.attr({
        body:{
          stroke:'red',
        }
      })
      rect2.attr({
        body:{
          stroke:'red',
        }
      })
    }
    if(this.mainStep === 'diagramdescription'){
      rect3.attr({
        body:{
          stroke:'red',
        }
      })
      rect4.attr({
        body:{
          stroke:'red',
        }
      })
    }
    if(this.mainStep === 'textdescription'){
      rect5.attr({
        body:{
          stroke:'red',
        }
      })
      rect6.attr({
        body:{
          stroke:'red',
        }
      })
    }
    if(this.mainStep === 'projection'){
      rect7.attr({
        body:{
          stroke:'red',
        }
      })
    }
    if(this.mainStep === 'privacy'){
      privacyFinish.attr({
        body:{
          stroke:'red',
        }
      })
    }
    if(this.mainStep === 'security'){
      securityFinish.attr({
        body:{
          stroke:'red',
        }
      })
    }
    if(this.mainStep === 'progression'){
      progressionFinish.attr({
        body:{
          stroke:'red',
        }
      })
    }
    if(this.mainStep === 'clockcheck'){
      clockcheckFinish.attr({
        body:{
          stroke:'red',
        }
      })
    }
    let link1 = new joint.shapes.standard.Link({
      source: { id: ellipse.id },
      target: { id: polygon.id },
      });
      link1.attr({
        line: {
          strokeWidth: 1,
        },
      });
      let link2 = new joint.shapes.standard.Link({
        source: { id: polygon.id },
        target: { id: rect1.id },
        });
      link2.attr({
        line: {
          strokeWidth: 1,
        }
      });
      let link3 = new joint.shapes.standard.Link({
        source: { id: polygon.id },
        target: { id: rect2.id },
        });
      link3.attr({
        line: {
          strokeWidth: 1,
        },
      });
      let link4 = new joint.shapes.standard.Link({
        source: { id: rect2.id },
        target: { id: rect3.id },
        });
      link4.attr({
        line: {
          strokeWidth: 1,
        },
      });
      let link5 = new joint.shapes.standard.Link({
        source: { id: rect2.id },
        target: { id: rect4.id },
        });
      link5.attr({
        line: {
          strokeWidth: 1,
        },
      });
      let link6 = new joint.shapes.standard.Link({
        source: { id: rect4.id },
        target: { id: rect7.id },
        });
      link6.attr({
        line: {
          strokeWidth: 1,
        },
      });
      let link7 = new joint.shapes.standard.Link({
        source: { id: rect1.id },
        target: { id: rect5.id },
        });
      link7.attr({
        line: {
          strokeWidth: 1,
        },
      });
      let link8 = new joint.shapes.standard.Link({
        source: { id: rect1.id },
        target: { id: rect6.id },
        });
      link8.attr({
        line: {
          strokeWidth: 1,
        },
      });
      let link9 = new joint.shapes.standard.Link({
        source: { id: rect3.id },
        target: { id: progressionFinish.id },
        });
      link9.attr({
        line: {
          strokeWidth: 1,
        },
      });
      let link10 = new joint.shapes.standard.Link({
        source: { id: rect5.id },
        target: { id: privacyFinish.id },
        });
      link10.attr({
        line: {
          strokeWidth: 1,
        },
      });
      let link11 = new joint.shapes.standard.Link({
        source: { id: rect6.id },
        target: { id: securityFinish.id },
        });
      link11.attr({
        line: {
          strokeWidth: 1,
        },
      });
      let link12 = new joint.shapes.standard.Link({
        source: { id: rect7.id },
        target: { id: clockcheckFinish.id },
        });
      link12.attr({
        line: {
          strokeWidth: 1,
        },
      });
    ellipse.addTo(this.graph);
    polygon.addTo(this.graph);
    rect1.addTo(this.graph);
    rect2.addTo(this.graph);
    rect3.addTo(this.graph);
    rect4.addTo(this.graph);
    rect5.addTo(this.graph);
    rect6.addTo(this.graph);
    rect7.addTo(this.graph);
    privacyFinish.addTo(this.graph);
    progressionFinish.addTo(this.graph);
    securityFinish.addTo(this.graph);
    clockcheckFinish.addTo(this.graph);
    link1.addTo(this.graph);
    link2.addTo(this.graph);
    link3.addTo(this.graph);
    link4.addTo(this.graph);
    link5.addTo(this.graph);
    link6.addTo(this.graph);
    link7.addTo(this.graph);
    link8.addTo(this.graph);
    link9.addTo(this.graph);
    link10.addTo(this.graph);
    link11.addTo(this.graph);
    link12.addTo(this.graph);
    var that = this;
    this.paper.on('element:pointerdblclick', function(elementView) {//pointerdblclick : double click
			var currentElement = elementView.model;//currentElement:the element which you double click on
      let elementText : string = currentElement.attr().label.text;
      if(that.mainStep === 'start'){
        if(elementText === 'Text Description'){
          location.href='http://localhost:4200/textdescription';
        }
        if(elementText === 'Diagram Description'){
          location.href='http://localhost:4200/diagramdescription';
        }
      }
      else if(that.mainStep === 'textdescription'){
        if(elementText === 'Privacy'){
          location.href='http://localhost:4200/privacy';
        }
        if(elementText === 'Security'){
          location.href='http://localhost:4200/security';
        }
      }
      else if(that.mainStep === 'diagramdescription'){
        if(elementText === 'Projection'){
          location.href='http://localhost:4200/projection';
        }
        if(elementText === 'Progression'){
          location.href='http://localhost:4200/progression';
        }
      }
      else if(that.mainStep === 'projection'){
        if(elementText === 'Clock Check'){
          location.href='http://localhost:4200';
        }
      }
		});
		this.paper.on('blank:mousewheel', (event,x ,y ,delta) => {
			let scale = that.paper.scale();
			that.paper.scale(scale.sx + (delta * 0.01), scale.sy + (delta * 0.01));
		});
  }
  
  previousMainStep(){
    if(location.search.indexOf('?') === -1){
      return;
    }
    else{
      if(location.search.substring(1).indexOf("textdescription") !== -1 || location.search.substring(1).indexOf("diagramdescription") !== -1){
        this.mainStep = 'start';
      }
      else if(location.search.substring(1).indexOf("progression") !== -1 || location.search.substring(1).indexOf("projection") !== -1){
        this.mainStep = 'diagramdescription';
      }
      else if(location.search.substring(1).indexOf("clockcheck") !== -1){
        this.mainStep = 'projection';
      }
      else if(location.search.substring(1).indexOf("privacy") !== -1 || location.search.substring(1).indexOf("security") !== -1){
        this.mainStep = 'textdescription';
      }
    }
    if(this.mainStep === 'start'){
      location.href = 'http://localhost:4200/workflow'
    }
    else {
      location.href = 'http://localhost:4200/workflow?from=' + this.mainStep;
    }
  }

}
