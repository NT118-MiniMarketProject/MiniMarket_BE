// const ProductService = require('../services/product.service')

const SearchQuery = (query) => {
    const where = {};
    if(query.search) {
        where.name = {
            contains: query.search,
            mode: 'insensitive'
        };
    }
    if(query.cid) {
        where.c_id = query.cid;
    } 
    if(query.brid) {
        where.br_id = query.brid;
    }
    if(query.keyword) {
        where.OR = [
            {
                discount_percent: {
                    not: 0
                }
            },
            {
                event_price: {
                    not: null
                }
            }
        ]
    }
    if(query.categoryGroupId) {
        where.category= {
            category_group: {
                categroup_id: query.categoryGroupId
            }
        }
    }
    if(query.popular) {
        where.is_feature = query.popular
    }
    return where;
}

const QuerySort = (sort) => {
    let orderBy = {}
    if(sort === 'minTomax') {
        orderBy = {
            reg_price: 'asc'
        };
    } else if (sort === 'a-z') {
        orderBy = {
            name: 'asc'
        };
    } else if(sort === 'z-a') {
        orderBy = {
            name: 'desc'
        };
    } else if(sort === 'maxTomin') {
        orderBy = {
            reg_price: 'desc'
        };
    }
    return orderBy;
}

module.exports = {
    QuerySort,
    SearchQuery
}
