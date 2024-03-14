var express = require('express');
var router = express.Router();

var connection = require('../config/database.js');
const Model_Dpi = require('../model/Model_Dpi.js');

router.get('/', async function(req, res, next) {
        let rows = await Model_Dpi.getAll();
        res.render('dpi/index', {
            data: rows
        })
});

router.get('/create', function(req, res, next) {
    res.render('dpi/create', {
    nama_dpi: '',
    luas: '',
    })
});

router.post("/store", async function (req, res, next) {
  try {
    let {nama_dpi, luas} = req.body;
    let Data = {
    nama_dpi, luas
    };
    await Model_Dpi.Store(Data);
    req.flash("success", "Berhasil menyimpan data");
    res.redirect("/dpi");
  } catch {
    req.flash("error", "gagal menyimpan data");
    res.redirect("/dpi");
  }
});

router.get('/edit/(:id)', async function(req, res, next){
    let id = req.params.id;
    let rows = await Model_Dpi.getId(id);
    res.render('dpi/edit', {
    id: rows[0].id_dpi,
    nama_dpi: rows[0].nama_dpi,
    luas: rows[0].luas,
    })
 });

router.post('/update/:id', async function(req, res, next) {
    try {
        let id = req.params.id;
        let {nama_dpi, luas} = req.body;
        let Data = { 
        nama_dpi, luas
        };

        await Model_Dpi.Update(id, Data);
        req.flash('Success', 'Berhasil menyimpan data');
        res.redirect('/dpi')
    } catch (err) {
        req.flash('error', 'Terjadi kesalahan pada fungsi');
        res.redirect('/dpi');
    }
});

router.get('/delete/(:id)', async function(req, res) {
    let id = req.params.id;
    await Model_Dpi.Delete(id);
    req.flash('Success', 'berhasil menghapus data');
    res.redirect('/dpi')
});



module.exports = router;