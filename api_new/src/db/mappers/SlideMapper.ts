import {MapperInterface} from './MapperInterface';
import Slide from '../../models/Slide';
import SlideMapping from './mappings/SlideMapping';
import FileMapping from './mappings/FileMapping';
import * as uuid from 'uuid';

export default class SlideMapper implements MapperInterface<Slide, SlideMapping> {

    public hydrate(slide: Slide, data: SlideMapping) {
        if (data.id || slide.getId()) {
            slide.setId(data.id || slide.getId());
        }
        slide.setName(data.name || slide.getName());
        slide.setType(data.type || slide.getType());
        slide.setPath(data.path || slide.getPath());
        slide.setOrder(data.order || slide.getOrder());
        return slide;
    }

    public dehydrate(slide: Slide) {
        const mapping = new SlideMapping();
        mapping.id = slide.getId();
        mapping.name = slide.getName();
        mapping.path = slide.getPath();
        mapping.order = slide.getOrder();
        mapping.type = slide.getType();

        return mapping;
    }

    public convertFromUploadData(data: FileMapping, index?: number) {
        const slide = new Slide();
        slide.setId(uuid.v4());
        slide.setName(data.filename);
        slide.setPath(data.path);
        slide.setType(data.mimetype);
        slide.setOrder(index);

        return slide;
    }
}