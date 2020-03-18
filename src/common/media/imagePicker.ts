/*
 * @flow
 * created by wyk made in 2019-01-14 13:54:53
 */
import ImagePicker from 'react-native-image-crop-picker';

export function imagePicker(callback?: Function, pickerOptions?: Object) {
    ImagePicker.openPicker({
        multiple: true,
        mediaType: 'photo',
        ...pickerOptions,
    })
        .then(callback)
        .catch((err: any) => {
            console.warn('err', err);
        });
}
