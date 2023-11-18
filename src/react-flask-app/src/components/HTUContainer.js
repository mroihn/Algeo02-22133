function HTUContainer() {
  return (
    <div className="container mt-5">
      <header className="text-center mb-5">
        <h1>How to Use</h1>
      </header>
      <div className="row">
        <div className="col-md-6">
          <h2>Step 1: Upload Image Query</h2>
          <p>
            Image query berisi gambar yang akan digunakan dalam pencarian gambar. 
            Untuk memasukkan image query, Anda dapat menggunakan tombol 'Insert Image' 
            atau menggunakan tombol 'Capture Image'.
          </p>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-md-6">
          <h2>Step 2: Upload Dataset</h2>
          <p>
            Kumpulan gambar (dataset), dilakukan dengan cara mengunggah multiple image 
            dalam bentuk folder ke dalam web browser.
          </p>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-md-6">
          <h2>Step 3: Click Search Button</h2>
          <p>
            Setelah memasukkan image query, kumpulan gambar inilah yang akan diseleksi 
            menjadi result.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HTUContainer;