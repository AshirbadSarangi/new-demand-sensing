import { Component, DoCheck, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {ThemePalette} from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EChartsOption } from 'echarts';
import  { weeklyForecast, weeklyHist, dailyHist, dailyForecast, hourlyHist, hourlyForecast} from './const_file';
import  { tradWeight, mlWeight, dlWeight, ensemWeight } from './const_file';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { timestamp } from 'rxjs';


export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subcategories?: Task[];
}


export interface DialogData {
  chosen:string,
  value : number
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck{
  
  title = 'Demand Demo';
  message = "Responses Recorded"
  action = "Close"

  today= new Date()

  weeklyHist = weeklyHist
  weeklyForecast = weeklyForecast
  dailyHist = dailyHist
  dailyForecast = dailyForecast
  hourlyHist = hourlyHist
  hourlyForecast = hourlyForecast

  chartType:string = "currency"

  promotionWt = false;
  priceWt = false;
  marketingWt = false;
  weatherWt = false;
  eventsWt = false;
  holidaysWt = false;

  tradBase = 0.5;
  mlBase = 0.65;
  dlBase = 0.60;
  ensemBase = 0.66;
  forecastBase = 1;
  prevTime:string = ""
  presTime:string = ""
  
  basePrecision:number = 0.7;

  salesIncreament:number = 1.32;
  impressionsIncreament:number = 4.38;
  revenuesIncreament:number = 1.37;
  workforceIncreament:number = 2.62;
  actual2021:number = 6;
  actual2022:number = 11;
  forecast:number = 14
  selectedChartPeriod:string = "hourly"
  selectedTablePeriod:string = ""

  forecastedPeriod:string = "2d"

  startDate : any  =  'Oct 07 2022' 
  endDate : any  = ' Oct 09 2022 '

  plusIcon = "https://cdn3.iconfinder.com/data/icons/top-search-9/1024/plus-1024.png"
  arrowIcon = "https://cdn2.iconfinder.com/data/icons/flat-style-svg-icons-part-1/512/raise_wage_rise_upraise_upgrade-1024.png"


  chartOption!: EChartsOption 

  chartOptionWeekly: EChartsOption = {
    tooltip:{},
    xAxis: {
      type: 'category',
      data: this.weeklyHist.map(c => c.week).concat(this.weeklyForecast.map(c => c.week)),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: this.weeklyHist.map(c => c["revenue"]),
        type: 'line',
      },
      {
        color:"#53D6C4",
        data: Array(this.weeklyHist.length - 1 ).concat(this.weeklyForecast.map(c => c["revenue"])),
        type: 'line',
        areaStyle: {}
      },
    ],
  };

