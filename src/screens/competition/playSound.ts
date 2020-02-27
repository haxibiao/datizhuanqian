import Sound from 'react-native-sound';
export const playSound = (soundName: any, repeat?: boolean) => {
    // If the audio is a 'require' then the second parameter must be the callback.
    let sound: Sound = null;
    if (!sound) {
        sound = new Sound(
            soundName,
            Sound.MAIN_BUNDLE,
            (error: any) => {
                if (error) {
                    console.log('加载错误', error);
                    return;
                }
                sound.play(() => sound.release());
            },
            {
                playingListener: () => {},
                stoppedListener: () => {},
            },
        );
    }
    // console.log('playSound', sound);
    // setTimeout(() => {
    //     if (sound) {
    //         sound.play(success => {
    //             if (success) {
    //                 console.log('successfully finished playing');
    //             } else {
    //                 console.log('playback failed due to audio decoding errors');
    //             }
    //         });
    //         repeat && sound.setNumberOfLoops(-1);
    //     }
    // }, 1);
    return sound;
};
