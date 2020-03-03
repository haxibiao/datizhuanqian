import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

import { Button } from 'components';
import { Overlay } from 'teaset';
import { QuestionsStore } from '../store';

let OverlayKey: any = null;
export const show = (navigation: { goBack: () => void }, category: { name: React.ReactNode }, questions: any[]) => {
    const submitteds = questions.filter(question => {
        return question.submittedAnswer && question.submittedAnswer !== '';
    });

    const percentage = submitteds.length / questions.length;

    const overlayView = (
        <Overlay.View animated>
            <View style={styles.container}>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View
                            style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: PxFit(5),
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: PxFit(20),
                            }}>
                            <Image
                                source={require('@src/assets/images/ic_leave_exam.png')}
                                style={{ width: Device.WIDTH / 3, height: ((Device.WIDTH / 3) * 272) / 255 }}
                            />
                            <Text style={{ fontSize: PxFit(11), color: '#666666', marginVertical: PxFit(20) }}>
                                正在考：{category.name}
                            </Text>
                            <Text style={{ fontSize: PxFit(16), fontWeight: 'bold', textAlign: 'center' }}>
                                很棒！你已经完成{submitteds.length}道题了，完成了{(percentage * 100).toFixed(2)}
                                %，要不要继续考试呢？
                            </Text>
                        </View>
                        <View style={{ marginTop: PxFit(60) }}>
                            <Button title={'继续考试'} onPress={hide} style={styles.buttonText} />
                            <Button
                                title={'先走一步'}
                                onPress={() => {
                                    hide();
                                    navigation.goBack();
                                }}
                                style={{
                                    height: PxFit(42),
                                    width: Device.WIDTH - PxFit(80),
                                    borderRadius: PxFit(21),
                                    marginTop: PxFit(15),
                                    borderWidth: PxFit(1),
                                    borderColor: Theme.lightBorder,
                                }}
                                textColor={Theme.defaultTextColor}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </Overlay.View>
    );
    OverlayKey = Overlay.show(overlayView);
};
export const hide = () => {
    Overlay.hide(OverlayKey);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Device.WIDTH,
        height: Device.HEIGHT,
        backgroundColor: 'rgba(255,255,255,0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        width: Device.WIDTH,
        height: Device.HEIGHT,
        paddingHorizontal: PxFit(30),
        backgroundColor: '#FBFBFB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        height: PxFit(42),
        width: Device.WIDTH - PxFit(80),
        borderRadius: PxFit(19),
        marginTop: PxFit(10),
        backgroundColor: '#45C3FF',
    },
});
export default { show, hide };
