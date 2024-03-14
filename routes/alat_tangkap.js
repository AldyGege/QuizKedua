var express = require('express');
var router = express.Router();

var connection = require('../config/database.js');
const Model_Alat_Tangkap = require('../model/Model_Alat_Tangkap.js');

router.get('/', async function(req, res, next) {
        let rows = await Model_Alat_Tangkap.getAll();
        res.render('alat_tangkap/index', {
            data: rows
        })
});

router.get('/create', function(req, res, next) {
    res.render('alat_tangkap/create', {
    nama_alat_tangkap: '',
    })
});

router.post("/store", async function (req, res, next) {
  try {
    let {nama_alat_tangkap} = req.body;
    let Data = {
    nama_alat_tangkap
    };
    await Model_Alat_Tangkap.Store(Data);
    req.flash("success", "Berhasil menyimpan data");
    res.redirect("/alat_tangkap");
  } catch {
    req.flash("error", "gagal menyimpan data");
    res.redirect("/alat_tangkap");
  }
});

router.get('/edit/(:id)', async function(req, res, next){
    let id = req.params.id;
    let rows = await Model_Alat_Tangkap.getId(id);
    res.render('alat_tangkap/edit', {
    id: rows[0].id_alat_tangkap,
    nama_alat_tangkap: rows[0].nama_alat_tangkap,
    })
 });

router.post('/update/:id', async function(req, res, next) {
    try {
        let id = req.params.id;
        let {nama_alat_tangkap} = req.body;
        let Data = { 
        nama_alat_tangkap
        };

        await Model_Alat_Tangkap.Update(id, Data);
        req.flash('Success', 'Berhasil menyimpan data');
        res.redirect('/alat_tangkap')
    } catch (err) {
        req.flash('error', 'Terjadi kesalahan pada fungsi');
        res.redirect('/alat_tangkap');
    }
});

router.get('/delete/(:id)', async function(req, res) {
    let id = req.params.id;
    await Model_Alat_Tangkap.Delete(id);
    req.flash('Success', 'berhasil menghapus data');
    res.redirect('/alat_tangkap')
});



module.exports = router;