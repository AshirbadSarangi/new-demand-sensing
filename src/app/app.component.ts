import { Component, DoCheck, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {ThemePalette} from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EChartsOption } from 'echarts';
import  { weeklyForecast, weeklyHist, dailyHist, dailyForecast, hourlyHist, hourlyForecast} from './const_file';
import  { tradWeight, mlWeight, dlWeight, ensemWeight } from './const_file';


export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subcategories?: Task[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck {
  
  title = 'Demand Demo';
  message = "Responses Recorded"
  action = "Close"

  weeklyHist = weeklyHist
  weeklyForecast = weeklyForecast
  dailyHist = dailyHist
  dailyForecast = dailyForecast
  hourlyHist = hourlyHist
  hourlyForecast = hourlyForecast

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


  constructor
  (
    private _formBuilder:FormBuilder,
    private _snackBar: MatSnackBar
  )
  {}



  dateRangeTrend = this._formBuilder.group
  (
    {
      startDate : [],
      endDate:[]
    }
  )

  dateRangeTable = this._formBuilder.group
  (
    {
      startDate : [],
      endDate:[]
    }
  )

 
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
    {name :'Hourly', value: 'hourly'},
    {name :'Daily', value :'daily'},
    {name :'Weekly', value :'weekly'},
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
    this.chartOption = this.chartOptionHourly
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
    this.chartOption = this.chartOptionDaily
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
    this.chartOption = this.chartOptionWeekly
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
}