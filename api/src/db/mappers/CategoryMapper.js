"use strict";
var CategoryMapping_1 = require("./mappings/CategoryMapping");
var CategoryMapper = (function () {
    function CategoryMapper() {
    }
    CategoryMapper.prototype.hydrate = function (category, data) {
        if (data.id || category.getId()) {
            category.setId(data.id || category.getId());
        }
        category.setName(data.name || category.getName());
        category.setDescription(data.description || category.getDescription());
        return category;
    };
    CategoryMapper.prototype.dehydrate = function (category) {
        var mapping = new CategoryMapping_1.default();
        mapping.id = category.getId();
        mapping.name = category.getName();
        mapping.description = category.getDescription();
        return mapping;
    };
    return CategoryMapper;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CategoryMapper;
