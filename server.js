
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

app.use(cors());

// ============================================================================
// API 1: LOKER INTERNASIONAL (Menampilkan 20 Data Remotive)
// ============================================================================
app.get('/api/loker-global', async (req, res) => {
    try {
        console.log("Memuat 20 API Global (Remotive)...");
        const response = await fetch('https://remotive.com/api/remote-jobs?category=software-dev');
        const dataMentah = await response.json();

        // SLICE DIUBAH MENJADI 20
        const dataPekerjaan = dataMentah.jobs.slice(0, 20).map(job => {
            const tgl = job.publication_date ? new Date(job.publication_date) : new Date();
            
            return {
                id_pekerjaan: job.id,
                nama_perusahaan: job.company_name,
                posisi: job.title,
                lokasi: job.candidate_required_location,
                skill_it: job.tags ? job.tags.slice(0, 5) : ["Software Development", "IT"],
                tanggal_buka: tgl.toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}),
                sumber: "Remotive Global",
                pendidikan: "Bachelor's Degree or Equivalent Experience"
            };
        });

        res.json({ status: "Berhasil", asal: "Internasional", lowongan: dataPekerjaan });
    } catch (error) {
        console.error("Error Global:", error);
        res.status(500).json({ pesan: "Gagal memuat API Internasional." });
    }
});

// ============================================================================
// API 2: LOKER LOKAL INDONESIA (Menampilkan 20 Data Arbeitnow)
// ============================================================================
// ============================================================================
// API 2: LOKER LOKAL INDONESIA (Menampilkan 20 Data Arbeitnow)
// ============================================================================
app.get('/api/loker-lokal', async (req, res) => {
    try {
        console.log("Memuat 20 API Lokal (Masking dari Arbeitnow)...");
        const response = await fetch('https://www.arbeitnow.com/api/job-board-api');
        const dataMentah = await response.json();

        const perusahaanLokal = [
            { nama: "GoTo (Gojek Tokopedia)" }, { nama: "Traveloka" },
            { nama: "Bank Mandiri (Livin')" }, { nama: "Telkomsel" },
            { nama: "Ruangguru" }, { nama: "Bukalapak" }, { nama: "Shopee Indonesia" },
            { nama: "Blibli" }, { nama: "Tiket.com" }, { nama: "OVO (PT Visionet Internasional)" },
            { nama: "DANA Indonesia" }, { nama: "Xendit" }, { nama: "Halodoc" },
            { nama: "eFishery" }, { nama: "Ajaib" }, { nama: "KoinWorks" }, { nama: "Bibit (Stockbit)" }
        ];
        
        const kotaLokal = [
            "Jakarta Selatan, DKI Jakarta", "Jakarta Pusat, DKI Jakarta", 
            "Bandung, Jawa Barat", "Tangerang Selatan, Banten", 
            "Yogyakarta, DIY", "Surabaya, Jawa Timur", "Bali (Remote)", "Batam, Kepulauan Riau"
        ];
        
        const sumberPlatform = ["Glints Indonesia", "JobStreet", "TechInAsia", "LinkedIn ID", "Kalibrr"];
        const daftarPendidikan = ["Minimal S1 Ilmu Komputer / Informatika", "Minimal SMK / D3 / S1 (Berpengalaman)", "S1 Sistem Informasi / Sederajat"];
        
        const daftarSkillLokal = [
            ["JavaScript", "React", "Node.js"], ["Java", "Spring Boot", "MySQL"], 
            ["Python", "Django", "PostgreSQL"], ["Flutter", "Dart", "Mobile Dev"],
            ["Golang", "Microservices", "Docker"], ["PHP", "Laravel", "REST API"],
            ["Vue.js", "Nuxt.js", "TailwindCSS"], ["AWS", "Kubernetes", "CI/CD"]
        ];

        const dataPekerjaan = dataMentah.data.slice(0, 20).map((job, index) => {
            const ptLokal = perusahaanLokal[index % perusahaanLokal.length];
            
            // MANIPULASI TANGGAL ACAK UNTUK LOKER LOKAL
            // Kita ambil tanggal hari ini, lalu kita kurangi secara acak antara 0 hingga 14 hari ke belakang
            const tanggalSekarang = new Date(); // Hari ini
            const hariMundurAcak = Math.floor(Math.random() * 15); // Menghasilkan angka acak 0-14
            tanggalSekarang.setDate(tanggalSekarang.getDate() - hariMundurAcak); // Mundurkan tanggalnya
            
            // Format ke dalam bahasa Indonesia
            const tanggalBuka = tanggalSekarang.toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'});

            return {
                id_pekerjaan: job.slug,
                nama_perusahaan: ptLokal.nama,
                posisi: job.title,
                lokasi: kotaLokal[index % kotaLokal.length], 
                skill_it: daftarSkillLokal[index % daftarSkillLokal.length],
                tanggal_buka: tanggalBuka, // Menggunakan tanggal acak yang baru dibuat
                sumber: sumberPlatform[index % sumberPlatform.length],
                pendidikan: daftarPendidikan[index % daftarPendidikan.length]
            };
        });

        res.json({ status: "Berhasil", asal: "Lokal (Masked)", lowongan: dataPekerjaan });
    } catch (error) {
        console.error("Error Lokal:", error);
        res.status(500).json({ pesan: "Gagal memuat API Lokal." });
    }
});
// ============================================================================
// MENYALAKAN SERVER
// ============================================================================
// Menyalakan server (Disetel khusus untuk Vercel & Localhost)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log("🚀 SERVER MENYALA DI LOCALHOST!");
    });
}
module.exports = app; // 👈 INI KODE WAJIB AGAR VERCEL BISA MEMBACANYA