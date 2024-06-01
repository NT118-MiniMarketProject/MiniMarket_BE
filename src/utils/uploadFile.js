const cloudinary = require('cloudinary').v2
const fs = require('fs')
const prisma = require('../config/prisma.instance')
const CustomResponse = require('../helper/CustomResponse')


const uploadImageConfig = async(file) => {
     try {
        const result = await cloudinary.uploader.upload(
            file, 
            {
                use_filename: true,
                unique_filename: false,
                overwrite: true,
                folder: 'mobile-upload',
            }
        )
        fs.unlinkSync(file)
        return result.secure_url
     } catch (err) {
        throw err
     }
}

const uploadImage = async(uid, file, options) => {
    const path = await uploadImageConfig(file)
    let response;
    // console.log(uid)

    switch(options) {
        case 1: {
            const select = CustomResponse.UserResponse();
            console.log('Uploading');
            response = await prisma.user.update({
                where: {
                    id: uid,
                },
                data: {
                    avater: path
                },
                select
            });
            break;
        }
        case 2: {
            response = await prisma.product.update({
                data: {
                    thumbnail: path
                },
                where: {
                    product_id: uid
                }
            });
            break;
        }
        case 3: {
            response = await prisma.category.update({
                data: {
                    thumbnail_category: path
                },
                where: {
                    category_id: uid
                }
            });
            break;
        }
        case 4: {
            response = await prisma.category_Group.update({
                data: {
                    thumbnail: path
                },
                where: {
                    thumbnail: path
                }
            })
        }
    }

    return response;
}

module.exports = {
    uploadImageConfig,
    uploadImage
}