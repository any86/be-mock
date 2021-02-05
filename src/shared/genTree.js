import isPlainObject from 'lodash/isPlainObject';
import { VAR_TYPE } from '../const';
import {
    getStringType,
} from './mock.js';

/**
 * 根据输入数据生成树形数据
 */
function genTree(object, parentType, propName, level = 0) {
    // const expand = 3 > level;
    const expand = true;
    let nodes = [];
    if (isPlainObject(object)) {
        const active = {
            text:'',
            parentType,
            propName,
            expand,
            type: VAR_TYPE.Object,
            children: [],
            mock: {
                times: 1,
            },
        };
        for (const propName in object) {
            const value = object[propName];
            active.children.push(
                ...genTree(
                    value,
                    VAR_TYPE.Object,
                    propName,
                    level + 1
                )
            );
        }
        nodes.push(active);
    } else if (Array.isArray(object)) {
        const active = {
            text:'',
            parentType,
            propName,
            expand,
            type: VAR_TYPE.Array,
            children: [],
            mock: {
                times: 1,
            },
        };
        for (const item of object) {
            active.children.push(
                ...genTree(
                    item,
                    VAR_TYPE.Array,
                    void 0,
                    level + 1
                )
            );
        }
        nodes.push(active);
    } else {
        // 对简单数据类型的进一步判断
        const type = getType(object);
        if (type === VAR_TYPE.String) {
            // console.log(object.length,Math.pow(10,object.length));
            const mockType = getStringType(object);
            const max =
                VAR_TYPE.Number === mockType ? ~~object : object.length;
            nodes.push({
                text:'',
                parentType,
                propName: 0 == level ? '' : propName,
                type,
                expand: true,
                children: [],
                mock: {
                    times: 1,
                    type: mockType,
                    min: 0,
                    max,
                    pool: '',
                },
            });
        } else if (type === VAR_TYPE.Number) {
            nodes.push({
                text:'',
                parentType,
                propName: 0 == level ? '' : propName,
                type,
                // 为了如果改变成Array|Object而准备的字段
                expand: true,
                children: [],
                // mock
                mock: {
                    times: 1,
                    type: getStringType(object),
                    min: 0,
                    max: object,
                },
            });
        } else if (type === VAR_TYPE.Null) {
            nodes.push({
                text:'',
                parentType,
                propName: 0 == level ? '' : propName,
                type,
                // 预先为了改变类型把children放这
                children: [],
                expand: false,
                // mock
                mock: {
                    times: 1,
                },
            });
        }
    }
    return nodes;
}

/**
 * 获取输入数据的类型
 */
function getType(object) {
    let rootType = null == object ? 'null' : typeof object;
    return (
        rootType[0].toUpperCase() +
        rootType.substring(1, rootType.length)
    );
}

export default genTree;