import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-hold-edit',
  templateUrl: './hold-edit.component.html',
  styleUrls: ['./hold-edit.component.scss']
})
export class HoldEditComponent implements OnInit {
  login: Observable<any> = new Observable<any>();
  en: any;
  form: FormGroup;
  orgCode: string;
  userId: string;
  applyDate: string;
  page = 0;
  size = 15;
  param: any;
  holdList: Array<any>;
  cols: any;
  count: number;
  hasData: boolean;
  checkResult = ['未审核', '通过', '未通过'];

  constructor(
    private http: Http,
    private store: Store<any>
  ) {
    this.login = this.store.select('login');
    this.param = {
      page: this.page,
      size: this.size,
      applyChangeType: 2
    };
    this.form = new FormGroup({
      applyTeams: new FormControl('', Validators.nullValidator),
      shiftId: new FormControl('', Validators.nullValidator),
      remark: new FormControl('', Validators.nullValidator)
    });
    this.en = {
      firstDayOfWeek: 0,
      dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
      dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    };
    this.cols = [
      { field: 'orgName', header: '组织名称' },
      { field: 'applyUserName', header: '顶班申请人' },
      { field: 'applyTeams', header: '顶板班组' },
      { field: 'applyDate', header: '顶板日期' },
      { field: 'checkResultCN', header: '顶班审核状态' }
    ];
  }

  submit() {
    this.addHold();
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

  addHold() {
    const myHeaders: Headers = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    this.form.value.applyDate = this.dateFormat(this.applyDate);
    this.form.value.stationCode = this.orgCode;
    this.form.value.applyUserId = this.userId;
    this.form.value.applyChangeType = 2;
    this.http.post(`http://119.29.144.125:8080/cgfeesys/ShiftChange/set`, JSON.stringify(this.form.value), {
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
    const myHeaders: Headers = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    this.http.post('http://119.29.144.125:8080/cgfeesys/ShiftChange/get', JSON.stringify(this.param) , {
              headers: myHeaders
            })
            .map(res => res.json())
            .subscribe(res => {
              if (res.code) {
                this.count = res.data.count;
                if (res.data.count > 0) {
                  this.hasData = true;
                  res.data.shiftChangeDataList.forEach(el => {
                    el.checkResultCN = this.checkResult[el.checkResult];
                  });
                  this.holdList = res.data.shiftChangeDataList;
                }
              }else {
                alert(res.message);
              }
            });
  }

  ngOnInit() {
    this.login.subscribe(res => {
      if (res) {
        this.orgCode = res.orgCode;
        this.userId = res.userId;
        this.param.orgList = [res.orgCode];
        this.param.applyUserId = res.userId;
        this.getInfo();
      }
    });
  }

}
