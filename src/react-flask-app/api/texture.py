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

def texture_based_image_retrieval(query_image, database_images, nama_file, imdir):
    imgs =[]
    #vec = []
   
    acuan_gray = toGray(query_image)
    acuan_norm = coMat(acuan_gray)
    acuan_vector = toVec(acuan_norm)
    result = []

    i = 0
    for files in database_images:
        if files.endswith('jpg'):
            image_path = os.path.join(imdir, files)
            image = cv.imread(image_path)
            grayed = toGray(image)
            imgs.append(grayed)
            norm = coMat(grayed)
            vectorize = toVec(norm)
            similar = consineSimilarity(acuan_vector, vectorize)*100
            if(similar >=60):
                result.append({'image_url':nama_file[i],'similarity':round(similar,2)})
            i+=1
            # print("cosine similarity:")
            # print(consineSimilarity(acuan_vector, vectorize))
    return result



    # matches = []
    # i = 0
    # for image in database_images:
    #     db_image = convert_rgb_to_hsv(image)
    #     similarity = pencarian_blok(query_image,db_image)
    #     if (similarity>=60):
    #         matches.append({'image_url':nama_file[i], 'similarity':round(similarity,2)})
    #     i+=1

    # matches = sorted(matches, key=lambda x: x['similarity'], reverse=True)
    # return matches




# list untuk nyimpen images (grayscale) yang di read
# imgs = []
# vec = []

# acuan = cv.imread("./dataset_mini/0.jpg")


# imdir = './dataset_mini/'

# image_files = os.listdir(imdir)

# arr_nama_file = [file for file in os.listdir(imdir) if os.path.isfile(os.path.join(imdir, file))]

# result = texture_based_image_retrieval(acuan,image_files,arr_nama_file)






# cv.imshow('image',imgs[1])
# cv.waitKey(0)
   


# buat fungsi untuk menentukan co-occurence matrix. read semua file gambar. ubah ke grayscale. kenain fungsi co-occurence matrix. semua matrix itu disimpen di list. dari gambar acuan, ubah ke grayscale, kenain fungsi co-occurence matrix. cari consine acuan. cari cosine dari dataset, bandingin. yang >= 60% disimpen di list dan nilainya juga disimpen di list.
