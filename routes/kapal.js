var express = require('express');
var router = express.Router();

var connection = require('../config/database.js');
const Model_Kapal = require('../model/Model_Kapal.js');
const Model_Dpi = require('../model/Model_Dpi.js');
const Model_Alat_Tangkap = require('../model/Model_Alat_Tangkap.js');
const Model_Pemilik = require('../model/Model_Pemilik.js');
const Model_Mahasiswa = require('../model/Model_Mahasiswa.js');

router.get('/', async function(req, res, next) {
        let rows = await Model_Kapal.getAll();
        res.render('kapal/index', {
            data: rows
        })
});

router.get('/create', async function (req, res, next) {
    let rows = await Model_Mahasiswa.getAll();
    res.render('kapal/create', {
        nama_kapal: '',
        id_pemilik: '',
        id_dpi: '',
        id_alat_tangkap: '',
        data: rows
    })
})

router.post("/store", async function (req, res, next) {
  try {
    let { nama_kapal, id_dpi, id_alat_tangkap, id_pemilik} = req.body;
    let Data = {
        nama_kapal, id_dpi, id_alat_tangkap, id_pemilik
    };
    await Model_Kapal.Store(Data);
    req.flash("success", "Berhasil menyimpan data");
    res.redirect("/kapal");
  } catch {
    req.flash("error", "gagal menyimpan data");
    res.redirect("/kapal");
  }
});

router.get('/edit/(:id)', async function (req, res, next) {
    let id = req.params.id;
    let pemilik = await Model_Pemilik.getAll();
    let dpi = await Model_Dpi.getAll();
    let alat = await Model_Alat_Tangkap.getAll();
    let rows = await Model_Kapal.getId(id);
    res.render('kapal/edit', {
        id: rows[0].id_kapal,
        nama_kapal: rows[0].nama_kapal,
        id_alat_tangkap: rows[0].id_alat_tangkap,
        data: alat,
        id_dpi: rows[0].id_dpi,
        data: dpi,
        id_pemilik: rows[0].id_pemilik,
        data: pemilik,
    })
})

router.post('/update/:id', async function(req, res, next) {
    try {
        let id = req.params.id;
        let { nama_kapal, id_dpi, id_alat_tangkap, id_pemilik } = req.body;
        let Data = { 
        nama_kapal, id_dpi, id_alat_tangkap, id_pemilik
        };

        await Model_Kapal.Update(id, Data);
        req.flash('Success', 'Berhasil menyimpan data');
        res.redirect('/kapal')
    } catch (err) {
        req.flash('error', 'Terjadi kesalahan pada fungsi');
        res.redirect('/kapal');
    }
});

router.get('/delete/(:id)', async function(req, res) {
    let id = req.params.id;
    await Model_Kapal.Delete(id);
    req.flash('Success', 'berhasil menghapus data');
    res.redirect('/kapal')
});



module.exports = router;