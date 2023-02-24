import { Op } from "sequelize";

export const generate_where = ({filter, exactMatch}:{filter: Object, exactMatch: Boolean}):any => {
    if(!filter) return {};
    if(exactMatch) return filter;
    const keys = Object.keys(filter);
    const where = {};
    for(let key of keys) {
        if(!filter[key]) continue;
        if(!exactMatch && typeof filter[key] == 'string')
            where[key] = { [Op.regexp]: filter[key] }
        else
            where[key] = filter[key];
    }
    return where
}

export const filter_array = (
    array: Array<any>, 
    {filter, exactMatch, offset, limit}:{filter: Object, exactMatch: Boolean, offset: number, limit: number}):any => {
    if(filter) {
        const keys = Object.keys(filter);
        return array.filter(row => {
            for(let key of keys) {
                if(!filter[key]) continue;
                if(!exactMatch && typeof filter[key] == 'string'){
                    if(!(new RegExp(filter[key])).test(row.dataValues[key]))
                        return false;
                }
                else
                    if(row.dataValues[key] != filter[key])
                        return false;
            }
            return true;
        }).slice(offset, offset + limit);
    }
    return array.slice(offset, offset + limit);
}