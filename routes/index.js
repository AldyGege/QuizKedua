var express = require('express');
var router = express.Router();

const bcrypt = require('bcrypt');

var Model_Users = require('../model/Model_Users');
const e = require('express');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/register', function(req, res, next) {
  res.render('auth/register');
});
router.get('/login', function(req, res, next) {
  res.render('auth/login');
});

router.post('/saveusers', async (req, res) => {
  let { email, password } = req.body;
  try {
      let enkripsi = await bcrypt.hash(password, 10);
      let Data = {
          email,
          password: enkripsi
      };
      await Model_Users.Store(Data);
      req.flash('success', 'Berhasil Register!');
      res.redirect('/login');
  } catch (error) {
      console.error(error);
      req.flash('error', 'Gagal menyimpan pengguna');
      res.redirect('/register');
  }
});


router.post('/log', async (req, res) => {
    let {email, password } = req.body;
    try {
    let Data = await Model_Users.Login(email);
    if (Data.length > 0) {
      let enkripsi = Data[0].password;
      let cek = await bcrypt.compare(password, enkripsi);
      if (cek) {
        req.session.userId = Data[0].id_users;
        req.flash('success', 'Berhasil login!');
        res.redirect('/users');
      } else {
        req.flash('error', 'email atau password salah!');
        res.redirect('/login');
      }
    } else {
      req.flash('error', 'akun Tidak Ditemukan!');
      res.redirect('/login');
    }
  } catch (err) {
    res.redirect('/login');
    req.flash('error', 'error pada fungsi');
    console.log(err);
  }    
});

router.get('/logout', function (req, res) {
  req.session.destroy(function(err) {
    if(err) {
      console.error(err);
    } else {
      res.redirect('/login');
    }
  });
});



module.exports = router;