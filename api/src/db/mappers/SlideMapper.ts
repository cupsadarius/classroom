import {MapperInterface} from './MapperInterface';
import Slide from '../../models/Slide';
import SlideMapping from './mappings/SlideMapping';
import FileMapping from './mappings/FileMapping';
import * as uuid from 'uuid';

export default class SlideMapper implements MapperInterface<Slide, SlideMapping> {

    /**
     * Populates a slide object based on it's mapping.
     */
    public hydrate(slide: Slide, data: SlideMapping) {
        if (data.id || slide.getId()) {
            slide.setId(data.id || slide.getId());
        }
        slide.setName(data.name || slide.getName());
        slide.setType(data.type || slide.getType());
        slide.setPath(data.path || slide.getPath());
        slide.setOrder(!isNaN(data.order) ? data.order : slide.getOrder());
        return slide;
    }

    /**
     * Extract the data from a slide object.
     */
    public dehydrate(slide: Slide) {
        const mapping = new SlideMapping();
        mapping.id = slide.getId() ? slide.getId() : uuid.v4();
        mapping.name = slide.getName();
        mapping.path = slide.getPath();
        mapping.order = slide.getOrder();
        mapping.type = slide.getType();

        return mapping;
    }

    /**
     * Populates a slide object from a FileUpload mapping
     */
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