// ===== NAVBAR =====
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("open");
    menuBtnIcon.setAttribute("class", "ri-menu-line");
  }
});

// ===== SCROLL REVEAL =====
const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 900,
  easing: "cubic-bezier(0.16, 1, 0.3, 1)",
};

// Hero
ScrollReveal().reveal(".header__container .section__subheader", { ...scrollRevealOption, delay: 100 });
ScrollReveal().reveal(".header__container h1", { ...scrollRevealOption, delay: 300 });
ScrollReveal().reveal(".header__container .header__desc", { ...scrollRevealOption, delay: 500 });
ScrollReveal().reveal(".header__container .header__btns", { ...scrollRevealOption, delay: 700 });

// About
ScrollReveal().reveal(".about__grid", { ...scrollRevealOption, delay: 100, origin: "left" });
ScrollReveal().reveal(".about__content", { ...scrollRevealOption, delay: 200, origin: "right" });

// Rooms
ScrollReveal().reveal(".room__card", { ...scrollRevealOption, interval: 200 });

// Fasilitas
ScrollReveal().reveal(".feature__card", { ...scrollRevealOption, interval: 150 });

// Gallery
ScrollReveal().reveal(".gallery__item", { ...scrollRevealOption, interval: 100 });

// Testimoni
ScrollReveal().reveal(".testimoni__slider", { ...scrollRevealOption, delay: 100 });

// Reservasi
ScrollReveal().reveal(".reservasi__form", { ...scrollRevealOption, delay: 100, origin: "left" });
ScrollReveal().reveal(".admin__panel", { ...scrollRevealOption, delay: 200, origin: "right" });

// Maps
ScrollReveal().reveal(".maps__info__card", { ...scrollRevealOption, interval: 150 });


// ===== SCROLL KE RESERVASI DARI TOMBOL PILIH KAMAR =====
const pilihKamarBtns = document.querySelectorAll(".pilih-kamar");
const kamarSelect = document.getElementById("kamar");

const kamarValueMap = {
  "Deluxe": "1200000",
  "Family": "1800000",
  "Penthouse": "2500000"
};

pilihKamarBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const namaKamar = btn.getAttribute("data-kamar");
    const val = kamarValueMap[namaKamar];
    if (val) {
      kamarSelect.value = val;
      hitungHarga();
    }
    document.getElementById("reservasi").scrollIntoView({ behavior: "smooth" });
  });
});


// ===== TESTIMONI SLIDER =====
let testimoniIndex = 0;
let testimoniAutoplay;

const slides = document.querySelectorAll(".testimoni__card.slide");
const dotsContainer = document.getElementById("testimoniDots");

// Buat dots
slides.forEach((_, i) => {
  const dot = document.createElement("div");
  dot.classList.add("dot");
  if (i === 0) dot.classList.add("active");
  dot.addEventListener("click", () => {
    goToTestimoni(i);
    resetAutoplay();
  });
  dotsContainer.appendChild(dot);
});

function updateDots() {
  document.querySelectorAll(".dot").forEach((d, i) => {
    d.classList.toggle("active", i === testimoniIndex);
  });
}

function goToTestimoni(idx) {
  slides.forEach(s => {
    s.classList.remove("active");
    s.style.display = "none";
  });
  testimoniIndex = (idx + slides.length) % slides.length;
  slides[testimoniIndex].style.display = "block";
  slides[testimoniIndex].classList.add("active");
  updateDots();
}

// Tampilkan slide pertama
goToTestimoni(0);

function startAutoplay() {
  testimoniAutoplay = setInterval(() => {
    goToTestimoni(testimoniIndex + 1);
  }, 3000);
}

function resetAutoplay() {
  clearInterval(testimoniAutoplay);
  startAutoplay();
}

startAutoplay();

document.getElementById("prevBtn").addEventListener("click", () => {
  goToTestimoni(testimoniIndex - 1);
  resetAutoplay();
});

document.getElementById("nextBtn").addEventListener("click", () => {
  goToTestimoni(testimoniIndex + 1);
  resetAutoplay();
});


// ===== FILE UPLOAD =====
const fileInput = document.getElementById("jaminan");
const filePreview = document.getElementById("filePreview");
const fileUploadArea = document.getElementById("fileUploadArea");
const fileNameEl = document.getElementById("fileName");

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) {
    fileNameEl.textContent = file.name;
    filePreview.style.display = "flex";
    fileUploadArea.style.display = "none";
  }
});

function hapusFile() {
  fileInput.value = "";
  filePreview.style.display = "none";
  fileUploadArea.style.display = "block";
}


// ===== HITUNG HARGA =====
const kamarEl = document.getElementById("kamar");
const checkinEl = document.getElementById("checkin");
const checkoutEl = document.getElementById("checkout");
const totalHargaEl = document.getElementById("totalHarga");
const dpHargaEl = document.getElementById("dpHarga");
const jumlahMalamEl = document.getElementById("jumlahMalam");
const hargaPerMalamEl = document.getElementById("hargaPerMalam");
const hargaSummary = document.getElementById("hargaSummary");

// Set tanggal minimum = hari ini
const today = new Date().toISOString().split("T")[0];
checkinEl.min = today;
checkoutEl.min = today;

checkinEl.addEventListener("change", () => {
  checkoutEl.min = checkinEl.value;
  hitungHarga();
});

