import React, { useRef, useState, useCallback, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Image, Text, TouchableOpacity } from 'react-native';
import {
    PageContainer,
    Row,
    Iconfont,
    CustomTextInput,
    beginnerGuidance,
    SetQuestionGuidance,
    Audio,
} from '@src/components';
import { Theme, SCREEN_WIDTH, SCREEN_HEIGHT, PxFit, Tools } from '@src/utils';
import { useApolloClient, useMutation, GQL } from '@src/apollo';
import { useNavigation } from 'react-navigation-hooks';
import { observer, useQuestionStore } from './store';
import Selections from './components/Selections';
import BottomTools from './components/BottomTools';
import MediaTool from './components/MediaTool';
import Explain from '../question/components/Explain';
import VideoExplain from '../question/components/VideoExplain';

export default observer(props => {
    const client = useApolloClient();
    const navigation = useNavigation();
    const store = useQuestionStore();
    const {
        description,
        category,
        video,
        audio,
        picture,
        explain,
        setDescription,
        setContentPicture,
        setContentVideo,
    } = store;
    return (
        <PageContainer
            white
            title="我的试题"
            rightView={
                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveText}>提交</Text>
                </TouchableOpacity>
            }>
            <ScrollView contentContainerStyle={styles.container} style={styles.container}>
                <TouchableOpacity onPress={() => navigation.navigate('EditCategory')}>
                    <View style={styles.topicItem}>
                        <Row>
                            <Image style={styles.iconTopic} source={require('@src/assets/images/icon_topic.png')} />
                            <Text style={styles.topicText}>{category.name || '选择题库'}</Text>
                        </Row>
                        <Iconfont name="right" size={PxFit(18)} color="#969696" />
                    </View>
                </TouchableOpacity>
                <View style={styles.contentWrap}>
                    <CustomTextInput
                        style={styles.contentInput}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        maxLength={300}
                        textAlignVertical="top"
                        placeholder="输入题干（不少于8个字）"
                    />
                    {!!(picture || video) && (
                        <MediaTool
                            style={{ marginTop: PxFit(15) }}
                            picture={picture}
                            videoPath={video && video.path}
                            setPicture={setContentPicture}
                            setVideo={setContentVideo}
                        />
                    )}
                    {audio && audio.path && <Audio.Player style={styles.audioContainer} audio={audio.path} />}
                </View>
                <View style={styles.selectionsWrap}>
                    <Selections />
                </View>
                <View style={styles.explainWrap}>
                    <VideoExplain
                        video={
                            Tools.syncGetter('video.path', explain) && {
                                ...explain.video,
                                url: explain.video.path,
                            }
                        }
                    />
                    <Explain text={Tools.syncGetter('text', explain)} picture={Tools.syncGetter('picture', explain)} />
                </View>
            </ScrollView>
            <BottomTools />
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
    },
    saveButton: {
        flex: 1,
        justifyContent: 'center',
    },
    saveText: {
        fontSize: PxFit(15),
        textAlign: 'center',
        color: Theme.primaryColor,
    },
    topicItem: {
        flexDirection: 'row',
        paddingHorizontal: PxFit(15),
        paddingVertical: PxFit(12),
        justifyContent: 'space-between',
        borderBottomWidth: PxFit(1),
        borderBottomColor: '#F1EFFA',
    },
    iconTopic: {
        width: PxFit(22),
        height: PxFit(22),
        marginRight: PxFit(4),
        resizeMode: 'cover',
    },
    topicText: {
        color: '#149EFF',
        fontSize: PxFit(16),
    },
    contentWrap: {
        margin: PxFit(15),
    },
    selectionsWrap: {
        marginLeft: PxFit(15),
    },
    explainWrap: {
        marginHorizontal: PxFit(15),
    },
    contentInput: {
        height: PxFit(120),
        padding: PxFit(10),
        paddingTop: PxFit(10),
        fontSize: PxFit(14),
        lineHeight: PxFit(20),
        borderRadius: PxFit(5),
        backgroundColor: '#f4f4f4',
    },
    audioContainer: {
        marginTop: PxFit(15),
        width: PxFit(160),
        height: PxFit(36),
        paddingHorizontal: PxFit(14),
        borderRadius: PxFit(18),
    },
});
