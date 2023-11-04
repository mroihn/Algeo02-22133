from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Create a list to store the uploaded dataset
uploaded_dataset = []

# Rute untuk mengunggah dataset
@app.route('/api/uploaddataset', methods=['POST'])
def upload_dataset():
    if not request.is_json:
        return jsonify({'message': 'Invalid JSON data'}), 400

    data = request.get_json()
    if 'images' not in data:
        return jsonify({'message': 'Images not found in the dataset'}), 400

    # Extract the array of images from the JSON data
    uploaded_images = data['images']

    # Process and save the dataset (you can store it as needed)
    # For demonstration, we'll just store it in a global list
    global uploaded_dataset
    uploaded_dataset = uploaded_images

    # Return a response with the same images as a confirmation
    return jsonify({'message': 'Dataset uploaded successfully', 'images': uploaded_dataset})

# Rute untuk mengunggah gambar (seperti yang telah Anda implementasikan sebelumnya)
@app.route('/api/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return {'message': 'No file part'}, 400

    image_file = request.files['image']
    if image_file.filename == '':
        return {'message': 'No selected file'}, 400

    # Proses dan simpan gambar ke direktori yang diinginkan di sini

    # Kirim respons yang sesuai
    return {'message': 'Image uploaded successfully', 'filename': image_file.filename}

if __name__ == '__main__':
    app.run(debug=True)