  chartOptionDaily: EChartsOption = {
    tooltip:{},
    xAxis: {
      type: 'category',
      data: this.dailyHist.map(c => c.daily).concat(this.dailyForecast.map(c => c.daily)),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: this.dailyHist.map(c => c["revenue"]),
        type: 'line',
      },
      {
        color:"#53D6C4",
        data: Array(this.dailyHist.length - 1 ).concat(this.dailyForecast.map(c => c["revenue"])),
        type: 'line',
        areaStyle : {}
      },
    ],
  };

  chartOptionHourly: EChartsOption = {
    tooltip:{},
    xAxis: {
      type: 'category',
      data: this.hourlyHist.map(c => c.hourly).concat(this.hourlyForecast.map(c => c.hourly)),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: this.hourlyHist.map(c => c["revenue"]),
        type: 'line',
      },
      {
        color:"#53D6C4",
        data: Array(this.hourlyHist.length - 1).fill('-').concat(this.hourlyForecast.map(c => (c["revenue"]).toString())),
        type: 'line',
        areaStyle:{}
      }
    ],
  };

  chartOptionUnitsWeekly: EChartsOption = {
    tooltip:{},
    xAxis: {
      type: 'category',
      data: this.weeklyHist.map(c => c.week).concat(this.weeklyForecast.map(c => c.week)),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: this.weeklyHist.map(c => c["revenue"]/1000),
        type: 'line',
      },
      {
        color:"#53D6C4",
        data: Array(this.weeklyHist.length - 1 ).concat(this.weeklyForecast.map(c => c["revenue"]/1000)),
        type: 'line',
        areaStyle: {}
      },
    ],
  };

  chartOptionUnitsDaily: EChartsOption = {
    tooltip:{},
    xAxis: {
      type: 'category',
      data: this.dailyHist.map(c => c.daily).concat(this.dailyForecast.map(c => c.daily)),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: this.dailyHist.map(c => c["revenue"]/1000),
        type: 'line',
      },
      {
        color:"#53D6C4",
        data: Array(this.dailyHist.length - 1 ).concat(this.dailyForecast.map(c => (c["revenue"]+1)/1000)),
        type: 'line',
        areaStyle : {}
      },
    ],
  };

  chartOptionUnitsHourly: EChartsOption = {
    tooltip:{},
    xAxis: {
      type: 'category',
      data: this.hourlyHist.map(c => c.hourly).concat(this.hourlyForecast.map(c => c.hourly)),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: this.hourlyHist.map(c => (c["revenue"])/1000),
        type: 'line',
      },
      {
        color:"#53D6C4",
        data: Array(this.hourlyHist.length - 1).fill('-').concat(this.hourlyForecast.map(c => ((c["revenue"]+10)/1000).toString())),
        type: 'line',
        areaStyle:{}
      }
    ],
  };


  constructor
  (
    private _formBuilder:FormBuilder,
    private _snackBar: MatSnackBar,
    private dialog : MatDialog
  )
  {}

  openDialog(name:string, weight:number): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '500px',
      data: {chosen : name, value : weight },
    });

  }

  dateRangeTrend = this._formBuilder.group
  (
    {
      startDate : [],
      endDate:[]
    }
  )

  trainingDateRange = this._formBuilder.group( { startDate : ['',], endDate : ['',] } )
  forecastedDateRange = this._formBuilder.group( { startDate : ['',], endDate : ['',] } )


    changeBase(): void 
    {

      this.tradBase = 0.5;
      this.mlBase = 0.65;
      this.dlBase = 0.60;
      this.ensemBase = 0.66;

      if(this.dateRangeTrend.value.startDate && this.dateRangeTrend.value.endDate) 
      {
        this.tradBase = this.tradBase + 
        tradWeight['promotion'] + tradWeight['market'] + tradWeight['weather'] +  tradWeight['macro']
        +  tradWeight['price'] 
  
        this.mlBase = this.mlBase + 
        mlWeight['promotion'] + mlWeight['market'] + mlWeight['weather'] +  mlWeight['macro']
        +  mlWeight['price'] 
  
        this.dlBase = this.dlBase + 
        dlWeight['promotion'] + dlWeight['market'] + dlWeight['weather'] +  dlWeight['macro']
        +  dlWeight['price'] 
  
        this.ensemBase = this.ensemBase + 
        ensemWeight['promotion'] + ensemWeight['market'] + ensemWeight['weather'] +  ensemWeight['macro']
        +  ensemWeight['price'] 
      }

      let startDate = new Date(this.dateRangeTrend.value.startDate || "")
      let endDate = new Date(this.dateRangeTrend.value.endDate || "")

      this.startDate = this.formatDate(startDate.toDateString())
      this.endDate = this.formatDate(endDate.toDateString())

      switch(this.forecastedPeriod) 
      {
        case '2d' : this.assignTrainingDate(7,'d');break;
        case '2w' : this.assignTrainingDate(14,'d');break;
        case '1m' : this.assignTrainingDate(3,'m');break;
        case '2m' : this.assignTrainingDate(6,'m');break;
      }

      this.forecastDate()

    }

    assignTrainingDate(stepSize:number, stepType:string)
    {
      let startDate = new Date(this.endDate)
      let endDate = new Date(this.endDate)
      if (stepType == 'd')
        startDate.setDate((startDate).getDate() - stepSize)

      else if (stepType == 'm')
        startDate.setMonth((startDate).getMonth() - stepSize )

      this.trainingDateRange.patchValue({startDate:startDate.toDateString(), endDate:endDate.toDateString()})
    }

  formatDate(passedDate:any)
  {
    if(passedDate)  return (passedDate.toString().slice(4,15))
    else return ;
  }

  findChecked()
  {
    let checked = false
    if(this.dateRangeTrend.value.startDate && this.dateRangeTrend.value.endDate) checked = true;

    return checked
  }
 
  changePrecision(event?:any)
  {
    if(event.checked) 
    {
      this.tradBase = this.tradBase + tradWeight[event.source.value.toString()] 
      this.mlBase = this.mlBase + mlWeight[event.source.value] 
      this.dlBase = this.dlBase + dlWeight[event.source.value] 
      this.ensemBase = this.ensemBase + ensemWeight[event.source.value] 
    }
    else
    {
      this.tradBase = this.tradBase - tradWeight[event.source.value] 
      this.mlBase = this.mlBase - mlWeight[event.source.value] 
      this.dlBase = this.dlBase - dlWeight[event.source.value] 
      this.ensemBase = this.ensemBase - ensemWeight[event.source.value] 
    } 

    if(this.ensemBase > 0.66) this.forecastBase =  1 + this.ensemBase/10
    else this.forecastBase = 1
   
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

    
  favoriteSeason: string ="";
  chosenProduct: string ="";
  chosenHistPeriod: string ="";
  chosenForecastPeriod: string ="";

  products: string[] = ['Product 1', 'Product 2', 'Product 3', 'Product 4'];
  forecastPeriods= 
  [
    {name :'Two Days', value: '2d'},
    {name :'Two Week', value :'2w'},
    {name :'One Month', value :'1m'},
    {name :'Two Months', value :'2m'},
  ]

showFiller = false;
categories: Task = {
  name: 'All',
  completed: false,
  color: 'primary',
  subcategories: [
    {name: 'Category 1', completed: false, color: 'primary'},
    {name: 'Category 2', completed: false, color: 'primary'},
    {name: 'Category 3', completed: false, color: 'primary'},
  ],
}
locations: Task = {
  name: 'All',
  completed: false,
  color: 'primary',
  subcategories: [
    {name: 'Location 1', completed: false, color: 'primary'},
    {name: 'Location 2', completed: false, color: 'primary'},
    {name: 'Location 3', completed: false, color: 'primary'},
  ],
};
period:string = "hour"

allComplete: boolean = false;

updateAllComplete() {
  this.allComplete = this.categories.subcategories != null && this.categories.subcategories.every(t => t.completed);
}

someComplete(): boolean {
  if (this.categories.subcategories == null) {
    return false;
  }
  return this.categories.subcategories.filter(t => t.completed).length > 0 && !this.allComplete;
}

setAll(completed: boolean) {
  this.allComplete = completed;
  if (this.categories.subcategories == null) {
    return;
  }
  this.categories.subcategories.forEach(t => (t.completed = completed));
}

ngDoCheck()
{
  this.appointDate()
}

forecastDate()
{
  let startDate = new Date(this.endDate)
  let endDate = new Date(this.endDate)

  let findDate = (date:Date,stepSize:number, stepType:string) => 
  {
    if (stepType == 'd')
      date.setDate((date).getDate() + stepSize)
    else if (stepType == 'm')
      date.setMonth((date).getMonth() + stepSize )
    return date
  }

  startDate = findDate(startDate,1,'d')

  switch(this.forecastedPeriod)
  {
    case '2d': endDate = findDate(endDate,2,'d');break;
    case '2w': endDate = findDate(endDate,7,'d');break;
    case '1m': endDate = findDate(endDate,1,'m');break;
    case '2m': endDate = findDate(endDate,2,'m');break;
  }

  // if(this.forecastedPeriod == '2d') this.endDate = new Date().getDate() + 2
  // if(this.forecastedPeriod == '2w') this.endDate = new Date().getDate() + 7
  // if(this.forecastedPeriod == '1m') this.endDate = new Date().getDate() + 14
  // if(this.forecastedPeriod == '2m') this.endDate = new Date().getDate() + 14

  // this.startDate = this.formatDate(this.startDate)
  // if(this.endDate.toString().length < 2) this.endDate = "0"+this.endDate.toString()
  // this.endDate = "Mon Oct "+this.endDate+" 2022"
  // this.endDate = this.formatDate(this.endDate)

  this.forecastedDateRange.patchValue({startDate:this.formatDate(startDate) , endDate:this.formatDate(endDate) ,}) 

  

}


print(event:any)
{
  console.log(event)
}

findSum(data:any,index:number,type:string)
{
  let revenues :any
  if(type=='obj')revenues = data.map((c:any) => c['revenue'])
  else if (type='arr') revenues = data
  let answer :any

  if(index == 2)
  {
    let halfLength = (revenues.length - 1)/2
    let firstPart = revenues.slice(0,halfLength)
    let secondPart = revenues.slice(halfLength,-1)

    answer =
    [
      firstPart.reduce((a:any,b:any)=>{return a+b}),
      secondPart.reduce((a:any,b:any)=>{return a+b})
    ]
    return answer
  }

  if(index == 1)
  {
    answer = revenues.reduce((a:any,b:any)=>{return a + b})
  }
  return answer
}

appointDate()
{
  let answerHist = []
  let answerForecast = 0
  if(this.selectedChartPeriod == 'hourly') 
  {
    if(this.chartType == 'currency')
    this.chartOption = this.chartOptionHourly
    if(this.chartType == 'units')
    this.chartOption = this.chartOptionUnitsHourly
    this.salesIncreament = 1.32;
    this.impressionsIncreament = 4.38;
    this.revenuesIncreament = 1.37;
    this.workforceIncreament = 2.62;
    answerHist = this.findSum(this.hourlyHist,2,'obj');
    answerForecast = this.findSum(this.hourlyForecast,1,'obj');
    this.actual2021 = 96824
    this.actual2022 = 90570.28896215459
    this.forecast = 112216.3235643741
    this.period = "hour"
    this.prevTime = "(02-10-2022)"
    this.presTime = "(03-10-2022)"
  }

  if(this.selectedChartPeriod == 'daily') 
  {
    if(this.chartType == 'currency')
    this.chartOption = this.chartOptionDaily
    if(this.chartType == 'units')
    this.chartOption = this.chartOptionUnitsDaily
    this.salesIncreament = 3.32;
    this.impressionsIncreament = 1.38;
    this.revenuesIncreament = 3.37;
    this.workforceIncreament = 5.62;
    let dailyHist = this.dailyHist.slice(0,7).concat(this.dailyHist.slice(-9,-2))
    answerHist = this.findSum(dailyHist,2,'obj');
    answerForecast = this.findSum(this.dailyForecast,1,'obj');
    this.actual2021 = answerHist[0]
    this.actual2022 = answerHist[1]
    this.forecast = answerForecast
    this.period = "day"
    this.prevTime = "(06 Sep - 13 Sep)"
    this.presTime = "(26 Sep - 3 Oct)"
  }

  if(this.selectedChartPeriod == 'weekly') 
  {
    if(this.chartType == 'currency')
    this.chartOption = this.chartOptionWeekly
    if(this.chartType == 'units')
    this.chartOption = this.chartOptionUnitsWeekly
    this.salesIncreament = 2.32;
    this.impressionsIncreament = 5.38;
    this.revenuesIncreament = 5.37;
    this.workforceIncreament = 1.62;
    let weeklyHist = this.weeklyHist.slice(0,4).concat
    (
      {
        "week": "04-10-2021",
        "revenue": 1819564.90
      },
      {
        "week": "11-10-2021",
        "revenue": 2144925.988
      },
      {
        "week": "18-10-2021",
        "revenue": 1950290.236
      },
      {
        "week": "25-10-2021",
        "revenue": 1902071.26
      },
      {
        "week": "25-10-2021",
        "revenue": 1902071.26
      },
    )
    answerHist = this.findSum(weeklyHist,2,'obj');
    answerForecast = this.findSum(this.weeklyForecast,1,'obj');
    this.actual2021 = answerHist[0]
    this.actual2022 = answerHist[1]
    this.forecast = answerForecast
    this.period = "week"
    this.prevTime = "(Oct 2021)"
    this.presTime = "(Oct 2022)"
  }
}

changeChart()
{
  // console.log(this.chartType)


}
}













