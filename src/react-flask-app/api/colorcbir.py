import cv2 as cv
import numpy as np
import os
from numba import njit, prange

@njit(cache=True)
def bgr2hsv(image):
    b, g, r = image[..., 0], image[..., 1], image[..., 2]

    cmax = np.maximum(np.maximum(b, g), r)
    cmin = np.minimum(np.minimum(b, g), r)

    delta = cmax - cmin

    hsv_image = np.zeros(image.shape, dtype=np.uint8)

    for i in prange(image.shape[0]):
        for j in prange(image.shape[1]):
            if delta[i, j] != 0:
                if cmax[i, j] == r[i, j]:
                    hsv_image[i, j, 0] = 30 * (((g[i, j] - b[i, j]) / delta[i, j]) % 1)
                elif cmax[i, j] == g[i, j]:
                    hsv_image[i, j, 0] = 30 * (2.0 + (((b[i, j] - r[i, j]) / delta[i, j]) % 1))
                else:
                    hsv_image[i, j, 0] = 30 * (4.0 + (((r[i, j] - g[i, j]) / delta[i, j]) % 1))
                # untuk hue/hsv[...,0] rangenya 0-180 karena cv.calcHis hanya bisa baca 8 bits (maks 255)
                hsv_image[i, j, 1] = np.round((100 * (cmax[i, j] - cmin[i, j]) / cmax[i, j] ))

            hsv_image[i, j, 2] = np.round(((100 * cmax[i, j]) / 255))

    return hsv_image

def block_histograms(hsv_image):
    # Get the dimensions of the image
    height, width = hsv_image.shape[:2]

    # Determine the dimensions of each block (assuming equally sized blocks)
    block_height = height // 4
    block_width = width // 4

    block_histograms = []

    # Iterate through each block
    for i in prange(4):
        for j in prange(4):
            # Define the boundaries of the current block
            y_start, y_end = i * block_height, (i + 1) * block_height
            x_start, x_end = j * block_width, (j + 1) * block_width

            # Extract the block from the HSV image
            block = hsv_image[y_start:y_end, x_start:x_end]

            # Calculate histogram for the block
            hist = calcHis_hsv(block)
            cv.normalize(hist, hist).flatten()
            block_histograms.append(hist)

    return block_histograms

def calcHis_hsv(hsv_block):
    # Process HSV image using Numba-optimized function
    h_unnormalized, s_unnormalized, v_unnormalized = hsv_block[...,0], hsv_block[...,1], hsv_block[...,2]
    
    # Calculate histograms for each channel
    hist_h = cv.calcHist([h_unnormalized], [0], None, [90], [0, 180]).flatten()
    hist_s = cv.calcHist([s_unnormalized], [0], None, [50], [0, 100]).flatten()
    hist_v = cv.calcHist([v_unnormalized], [0], None, [50], [0, 100]).flatten()
    
    return np.concatenate((hist_h, hist_s, hist_v))

def color_similarity(block_hist1,block_hist2):
    similarities = np.zeros_like(block_hist1)

    for i in range(16):
        vector1 = block_hist1[i]
        vector2 = block_hist2[i]

        # similarities.append(cosineSimilarity(vector1,vector2))

        dotproduct = np.dot(vector1,vector2)

        norm1 = np.sqrt(np.dot(vector1,vector1))
        norm2 = np.sqrt(np.dot(vector2,vector2))

        result = dotproduct / (norm1 * norm2)
        similarities[i] = result

    return np.mean(similarities)

def color_based_image_retrieval(query_image, database_images, nama_file, imdir):
    ds_images = []

    acuan_hsv = bgr2hsv(query_image)
    acuan_hist = block_histograms(acuan_hsv)
    result = []

    i = 0
    for files in database_images:
        if files.endswith('jpg'):
            image_path = os.path.join(imdir, files)
            compared_image = cv.imread(image_path)
            compared_hsv = bgr2hsv(compared_image)
            compared_hist = block_histograms(compared_hsv)
            similarity = color_similarity(acuan_hist,compared_hist) * 100
            if (similarity >= 60):
                result.append({'image_url':nama_file[i],'similarity':round(similarity,2)})
            i += 1

    return result

# true_start = time.time()
# start = true_start

# img = cv.imread("0.jpg")
# hsv_img = bgr2hsv(img)

# end = time.time()

# print("image 1 ",end-start)

# start = time.time()

# img2 = cv.imread("1726.jpg")
# hsv_img2 = bgr2hsv(img2)

# end = time.time()

# print("image 2 ",end-start)

# start = time.time()
# hist = calculate_block_histograms(hsv_img)
# end = time.time()

# print("CalcHis ",end-start)

# start = time.time()
# hist2 = calculate_block_histograms(hsv_img2)
# end = time.time()

# print("CalcHis2 ",end-start)
# print("total processing ",end-true_start)

# similarity = color_similarity(hist,hist2)
# print("similarity ",similarity)
# end = time.time()

# print("total all ",end-true_start)

# image untuk testnya sudah dihapus : (