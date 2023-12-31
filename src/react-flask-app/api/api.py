from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os,cv2,glob
from tkinter import Tk, filedialog
from texture import texture_based
from color import color_based
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})


uploaded_dataset = []
uploaded_image = ''
dataset_path = ''
directory_path = ''
search_mode = 'color'

def select_folder():
    root = Tk()
    root.attributes('-topmost', True)  # Bring the window to the front
    root.withdraw()  # Hide the main window

    folder_path = filedialog.askdirectory(title="Select a Folder")
    
    root.destroy()  

    return folder_path

def get_image_objects_from_folder(folder_path):
    image_objects = []

    for filename in os.listdir(folder_path):
        if filename.endswith(('.png', '.jpg', '.jpeg')):
            image_path = os.path.join(folder_path, filename)
            relative_path = os.path.relpath(image_path, folder_path)
            

            image_object = {'image_url': relative_path, 'similarity':''}
            image_objects.append(image_object)
            image_path = image_path.replace('\\', '/')
            

    return image_objects

# Rute untuk clean up
@app.route('/api/cleanup', methods=['GET'])
def clean_up():
    global uploaded_dataset
    uploaded_dataset = []
    global uploaded_image
    uploaded_image = ''
    global dataset_path
    dataset_path = ''
    global directory_path
    directory_path = ''
    global search_mode
    search_mode = 'color'

    return jsonify({'message': 'Cleanup successfully'})

# Rute untuk menampilan dataset ke layar
@app.route('/api/images/<path:filename>')
def get_image(filename):
    return send_from_directory(dataset_path, filename)

# Rute untuk menampilkan gambar ke layar 
@app.route('/api/image/<path:filename>')
def get_file(filename):
    return send_from_directory(directory_path,filename)

# Rute untuk mengupload dataset 
@app.route('/api/uploaddataset', methods=['GET'])
def upload_dataset():
    global dataset_path
    dataset_path = select_folder()

    if dataset_path:
        image_objects = get_image_objects_from_folder(dataset_path)
        global uploaded_dataset
        uploaded_dataset = image_objects
        # print(dataset_path)
        # print(uploaded_dataset)

        return jsonify({'message': 'Dataset uploaded successfully', 'images': image_objects})
    else:
        return jsonify({'message': 'Error selecting folder'}), 400

# Rute untuk mengupload gambar 
@app.route('/api/upload', methods=['GET'])
def upload_image():
    root = Tk()
    root.attributes('-topmost', True)
    root.withdraw()  # Hide the main window
    file_path = filedialog.askopenfilename(title="Select an image", filetypes=[("Image files", "*.png;*.jpg;*.jpeg;")])
    root.destroy()

    if file_path:
        global directory_path
        directory_path = os.path.dirname(file_path)
        file_name = os.path.basename(file_path)
        
        global uploaded_image
        uploaded_image = file_path
        image_object = {'image_url': file_path, 'image_name': file_name}
        return jsonify({'message': 'Image uploaded successfully', 'image': image_object})
    else:
        return jsonify({'message': 'Error selecting image'}), 400

# Rute untuk mengambil gambar dari kamera    
@app.route('/api/camera', methods=['POST'])
def upload_file():
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if file:
        original_file_path = "../src/img/captured_photo.jpg"
        global directory_path
        directory_path = os.path.dirname(original_file_path)

        # Pastikan folder "captured_image" sudah ada, jika tidak, buat folder tersebut
        os.makedirs(directory_path, exist_ok=True)

        # Jika file dengan nama tersebut sudah ada, ganti nama file
        counter = 1
        file_name = os.path.basename(original_file_path)
        while os.path.exists(os.path.join(directory_path, file_name)):
            file_name = f"captured_photo_{counter}.jpg"
            counter += 1

        # Buat path baru dengan nama file yang unik
        
        file_path = os.path.join(directory_path, file_name)
        global uploaded_image
        uploaded_image = file_path
        file.save(os.path.join(directory_path, file_name))
        image_object = {'image_url': file_path, 'image_name': file_name}
        return jsonify({'message': 'Image uploaded successfully', 'image': image_object})
    

