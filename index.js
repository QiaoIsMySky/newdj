const express = require('express');
const got = require('got');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let s_token,
  cookies,
  guid,
  lsid,
  lstoken,
  okl_token,
  token,
  userCookie = '';

function praseSetCookies(response) {
  s_token = response.body.s_token;
  guid = response.headers['set-cookie'][0];
  guid = guid.substring(guid.indexOf('=') + 1, guid.indexOf(';'));
  lsid = response.headers['set-cookie'][2];
  lsid = lsid.substring(lsid.indexOf('=') + 1, lsid.indexOf(';'));
  lstoken = response.headers['set-cookie'][3];
  lstoken = lstoken.substring(lstoken.indexOf('=') + 1, lstoken.indexOf(';'));
  cookies =
    'guid=' + guid + '; lang=chs; lsid=' + lsid + '; lstoken=' + lstoken + '; ';
}

function getCookie(response) {
  var TrackerID = response.headers['set-cookie'][0];
  TrackerID = TrackerID.substring(
    TrackerID.indexOf('=') + 1,
    TrackerID.indexOf(';')
  );
  var pt_key = response.headers['set-cookie'][1];
  pt_key = pt_key.substring(pt_key.indexOf('=') + 1, pt_key.indexOf(';'));
  var pt_pin = response.headers['set-cookie'][2];
  pt_pin = pt_pin.substring(pt_pin.indexOf('=') + 1, pt_pin.indexOf(';'));
  var pt_token = response.headers['set-cookie'][3];
  pt_token = pt_token.substring(
    pt_token.indexOf('=') + 1,
    pt_token.indexOf(';')
  );
  var pwdt_id = response.headers['set-cookie'][4];
  pwdt_id = pwdt_id.substring(pwdt_id.indexOf('=') + 1, pwdt_id.indexOf(';'));
  var s_key = response.headers['set-cookie'][5];
  s_key = s_key.substring(s_key.indexOf('=') + 1, s_key.indexOf(';'));
  var s_pin = response.headers['set-cookie'][6];
  s_pin = s_pin.substring(s_pin.indexOf('=') + 1, s_pin.indexOf(';'));
  cookies =
    'TrackerID=' +
    TrackerID +
    '; pt_key=' +
    pt_key +
    '; pt_pin=' +
    pt_pin +
    '; pt_token=' +
    pt_token +
    '; pwdt_id=' +
    pwdt_id +
    '; s_key=' +
    s_key +
    '; s_pin=' +
    s_pin +
    '; wq_skey=';
  var userCookie = 'pt_key=' + pt_key + ';pt_pin=' + pt_pin + ';';

  console.log('\n############  ???????????????????????? Cookie  #############\n\n');
  console.log('Cookie1="' + userCookie + '"\n');
  console.log('\n####################################################\n\n');
  return userCookie;
}

async function step1() {
  try {
    s_token, cookies, guid, lsid, lstoken, okl_token, (token = '');
    let timeStamp = new Date().getTime();
    let url =
      'https://plogin.m.jd.com/cgi-bin/mm/new_login_entrance?lang=chs&appid=300&returnurl=https://wq.jd.com/passport/LoginRedirect?state=' +
      timeStamp +
      '&returnurl=https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action&source=wq_passport';
    const response = await got(url, {
      responseType: 'json',
      headers: {
        Connection: 'Keep-Alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'zh-cn',
        Referer:
          'https://plogin.m.jd.com/login/login?appid=300&returnurl=https://wq.jd.com/passport/LoginRedirect?state=' +
          timeStamp +
          '&returnurl=https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action&source=wq_passport',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
        Host: 'plogin.m.jd.com',
      },
    });

    praseSetCookies(response);
  } catch (error) {
    cookies = '';
    console.log(error.response.body);
  }
}

