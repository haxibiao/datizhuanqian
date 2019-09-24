/*
 * @flow
 * created by wyk made in 2019-01-14 10:44:51
 */
import ImagePicker from 'react-native-image-crop-picker';
import videoUpload, { UploadOption } from './videoUpload';

export default function(onPickered?: Function, options: UploadOption, uploadType: String) {
    ImagePicker.openPicker({
        multiple: false,
        mediaType: 'video',
    })
        .then(video => {
            let videoPath = video.path.substr(7);
            options.videoPath = videoPath;
            options.uploadType = uploadType;
            onPickered && onPickered(video);
            videoUpload(options);
        })
        .catch(err => {
            console.log(err);
        });
}
