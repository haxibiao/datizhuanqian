// 传入参数，返回样式
function dimensions(top: any, right = top, bottom = top, left = right, property: any) {
    const styles: any[] = [];

    styles[`${property}Top`] = top;
    styles[`${property}Right`] = right;
    styles[`${property}Bottom`] = bottom;
    styles[`${property}Left`] = left;

    return styles;
}

export function margin(top: any, right: any, bottom: any, left: any) {
    return dimensions(top, right, bottom, left, 'margin');
}

export function padding(top: any, right: any, bottom: any, left: any) {
    return dimensions(top, right, bottom, left, 'padding');
}

export function boxShadow(color: any, offset = { height: 2, width: 2 }, radius = 8, opacity = 0.2) {
    return {
        shadowColor: color,
        shadowOffset: offset,
        shadowOpacity: opacity,
        shadowRadius: radius,
        elevation: radius,
    };
}
