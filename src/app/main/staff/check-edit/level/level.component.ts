import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { work_post } from '../../../../store/translate';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.scss']
})
export class LevelComponent implements OnInit {
  login: Observable<any> = new Observable<any>();
  orgCode: string;
  levelList: Array<any>;
  hasData: boolean;
  workPost = work_post;
  form: FormGroup;
  staffList: any;
  data: any;
  computerLevelEvaluate: string;
  mandarinLevelEvaluate: string;
  en: any;

  constructor(
    private http: Http,
    private store: Store<any>
  ) {
    this.login = store.select('login');
    this.form = new FormGroup({
      userId: new FormControl('', Validators.nullValidator),
      computerLevel: new FormControl('', Validators.nullValidator),
      mandarinLevel: new FormControl('', Validators.nullValidator)
    });
    this.en = {
      firstDayOfWeek: 0,
      dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
      dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    };
  }

  add() {
    const myHeaders: Headers = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    this.form.value.mandarinLevelEvaluate = this.dateFormat(this.mandarinLevelEvaluate);
    this.form.value.computerLevelEvaluate = this.dateFormat(this.computerLevelEvaluate);
    this.form.value.stationCode = this.orgCode;
    this.http.post(`http://119.29.144.125:8080/cgfeesys/Check/setCheckSkill`, JSON.stringify(this.form.value), {
              headers: myHeaders
            })
            .map(res => res.json())
            .subscribe(res => {
              if (res.code) {
                alert(res.message);
              }else {
                alert(res.message);
              }
            });
  }

  getInfo() {
    this.http.get(`http://119.29.144.125:8080/cgfeesys/Check/getCheckSkill?userId=${this.form.value.userId}`)
      .map(res => res.json())
      .subscribe(res => {
        if (res.code) {
          this.data = res.data;
          this.form.patchValue(res.data);
          this.computerLevelEvaluate = res.data.computerLevelEvaluate || '';
          this.mandarinLevelEvaluate = res.data.mandarinLevelEvaluate || '';
        }else {
          alert(res.message);
        }
      });
  }

  dateFormat(date) {
    if (date) {
      const _date = new Date(date);
      const _month = (_date.getMonth() + 1) <= 9 ? `0${(_date.getMonth() + 1)}` : _date.getMonth();
      const _day = _date.getDate() <= 9 ? `0${_date.getDate()}` : _date.getDate();
      return `${_date.getFullYear()}-${_month}-${_day}`;
    }else {
      return '';
    }
  }

  getStaff() {
    this.http.get(`http://119.29.144.125:8080/cgfeesys/BaseInfo/getStationUserId?stationCode=${this.orgCode}`)
            .map(res => res.json())
            .subscribe(res => {
              if (res.code) {
                this.staffList = res.data;
              }else {
                alert(res.message);
              }
            });
  }

  ngOnInit() {
    this.login.subscribe(res => {
      if (res) {
        this.orgCode = res.orgCode;
        this.getStaff();
      }
    });
  }

}
