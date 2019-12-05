import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ImageBackground } from 'react-native';
import { Button, TouchFeedback } from 'components';
import { Config, Theme, PxFit, SCREEN_WIDTH, Tools } from 'utils';
import { BoxShadow } from 'react-native-shadow';

const MedalIntro = props => {
    const { hide, medal } = props;
    const aWidth = SCREEN_WIDTH - PxFit(60);
    return (
        <View
            style={{
                width: aWidth,
                paddingHorizontal: PxFit(0),
                paddingVertical: PxFit(0),
                borderRadius: PxFit(5),
                backgroundColor: '#fff',
                alignItems: 'center',
            }}>
            <Image
                source={require('@src/assets/images/medal_overlay_header.png')}
                style={{
                    width: aWidth,
                    height: (aWidth * 349) / 601,
                }}
            />
            <BoxShadow
                setting={Object.assign({}, shadowOpt, {
                    height: (aWidth * 2) / 3,
                })}>
                <View
                    style={{
                        backgroundColor: Theme.white,
                        width: SCREEN_WIDTH - PxFit(110),
                        height: (aWidth * 2) / 3,
                        borderRadius: PxFit(5),
                        alignItems: 'center',
                        marginTop: PxFit(-70),
                    }}>
                    <ImageBackground
                        source={require('@src/assets/images/medal_icon_bg.png')}
                        style={{
                            width: SCREEN_WIDTH / 4 + PxFit(35),
                            height: SCREEN_WIDTH / 4 + PxFit(35),
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: PxFit(-30),
                        }}>
                        <Image
                            source={{ uri: medal.done_icon_url }}
                            style={{
                                width: SCREEN_WIDTH / 4 - PxFit(20),
                                height: SCREEN_WIDTH / 4 - PxFit(20),
                            }}
                        />
                    </ImageBackground>

                    <Text style={{ fontSize: 20, marginTop: PxFit(15) }}>{medal.name_cn}</Text>
                    <Text style={{ color: Theme.subTextColor, marginTop: PxFit(20) }}>{medal.introduction}</Text>
                </View>
            </BoxShadow>

            <TouchFeedback
                style={{ marginTop: PxFit(-40), paddingBottom: PxFit(20) }}
                onPress={() => {
                    Tools.navigate('Main');
                }}>
                <ImageBackground
                    source={require('@src/assets/images/medal_overlay_button.png')}
                    style={{
                        width: aWidth - PxFit(50),
                        height: ((aWidth - PxFit(50)) * 77) / 504,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Text
                        style={{
                            color: Theme.white,
                            fontSize: PxFit(13),
                        }}>
                        挑战勋章
                    </Text>
                </ImageBackground>
            </TouchFeedback>
        </View>
    );
};

const shadowOpt = {
    width: SCREEN_WIDTH - PxFit(110),
    height: PxFit(80),
    color: '#E8E8E8',
    border: PxFit(5),
    radius: PxFit(5),
    opacity: 0.5,
    x: 0,
    y: PxFit(-70),
    style: {
        marginHorizontal: PxFit(15),
        // marginVertical: PxFit(15),
        // marginTop: PxFit(-40),
    },
};

const imageShadowOpt = {
    width: SCREEN_WIDTH / 4,
    height: SCREEN_WIDTH / 4,
    color: '#E8E8E8',
    border: PxFit(5),
    radius: SCREEN_WIDTH / 4 / 2,
    opacity: 0.5,
    x: 0,
    y: 0,
    style: {
        marginHorizontal: PxFit(15),
        // marginVertical: PxFit(15),
        marginTop: PxFit(-20),
    },
};

const styles = StyleSheet.create({
    text: {
        paddingVertical: PxFit(2),
        lineHeight: PxFit(18),
        fontSize: PxFit(12),
        color: Theme.subTextColor,
    },
    buttonText: {
        height: PxFit(38),
        borderRadius: PxFit(19),
        marginTop: PxFit(10),
        backgroundColor: Theme.primaryColor,
    },
});

export default MedalIntro;
