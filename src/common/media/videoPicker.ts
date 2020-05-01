/*
 * @flow
 * created by wyk made in 2019-01-14 10:44:51
 */
import ImagePicker from 'react-native-image-crop-picker';
// import { UploadOption, videoUpload } from './videoUpload';
import { vodUpload, UploadOption } from './vodUpload';

export function videoPicker(onPickered?: Function, options: UploadOption, uploadType: String) {
    console.log('videoPicker');
    ImagePicker.openPicker({
        multiple: false,
        mediaType: 'video',
    })
        .then(video => {
            console.log('video', video);
            let videoPath = video.path.substr(7);
            options.videoPath = videoPath;
            options.uploadType = uploadType;
            onPickered && onPickered(video);
            console.log('options', options);
            vodUpload(options);
        })
        .catch(err => {
            console.log(err);
        });
}