async function step2() {
  try {
    if (cookies == '') {
      return 0;
    }
    let timeStamp = new Date().getTime();
    let url =
      'https://plogin.m.jd.com/cgi-bin/m/tmauthreflogurl?s_token=' +
      s_token +
      '&v=' +
      timeStamp +
      '&remember=true';
    const response = await got.post(url, {
      responseType: 'json',
      json: {
        lang: 'chs',
        appid: 300,
        returnurl:
          'https://wqlogin2.jd.com/passport/LoginRedirect?state=' +
          timeStamp +
          '&returnurl=//home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action',
        source: 'wq_passport',
      },
      headers: {
        Connection: 'Keep-Alive',
        'Content-Type': 'application/x-www-form-urlencoded; Charset=UTF-8',
        Accept: 'application/json, text/plain, */*',
        Cookie: cookies,
        Referer:
          'https://plogin.m.jd.com/login/login?appid=300&returnurl=https://wqlogin2.jd.com/passport/LoginRedirect?state=' +
          timeStamp +
          '&returnurl=//home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action&source=wq_passport',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
        Host: 'plogin.m.jd.com',
      },
    });
    token = response.body.token;
    okl_token = response.headers['set-cookie'][0];
    okl_token = okl_token.substring(
      okl_token.indexOf('=') + 1,
      okl_token.indexOf(';')
    );
    var qrUrl =
      'https://plogin.m.jd.com/cgi-bin/m/tmauth?appid=300&client_type=m&token=' +
      token;
    return qrUrl;
  } catch (error) {
    console.log(error.response.body);
    return 0;
  }
}

var i = 0;

async function checkLogin() {
  try {
    if (cookies == '') {
      return 0;
    }
    let timeStamp = new Date().getTime();
    let url =
      'https://plogin.m.jd.com/cgi-bin/m/tmauthchecktoken?&token=' +
      token +
      '&ou_state=0&okl_token=' +
      okl_token;
    const response = await got.post(url, {
      responseType: 'json',
      form: {
        lang: 'chs',
        appid: 300,
        returnurl:
          'https://wqlogin2.jd.com/passport/LoginRedirect?state=1100399130787&returnurl=//home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action',
        source: 'wq_passport',
      },
      headers: {
        Referer:
          'https://plogin.m.jd.com/login/login?appid=300&returnurl=https://wqlogin2.jd.com/passport/LoginRedirect?state=' +
          timeStamp +
          '&returnurl=//home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&/myJd/home.action&source=wq_passport',
        Cookie: cookies,
        Connection: 'Keep-Alive',
        'Content-Type': 'application/x-www-form-urlencoded; Charset=UTF-8',
        Accept: 'application/json, text/plain, */*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
      },
    });

    return response;
  } catch (error) {
    console.log(error.response.body);
    let res = {};
    res.body = { check_ip: 0, errcode: 222, message: '??????' };
    res.headers = {};
    return res;
  }
}

async function sendMsg(msg) {
  try {
    if (process.env.QYWX_KEY) {
      let url = `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${process.env.QYWX_KEY}`;
      const response = await got.post(url, {
        responseType: 'json',
        json: {
          msgtype: 'text',
          text: {
            content: `???${new Date()}??? ?????????Cookies???\n============\n${msg}`,
          },
        },
      });
    } else {
      console.log('??????????????????????????????Key??????????????????');
    }
  } catch (error) {
    console.log(error.response.body);
  }
}

/**
 * ?????????????????????
 */

app.get('/qrcode', function (request, response) {
  (async () => {
    try {
      await step1();
      const qrurl = await step2();
      if (qrurl != 0) {
        response.send({ err: 0, qrcode: qrurl });
      } else {
        response.send({ err: 1, msg: '??????' });
      }
    } catch (err) {
      response.send({ err: 1, msg: err });
    }
  })();
});

/**
 * ???????????????cookie??????
 */

app.get('/cookie', function (request, response) {
  if (cookies != '') {
    (async () => {
      try {
        const cookie = await checkLogin();
        if (cookie.body.errcode == 0) {
          let ucookie = getCookie(cookie);
          // ??????????????????
          await sendMsg(ucookie);
          response.send({ err: 0, cookie: ucookie });
        } else {
          response.send({ err: cookie.body.errcode, msg: cookie.body.message });
        }
      } catch (err) {
        response.send({ err: 1, msg: err });
      }
    })();
  } else {
    response.send({ err: 1, msg: loginFaild });
  }
});

app.listen(6789, () => {
  console.log('?????????????????? 6789 ??????!');
});
