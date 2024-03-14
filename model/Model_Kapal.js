const connection = require('../config/database');

class Model_Kapal {

    static async getAll() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT kapal.id_kapal, kapal.nama_kapal,pemilik.id_pemilik, pemilik.nama_pemilik, dpi.id_dpi, dpi.nama_dpi, alat_tangkap.id_alat_tangkap, alat_tangkap.nama_alat_tangkap FROM kapal JOIN pemilik ON kapal.id_pemilik = pemilik.id_pemilik JOIN dpi ON kapal.id_dpi = dpi.id_dpi JOIN alat_tangkap ON kapal.id_alat_tangkap = alat_tangkap.id_alat_tangkap', (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
    static async Store(Data) {
        return new Promise((resolve, reject) => {
            connection.query('insert into kapal set ?', Data, function(err, result){
                if(err) {
                    reject(err);
                }else{
                    resolve(result);
                }
            });
        });
    }
    
    static async getId(id) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM kapal where id_kapal = ' + id, (err, rows) => {
                if(err) {
                    reject(err);
                }else {
                    resolve(rows);
                }
            });
        });
    }
    
    static async Update(id, Data) {
        return new Promise((resolve, reject) => {
            connection.query('update kapal set ? where id_kapal = ' + id, Data, function(err, result) {
                if(err) {
                    reject(err);
                }else {
                    resolve(result);
                }
            });
        });
    }
    
    
    static async Delete(id) {
        return new Promise((resolve, reject) => {
            connection.query('delete from kapal where id_kapal = ' + id, function(err, result) {
                if(err) {
                    reject(err);
                }else {
                    resolve(result);
                }
            });
        });
    }

}

module.exports = Model_Kapal;