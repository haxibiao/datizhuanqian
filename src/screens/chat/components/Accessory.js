/*
 * @flow
 * created by wyk made in 2019-06-18 14:08:11
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Iconfont } from '@src/components';
import { observer, inject } from 'mobx-react';

@observer
class Accessory extends Component {
    render() {
        let {
            viewState,
            pickedImages,
            pickedVideo,
            openRecordingView,
            openImageView,
            openVideoView,
            openEmojiView,
        } = this.props.chatStore;
        return (
            <View style={styles.container}>
                <View style={styles.listWrap}>
                    <TouchableOpacity style={styles.operationItem} onPress={openRecordingView}>
                        <Iconfont
                            name="recording"
                            size={PxFit(25)}
                            color={viewState === 'recording' ? Theme.theme : Theme.secondaryTextColor}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.operationItem} onPress={openImageView}>
                        <Iconfont
                            name="picture"
                            size={PxFit(25)}
                            color={viewState === 'image' ? Theme.theme : Theme.secondaryTextColor}
                        />
                        {pickedImages.size > 0 && (
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 10,
                                    left: '50%',
                                    width: 16,
                                    height: 16,
                                    borderRadius: 8,
                                    backgroundColor: Theme.theme,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <Text style={{ fontSize: 12, color: '#fff' }}>{pickedImages.size}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.operationItem} onPress={openVideoView}>
                        <Iconfont
                            name="camera"
                            size={PxFit(25)}
                            color={viewState === 'video' ? Theme.theme : Theme.secondaryTextColor}
                        />
                        {pickedVideo && (
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 10,
                                    left: '50%',
                                    width: 16,
                                    height: 16,
                                    borderRadius: 8,
                                    backgroundColor: Theme.theme,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <Text style={{ fontSize: 12, color: '#fff' }}>1</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.operationItem} onPress={openEmojiView}>
                        <Iconfont
                            name="emoji"
                            size={PxFit(25)}
                            color={viewState === 'emoji' ? Theme.theme : Theme.secondaryTextColor}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: PxFit(50),
    },
    listWrap: {
        flex: 1,
        flexDirection: 'row',
    },
    operationItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default inject(stores => ({ chatStore: stores.chatStore }))(Accessory);
