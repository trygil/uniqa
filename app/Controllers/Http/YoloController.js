'use strict'

const Database = use('Database');
const Post = use('App/Models/Post');
const Tag = use('App/Models/Tag')
const User = use('App/Models/User');

var moment = require("moment");

let data = [
    {
        title: "Tanggal pengumpulan tugas KWU?",
        post: "Kapan ya pengumpulan tugas paper terakhir?",
        tags: ["Tugas", "KWU", "Kewirausahaan"],
        answers: [
            {
                post: "Setau saya tanggal 23 Juni terakhir",
            },
            {
                post: "Maksimal pengiriman 23 Juni, dikirim via email ke unikom1@email.unikom.ac.id",
            },
        ],
    },
    {
        title: "Perwalian",
        post: "Kapan mulai perwalian untuk semester 6 angkatan 2015 ?",
        tags: ["Perwalian", "2015"],
        answers: [
            {
                post: "Untuk informasi perwalian bisa diakses di akun FB Unikom https://web.facebook.com/pg/Teknik-Informatika-UNIKOM-Bandung-165292613289/posts/?ref=page_internal",
            },
        ],
    },
    {
        title: "Pendaftaran Belogix",
        post: "Untuk pendaftaran Bilogix untuk semester 6 mulai pendaftarannya kapan?",
        tags: ["Belogix", "Pendaftaran"],
        answers: [
            {
                post: "Perpanjangan pendaftaran peserta Belogix, disampaikan untuk semua mahasiswa mulai dari semester 6 yang ingin mengikuti pelatihan Be-Logix, pendaftaran peserta diperpanjang sampai dengan tanggal 14 Juli 2018. Pendaftaran dilakukan setiap hari Selasa, Kamis dan Sabtu jam 8.00 - 12.00. Pendaftaran dapat diwakilkan dengan membawa foto copy KTM dari mahasiswa yang akan diwakilkan.",
            },
        ],
    },
    {
        title: "Belogix",
        post: "Kalo pendaftaran belogix bisa diwakilkan tidak ya? karena saya berhalangan hadir",
        tags: ["Belogix", "Pendaftaran"],
        answers: [
            {
                post: "Bisa.Pendaftaran dapat diwakilkan dengan membawa foto copy KTM dari mahasiswa yang akan diwakilkan.",
            },
            {
                post: "Bisa saja dengan bawa foto copy KTM",
            },
        ],
    },
    {
        title: "Pengambilan Sertifikat Belogix",
        post: "Kapan pengambilan sertifikat Belogix?",
        tags: ["Belogix"],
        answers: [
            {
                post: "Pengambilan sertifikat mulai 30 juni - 11 juli 2018",
            },
            {
                post: "Buat pengambilan dari hari sabtu tgl 30 juni sampe selasa 12 juli",
            },
            {
                post: "Pengambilan sertifikat Belogix dapat dilakukan mulai besok Sabtu tanggal 30 Juni 2018 sampai 12 Juli 2018 setiap hari Selasa, Kamis dan Sabtu jam 8.00 - 12.00. Pengambilan sertifikat dapat diwakilkan.",
            },
        ],
    },
    {
        title: "Waktu pendaftaran belogix",
        post: "Jam berapa dan hari apa pendaftaran Belogix?",
        tags: ["Belogix", "Pendaftaran"],
        answers: [
            {
                post: "Pendaftaran belogix di perpanjang sampai 14 juli 2018",
            },
            {
                post: "Pendaftaran dilakukan setiap hari Selasa, Kamis dan Sabtu jam 8.00 - 12.00.",
            },
            {
                post: "Diperpanjang sampe tgl 14 juli 2018 cuman pada hari tertentu dari Selasa, Kamis, Sabtu. Kalo gak salah",
            },
        ],
    },
    {
        title: "Panggilan CD kerja praktek",
        post: "Tolong informasinya, untuk waktu dan tempat perbaikan laporan CD yang bermasalah kemana ya?",
        tags: ["Kerja praktek", "CD", "Kelompok", "Siswa"],
        answers: [
            {
                post: "Langsung saja ke prody ke Pak Roby",
            },
            {
                post: "Ke Pak Roby di Prodi, paling lambat hari Kamis Tanggal 28 Juni 2018 Pukul 12.00. (dapar diwakilkan oleh perwakilan kelompok)",
            },
        ],
    },
    {
        title: "Sertifikat TOEFL",
        post: "Pengambilan sertifikat toefl mulai bisa di ambil mulai kapan ya?",
        tags: ["toefl", "sertifikat"],
        answers: [
            {
                post: "untuk gelombang 1 sudah lewat, jika untuk gelombang 2 tgl 25-26 mei 2018",
            },
            {
                post: `Sertifikat hasil score tes TOEFL Gel.2 (25-26 Mei 2018) sudah dapat diambil di Ibu Gentisya Tri Mardiani di ruang dosen IF, pada:
Sabtu, tanggal 2 Juni 2018
Jumat, tanggal 8 Juni 2018
Sabtu, tanggal 9 Juni 2018
jam 08.00-11.00`,
            },
        ],
    },
    {
        title: "Sertifikat TOEFL",
        post: "Untuk pengambilan sertifikat toefl bisa diwakilkan gak ya? soalnya saya lagi di luar kota",
        tags: ["toefl", "sertifikat"],
        answers: [
            {
                post: "Bisa diwakilkan, kalo misal dari gelombang sebelumnya belum di ambil bisa diambil pada hari itu juga",
            },
            {
                post: `Bisa. diambilnya pas hari-hari ini aja Sabtu, tanggal 2 Juni 2018
Jumat, tanggal 8 Juni 2018
Sabtu, tanggal 9 Juni 2018
jam 08.00-11.00`,
            },
        ],
    },
    {
        title: "Pendaftaran TOEFL",
        post: "Untuk pendaftaran toefl tahun ini mulai kapan ya?",
        tags: ["toefl", "pendaftaran"],
        answers: [
            {
                post: "Pendaftaran Tes TOEFL Gelombang 3 (Gelombang terakhir) Semester Genap 2017/2018 dibuka mulai tanggal 26 Mei 2018 sampai tanggal 7 Juli 2018",
            },
        ],
    },
    {
        title: "Persyaratan pendaftaran TOEFL",
        post: "Persyaratan untuk pendaftaran TOEFL apa saja? mohon info lengkapnya",
        tags: ["toefl", "pendaftaran"],
        answers: [
            {
                post: `Biaya Pendaftaran untuk tes ToEFL sebesar Rp.55.000.
Pembayaran dilakukan pada saat mendaftar.

Pendaftaran dapat dilakukan melalui Ibu Gentisya Tri Mardiani di ruang dosen IF, lantai 6 ruang 6014, pada:

Sabtu 26 Mei 2018, jam 08.00-11.00
Sabtu 2, 9, 30 Juni 2018, jam 08.00-11.00
Sabtu 7 Juli 2018, jam 08.00-11.00

Peserta yang mendaftar wajib membawa pas foto berwarna 2x3.

Pelaksanaan Tes akan dilakukan pada 13-14 Juli 2018 (sesuai sesi yang dipilih pada saat mendaftar).

Setelah tes, peserta akan mendapatkan sertifikat yang dapat digunakan sebagai syarat skripsi.`,
            },
        ],
    },
    {
        title: "Informasi beasiswa",
        post: "Mohon info, untuk info dan pendaftaran beasiswa unikom di mana ya?",
        tags: ["informasi", "beasiswa"],
        answers: [
            {
                post: "Bisa diakses ke halaman FB setiap jurusan",
            },
            {
                post: "Buka aja web resmi unikom nya. https://unikom.ac.id/berita/pembukaan-pendaftaran-beasiswa-ta-20182019-bagi-mahasiswa-unikom",
            },
        ],
    },
    {
        title: "Kepastian Kuliah pada tanggal 27 Juni (Event Pilkada)",
        post: "Untuk tanggal 27 Juni apakah Unikom di liburkan?",
        tags: ["informasi", "pilkada", "27", "juni", "libur"],
        answers: [
            {
                post: "Iya, UNIKOM diliburkan sesuai dengan peraturan daerah",
            },
        ],
    },
    {
        title: "Informasi Masuk Kuliah setelah libur lebaran",
        post: "Minta infonya perihal masuk kuliah setelah libur lebaran, apakah tanggal 18 atau 25?",
        tags: ["lebaran", "libur", "idul", "fitri"],
        answers: [
            {
                post: "Unikom masuk kembali seperti biasa tanggal 25 Juni",
            },
        ],
    },
    {
        title: "Informasi Festival Olahraga",
        post: "Selamat sore, apakah ada yang tau di lombakan Olahraga apa saja?",
        tags: ["FORSMA", "unikom", "olahraga", "festival"],
        answers: [
            {
                post: "Untuk Olahraganya ada lomba Volly, Sepak Bola, Basket dan Futsal",
            },
        ],
    },
    {
        title: "informasi perubahan nilai",
        post: "selamat pagi , apabila saya ingin memperbaiki nilai harus menghadap kemana ya ? ",
        tags: ["informasi", "nilai"],
        answers: [
            {
                post: "setau saya ke dosen yang bersangkutan ,  tapi setau saya kita harus menghadap ke dosen wali setelah dosen wali kita menghadap ke bagian tatausaha",
            },
        ],
    },
    {
        title: "informasi dosen ",
        post: "minta informasinya perihal ruangan dan kelas mana saja dosen Wali if karyawan mengajar?",
        tags: ["informasi", "dosen","unikom"],
        answers: [
            {
                post: "setau saya dosen wali IF karyawan bapak alif menfajar RPL2 tapi saya kurang tau untuk ruang mengajarnya ",
            },
        ],
    },
    {
        title: "Harga Tiket \"RAMADHAN BERBAGI\"",
        post: "Ada yang tau harga tiket di acara \"Ramadhan berbagi\" berapa ya?",
        tags: ["harga", "tiket", "ramadhan", "berbagi"],
        answers: [
            {
                post: `untuk event ramadhan berbagai ada beberapa macam jenis tiket,                 PRESALE 1 (50 peserta)
=> 10k
PRESALE (100 peserta)
=> 15k
OTS (20 Peserta)
=> 20k`,
            },
        ],
    },
    {
        title: "informasi situs ",
        post: "apa saja link situs aktif unikom ?",
        tags: ["informasi", "situs", "aktif"],
        answers: [
            {
                post: "hampir semua situs unikom aktif seperti  www.unikom.ac.id / www.perwalian.unikom.ac.id ada juga dan ada juga situs kuliah onlinenya ",
            },
        ],
    },
    {
        title: "Informasi UAS ",
        post: "kapan Tanggal dilaksanakannya UAS? ",
        tags: ["UAS", "UTS", "Informasi"],
        answers: [
            {
                post: "untuk UAS terhitung mulai pada tanggal 17 juli 2018 ",
            },
        ],
    },
    {
        title: "Informasi Auto debet",
        post: "Kapan Tanggal jatuh tempo pembayaran untuk AUTO DEBET ? ",
        tags: ["Informasi", "AutoDebet"],
        answers: [
            {
                post: "untuk penarikan autodebet untuk semester ini kemungkinan bulan agustus tapi saya kurang tau untuk tanggalnya ",
            },
        ],
    },
    {
        title: "Jam Berapa acara Seminar Kewirausahaan UPBM",
        post: "Acara Seminar Kewirausahaan yang di adakan sama UPBM itu dimulai jam berapa ya guys?",
        tags: ["UPBM", "Seminar", "kewirausahaan"],
        answers: [
            {
                post: "setahu saya di mulai pukul 10 pagi sampai pukul 3 sore ",
            },
        ],
    },
    {
        title: "Fasilitas",
        post: "Jenis Fasilitas apa saja yang dimiliki UNIKOM ? ",
        tags: ["informasi", "fasilitas"],
        answers: [
            {
                post: "setahu saya fasilitas yang ada di sini ada wc,lab kom ,kantin dan masih banyak lagi",
            },
        ],
    },
    {
        title: "Email Pengiriman Paper KWU",
        post: "untuk tiap jurusan kan pengiriman ke emailnya beda2, untuk prodi IF kirim ke email yang mana ya ?",
        tags: ["Paper", "tugas", "kwu"],
        answers: [
            {
                post: "unikom1@email.ac.id",
            },
        ],
    },
    {
        title: "Nomor Dosen Pa Ghani",
        post: "Assalamualaikum, ada yang punya nomor pa Ghani? Flashdisk saya ketinggalan di pak ghani",
        tags: ["dosen", "ghani", "nomor", "telepon"],
        answers: [
            {
                post: "saya ada kang, nanti saya kirim via chat personal",
            },
        ],
    },
    {
        title: "Info Komunitas Photograpy Unikom",
        post: "Selamat siang, saya mahasiswa IF Unikom, baru masuk tahun ini, apakah Unikom memiliki komunitas atau klub photograpy? kalo ada saya minat gabung hehe",
        tags: ["komunitas", "unikom", "photograpy", "photo", "klub"],
        answers: [

        ],
    },
    {
        title: "Tugas Paper KWU",
        post: "Kang yang masuk kelas KWU , untuk tema dari tugas papernya apa ya? apakah kita bisa menentukan tema sendiri atau ada ketentuannya?",
        tags: ["Paper", "tugas", "kwu", "tema"],
        answers: [

        ],
    },
    {
        title: "Tanya Hari Libur",
        post: "Cuy ikut nanya, untuk libur semester kapan ya?",
        tags: ["Tanya", "Libur", "Semester"],
        answers: [
            {
                post: "Semester berapa dulu ini?",
            },
            {
                post: "Hari terakhir perkuliahan tgl 14-15 juli 2018",
            },
            {
                post: "Hari terakhir perkuliahan tgl 14-15 juli, minggu tenang 16-22 juli, uas 23 juli - 05 agustus2018",
            },
        ],
    },
    {
        title: "Minggu tenang",
        post: "Untuk minggu tenang bulan juli 2018 tgl berapa ya?",
        tags: ["minggu", "tenang", "libur"],
        answers: [
            {
                post: "buka aja webnya cuy",
            },
            {
                post: "minggu tenang 16-22 juli ",
            },
            {
                post: "yaelah tugas numpuk cuy percuma libur juga. lol",
            },
        ],
    },
    {
        title: "uas",
        post: "jadwal UAS kapan untuk ta 2017/2018?",
        tags: ["uas", "jadwal"],
        answers: [
            {
                post: "stres nih udah liat pertanyaan ginian -_-",
            },
            {
                post: "uas 23-05 agustus 2018 ta. 2017/2018",
            },
            {
                post: "udah uas lagi aja nih maaa",
            },
        ],
    },
    {
        title: "pameran",
        post: "Assalamu'alaikum. Mau tanya kak, kalo pameran \"Majang Kawani\" prodi dkv kapan mulainya ya? Nuhun",
        tags: ["pameran", "tanya", "dkv"],
        answers: [
            {
                post: "waalaikumussalam teteh :*",
            },
            {
                post: "untuk acara itu dari tgl 26 feb - 03 maret kak",
            },
            {
                post: "udeh kelewat lama keles",
            },
        ],
    },
    {
        title: "seminar",
        post: "kapan ya seminar Talkshow: Menulis dan Gejolak Muda Remaja Millenial ?",
        tags: ["seminar", "hima", "talkshow"],
        answers: [
            {
                post: "untuk seminar ini hari Jum'at, 29 Juni 2018",
            },
        ],
    },
    {
        title: "Talkshow",
        post: "Pengen tanya dong, kalo Talkshow: Menulis dan Gejolak Muda Remaja Millenial itu berbayar gak ya? Kalo berbayar berapa tuh htm nya?",
        tags: ["seminar", "hima", "talkshow"],
        answers: [
            {
                post: `IDR : 35k (Lomba Menulis Fiksi Mini dan Pertunjukan seni) 
50K (Talkshow & 
Pertunjukan Seni)
70K (Talkshow, Pertunjukan Seni, Lomba Menulis Fiksi Mini)`,
            },
            {
                post: `"Talkshow: Menulis dan Gejolak Muda Remaja Millenial" 
Bersama Leila S. Chudori (Penulis buku "Pulang" dan "Laut bercerita")

Hari/Tanggal : Jum'at, 29 Juni 2018
Tempat : Auditorium Miracle, UNIKOM

IDR : 35k (Lomba Menulis Fiksi Mini dan Pertunjukan seni) 
50K (Talkshow & 
Pertunjukan Seni)
70K (Talkshow, Pertunjukan Seni, Lomba Menulis Fiksi Mini)

Selain Talkshow dan Meet and Greet, kalian juga akan disuguhkan berbagai pertunjukan seni serta berkesempatan untuk mendapatkan berbagai Merchandise menarik loh. So, jangan sampai ketinggalan yah ! (Limited Seat). info lengkap langsung cek fanspage hima nya aja kak`,
            },
        ],
    },
    {
        title: "Sumbangan donasi",
        post: "Mau info dong tetang hima sastra inggris yang bikin acara baksos pengabdian ke MTS-Al mukhtar?",
        tags: ["hima", "sastra", "donasi", "baksos"],
        answers: [
            {
                post: "Pengabdian ini akan dilaksanakan pada tanggal 19 April 2018 di SMP 5 Lembang serta pemberian donasi diberikan ke MTs Al-Mukhtar dan Rumah Qur'an Al-Fath.",
            },
            {
                post: "Tgl 19 April 2018",
            },
        ],
    },
    {
        title: "Jam kerja BNI Unikom",
        post: "selamat malam, saya mau tanya BNI Unikom buka sampai jam berapa ya? kartu  ATM saya hilang",
        tags: ["ATM", "kartu", "mahasiswa", "BNI"],
        answers: [
            {
                post: "Yang saya tau, jam kerja BNI Unikom kayak BNI biasa sih kang, dari jam 9 sampai jam 4 sore"
            },
        ],
    },
    {
        title: "Kehilangan Handphone",
        post: "Urgent, handphpne saya ketinggalan di kantin ada yang liat ga? merk Xiaomi A1, warna hitam, tolong infokan ke saya apabila ada yang menemukan, terima kasih sebelumnya",
        tags: ["Handphone", "kehilangan", "Xiaomi", "hitam"],
        answers: [
            {
                post: "Maaf kang tidak lihat"
            },
        ],
    },
    {
        title: "Jam kerja perpustakaan Unikom di hari sabtu",
        post: "Assalamualaikum, akang teteh, ada yang tau kalo hari sabtu perpus Unikom buka sampai jam berapa?",
        tags: ["Perpustakaan", "Unikom", "jam", "buka"],
        answers: [
            {
                post: "Seingat saya sampai jam 12 kang, tapi ya sebelum jam 12 juga mereka sudah beres2"
            },
        ],
    },
    {
        title: "Meminjam buku di Perpus",
        post: "Kang saya lagi butuh buku KWU, kalo minjem di perpus, prosedurnya gimana ya? apakah harus jadi anggota perpus dulu?",
        tags: ["Perpustakaan", "anggota", "perpus", "peminjaman", "minjam", "buku"],
        answers: [
            {
                post: "agak ribet sih kang, ente harus jadi anggota perpus dulu baru boleh pinjem buku, kalo mau silahkan saja pakai dulu kwu saya kang"
            },
        ],
    },
    {
        title: "Meminjam Jas Unikom",
        post: "Ada yang bisa bantu saya? saya mau pinjam jas unikom untuk UAS nanti, ada yang bisa meminjamkan? Jas Almamater Cowo ukuran L kalo ada yang punya bisa tolong kontak saya",
        tags: ["pinjam", "meminjam", "jas", "unikom"],
        answers: [
            {
                post: "saya mau aja pinjamkan sih, tapi yang saya ketinggalan di kampung hehe, mungkin yang lain bisa bantu",
            },
        ],
    },
    {
        title: "Hari Terakhir Cap Kartu Ujian",
        post: "Kang, teteh, ada yang tau terakhir ngecap kartu ujian kapan ya? saya kebetulan lagi diluar kota, datang ke bandung, hari pertama UAS, apakah masih sempat untuk cap kartu Ujian?",
        tags: ["kartu", "ujian", "cap", "UAS"],
        answers: [
            {
                post: "waduh, hari terakhir cap kartu ujian harusnya hari sabtu teh, ga bisa cap lagi kalo hari senin, kecuali kartunya hilang dan ada surat kehilangan dari kantor polisi terdekat.",
            },
        ],
    },
];

