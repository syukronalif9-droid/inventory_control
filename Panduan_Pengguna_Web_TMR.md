# Panduan Penggunaan Web TMR Monitoring Dashboard

Selamat datang di panduan penggunaan aplikasi **TMR Monitoring Dashboard**. Dokumen ini akan menjelaskan cara menggunakan fitur-fitur yang ada di dalam aplikasi web ini.

---

## 1. Halaman Login
Saat pertama kali membuka web, Anda akan diarahkan ke halaman Login. *(Akun Anda, berupa Email dan Kata Sandi, akan disiapkan dan diberikan oleh pihak Administrator).*

1. Masukkan **Email** yang sudah terdaftar.
2. Masukkan **Kata Sandi** (Password) Anda.
3. Klik tombol **Masuk**.
*Catatan: Pastikan koneksi internet Anda stabil. Jika gagal masuk, pastikan email dan kata sandi sudah benar.*

---

## 2. Tampilan Utama (Dashboard)
Setelah berhasil login, Anda akan masuk ke halaman Dashboard. Halaman ini berisi rangkuman data pengiriman dan penerimaan (GR).

### A. Fitur Filter Data
Anda dapat menyaring (filter) data yang tampil menggunakan tombol-tombol di bagian atas tabel:
- **Tanggal Pengiriman (Shipping Date)**: Pilih rentang tanggal awal dan akhir pengiriman.
- **Status GR**: Filter data berdasarkan status "SUDAH GR" atau "BELUM GR".
- **Status TMR**: Filter berdasarkan status proses TMR saat ini.
- **Grup Material (Matl Group)**: Filter khusus untuk material "Inventory" atau "Expense (OB)".
- **Tujuan (Destination)**: Filter berdasarkan lokasi tujuan pengiriman.

*Tip: Klik tombol berikon silang merah **(X)** untuk mereset dan menghapus semua filter yang sedang aktif.*

### B. Rangkuman Data (Summary Cards)
Di bagian atas halaman Dashboard, Anda akan melihat beberapa kotak ringkasan yang menampilkan:
- **Group Material LINE INVENTORY & EXPENSE (OB)**: Jumlah data yang berstatus *Sudah GR* atau *Belum GR* pada masing-masing grup material.
- **Shipping TMR**: Rangkuman performa pengiriman, yaitu jumlah pengiriman yang terlambat (*Late > 2 hari*) dan tepat waktu (*Ontime ≤ 2 hari*).
- **GR 101**: Rangkuman performa proses GR, yaitu jumlah GR yang terlambat dan tepat waktu.

### C. Panel Ringkasan Data
Di bawah grafik-grafik pada halaman utama, terdapat panel khusus bernama **Ringkasan Data**. Panel ini menjabarkan rincian angka yang lebih detail, meliputi:
- **Total line Inventory & Expense**: Total gabungan seluruh baris data.
- **Total line Inventory / Expense**: Jumlah baris data berdasarkan masing-masing kategori material (Inventory atau Expense).
- **Kuantitas (QTY)**: Menampilkan total jumlah unit (*quantity*) barang yang **Sudah GR** maupun **Belum GR** secara terpisah untuk kategori Inventory dan Expense.

---

## 3. Fitur Upload & Reset Data (Khusus Admin)
Tombol untuk mengunggah (upload) dan mereset data hanya akan muncul jika Anda login menggunakan akun dengan akses **Admin**.
Jika Anda menggunakan akun **Viewer**, tombol-tombol ini **tidak akan terlihat**, dan Anda hanya dapat melihat serta memfilter data (hanya-baca).

**A. Mengunggah (Upload) Data Baru:**
1. Siapkan file **Excel (.xlsx, .xls) atau .csv** yang sesuai dengan format template yang telah ditentukan. *(Daftar nama kolom untuk template Excel ini dapat Anda lihat pada bagian paling bawah dokumen ini)*.
2. Klik tombol **ikon awan dengan panah ke atas (Upload)** di sebelah kanan fitur filter.
3. Pilih file Excel dari komputer Anda.
4. Tunggu proses loading selesai. Jika berhasil, akan muncul notifikasi sukses dan halaman akan memuat ulang (refresh) otomatis untuk menampilkan data terbaru.
*Penting: Data lama dengan tanggal pengiriman (Shipping Date) yang sama akan diperbarui secara otomatis untuk menghindari data ganda.*

**B. Menghapus (Reset) Semua Data:**
- Di sebelah tombol Upload, terdapat tombol **Reset** (berikon tempat sampah).
- Fitur ini berfungsi untuk **menghapus SELURUH data TMR** yang ada di dalam sistem.
- *Perhatian: Gunakan fitur ini dengan sangat hati-hati! Data yang sudah di-reset/dihapus tidak dapat dikembalikan.*

---

## 4. Tabel Data Lengkap
Di bagian bawah halaman Dashboard, terdapat tabel detail data TMR.
- Tabel ini menampilkan rincian seperti TMR Number, Destination, Item, Quantity, Material Document, Status Keterangan GR, dan performa hari kerja.
- **Purchasing Document**: Di dalam tabel ini, Anda juga dapat melihat kolom *Purchasing Document* yang berisi nomor dokumen pembelian (misalnya nomor *Purchase Order* / PO) yang terkait dengan data tersebut.
- Anda bisa menggeser tabel ke kanan-kiri (scroll horizontal) untuk melihat kolom lainnya.
- Untuk membuka atau melihat rincian lebih detail pada suatu data, silakan **klik 2 kali (double-click)** pada baris tabel tersebut.

---

## 5. Pengaturan Hari Libur (Daftar Libur Nasional)
Perhitungan kinerja (Ontime/Late) sangat bergantung pada hari libur. Anda dapat mengatur hari libur di menu ini.
1. Klik tab **Daftar Libur Nasional** di bagian atas (sebelah tab Dashboard).
2. Untuk menambah hari libur: 
   - Pilih tanggal libur pada kalender.
   - Ketikkan nama/keterangan hari libur tersebut (contoh: "Tahun Baru").
   - Klik tombol **Tambah Libur (+)**.
3. Untuk menghapus hari libur: Klik tombol berikon **Tong Sampah** warna merah di sebelah kanan nama hari libur yang ingin dihapus.

---

## 6. Format Template Excel (Upload Data)
Pastikan baris judul (header) pada file Excel Anda mengandung nama-nama kolom berikut agar sistem dapat membacanya dengan benar. *(Catatan: `TMR Number` wajib ada).*

**Daftar Kolom Penting:**
- TMR Number
- Status TMR
- Destination
- Shipping Date
- GR Date TMR
- Purchasing Document
- Item
- Material
- Short Text
- Quantity TMR
- Material Document
- Material Doc. Year
- Material Doc.Item
- Storage Location
- Movement Type
- QTY GR
- Posting Date
- Entry Date

*(Anda tidak harus mengisi semua kolom, namun pastikan nama kolom (header) pada baris atas sesuai dengan format sistem agar data tidak error/gagal diproses).*

---

## 7. Keluar dari Aplikasi (Logout)
Untuk keluar dari akun Anda:
1. Klik tombol **ikon pintu keluar (LogOut)** warna merah di sudut kanan atas layar (di sebelah tulisan judul TMR Monitoring Dashboard).
2. Anda akan dikembalikan ke halaman Login.

---

*Jika Anda mengalami kendala atau bug pada aplikasi, silakan hubungi tim administrator/IT yang bertugas.*
