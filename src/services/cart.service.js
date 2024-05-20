const prisma = require('../config/prisma.instance')
const CustomError = require('../errors')
const ProductService = require('./product.service')
const helper = require('../helper')

const FindCartItemService = async({productId}) => {
    try {
        const cartItem = await prisma.cartItem.findFirst({
            where: {
                product: productId
            }
        });
        return {cartItem};
    } catch(err) {
        throw err;
    }
}

const AddService = async({body, userId}) => {
    try {
        const {products, quantity} = body
        let {data: cart} = await GetService({userId});

        if(!cart) {
            cart = await prisma.cart.create({
                data:{
                    user_id: userId
                }
            });
        }

        let totalPrice = 0;
        let totalQuantity = 0;
        let totalSaved = 0;
        for(const item of products) {
            let price;
            let cartItem;
            const {product} = await ProductService.GetProductByIdService({product_id: item.productId});
            if(!product)
                throw new CustomError.NotFoundError(`Not found product with id: ${item.productId}`);

            const {cartItem: ExistCartItem} = await FindCartItemService({productId: product.product_id});
            if(ExistCartItem) {
                const quantity = item.quantity + ExistCartItem.quantity;
                const {data} = await UpdateService({cartItemId: ExistCartItem.cartItem, quantity});
                cartItem = {
                    ...data
                }
            } else {
                if(product.discount_price) 
                    price = product.discount_price;
                else if (product.event_price)
                    price = product.event_price;
                else 
                    price = product.reg_price;

                const newData = {
                    quantity: item.quantity,
                    total: item.quantity * price,
                    cartUser: cart.cart_id,
                    product: product.product_id,
                    saving: quantity * (product.reg_price - price)
                };

                cartItem = await prisma.cartItem.create({
                    data: newData
                });

                const newProductData = {
                    quantity: product.quantity - item.quantity
                };
            
                await ProductService.UpdateProductService(newProductData, product.product_id);
            }

            totalPrice += cartItem.total;
            totalQuantity += cartItem.quantity;
            totalSaved += cartItem.saving;
        }

        const newCartData = {
            quantity: totalQuantity,
            total: totalPrice,
            saved: totalSaved
        };

        const select = helper.CustomResponse.CartResponse()
        const data = await prisma.cart.update({
            where: {
                cart_id: cart.cart_id
            },
            data: newCartData,
            select
        });
        return {data};

    } catch(err) {
        throw err;
    }
}

const GetService = async({userId}) => {
    try {
        const select = helper.CustomResponse.CartResponse();
        const data = await prisma.cart.findFirst({
            where: {
                user_id: userId
            }, 
            select
        });
        return {data};
    } catch (err) {
        throw err;
    }
}

const GetCartItemByIdService= async(id) => {
    try {
        const data = await prisma.cartItem.findFirst({
            where: {
                cartItem: id
            }
        });
        return data; 
    } catch (err) {
        throw err;
    }
}

const UpdateService = async({cartItemId, quantity}) => {
    try {
        const select = helper.CustomResponse.CartItemResponse()

        const ExistCartItem = await GetCartItemByIdService(cartItemId)

        const {product} = await ProductService.GetProductByIdService({product_id:  ExistCartItem.product});

        const data = await prisma.cartItem.update({
            where: {
               cartItem: cartItemId
            },
            data: {
                quantity,
                total: quantity * product.discount_price,
                saving: quantity * (product.discount_price - product.reg_price)
            },
            select
        });


        const newProductData = {
            quantity: product.quantity +  (ExistCartItem.quantity - quantity)
        };
            
        await ProductService.UpdateProductService(newProductData, ExistCartItem.product);

        return {data};
    } catch (err) {
        throw err;
    }
}

const UpdateQuantityService = async({userId, cartItemId, quantity}) => {
    try {
        const select = helper.CustomResponse.CartResponse();
        if(quantity == 0) {
            const ExistCartItem = await GetCartItemByIdService(cartItemId);

            const {product} = await ProductService.GetProductByIdService({product_id: ExistCartItem.product})
            const newProductData = {
                quantity: product.quantity +  ExistCartItem.quantity
            };
            await ProductService.UpdateProductService(newProductData, ExistCartItem.product);

            await DeleteService({cartItemId});
        }
        else {
            await UpdateService({cartItemId, quantity});
        }
        const {data: cart} = await GetService({userId});
        let totalPrice = 0;
        let totalQuantity = 0;
        let totalSaved = 0;
        for(const ele of cart.cartItems) {
           totalPrice += ele.total;
           totalQuantity += ele.quantity;
           totalSaved += ele.saving;
        }

        const data = await prisma.cart.update({
            where: {
                cart_id: cart.cart_id
            }, 
            data: {
                total: totalPrice,
                quantity: totalQuantity,
                saved: totalSaved
            },
            select
        });
        return {data}
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const DeleteService = async({cartItemId}) => {
    try {
        await prisma.cartItem.delete({
            where: {
                cartItem: cartItemId
            }
        });
        return {msg: 'Successfully deleted'};
    } catch (err) {
        throw err;
    }
}

module.exports = {
    AddService,
    GetService,
    UpdateService,
    UpdateQuantityService,
    DeleteService
}