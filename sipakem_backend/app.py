from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import config
import re
import os
from werkzeug.utils import secure_filename
from flask import send_from_directory

app = Flask(__name__)
CORS(app)

app.config['MYSQL_HOST'] = config.MYSQL_HOST
app.config['MYSQL_USER'] = config.MYSQL_USER
app.config['MYSQL_PASSWORD'] = config.MYSQL_PASSWORD
app.config['MYSQL_DB'] = config.MYSQL_DB
app.config['MYSQL_PORT'] = config.MYSQL_PORT

mysql = MySQL(app)

def log_aktivitas(admin_id, aktivitas):
    try:
        cur = mysql.connection.cursor()
        cur.execute("""
            INSERT INTO aktivitas_admin (admin_id, aktivitas)
            VALUES (%s, %s)
        """, (admin_id, aktivitas))
        mysql.connection.commit()
        cur.close()
    except Exception as e:
        print("Log aktivitas error:", e)

UPLOAD_FOLDER = 'static/profile'

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# register
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        nama_pengguna = data.get('nama') 
        tanggal_lahir = data.get('tanggal_lahir')
        jenis_kelamin = data.get('jenis_kelamin')
        no_hp = data.get('no_hp')
        email = data.get('email')

        valid_domains = [
            "gmail.com",
            "yahoo.com",
            "outlook.com",
            "hotmail.com"
        ]

        email_domain = email.split("@")[-1]

        if email_domain not in valid_domains:
            return jsonify({
                'message': 'Domain email tidak valid'
            }), 400
        password_raw = data.get('password')

        # Validasi sederhana agar tidak error saat query
        if not all([nama_pengguna, email, password_raw]):
            return jsonify({'message': 'Data tidak lengkap'}), 400

        password = generate_password_hash(password_raw)

        cur = mysql.connection.cursor()

        # cek email
        cur.execute("SELECT * FROM pengguna WHERE email=%s", (email,))
        if cur.fetchone():
            cur.close()
            return jsonify({'message': 'Email sudah digunakan'}), 400

        # insert data ke kolom sesuai gambar database kamu
        cur.execute(
            """
            INSERT INTO pengguna 
            (nama_pengguna, tanggal_lahir, jenis_kelamin, no_hp, email, password, role) 
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (nama_pengguna, tanggal_lahir, jenis_kelamin, no_hp, email, password, 'pengguna')
        )

        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Registrasi berhasil'}), 201

    except Exception as e:
        print(f"Error: {e}") # Muncul di terminal Flask kamu
        return jsonify({'message': f'Server Error: {str(e)}'}), 500

# LOGIN
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM pengguna WHERE email=%s", (email,))
        user = cur.fetchone()
        cur.close()

        if user:
            hashed_password = user[6]
            if check_password_hash(hashed_password, password):
                return jsonify({
                    'message': 'Login berhasil',
                    'user': {
                        'id_pengguna': user[0],
                        'nama_pengguna': user[1],
                        'tanggal_lahir': user[2],
                        'jenis_kelamin': user[3],
                        'no_hp': user[4],
                        'email': user[5],
                        'role': user[7],
                        'foto_profile': user[8]
                    }
                })

        return jsonify({'message': 'Email atau password salah'}), 401
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# TAMBAH GEJALA
@app.route('/gejala', methods=['POST'])
def tambah_gejala():
    data = request.get_json()

    kode = data.get('kode')
    nama = data.get('nama')
    admin_id = data.get('admin_id')

    cur = mysql.connection.cursor()

    cur.execute(
        "INSERT INTO gejala (kode_gejala, nama_gejala) VALUES (%s, %s)",
        (kode, nama)
    )

    mysql.connection.commit()
    cur.close()

    # log aktivitas admin
    if admin_id:
        log_aktivitas(admin_id, f"Menambahkan gejala {kode}")

    return jsonify({'message': 'Gejala berhasil ditambahkan'})

# semua gejala
@app.route('/gejala/all', methods=['GET'])
def get_all_gejala():

    cur = mysql.connection.cursor()

    cur.execute("SELECT * FROM gejala ORDER BY id DESC")

    data = cur.fetchall()

    hasil = []

    for item in data:
        hasil.append({
            'id': item[0],
            'kode': item[1],
            'nama': item[2]
        })

    cur.close()

    return jsonify(hasil)


@app.route('/gejala/<int:id>', methods=['GET'])
def get_gejala_by_id(id):

    cur = mysql.connection.cursor()

    cur.execute("""
        SELECT *
        FROM gejala
        WHERE id=%s
    """, (id,))

    data = cur.fetchone()

    cur.close()

    if data:
        return jsonify({
            'id': data[0],
            'kode': data[1],
            'nama': data[2]
        })

    return jsonify({
        'message': 'Gejala tidak ditemukan'
    }), 404

# update gejala
@app.route('/gejala/<int:id>', methods=['PUT'])
def update_gejala(id):
    data = request.get_json()

    kode = data.get('kode')
    nama = data.get('nama')
    admin_id = data.get('admin_id')

    cur = mysql.connection.cursor()

    cur.execute(
        """
        UPDATE gejala
        SET kode_gejala=%s,
            nama_gejala=%s
        WHERE id=%s
        """,
        (kode, nama, id)
    )

    mysql.connection.commit()
    cur.close()
    if admin_id:
        log_aktivitas(admin_id, f"Mengubah gejala {kode} (ID {id})")

    return jsonify({'message': 'Gejala berhasil diupdate'})

# hapus gejala
@app.route('/gejala/<int:id>', methods=['DELETE'])
def delete_gejala(id):
    
    data = request.get_json(silent=True) or {}
    admin_id = data.get('admin_id')

    cur = mysql.connection.cursor()

    cur.execute(
        "DELETE FROM gejala WHERE id=%s",
        (id,)
    )

    mysql.connection.commit()
    cur.close()
    if admin_id:
        log_aktivitas(admin_id, f"Menghapus gejala ID {id}")

    return jsonify({'message': 'Gejala berhasil dihapus'})

# TAMBAH DIAGNOSIS
@app.route('/diagnosis', methods=['POST'])
def tambah_diagnosis():
    data = request.get_json()

    kode = data.get('kode')
    nama = data.get('nama')
    deskripsi = data.get('deskripsi')
    admin_id = data.get('admin_id')

    cur = mysql.connection.cursor()

    cur.execute(
        """
        INSERT INTO diagnosis
        (kode_diagnosis, nama_diagnosis, deskripsi)
        VALUES (%s, %s, %s)
        """,
        (kode, nama, deskripsi)
    )

    mysql.connection.commit()
    cur.close()

    if admin_id:
        log_aktivitas(admin_id, f"Menambahkan diagnosis {kode}")

    return jsonify({'message': 'Diagnosis berhasil ditambahkan'})

# semua diagnosis
@app.route('/diagnosis/all', methods=['GET'])
def get_all_diagnosis():

    cur = mysql.connection.cursor()

    cur.execute("SELECT * FROM diagnosis ORDER BY id DESC")

    data = cur.fetchall()

    hasil = []

    for item in data:
        hasil.append({
            'id': item[0],
            'kode': item[1],
            'nama': item[2],
            'deskripsi': item[3]
        })

    cur.close()

    return jsonify(hasil)

# update dan hapus diagnosis
@app.route('/diagnosis/<int:id>', methods=['GET'])
def get_diagnosis_by_id(id):

    cur = mysql.connection.cursor()

    cur.execute("""
        SELECT *
        FROM diagnosis
        WHERE id=%s
    """, (id,))

    data = cur.fetchone()

    cur.close()

    if data:
        return jsonify({
            'id': data[0],
            'kode': data[1],
            'nama': data[2],
            'deskripsi': data[3]
        })

    return jsonify({
        'message': 'Diagnosis tidak ditemukan'
    }), 404

@app.route('/diagnosis/<int:id>', methods=['PUT'])
def update_diagnosis(id):
    data = request.get_json()

    kode = data.get('kode')
    nama = data.get('nama')
    deskripsi = data.get('deskripsi')
    admin_id = data.get('admin_id')

    cur = mysql.connection.cursor()

    cur.execute(
        """
        UPDATE diagnosis
        SET kode_diagnosis=%s,
            nama_diagnosis=%s,
            deskripsi=%s
        WHERE id=%s
        """,
        (kode, nama, deskripsi, id)
    )

    mysql.connection.commit()
    cur.close()

    if admin_id:
        log_aktivitas(admin_id, f"Mengubah diagnosis ID {id}")

    return jsonify({'message': 'Diagnosis berhasil diupdate'})

@app.route('/diagnosis/<int:id>', methods=['DELETE'])
def delete_diagnosis(id):

    data = request.get_json(silent=True) or {}
    admin_id = data.get('admin_id')

    cur = mysql.connection.cursor()

    cur.execute(
        "DELETE FROM diagnosis WHERE id=%s",
        (id,)
    )

    mysql.connection.commit()
    cur.close()

    if admin_id:
        log_aktivitas(admin_id, f"Menghapus diagnosis ID {id}")

    return jsonify({'message': 'Diagnosis berhasil dihapus'})

# TAMBAH REKOMENDASI
@app.route('/rekomendasi', methods=['POST'])
def tambah_rekomendasi():
    data = request.get_json()

    kode = data.get('kode')
    deskripsi = data.get('deskripsi')
    admin_id = data.get('admin_id')


    cur = mysql.connection.cursor()

    cur.execute(
        """
        INSERT INTO rekomendasi
        (kode_rekomendasi, deskripsi)
        VALUES (%s, %s)
        """,
        (kode, deskripsi)
    )

    mysql.connection.commit()
    cur.close()

    if admin_id:
        log_aktivitas(admin_id, f"Menambahkan rekomendasi {kode}")

    return jsonify({'message': 'Rekomendasi berhasil ditambahkan'})

# semua rekomendasi
@app.route('/rekomendasi/all', methods=['GET'])
def get_all_rekomendasi():

    cur = mysql.connection.cursor()

    cur.execute("SELECT * FROM rekomendasi ORDER BY id DESC")

    data = cur.fetchall()

    hasil = []

    for item in data:
        hasil.append({
            'id': item[0],
            'kode': item[1],
            'deskripsi': item[2]
        })

    cur.close()

    return jsonify(hasil)

# detail rekomendasi
@app.route('/rekomendasi/<int:id>', methods=['GET'])
def get_rekomendasi_by_id(id):

    cur = mysql.connection.cursor()

    cur.execute("""
        SELECT *
        FROM rekomendasi
        WHERE id=%s
    """, (id,))

    data = cur.fetchone()

    cur.close()

    if data:
        return jsonify({
            'id': data[0],
            'kode': data[1],
            'deskripsi': data[2]
        })

    return jsonify({
        'message': 'Rekomendasi tidak ditemukan'
    }), 404

#  update dan hapus rekomendsi
@app.route('/rekomendasi/<int:id>', methods=['PUT'])
def update_rekomendasi(id):
    data = request.get_json()

    kode = data.get('kode')
    deskripsi = data.get('deskripsi')
    admin_id = data.get('admin_id')

    cur = mysql.connection.cursor()

    cur.execute(
        """
        UPDATE rekomendasi
        SET kode_rekomendasi=%s,
            deskripsi=%s
        WHERE id=%s
        """,
        (kode, deskripsi, id)
    )

    mysql.connection.commit()
    cur.close()

    if admin_id: 
        log_aktivitas(admin_id, f"Mengubah rekomendasi {kode} (ID {id})")

    return jsonify({'message': 'Rekomendasi berhasil diupdate'})

@app.route('/rekomendasi/<int:id>', methods=['DELETE'])
def delete_rekomendasi(id):

    data = request.get_json(silent=True) or {}
    admin_id = data.get('admin_id')

    cur = mysql.connection.cursor()

    cur.execute(
        "DELETE FROM rekomendasi WHERE id=%s",
        (id,)
    )

    mysql.connection.commit()
    cur.close()

    if admin_id:
        log_aktivitas(admin_id, f"Menghapus rekomendai ID {id}")

    return jsonify({'message': 'Rekomendasi berhasil dihapus'})

# rule
@app.route('/rule', methods=['POST'])
def tambah_rule():

    data = request.get_json()

    diagnosis_id = data.get('diagnosis_id')
    rekomendasi_id = data.get('rekomendasi_id')
    gejala_ids = data.get('gejala_ids')
    admin_id = data.get('admin_id')

    cur = mysql.connection.cursor()

    # simpan rule utama
    cur.execute(
        """
        INSERT INTO rule
        (diagnosis_id, rekomendasi_id)
        VALUES (%s, %s)
        """,
        (diagnosis_id, rekomendasi_id)
    )

    mysql.connection.commit()

    rule_id = cur.lastrowid

    # simpan gejala-gejala rule
    for gejala_id in gejala_ids:

        cur.execute(
            """
            INSERT INTO rule_gejala
            (rule_id, gejala_id)
            VALUES (%s, %s)
            """,
            (rule_id, gejala_id)
        )

    mysql.connection.commit()

    cur.close()

    if admin_id:
        log_aktivitas(admin_id, f"Menambahkan rule ID {rule_id}")

    return jsonify({
        'message': 'Rule berhasil ditambahkan'
    })


# GET RULE
@app.route('/rule', methods=['GET'])
def get_rule():

    cur = mysql.connection.cursor()

    cur.execute("""
        SELECT
            rule.id,
            diagnosis.nama_diagnosis,
            rekomendasi.deskripsi,
            diagnosis.id,
            rekomendasi.id

        FROM rule

        JOIN diagnosis
        ON rule.diagnosis_id = diagnosis.id

        JOIN rekomendasi
        ON rule.rekomendasi_id = rekomendasi.id

        ORDER BY rule.id DESC
    """)

    rules = cur.fetchall()

    hasil = []

    for rule in rules:

        rule_id = rule[0]

        # ambil gejala
        cur.execute("""
            SELECT
                gejala.nama_gejala,
                gejala.id

            FROM rule_gejala

            JOIN gejala
            ON rule_gejala.gejala_id = gejala.id

            WHERE rule_gejala.rule_id=%s
        """, (rule_id,))

        gejala_data = cur.fetchall()

        gejala_list = []
        gejala_id_list = []

        for g in gejala_data:

            gejala_list.append(g[0])
            gejala_id_list.append(g[1])

        hasil.append({
            'id': rule[0],
            'diagnosis': rule[1],
            'rekomendasi': rule[2],
            'diagnosis_id': rule[3],
            'rekomendasi_id': rule[4],
            'gejala': gejala_list,
            'gejala_id': gejala_id_list
        })

    cur.close()

    return jsonify(hasil)

# DETAIL RULE
@app.route('/rule/<int:id>', methods=['GET'])
def get_rule_by_id(id):

    cur = mysql.connection.cursor()

    cur.execute("""
        SELECT
            rule.id,
            diagnosis_id,
            rekomendasi_id
        FROM rule
        WHERE rule.id=%s
    """, (id,))

    rule = cur.fetchone()

    if not rule:
        cur.close()

        return jsonify({
            'message': 'Rule tidak ditemukan'
        }), 404

    # ambil gejala rule
    cur.execute("""
        SELECT gejala_id
        FROM rule_gejala
        WHERE rule_id=%s
    """, (id,))

    gejala = cur.fetchall()

    gejala_ids = [g[0] for g in gejala]

    cur.close()

    return jsonify({
        'id': rule[0],
        'diagnosis_id': rule[1],
        'rekomendasi_id': rule[2],
        'gejala_ids': gejala_ids
    })

# UPDATE RULE
@app.route('/rule/<int:id>', methods=['PUT'])
def update_rule(id):

    data = request.get_json()

    diagnosis_id = data.get('diagnosis_id')
    rekomendasi_id = data.get('rekomendasi_id')
    gejala_ids = data.get('gejala_ids')
    admin_id = data.get('admin_id')

    cur = mysql.connection.cursor()

    # update rule utama
    cur.execute("""
        UPDATE rule
        SET diagnosis_id=%s,
            rekomendasi_id=%s
        WHERE id=%s
    """, (diagnosis_id, rekomendasi_id, id))

    # hapus gejala lama
    cur.execute("""
        DELETE FROM rule_gejala
        WHERE rule_id=%s
    """, (id,))

    # insert ulang gejala baru
    for gejala_id in gejala_ids:

        cur.execute("""
            INSERT INTO rule_gejala
            (rule_id, gejala_id)
            VALUES (%s, %s)
        """, (id, gejala_id))

    mysql.connection.commit()

    cur.close()

    if admin_id:
        log_aktivitas(admin_id, f"Mengubah rule ID {id}")

    return jsonify({
        'message': 'Rule berhasil diupdate'
    })


# DELETE RULE
@app.route('/rule/<int:id>', methods=['DELETE'])
def delete_rule(id):

    data = request.get_json(silent=True) or {}
    admin_id = data.get('admin_id')

    cur = mysql.connection.cursor()

    # hapus relasi gejala dulu
    cur.execute("""
        DELETE FROM rule_gejala
        WHERE rule_id=%s
    """, (id,))

    # hapus rule
    cur.execute("""
        DELETE FROM rule
        WHERE id=%s
    """, (id,))

    mysql.connection.commit()

    cur.close()

    if admin_id:
        log_aktivitas(admin_id, f"Menghapus rule ID {id}")

    return jsonify({
        'message': 'Rule berhasil dihapus'
    })

# API konsultasi (Forward Chaining + Persentase)
@app.route('/konsultasi', methods=['POST'])
def konsultasi():

    data = request.get_json()

    gejala_user = data.get('gejala')
    pengguna_id = data.get('pengguna_id')

    cur = mysql.connection.cursor()

    # ambil semua rule
    cur.execute("SELECT id FROM rule")
    rules = cur.fetchall()

    hasil_terbaik = None
    persen_tertinggi = 0

    for rule in rules:

        rule_id = rule[0]

        # ambil gejala rule
        cur.execute("""
            SELECT gejala_id
            FROM rule_gejala
            WHERE rule_id=%s
        """, (rule_id,))

        gejala_rule = cur.fetchall()

        gejala_rule_ids = [g[0] for g in gejala_rule]

        # hitung jumlah gejala cocok
        jumlah_cocok = 0

        for gejala in gejala_rule_ids:
            if gejala in gejala_user:
                jumlah_cocok += 1

        # hitung persentase
        persen = (
            jumlah_cocok / len(gejala_rule_ids)
        ) * 100

        # simpan hasil dengan persen tertinggi
        if persen > persen_tertinggi:

            persen_tertinggi = persen

            cur.execute("""
                SELECT
                    diagnosis.nama_diagnosis,
                    diagnosis.deskripsi,
                    rekomendasi.deskripsi

                FROM rule

                JOIN diagnosis
                ON rule.diagnosis_id = diagnosis.id

                JOIN rekomendasi
                ON rule.rekomendasi_id = rekomendasi.id

                WHERE rule.id=%s
            """, (rule_id,))

            hasil = cur.fetchone()

            hasil_terbaik = {
                'diagnosis': hasil[0],
                'deskripsi': hasil[1],
                'rekomendasi': hasil[2],
                'persen': round(persen, 2)
            }

    # JIKA ADA HASIL
    if hasil_terbaik:

        # SIMPAN RIWAYAT HANYA JIKA LOGIN
        if pengguna_id:

            cur.execute("""
                INSERT INTO riwayat_konsultasi
            (
                pengguna_id,
                diagnosis,
                deskripsi,
                rekomendasi,
                persen
            )

            VALUES (%s, %s, %s, %s, %s)
            """, (
                pengguna_id,
                hasil_terbaik['diagnosis'],
                hasil_terbaik['deskripsi'],
                hasil_terbaik['rekomendasi'],
                hasil_terbaik['persen']
            ))

            mysql.connection.commit()

        cur.close()

        return jsonify({
            'diagnosis': hasil_terbaik['diagnosis'],
            'deskripsi': hasil_terbaik['deskripsi'],
            'rekomendasi': hasil_terbaik['rekomendasi'],
            'persen': hasil_terbaik['persen'],
            'is_login': True if pengguna_id else False
        })

    cur.close()

    return jsonify({
        'message': 'Tidak ditemukan diagnosis'
    })

# RIWAYAT KONSULTASI
@app.route('/riwayat-konsultasi/<int:id>', methods=['GET'])
def get_riwayat_konsultasi(id):

    try:
        cur = mysql.connection.cursor()

        cur.execute("""
            SELECT
                id,
                diagnosis,
                deskripsi,
                rekomendasi,
                persen,
                created_at

            FROM riwayat_konsultasi

            WHERE pengguna_id=%s

            ORDER BY id DESC
        """, (id,))

        data = cur.fetchall()

        hasil = []

        for item in data:
            hasil.append({
                'id': item[0],
                'diagnosis': item[1],
                'deskripsi': item[2],
                'rekomendasi': item[3],
                'persen': item[4],
                'tanggal': item[5].strftime('%d %B %Y %H:%M')
            })

        cur.close()

        return jsonify(hasil)

    except Exception as e:
        return jsonify({
            'message': str(e)
        }), 500
    
# HAPUS RIWAYAT KONSULTASI
@app.route('/riwayat-konsultasi/<int:id>', methods=['DELETE'])
def delete_riwayat_konsultasi(id):

    try:
        cur = mysql.connection.cursor()

        cur.execute("""
            DELETE FROM riwayat_konsultasi
            WHERE id=%s
        """, (id,))

        mysql.connection.commit()

        cur.close()

        return jsonify({
            'message': 'Riwayat berhasil dihapus'
        })

    except Exception as e:
        return jsonify({
            'message': str(e)
        }), 500
    
# GET PROFILE
@app.route('/profile/<int:id>', methods=['GET'])
def get_profile(id):

    cur = mysql.connection.cursor()

    cur.execute("""
        SELECT
            id_pengguna,
            nama_pengguna,
            tanggal_lahir,
            jenis_kelamin,
            no_hp,
            email,
            role,
            foto_profile
        FROM pengguna
        WHERE id_pengguna=%s
    """, (id,))

    user = cur.fetchone()

    cur.close()

    if not user:
        return jsonify({
            'message': 'User tidak ditemukan'
        }), 404

    return jsonify({
        'id_pengguna': user[0],
        'nama_pengguna': user[1],
        'tanggal_lahir': user[2].strftime('%Y-%m-%d') if user[2] else '',
        'jenis_kelamin': user[3] if user[3] else '',
        'no_hp': user[4],
        'email': user[5],
        'role': user[6],
        'foto_profile': user[7]
    })

# UPDATE PROFILE
@app.route('/profile/<int:id>', methods=['PUT'])
def update_profile(id):

    try:
        data = request.get_json()

        nama_pengguna = data.get('nama_pengguna')
        email = data.get('email')
        tanggal_lahir = data.get('tanggal_lahir')
        jenis_kelamin = data.get('jenis_kelamin')
        no_hp = data.get('no_hp')
        foto_profile = data.get('foto_profile')

        cur = mysql.connection.cursor()

        # cek email dipakai user lain
        cur.execute("""
            SELECT id_pengguna
            FROM pengguna
            WHERE email=%s AND id_pengguna != %s
        """, (email, id))

        existing_user = cur.fetchone()

        if existing_user:
            cur.close()
            return jsonify({
                'message': 'Email sudah digunakan'
            }), 400

        cur.execute("""
            UPDATE pengguna
            SET
                nama_pengguna=%s,
                email=%s,
                tanggal_lahir=%s,
                jenis_kelamin=%s,
                no_hp=%s,
                foto_profile=%s
            WHERE id_pengguna=%s
        """, (
            nama_pengguna,
            email,
            tanggal_lahir,
            jenis_kelamin,
            no_hp,
            foto_profile,
            id
        ))

        mysql.connection.commit()

        cur.close()

        return jsonify({
            'message': 'Profil berhasil diperbarui'
        })

    except Exception as e:
        return jsonify({
            'message': str(e)
        }), 500

# UPLOAD FOTO PROFILE
@app.route('/upload-profile/<int:id>', methods=['POST'])
def upload_profile(id):

    try:

        if 'foto' not in request.files:
            return jsonify({
                'message': 'File tidak ditemukan'
            }), 400

        file = request.files['foto']

        if file.filename == '':
            return jsonify({
                'message': 'File kosong'
            }), 400

        filename = secure_filename(file.filename)

        # nama unik
        filename = f"user_{id}_{filename}"

        filepath = os.path.join(
            app.config['UPLOAD_FOLDER'],
            filename
        )

        file.save(filepath)

        foto_path = f"/static/profile/{filename}"

        cur = mysql.connection.cursor()

        cur.execute("""
            UPDATE pengguna
            SET foto_profile=%s
            WHERE id_pengguna=%s
        """, (foto_path, id))

        mysql.connection.commit()

        cur.close()

        return jsonify({
            'message': 'Foto berhasil diupload',
            'foto_profile': foto_path
        })

    except Exception as e:
        return jsonify({
            'message': str(e)
        }), 500
    
@app.route('/static/profile/<filename>')
def profile_file(filename):
    return send_from_directory(
        app.config['UPLOAD_FOLDER'],
        filename
    )

# HAPUS FOTO PROFILE
@app.route('/delete-profile-photo/<int:id>', methods=['DELETE'])
def delete_profile_photo(id):

    try:
        cur = mysql.connection.cursor()

        # ambil foto lama
        cur.execute("""
            SELECT foto_profile
            FROM pengguna
            WHERE id_pengguna=%s
        """, (id,))

        user = cur.fetchone()

        if not user:
            return jsonify({
                'message': 'User tidak ditemukan'
            }), 404

        foto_path = user[0]

        # hapus file fisik
        if foto_path:

            file_path = foto_path.replace('/static/profile/', '')

            full_path = os.path.join(
                app.config['UPLOAD_FOLDER'],
                file_path
            )

            if os.path.exists(full_path):
                os.remove(full_path)

        # update database
        cur.execute("""
            UPDATE pengguna
            SET foto_profile=NULL
            WHERE id_pengguna=%s
        """, (id,))

        mysql.connection.commit()

        cur.close()

        return jsonify({
            'message': 'Foto berhasil dihapus'
        })

    except Exception as e:
        return jsonify({
            'message': str(e)
        }), 500

# GANTI PASSWORD
@app.route('/change-password/<int:id>', methods=['PUT'])
def change_password(id):

    try:
        data = request.get_json()

        email = data.get('email')
        old_password = data.get('old_password')
        new_password = data.get('new_password')
        confirm_password = data.get('confirm_password')

        # validasi password baru
        if new_password != confirm_password:
            return jsonify({
                'message': 'Konfirmasi password tidak cocok'
            }), 400

        cur = mysql.connection.cursor()

        # ambil user
        cur.execute("""
            SELECT password
            FROM pengguna
            WHERE id_pengguna=%s AND email=%s
        """, (id, email))

        user = cur.fetchone()

        if not user:
            cur.close()
            return jsonify({
                'message': 'User tidak ditemukan'
            }), 404

        # cek password lama
        if not check_password_hash(user[0], old_password):
            cur.close()
            return jsonify({
                'message': 'Password lama salah'
            }), 400

        # hash password baru
        hashed_password = generate_password_hash(new_password)

        # update password
        cur.execute("""
            UPDATE pengguna
            SET password=%s
            WHERE id_pengguna=%s
        """, (hashed_password, id))

        mysql.connection.commit()

        cur.close()

        return jsonify({
            'message': 'Password berhasil diganti'
        })

    except Exception as e:
        return jsonify({
            'message': str(e)
        }), 500
    
# DASHBOARD ADMIN
@app.route('/dashboard-admin', methods=['GET'])
def dashboard_admin():

    try:
        cur = mysql.connection.cursor()

        # TOTAL DATA
        cur.execute("SELECT COUNT(*) FROM diagnosis")
        total_diagnosis = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM gejala")
        total_gejala = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM rekomendasi")
        total_rekomendasi = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM pengguna")
        total_pengguna = cur.fetchone()[0]

        # TOTAL RULE
        cur.execute("SELECT COUNT(*) FROM rule")
        total_rule = cur.fetchone()[0]

        # PIE CHART
        cur.execute("""
            SELECT
                diagnosis,
                COUNT(*) as total
            FROM riwayat_konsultasi
            GROUP BY diagnosis
            ORDER BY total DESC
            LIMIT 5
        """)

        diagnosis_chart = cur.fetchall()

        diagnosis_data = []

        for item in diagnosis_chart:
            diagnosis_data.append({
                "name": item[0],
                "value": item[1]
            })

        # AKTIVITAS TERBARU
        cur.execute("""
            SELECT aktivitas, created_at
            FROM aktivitas_admin
            ORDER BY id DESC
            LIMIT 10
        """)

        data = cur.fetchall()

        aktivitas = []

        for item in data:
            aktivitas.append({
                "aktivitas": item[0],
                "waktu": item[1].strftime("%d %b %H:%M") if item[1] else ""
            })

        # GRAFIK KONSULTASI
        cur.execute("""
            SELECT
                DATE(created_at) as tanggal,
                COUNT(*) as total
            FROM riwayat_konsultasi
            GROUP BY DATE(created_at)
            ORDER BY tanggal ASC
            LIMIT 7
        """)

        grafik = cur.fetchall()

        grafik_konsultasi = []

        for item in grafik:
            grafik_konsultasi.append({
                "tanggal": item[0].strftime("%d %b") if item[0] else "",
                "total": item[1]
            })

        cur.close()

        return jsonify({
            "total_diagnosis": total_diagnosis,
            "total_gejala": total_gejala,
            "total_rekomendasi": total_rekomendasi,
            "total_pengguna": total_pengguna,
            "total_rule": total_rule,
            "diagnosis_chart": diagnosis_data,
            "aktivitas": aktivitas,
            "grafik_konsultasi": grafik_konsultasi
        })

    except Exception as e:
        return jsonify({
            "message": str(e)
        }), 500
    
if __name__ == '__main__':
    app.run(debug=True)