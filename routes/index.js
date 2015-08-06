var express = require('express');
var router = express.Router();
var Imap = require('imap'),
    inspect = require('util').inspect;

var imap = new Imap({
  user: 'EMAIL@gmail.com',
  password: 'PASSWORD',
  host: 'imap.gmail.com',
  port: 993,
  tls: true
});

var fs = require('fs'), fileStream;

function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}

var BACKDATE = 'July 20, 2015';
var unreadCount = 0;
var readCount = 0;
var attachCount = 0;
var totalEmails = 0;
var mimes_arr = [];

imap.once('ready', function() {
    openInbox(function(err, box) {
        if (err) throw err;
        imap.search([ 'UNSEEN', ['SINCE', BACKDATE] ], function(err, results) {
            if (err) throw err;
            var f = imap.fetch(results, { bodies: '' });
            f.on('message', function(msg, seqno) {
                var prefix = '(#' + seqno + ') ';
                msg.on('body', function(stream, info) {
                    unreadCount++;
                });
                msg.once('attributes', function(attrs) {
                });
                msg.once('end', function() {
                    console.log(prefix + 'Finished');
                });
            });
            f.once('error', function(err) {
                console.log('Fetch error: ' + err);
            });
            f.once('end', function() {
                imap.end();
            });
        });
    });
});

imap.once('ready', function() {
    openInbox(function (err, box) {
        if (err) throw err;
        imap.search([ 'SEEN', ['SINCE', BACKDATE] ], function(err, results) {
            if (err) throw err;
            var f = imap.fetch(results, { bodies: '' });
            f.on('message', function(msg, seqno) {
                var prefix = '(#' + seqno + ') ';
                msg.on('body', function(stream, info) {
                    readCount++;
                });
                msg.once('attributes', function(attrs) {
                });
                msg.once('end', function() {
                    console.log(prefix + 'Finished');
                });
            });
            f.once('error', function(err) {
                console.log('Fetch error: ' + err);
            });
            f.once('end', function() {
                imap.end();
            });
        });
    });
});

imap.once('ready', function() {
  openInbox(function(err, box) {
    if (err) throw err;
    imap.search([ 'ALL', ['SINCE', BACKDATE] ], function(err, results) {
      if (err) throw err;
      var f = imap.fetch(results, { bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)', struct: true });
        f.on('message', function(msg, seqno) {
            var prefix = '(#' + seqno + ') ';
            msg.on('body', function(stream, info) {
                var buffer = '';
                stream.on('data', function(chunk) {
                    buffer += chunk.toString('utf8');
                });
                stream.once('end', function() {
                });
            });
            msg.once('attributes', function(attrs) {
                totalEmails++;
                var arr = attrs.struct[2];
                if (typeof arr !== 'undefined'){
                    if(arr[0].disposition === null || typeof arr[0].disposition === 'undefined' || typeof arr[0].disposition.params === 'undefined'){
                    }
                    else{
                        attachCount++;

                        var thisType = arr[0].type;
                        var found = false;

                        if (mimes_arr.length === 0){
                            var obj = {mtype: thisType, count: 1};
                            mimes_arr.push(obj);
                        }
                        else{
                            mimes_arr.forEach(function (mime) {
                                if (mime.mtype === thisType){
                                    found = true;
                                    mime.count++;
                                }
                            });
                            if (found === false){
                                var obj = {mtype: thisType, count: 1};
                                mimes_arr.push(obj);
                            }
                            found = false;
                        }

                    }
                }
            });
            msg.once('end', function() {
                console.log(prefix + 'Finished');
            });
        });
        f.once('error', function(err) {
            console.log('Fetch error: ' + err);
        });
        f.once('end', function() {
            console.log('Done fetching all messages!');
            imap.end();
      });
    });
  });
});

imap.once('error', function(err) {
  console.log(err);
});

imap.once('end', function() {
    var nonAttachments = totalEmails - attachCount;
  console.log('Connection ended');
});

imap.connect();

/* GET home page. */
router.get('/', function(req, res, next) {var nonAttachments = totalEmails - attachCount;
    var renderObj = {
        title: 'Express',
        unread: unreadCount,
        read: readCount,
        attachments: attachCount,
        total: totalEmails,
        noatt: nonAttachments,
        numTypes: mimes_arr.length,
        mimes_arr: mimes_arr,
        date: BACKDATE
    }
  res.render('index', renderObj);
});

module.exports = router;