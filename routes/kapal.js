var express = require("express");
var router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require('multer')
var connection = require("../config/database.js");
const Model_Kapal = require("../model/Model_Kapal.js");
const Model_Dpi = require("../model/Model_Dpi.js");
const Model_Alat_Tangkap = require("../model/Model_Alat_Tangkap.js");
const Model_Pemilik = require("../model/Model_Pemilik.js");
const Model_Users = require("../model/Model_Users.js");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/upload");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

router.get("/", async function (req, res, next) {
  try {
    let id = req.session.userId;
    let Data = await Model_Users.getId(id);
    if (Data.length > 0) {
      let rows = await Model_Kapal.getAll();
      res.render("kapal/index", {
        data: rows,
      });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    res.redirect("/login");
  }
});

router.get("/create", async function (req, res, next) {
  try {
    let pemilik = await Model_Pemilik.getAll();
    let dpi = await Model_Dpi.getAll();
    let alat = await Model_Alat_Tangkap.getAll();
    res.render("kapal/create", {
      nama_kapal: "",
      id_pemilik: "",
      id_dpi: "",
      id_alat_tangkap: "",
      data1: alat,
      data2: dpi,
      data3: pemilik,
    });
  } catch (error) {
    console.log(error); // Menampilkan pesan kesalahan ke konsol
    next(error); // Meneruskan kesalahan ke penanganan kesalahan berikutnya (jika ada)
  }
});


router.post(
  "/store",
  upload.single("foto_kapal"),
  async function (req, res, next) {
    try {
      let { nama_kapal, id_dpi, id_alat_tangkap, id_pemilik } = req.body;
      let Data = {
        nama_kapal,
        id_dpi,
        id_alat_tangkap,
        id_pemilik,
        foto_kapal: req.file.filename
      };
      await Model_Kapal.Store(Data);
      req.flash("success", "Berhasil menyimpan data");
      res.redirect("/kapal");
    } catch (error) {
      console.log(error); // Menampilkan pesan kesalahan ke konsol
      req.flash("error", "Gagal menyimpan data");
      res.redirect("/kapal");
    }
  }
);


router.get("/edit/(:id)", async function (req, res, next) {
  try {
    let id = req.params.id;
    let pemilik = await Model_Pemilik.getAll();
    let dpi = await Model_Dpi.getAll();
    let alat = await Model_Alat_Tangkap.getAll();
    let rows = await Model_Kapal.getId(id);
    
    // Periksa apakah ada data yang ditemukan untuk ID yang diberikan
    if (rows.length > 0) {
      res.render("kapal/edit", {
        id: rows[0].id_kapal,
        nama_kapal: rows[0].nama_kapal,
        foto_kapal: rows[0].foto_kapal,
        id_alat_tangkap: rows[0].id_alat_tangkap,
        data1: alat,
        id_dpi: rows[0].id_dpi,
        data2: dpi,
        id_pemilik: rows[0].id_pemilik,
        data3: pemilik,
      });
    } else {
      // Jika tidak ada data yang ditemukan, kembalikan respon 404
      res.status(404).send('Data not found');
    }
  } catch (error) {
    console.log(error); // Menampilkan pesan kesalahan ke konsol
    next(error); // Meneruskan kesalahan ke penanganan kesalahan berikutnya (jika ada)
  }
});

router.post("/update/:id", upload.single("foto_kapal"), async function (req, res, next) {
  try {
      let id = req.params.id;
      let filebaru = req.file ? req.file.filename : null;
      let rows = await Model_Kapal.getId(id);
      const namaFileLama = rows[0].foto_kapal;
      if (filebaru && namaFileLama) {
          const pathFileLama = path.join(__dirname, "../public/images/upload", namaFileLama);
          fs.unlinkSync(pathFileLama);
      }

      let { nama_kapal, id_dpi, id_alat_tangkap, id_pemilik } = req.body;
      let foto_kapal = filebaru || namaFileLama;
      let Data = {
          nama_kapal,
          id_dpi,
          id_alat_tangkap,
          id_pemilik,
          foto_kapal
      };

      await Model_Kapal.Update(id, Data);
      req.flash("Success", "Berhasil menyimpan data");
      res.redirect("/kapal");
  } catch (error) {
      console.log(error); // Menampilkan pesan kesalahan ke konsol
      req.flash("error", "Terjadi kesalahan pada fungsi");
      res.redirect("/kapal");
  }
});



router.get("/delete/(:id)", async function (req, res) {
  let id = req.params.id;
  let rows = await Model_Kapal.getId(id)
  const namaFileLama = rows[0].foto_kapal;
  if(namaFileLama){
    const pathFileLama = path.join(__dirname, '../public/images/upload', namaFileLama);
    fs.unlinkSync(pathFileLama);
  }
  await Model_Kapal.Delete(id);
  req.flash("Success", "berhasil menghapus data");
  res.redirect("/kapal");
});

module.exports = router;