class YoloController {
    async saveQuestions() {

        var randomDate = (start, end) => {
            return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        };

        for (let i in data) {
            let item = data[i];

            const trx = await Database.beginTransaction();

            try {
                var users = await User.query().orderBy(Database.raw("random()"));

                let post_datetime = randomDate(moment("2018-05-25").toDate(), moment("2018-07-03").toDate());
                post_datetime = moment(post_datetime);

                let range_datetime = moment(post_datetime);
                range_datetime.add(5, 'days');

                let post = new Post;
                post.fill({
                    title: item.title,
                    post: item.post,
                    data: JSON.stringify({"tags": item.tags}),
                    type: 0,
                    user_id: users[0].id,
                    created_at: post_datetime.format('YYYY-MM-DD HH:mm:ss'),
                    updated_at: post_datetime.format('YYYY-MM-DD HH:mm:ss'),
                });

                // save question
                await post.save(trx);

                // save tags
                for (let k in item.tags) {
                    let sql = `INSERT INTO tags (tag, created_at, updated_at) 
                               VALUES (?, current_timestamp, current_timestamp)
                               ON CONFLICT (tag) DO NOTHING`;

                    await Database.raw(sql, item.tags[k], trx);
                }

                // save answers
                for (let j in item.answers) {
                    let subitem = item.answers[j];

                    let answer_datetime = moment(randomDate(post_datetime.toDate(), range_datetime.toDate()));

                    let answer = new Post;
                    answer.fill({
                        parent_id: post.id,
                        title: item.title,
                        post: subitem.post,
                        type: 1,
                        user_id: users[parseInt(j) + 1].id,
                        created_at: answer_datetime.format('YYYY-MM-DD HH:mm:ss'),
                        updated_at: answer_datetime.format('YYYY-MM-DD HH:mm:ss'),
                    });

                    await answer.save(trx);
                }

                trx.commit();
            } catch(e) {
                trx.rollback();

                console.error(e);
            }
        }
    }
}

module.exports = YoloController
