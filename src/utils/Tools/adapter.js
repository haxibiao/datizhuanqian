/*
 * @flow
 * created by wyk made in 2019-03-22 16:01:34
 */
export function syncGetter(str, data) {
    if (data == null || data == undefined || typeof data !== 'object') return;
    let result = Object.assign({}, data);
    let keys = str.split('.');
    for (let i = 0; i < keys.length; i++) {
        if (result[keys[i]] !== undefined && result[keys[i]] !== null) {
            result = result[keys[i]];
        } else {
            return undefined;
        }
    }
    return result;
}

export function Mixes(obj1, obj2) {
    function isObject(obj) {
        if (typeof obj === 'object' && obj !== null) {
            return obj;
        } else {
            throw new Error(obj + 'is not a object');
        }
    }
    isObject(obj1);
    isObject(obj2);
    for (var k in obj2) {
        obj1[k] = obj2[k];
    }
    return obj1;
}
