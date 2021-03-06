import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-self-edit',
  templateUrl: './self-edit.component.html',
  styleUrls: ['./self-edit.component.scss']
})
export class SelfEditComponent implements OnInit {
  data: any = {};
  form: FormGroup;
  staffId: string;
  hireDate: string;
  birthday: string;
  en: any;
  changeTime: string;
  file: any;
  filename: string;
  login: Observable<any> = new Observable<any>();
  orgCode: string;
  updateUrl = `http://119.29.144.125:8080/cgfeesys/User/setUserDetail`;
  keys: Array<any>;
  orgName: string;
  orgType: number;

  constructor(
    private http: Http,
    private store: Store<any>
  ) {
    this.form = new FormGroup({
      orgName: new FormControl('', Validators.nullValidator),
      userName: new FormControl('', Validators.nullValidator),
      userSex: new FormControl('', Validators.nullValidator),
      educational: new FormControl('', Validators.nullValidator),
      practitionerCertificate: new FormControl('', Validators.nullValidator),
      userTel: new FormControl('', Validators.nullValidator),
      workPost: new FormControl('', Validators.nullValidator),
      politicalStatus: new FormControl('', Validators.nullValidator),
      positionalTitle: new FormControl('', Validators.nullValidator),
      emergencyContact: new FormControl('', Validators.nullValidator),
      emergencyPhone: new FormControl('', Validators.nullValidator),
      userMail: new FormControl('', Validators.nullValidator),
      jobDetail: new FormControl('', Validators.nullValidator),
      listGroup: new FormControl('', Validators.nullValidator),
      awardDetail: new FormControl('', Validators.nullValidator),
      specialSkill: new FormControl('', Validators.nullValidator)
    });
    this.keys = Object.keys(this.form.value);
    this.en = {
      firstDayOfWeek: 0,
      dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
      dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    };
    this.login = store.select('login');
  }

  getStaffInfo(staffId) {
    this.http.get(`http://119.29.144.125:8080/cgfeesys/User/getUserDetail?userId=${staffId}`)
            .map(res => res.json())
            .subscribe(res => {
              if (res.code) {
                this.data = res.data;
                this.form.patchValue(res.data);
                this.hireDate = res.data.hireDate;
                this.birthday = res.data.birthday;
                this.changeTime = res.data.changeTime;
              }else {
                alert(res.message);
              }
            });
  }

  submit() {
    this.updateStaff();
  }

  fileChange($event) {
    this.filename = $event.target.files[0].name;
    this.file = $event.target.files[0];
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

  updateStaff() {
    const myHeaders: Headers = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    const keys = Object.keys(this.form.value);
    keys.forEach(el => {
      this.data[el] = this.form.value[el];
    });
    this.data.hireDate = this.dateFormat(this.hireDate);
    this.data.birthday = this.dateFormat(this.birthday);
    this.data.changeTime = this.dateFormat(this.changeTime);
    this.data.politics = this.data.politics ? this.data.politics : 0;
    this.data.positionalTitle = this.data.positionalTitle ? this.data.positionalTitle : 0;
    this.http.post(`http://119.29.144.125:8080/cgfeesys/User/setUserDetail`, JSON.stringify(this.data), {
              headers: myHeaders
            })
            .map(res => res.json())
            .subscribe(res => {
              if (res.code) {
                if (this.file) {
                  this.upload(this.data.userId);
                }else {
                  alert('修改成功！');
                }
              }else {
                alert(res.message);
              }
            });
  }

  upload(userId) {
    const formdata = new FormData();
    formdata.append('file', this.file);
    formdata.append('userId', userId);
    this.http.post(`http://119.29.144.125:8080/cgfeesys/upload/userInfo`, formdata)
      .map(res => res.json())
      .subscribe(res => {
        if (res.code) {
          alert(res.message);
        }else {
          alert(res.message);
        }
      });
  }

  ngOnInit() {
    this.login.subscribe(res => {
      if (res) {
        this.orgCode = res.orgCode;
        this.orgName = res.orgName;
        this.orgType = res.orgType;
        this.staffId = res.userId;
        this.form.value.orgName = res.orgName;
        this.getStaffInfo(res.userId);
      }
    });
  }

}
