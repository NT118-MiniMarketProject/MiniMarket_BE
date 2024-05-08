const modifyCategoryByGroup = (categoryByGroup) => {
    return categoryByGroup.map(item => ({
        ...item,
        lists: item.categories
    })).map(item => {
        delete item.categories;
        return item;
    });
};

module.exports = {
    modifyCategoryByGroup
}