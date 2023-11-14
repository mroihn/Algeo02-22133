import cv2 as cv
import os
import numpy as np



# fungsi - fungsi

def toGray(nparray):
    gray = np.dot(nparray,[0.114, 0.587, 0.29]).astype(np.uint8)
    return gray

def coMat(nparray):
    coMat = np.zeros((256,256), np.uint8)
    for j in range(nparray.shape[1] - 1):
        coMat[nparray[:,j],nparray[:,j + 1]] += 1
    
    coMat += np.transpose(coMat)
    return (coMat/np.sum(coMat)) # udah sampai normalisasi

def toVec(normArray):
    Vec = []
    contrast = np.sum(normArray * (np.arange(normArray.shape[1]) - np.arange(normArray.shape[1]).reshape((-1,1)))**2)
    homogeneity = np.sum(normArray / (1 + (np.arange(normArray.shape[1]) - np.arange(normArray.shape[1]).reshape((-1,1)))**2))
    entropy = -(np.sum(np.log10(normArray + (1e-15)) * normArray))
    Vec.append(contrast)
    Vec.append(homogeneity)
    Vec.append(entropy)
    return Vec

def consineSimilarity(array1, array2):
    return (np.dot(array1, array2) / (np.sqrt(np.dot(array1,array1)) * (np.sqrt(np.dot(array2,array2)))))






# list untuk nyimpen images (grayscale) yang di read
imgs = []
vec = []

acuan = cv.imread("bunga.png")
acuan_gray = toGray(acuan)
acuan_norm = coMat(acuan_gray)
acuan_vector = toVec(acuan_norm)

image_directory = "dataset_temp"

image_files = os.listdir(image_directory)

for files in image_files:
    if files.endswith('jpg'):
        image_path = os.path.join(image_directory, files)
        image = cv.imread(image_path)
        grayed = toGray(image)
        imgs.append(grayed)
        norm = coMat(grayed)
        vectorize = toVec(norm)
        print("cosine similarity:")
        print(consineSimilarity(acuan_vector, vectorize))


print("done")

# cv.imshow('image',imgs[1])
# cv.waitKey(0)
   


# buat fungsi untuk menentukan co-occurence matrix. read semua file gambar. ubah ke grayscale. kenain fungsi co-occurence matrix. semua matrix itu disimpen di list. dari gambar acuan, ubah ke grayscale, kenain fungsi co-occurence matrix. cari consine acuan. cari cosine dari dataset, bandingin. yang >= 60% disimpen di list dan nilainya juga disimpen di list.