@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-overview-example-dialog.html',
  styleUrls:['./app.component.css']
})
export class DialogOverviewExampleDialog implements OnInit {

  name:string = ''
  firstOption : number | string= 0
  secondOption : number | string = 0
  thirdOption : number  | string= 0
  fourthOption : number  | string = 0

  firstName : string = ""
  secondName : string = ""
  thirdName : string = ""
  fourthName : string |null = null

  

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}



  ngOnInit(): void {

    this.firstOption = (this.data.value * 100 ).toPrecision(3)
    this.secondOption = (0.79 * Number(this.firstOption)).toPrecision(3) 
    this.thirdOption = (0.66 * Number(this.firstOption) ).toPrecision(3)
    this.fourthOption = (0.52 * Number(this.firstOption)).toPrecision(3) 

    if(this.data.chosen == 'trad') 
    {
      this.name = 'Traditional'
      this.firstName = "ARIMA"
      this.secondName = "SARIMA"
      this.thirdName = "UCM"
      this.fourthName = "WORK"
    }
    if(this.data.chosen == 'ml')
    {
      this.name = 'Machine Learning'
      this.firstName = "Random Forest"
      this.secondName = "Support Vector Machine"
      this.thirdName = "XG Boost"
    }
    if(this.data.chosen == 'dl')
    {
      this.name = 'Deep Learning'
      this.firstName = "CNN"
      this.secondName = "RNN"
      this.thirdName = "LSTM"
    }
    if(this.data.chosen == 'ensem')
    {
      this.name = 'Ensemble'
      this.firstName = "ARIMA"
      this.secondName = "Random Forest"
      this.thirdName = "CNN"
    }
  }
  
}

