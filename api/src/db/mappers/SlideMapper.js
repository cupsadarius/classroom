"use strict";
var Slide_1 = require("../../models/Slide");
var SlideMapping_1 = require("./mappings/SlideMapping");
var uuid = require("uuid");
var SlideMapper = (function () {
    function SlideMapper() {
    }
    SlideMapper.prototype.hydrate = function (slide, data) {
        if (data.id || slide.getId()) {
            slide.setId(data.id || slide.getId());
        }
        slide.setName(data.name || slide.getName());
        slide.setType(data.type || slide.getType());
        slide.setPath(data.path || slide.getPath());
        slide.setOrder(data.order || slide.getOrder());
        return slide;
    };
    SlideMapper.prototype.dehydrate = function (slide) {
        var mapping = new SlideMapping_1.default();
        mapping.id = slide.getId();
        mapping.name = slide.getName();
        mapping.path = slide.getPath();
        mapping.order = slide.getOrder();
        mapping.type = slide.getType();
        return mapping;
    };
    SlideMapper.prototype.convertFromUploadData = function (data, index) {
        var slide = new Slide_1.default();
        slide.setId(uuid.v4());
        slide.setName(data.filename);
        slide.setPath(data.path);
        slide.setType(data.mimetype);
        slide.setOrder(index);
        return slide;
    };
    return SlideMapper;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SlideMapper;
