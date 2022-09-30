import { Component, DoCheck, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {ThemePalette} from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EChartsOption } from 'echarts';
import  { weeklyForecast, weeklyHist, monthlyForecast, monthlyHist, quaterlyForecast, quaterlyHist} from './const_file';
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
  
 weeklyHist = weeklyHist
 weeklyForecast = weeklyForecast
 monthlyHist = monthlyHist
 monthlyForecast = monthlyForecast
 quaterlyHist = quaterlyHist
 quaterlyForecast = quaterlyForecast


  constructor
  (
    private _formBuilder:FormBuilder,
    private _snackBar: MatSnackBar
  )
  {}

  message = "Responses Recorded"
  action = "Close"

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
  
  basePrecision:number = 0.7;

  salesIncreament:number = 1.32;
  impressionsIncreament:number = 4.38;
  revenuesIncreament:number = 1.37;
  workforceIncreament:number = 2.62;
  actual2021:number = 6;
  actual2022:number = 11;
  forecast:number = 14
  selectedChartPeriod:string = "weekly"
  selectedTablePeriod:string = ""

  minorPeriod = "4 weeks"
  chartOption: EChartsOption = 
 {
  xAxis: {
    type: 'category',
    data: this.weeklyHist.map(c => c.week).concat(this.weeklyForecast.map(c => c.week)),
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: this.weeklyHist.map(c => c[" Revenue "]/10000),
      type: 'line',
    },
    {
      data: Array(this.weeklyHist.length - 1 ).concat(this.weeklyForecast.map(c => c[" Revenue "]/10000)),
      type: 'line',
    },
  ],
  };
  chartOptionWeekly: EChartsOption = {
    xAxis: {
      type: 'category',
      data: this.weeklyHist.map(c => c.week).concat(this.weeklyForecast.map(c => c.week)),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: this.weeklyHist.map(c => c[" Revenue "]/10000),
        type: 'line',
      },
      {
        data: Array(this.weeklyHist.length - 1 ).concat(this.weeklyForecast.map(c => c[" Revenue "]/10000)),
        type: 'line',
      },
    ],
  };
  chartOptionMonthly: EChartsOption = {
    xAxis: {
      type: 'category',
      data: this.monthlyHist.map(c => c.month).concat(this.monthlyForecast.map(c => c.month)),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: this.monthlyHist.map(c => c["revenue"]/10000),
        type: 'line',
      },
      {
        data: Array(this.monthlyHist.length - 1).fill('-').concat(this.monthlyForecast.map(c => (c["revenue"]/10000).toString())),
        type: 'line',
      }
    ],
  };
  chartOptionQuarterly: EChartsOption = {
    xAxis: {
      type: 'category',
      data: this.quaterlyHist.map(c => c.quarter).concat(this.quaterlyForecast.map(c => c.quarter))
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: this.quaterlyHist.map(c => c.revenue),
        type: 'line',
      },
      {
        data: Array(this.quaterlyHist.length -1).fill('-').concat(this.quaterlyForecast.map(c => (c["revenue"]/10000).toString())),
        type: 'line',
      }
    ],
  };

  changePrecision(event?:any)
  {
    // const p = event.source.value
    // console.log(tradWeight[p])
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
   
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  updateOptions : any
  timer = setInterval(() => {
    
    for (let i = 0; i < 5; i++) {
      this.weeklyForecast.map(c => c[" Revenue "]).shift();
      // this.data.push(this.randomData());
    }
  this.updateOptions = 
  {
      series: 
      [
        {
          data: this.weeklyForecast.map(c => c[" Revenue "])
        }
      ]
    };
  }, 5000);
  


  
  favoriteSeason: string ="";
  chosenProduct: string ="";
  chosenHistPeriod: string ="";
  chosenForecastPeriod: string ="";

  products: string[] = ['Product 1', 'Product 2', 'Product 3', 'Product 4'];
  forecastPeriods= 
  [
    {name :'1 Week', value: 'weekly'},
    {name :'1 Month', value :'monthly'},
    {name :'1 Quater', value :'quarterly'},
  ]
  histDurations: string[] = ['0.5 Year', '1 Year', '1.5 Years', '2 Years'];

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
period:string = "week"

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

appointDate()
{
  if(this.selectedChartPeriod == 'weekly') 
  {
    this.chartOption = this.chartOptionWeekly
    this.salesIncreament = 1.32;
    this.impressionsIncreament = 4.38;
    this.revenuesIncreament = 1.37;
    this.workforceIncreament = 2.62;
    this.actual2021 = 6;
    this.actual2022 = 11;
    this.forecast = 14
    this.period = "week"
    this.minorPeriod = "4 Weeks"
  }
  if(this.selectedChartPeriod == 'monthly') 
  {
    this.chartOption = this.chartOptionMonthly
    this.salesIncreament = 3.32;
    this.impressionsIncreament = 1.38;
    this.revenuesIncreament = 3.37;
    this.workforceIncreament = 5.62;
    this.actual2021 = 24.5;
    this.actual2022 = 40;
    this.forecast = 48
    this.period = "month"
    this.minorPeriod = "3 Months"
  }
  if(this.selectedChartPeriod == 'quarterly') 
  {
    this.chartOption = this.chartOptionQuarterly
    this.salesIncreament = 2.32;
    this.impressionsIncreament = 5.38;
    this.revenuesIncreament = 5.37;
    this.workforceIncreament = 1.62;
    this.actual2021 = 90;
    this.actual2022 = 156;
    this.forecast =184;
    this.period = "quarter";
    this.minorPeriod = "4 Quarter"
  }
}


}