# Rute untuk mengatur mode pencarian 
@app.route('/api/searchmode', methods=['POST'])
def handle_data():
    data = request.get_json()

    if 'data' not in data:
        return jsonify({'error': 'Data not provided'})

    global search_mode
    search_mode = data['data']

    if search_mode == 'color':
        resp = {'response': 'color'}
    elif search_mode == 'texture':
        resp = {'response': 'texture'}
    else:
        resp = {'response': 'unknown'}

    return jsonify(resp)

# Rute untuk melakukan image retrieval
@app.route('/api/imagerecognition', methods=['GET'])
def image_recognition_route():
    if not uploaded_image or not uploaded_dataset:
        return {'message': 'No image or dataset available for recognition'}, 400  
    if(search_mode == 'color'):      
        acuan = cv2.imread(uploaded_image)
        imdir = dataset_path.rstrip('/') + '/'
        image_files = os.listdir(imdir)
        arr_nama_file = [file for file in os.listdir(imdir) if os.path.isfile(os.path.join(imdir, file))]
        result = color_based(acuan,image_files,arr_nama_file,imdir)
        return jsonify({'message': 'Image recognition complete', 'similar_images': result, 'search_mode':search_mode})
    elif(search_mode == 'texture'):
        acuan = cv2.imread(uploaded_image)
        imdir = dataset_path.rstrip('/') + '/'
        image_files = os.listdir(imdir)
        arr_nama_file = [file for file in os.listdir(imdir) if os.path.isfile(os.path.join(imdir, file))]
        result = texture_based(acuan,image_files,arr_nama_file,imdir)
        return jsonify({'message': 'Image recognition complete', 'similar_images': result, 'search_mode':search_mode})
    else:
        return {'message': 'Error'}, 400  
    
# Rute untuk melakukan image scraping
@app.route('/api/imagescraping', methods=['POST'])
def image_scraping():
    # Mendapatkan URL dari data POST
    data = request.get_json()
    url = data.get('url', '')
    save_folder = '../src/scraped_img'
    
    # Memastikan URL yang valid
    if not url:
        return jsonify({'error': 'Invalid URL'}), 400
    # Membuat folder jika belum ada
    os.makedirs(save_folder, exist_ok=True)
    global dataset_path
    dataset_path = '../src/scraped_img'
    
    # Mengunduh halaman web
    response = requests.get(url)
    
    # Memastikan permintaan berhasil
    if response.status_code == 200:
        # Menggunakan BeautifulSoup untuk parsing HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Mencari tag <img> untuk mendapatkan gambar
        img_tags = soup.find_all('img')
        
        for img_tag in img_tags:
            # Mendapatkan URL gambar
            img_url = img_tag.get('src')
            
            # Menggabungkan URL gambar dengan URL halaman web jika diperlukan
            img_url = urljoin(url, img_url)
            
            # Memeriksa apakah URL gambar berakhir dengan .jpg, .jpeg, atau .png
            if img_url.lower().endswith(('.jpg', '.jpeg', '.png')):
                # Mendownload gambar
                img_data = requests.get(img_url).content
                
                # Menyimpan gambar ke folder yang ditentukan
                img_filename = f"image{img_tags.index(img_tag) + 1}.jpg"
                img_path = os.path.join(save_folder, img_filename)
                
                with open(img_path, 'wb') as img_file:
                    img_file.write(img_data)
           
        image_objects = get_image_objects_from_folder(dataset_path)
        global uploaded_dataset
        uploaded_dataset = image_objects
        return jsonify({'message': 'Image scraping successfully', 'images': image_objects})
    else:
        return jsonify({'message': 'Error scraping image'}), 400


if __name__ == '__main__':
    app.run(debug=True)
