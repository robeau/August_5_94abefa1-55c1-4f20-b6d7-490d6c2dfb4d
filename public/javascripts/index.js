/**
 * Created by natalie on 8/5/2015.
 */

    console.log('Hello from public/');

/*
 Create an Express application that takes the email and password for a gmail account and shows

 on a dashboard, the number of emails received by the user as three pie charts

 1. Read vs Unread emails

 2. Emails with attachments vs emails without attachments

 3. Division based on MIME types of attachments (doc, pdf, etc) - This should be dynamic

 based on the MIME types DO NOT hardcode mime types
 */

var calendar = document.getElementById('date');
var shownDate = document.getElementById('showDate');

calendar.addEventListener('change', function () {
 var newDate = this.value;
 newDate = newDate.toString();
 var year = newDate.substr(0,4);
 var month = newDate.substr(5,2);
 switch (month){
  case '01':
         month = 'January';
         break;
  case '02':
   month = 'February';
   break;
  case '03':
   month = 'March';
   break;
  case '04':
   month = 'April';
   break;
  case '05':
   month = 'May';
   break;
  case '06':
   month = 'June';
   break;
  case '07':
   month = 'July';
   break;
  case '08':
   month = 'August';
   break;
  case '09':
   month = 'September';
   break;
  case '10':
   month = 'October';
   break;
  case '11':
   month = 'November';
   break;
  case '12':
   month = 'December';
   break;
 }
 var day = newDate.substr(8,2);
 newDate = month + ' ' + day + ', ' + year;

 console.log('new date is:', newDate);

 $.post('/', newDate, function (data) {
  console.log('this is the data',data);
 });

 shownDate.innerHTML = 'since ' + newDate;
 location.reload();

});
