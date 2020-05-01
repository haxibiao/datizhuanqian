import React from 'react';
import { StyleSheet, View, Text, Image, ImageBackground } from 'react-native';
import { TouchFeedback } from 'components';
import { BoxShadow } from 'react-native-shadow';
import service from 'service';
import { Matomo } from 'native';

const BODY_WIDTH = Device.WIDTH - PxFit(60);

const MedalIntro = (props: { hide: any; medal: any }) => {
    const { hide, medal } = props;
    const navigationAction = () => {
        hide();
        const name = `点击${medal.name_cn}徽章`;
        Matomo.trackEvent('用户行为', name, name, 1);
    };
    return (
        <View style={styles.container}>
            <Image source={require('@src/assets/images/medal_overlay_header.png')} style={styles.header} />
            <BoxShadow
                setting={Object.assign({}, shadowOpt, {
                    height: (BODY_WIDTH * 2) / 3,
                })}>
                <View style={styles.imageContainer}>
                    <ImageBackground
                        source={require('@src/assets/images/medal_icon_bg.png')}
                        style={styles.imageBackground}>
                        <Image source={{ uri: medal.done_icon_url }} style={styles.icon} />
                    </ImageBackground>

                    <Text style={styles.name}>{medal.name_cn}</Text>
                    <Text style={styles.intro}>{medal.introduction}</Text>
                </View>
            </BoxShadow>

            <TouchFeedback style={styles.buttonContainer} onPress={navigationAction}>
                <BoxShadow setting={imageShadowOpt}>
                    <ImageBackground
                        source={require('@src/assets/images/medal_overlay_button.png')}
                        style={styles.buttonBackground}>
                        <Text style={styles.buttonText}>{medal.owned ? '已拥有' : '挑战勋章'}</Text>
                    </ImageBackground>
                </BoxShadow>
            </TouchFeedback>
        </View>
    );
};

const shadowOpt = {
    width: Device.WIDTH - PxFit(110),
    height: PxFit(80),
    color: '#E8E8E8',
    border: PxFit(5),
    radius: PxFit(5),
    opacity: 0.5,
    x: 0,
    y: PxFit(-70),
    style: {
        marginHorizontal: PxFit(15),
    },
};

const imageShadowOpt = {
    width: Device.WIDTH - PxFit(109),
    height: ((Device.WIDTH - PxFit(109)) * 77) / 504,
    color: '#E8E8E8',
    border: PxFit(5),
    radius: ((Device.WIDTH - PxFit(109)) * 77) / 504 / 2,
    opacity: 0.7,
    x: 0,
    y: 0,
    style: {
        marginHorizontal: PxFit(15),
    },
};

const styles = StyleSheet.create({
    container: {
        width: BODY_WIDTH,
        paddingHorizontal: PxFit(0),
        paddingVertical: PxFit(0),
        borderRadius: PxFit(5),
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    header: {
        width: BODY_WIDTH,
        height: (BODY_WIDTH * 349) / 601,
    },
    imageContainer: {
        backgroundColor: Theme.white,
        width: Device.WIDTH - PxFit(110),
        height: (BODY_WIDTH * 2) / 3,
        borderRadius: PxFit(5),
        alignItems: 'center',
        marginTop: PxFit(-70),
    },
    imageBackground: {
        width: Device.WIDTH / 4 + PxFit(35),
        height: Device.WIDTH / 4 + PxFit(35),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: PxFit(-30),
    },
    icon: {
        width: Device.WIDTH / 4 - PxFit(20),
        height: Device.WIDTH / 4 - PxFit(20),
    },
    name: {
        fontSize: 20,
        marginTop: PxFit(15),
    },
    intro: {
        color: Theme.subTextColor,
        marginTop: PxFit(20),
        marginHorizontal: PxFit(15),
        textAlign: 'center',
    },
    buttonContainer: {
        marginTop: PxFit(-40),
        paddingBottom: PxFit(20),
    },
    buttonBackground: {
        width: BODY_WIDTH - PxFit(50),
        height: ((BODY_WIDTH - PxFit(50)) * 77) / 504,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: Theme.white,
        fontSize: PxFit(13),
    },
});

export default MedalIntro;
