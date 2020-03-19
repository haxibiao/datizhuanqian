import { Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');

const SCREEN_WIDTH = width;

export const syncGetter = (str: string, data: any) => {
    if (data === null || data === undefined || typeof data !== 'object') return null;
    let result: any = { ...data };
    const keys: string[] = str.split('.');
    for (const key of keys) {
        if (result[key] !== undefined && result[key] !== null) {
            result = result[key];
        } else {
            return undefined;
        }
    }
    return result;
};

//手机 邮箱 正则验证
export const regular = (account: string) => {
    const phoneReg = /^1[3-9]\d{9}$/;
    const mailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;

    let value = phoneReg.test(account) || mailReg.test(account);
    return value;
};

export const imgsLayoutSize = (
    imgCount: number,
    images: { height: any; width: any }[],
    space = 5,
    maxWidth = width - 30,
) => {
    let width,
        height,
        i = 0;
    let imgSize = [];
    switch (true) {
        case imgCount == 1:
            if (images[0].height > images[0].width) {
                height = (maxWidth * 2) / 3;
                width = (height * images[0].width) / images[0].height;
                imgSize.push({ width, height, marginTop: space });
            } else {
                if (images[0].width > maxWidth) {
                    width = maxWidth;
                    height = (width * images[0].height) / images[0].width;
                    imgSize.push({ width, height, marginTop: space });
                } else {
                    width = images[0].width;
                    height = images[0].height;
                    imgSize.push({ width, height, marginTop: space });
                }
            }

            break;
        case imgCount == 7:
            for (; i < imgCount; i++) {
                if (i == 0) {
                    width = maxWidth;
                    height = maxWidth / 2;
                } else {
                    width = height = (maxWidth - space * 2) / 3;
                }
                imgSize.push({ width, height, marginLeft: space, marginTop: space });
            }
            break;
        case imgCount == 5:
        case imgCount == 8:
            for (; i < imgCount; i++) {
                if (i == 0 || i == 1) {
                    width = height = (maxWidth - space) / 2;
                } else {
                    width = height = (maxWidth - space * 2) / 3;
                }
                imgSize.push({ width, height, marginLeft: space, marginTop: space });
            }
            break;

        case imgCount == 2:
        case imgCount == 4:
            width = height = (maxWidth - space) / 2;
            for (; i < imgCount; i++) {
                imgSize.push({ width, height, marginRight: space, marginTop: space });
            }
            break;
        case imgCount == 3:
        case imgCount == 6:
        case imgCount == 9:
            width = height = (maxWidth - space * 2) / 3;
            for (; i < imgCount; i++) {
                imgSize.push({ width, height, marginRight: space, marginTop: space });
            }
            break;
    }
    return imgSize;
};

export const imageSize = ({ width, height, padding }) => {
    let size = {
        height: 0,
        width: 0,
    };
    if (width > SCREEN_WIDTH) {
        size.width = SCREEN_WIDTH - padding;
        size.height = ((SCREEN_WIDTH - padding) * height) / width;
    } else {
        size = { width, height };
    }
    return size;
};