function formatRupiah(angka) {
  return "Rp" + Number(angka).toLocaleString("id-ID");
}

function getKamarNama(val) {
  const map = {
    "1200000": "Kamar Deluxe",
    "1800000": "Kamar Family",
    "2500000": "Penthouse Luxury"
  };
  return map[val] || val;
}

let currentTotal = 0;
let currentDP = 0;

function hitungHarga() {
  const harga = parseInt(kamarEl.value) || 0;
  const tgl1 = new Date(checkinEl.value);
  const tgl2 = new Date(checkoutEl.value);
  const selisih = Math.round((tgl2 - tgl1) / (1000 * 60 * 60 * 24));

  if (harga > 0 && selisih > 0) {
    const total = harga * selisih;
    const dp = total * 0.3;

    currentTotal = total;
    currentDP = dp;

    jumlahMalamEl.textContent = selisih + " malam";
    hargaPerMalamEl.textContent = formatRupiah(harga);
    totalHargaEl.textContent = formatRupiah(total);
    dpHargaEl.textContent = formatRupiah(dp);

    hargaSummary.style.display = "flex";
  } else {
    hargaSummary.style.display = "none";
  }
}

kamarEl.addEventListener("change", hitungHarga);
checkinEl.addEventListener("change", hitungHarga);
checkoutEl.addEventListener("change", hitungHarga);


// ===== FORM RESERVASI =====
const form = document.getElementById("formReservasi");
const tabelBody = document.getElementById("tabelBody");
let reservasiData = [];

form.addEventListener("submit", function(e) {
  e.preventDefault();

  // Validasi
  const nama = document.getElementById("nama").value.trim();
  const kamarVal = kamarEl.value;
  const checkinVal = checkinEl.value;
  const checkoutVal = checkoutEl.value;

  if (!nama) { alert("Mohon isi nama lengkap Anda."); return; }
  if (!kamarVal) { alert("Mohon pilih tipe kamar."); return; }
  if (!checkinVal || !checkoutVal) { alert("Mohon isi tanggal check-in dan check-out."); return; }

  const tgl1 = new Date(checkinVal);
  const tgl2 = new Date(checkoutVal);

  if (tgl2 <= tgl1) {
    alert("Tanggal check-out harus setelah tanggal check-in!");
    return;
  }

  const selisih = Math.round((tgl2 - tgl1) / (1000 * 60 * 60 * 24));

  // Tampilkan loading
  document.getElementById("loadingOverlay").style.display = "flex";

  setTimeout(() => {
    document.getElementById("loadingOverlay").style.display = "none";

    // Isi popup
    document.getElementById("pNama").textContent = nama;
    document.getElementById("pKamar").textContent = getKamarNama(kamarVal);
    document.getElementById("pCheckin").textContent = formatTanggal(checkinVal);
    document.getElementById("pCheckout").textContent = formatTanggal(checkoutVal);
    document.getElementById("pMalam").textContent = selisih + " malam";
    document.getElementById("pTotal").textContent = formatRupiah(currentTotal);
    document.getElementById("pDP").textContent = formatRupiah(currentDP);

    // Simpan data struk
    document.getElementById("struk").innerHTML =
      "=== STRUK RESERVASI ===\n" +
      "Hotel: Sania Luxury Hotel\n" +
      "Nama Tamu: " + nama + "\n" +
      "Kamar: " + getKamarNama(kamarVal) + "\n" +
      "Check In: " + formatTanggal(checkinVal) + "\n" +
      "Check Out: " + formatTanggal(checkoutVal) + "\n" +
      "Jumlah Malam: " + selisih + " malam\n" +
      "Total Harga: " + formatRupiah(currentTotal) + "\n" +
      "DP (30%): " + formatRupiah(currentDP) + "\n" +
      "======================\n" +
      "Terima kasih telah memilih Sania Luxury Hotel!";

    // Tambahkan ke tabel admin
    tambahKeAdmin(nama, getKamarNama(kamarVal), checkinVal, checkoutVal, currentTotal);

    // Tampilkan popup
    document.getElementById("popupOverlay").style.display = "flex";

  }, 2000);
});


function formatTanggal(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const options = { day: "numeric", month: "long", year: "numeric" };
  return d.toLocaleDateString("id-ID", options);
}

function tambahKeAdmin(nama, kamar, checkin, checkout, total) {
  // Hapus baris "belum ada data"
  const emptyRow = document.querySelector(".empty__row");
  if (emptyRow) emptyRow.remove();

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${nama}</td>
    <td>${kamar}</td>
    <td>${formatTanggal(checkin)}</td>
    <td>${formatTanggal(checkout)}</td>
    <td style="color:#f6ac0f;font-weight:600">${formatRupiah(total)}</td>
  `;
  tabelBody.appendChild(tr);
}

function tutupPopup() {
  document.getElementById("popupOverlay").style.display = "none";
  form.reset();
  hargaSummary.style.display = "none";
  filePreview.style.display = "none";
  fileUploadArea.style.display = "block";
  currentTotal = 0;
  currentDP = 0;
}

function downloadStruk() {
  const teks = document.getElementById("struk").innerHTML
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

  const blob = new Blob([teks], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "struk_reservasi_sania_hotel.txt";
  link.click();
}

// Tutup popup jika klik overlay
document.getElementById("popupOverlay").addEventListener("click", function(e) {
  if (e.target === this) tutupPopup();
});
