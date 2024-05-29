const prisma = require('../config/prisma.instance')
const CustomError = require('../errors')
const ProductService = require('./product.service')
const helper = require('../helper')

const FindCartItemService = async({productId, cartId}) => {
    try {
        const cartItem = await prisma.cartItem.findFirst({
            where: {
                product: productId,
                cartUser: cartId
            }
        });
        return {cartItem};
    } catch(err) {
        throw err;
    }
}

const CheckSaleItems = async (id) => {
    try {
        const salesItems = await prisma.saleItem.findFirst({
            where: {
                productId: id
            }
        });

        if(!salesItems)
            return false;
        else 
            return salesItems;

    } catch(err) {
        throw err;
    }
}

const UpdateSalesItem = async(id, remain) => {
    const data = await prisma.saleItem.update({
                where: {
                    saleItemId: id
                },
                data: {
                    remain: remain
                }
            });
    return data;
}

const AddToCartSale = async({item, product, cartId, salesItems}) => {
    try {
        let cartItem;
        const remain = salesItems.remain - item.quantity;
        const {cartItem: ExistCartItem} = await FindCartItemService({productId: product.product_id, cartId});

        let quantity = 0;
        let NotSalesRemain = 0;
        if(remain >= 0) {
            quantity = item.quantity;
            await UpdateSalesItem(salesItems.saleItemId, remain);
        } else {
            quantity = salesItems.remain;
            NotSalesRemain = Math.abs(remain);
            await UpdateSalesItem(salesItems.saleItemId, 0)
        }

        if(ExistCartItem) {
            const Salequantity = quantity + ExistCartItem.quantity;
            const {data} = await UpdateService({cartItemId: ExistCartItem.cartItem, quantity: Salequantity, price: product.event_price});
            cartItem = {
                ...data
            }
        } else {        
            cartItem = await helper.cartHelper.createNewCartItem({quantity, product, cartId, price: product.event_price});
        }
        
        if(NotSalesRemain > 0){
            const item = {
                quantity: NotSalesRemain 
            }
            cartItem = await AddToCartNotSale({item, product, cartId});
        }

        return cartItem;
    } catch(err) {
        throw err;
    }
}

const AddToCartNotSale = async({item, product, cartId}) => {
    try {
        let cartItem;
        if(product.discount_price) 
            price = product.discount_price;
        else 
            price = product.reg_price;
        const {cartItem: ExistCartItem} = await FindCartItemService({productId: product.product_id, cartId});
        
        if(ExistCartItem) {
            const quantity = item.quantity + ExistCartItem.quantity;
            const {data} = await UpdateService({cartItemId: ExistCartItem.cartItem, quantity, price});
            cartItem = {
                ...data
            }
        } else {
            cartItem = await helper.cartHelper.createNewCartItem({quantity: item.quantity, product, cartId, price});
        }
        return cartItem;
    } catch(err) {
        throw err;
    }
}

const AddService = async({body, userId}) => {
    try {
        const { products } = body;
        let { data: cart } = await GetService({ userId });

        if (!cart) {
            cart = await prisma.cart.create({
                data: {
                    user_id: userId
                }
            });
        }
        
        for(const item of products) {
            const { product } = await ProductService.GetProductByIdService({ product_id: item.productId });
            if (!product)
                throw new CustomError.NotFoundError(`Not found product with id: ${item.productId}`);
            
            if (item.quantity > product.quantity) 
                throw new CustomError.NotEnoughError('Insufficient quantity of product');
            

            const check = await CheckSaleItems(product.product_id);
            
            let cartItem;
            if (check) {
                cartItem = await AddToCartSale({ item, product, cartId: cart.cart_id, salesItems: check });
            } else {
                cartItem = await AddToCartNotSale({ item, product, cartId: cart.cart_id });
            }
        }

        const select = helper.CustomResponse.CartResponse();

        let { data: Newcart } = await GetService({ userId });
        
        const {data} = await helper.cartHelper.CartItemLoop({cart: Newcart, select});

        return { data };

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

const UpdateService = async({cartItemId, quantity, price}) => {
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
                total: ExistCartItem.total + (price * (quantity - ExistCartItem.quantity)),
                saving: ((quantity - ExistCartItem.quantity) * (product.reg_price - price)) + ExistCartItem.saving
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
        const ExistCartItem = await GetCartItemByIdService(cartItemId);    
        const {product} = await ProductService.GetProductByIdService({product_id: ExistCartItem.product});

        const check = await CheckSaleItems(product.product_id);

        if(quantity == 0) {
            const newProductData = {
                quantity: product.quantity +  ExistCartItem.quantity
            };

            await ProductService.UpdateProductService(newProductData, ExistCartItem.product);

            if(check) {
                let CheckRemain = check.quantity - check.remain;
                if(CheckRemain >= ExistCartItem.quantity)
                    await UpdateSalesItem(check.saleItemId, (check.remain + ExistCartItem.quantity))
                else {
                    await UpdateSalesItem(check.saleItemId, (check.remain + CheckRemain));
                }
            }
            await DeleteService({cartItemId});
        }
        else {
            if(check) {
                if(check.quantity >= quantity){
                    await UpdateService({cartItemId, quantity, price: product.event_price});
                    await UpdateSalesItem(check.saleItemId, (check.quantity - quantity));
                } else if(check.quantity < quantity) {
                    await helper.cartHelper.ResetCartItem({cartItemId});
                    await UpdateService({cartItemId, quantity: check.quantity, price: product.event_price});
                    await UpdateService({cartItemId, quantity, price: product.discount_price});
                    await UpdateSalesItem(check.saleItemId, 0)
                }
            } else {
                await UpdateService({cartItemId, quantity, price: product.discount_price});
            }
        }

        const {data: cart} = await GetService({userId});
        const {data} = await helper.cartHelper.CartItemLoop({cart, select});
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
    UpdateQuantityService,
    DeleteService,
    CheckSaleItems
}