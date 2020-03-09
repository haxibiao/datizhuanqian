import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { TouchFeedback } from 'components';
import { Config, SCREEN_WIDTH, Theme, PxFit } from 'utils';
import { observer, app, config } from 'store';

const ListHeader = observer(props => {
    const { navigation } = props;
    if (app.gameConfig.status >= 1) {
        return (
            <View style={styles.enters}>
                <TouchFeedback
                    authenticated
                    navigation={navigation}
                    style={styles.enterWrap}
                    activeOpacity={1}
                    onPress={() => navigation.navigate('Matching')}>
                    <ImageBackground
                        source={require('@src/assets/images/ic_answer_match.png')}
                        style={styles.letEntrance}>
                        <Text style={styles.entranceName}>答题对战</Text>
                        <Text style={styles.entranceDescription}>{!config.disableAd ? 'PK赢奖金' : '知识对决'}</Text>
                    </ImageBackground>
                </TouchFeedback>
                <View style={{ justifyContent: 'space-between' }}>
                    <TouchFeedback
                        authenticated
                        navigation={navigation}
                        style={styles.enterWrap}
                        activeOpacity={1}
                        onPress={() => navigation.navigate('Rank')}>
                        <ImageBackground
                            source={require('@src/assets/images/ic_answer_rank.png')}
                            style={styles.entrance}>
                            <Text style={styles.entranceName}>排行榜</Text>
                            <Text style={styles.entranceDescription}>今日榜单排名</Text>
                        </ImageBackground>
                    </TouchFeedback>
                    <TouchFeedback
                        authenticated
                        navigation={navigation}
                        style={styles.enterWrap}
                        activeOpacity={1}
                        onPress={() => {
                            // navigation.navigate('Audit');
                            Toast.show({
                                content: '敬请期待',
                            });
                        }}>
                        <ImageBackground
                            source={require('@src/assets/images/ic_audit_question.png')}
                            style={styles.entrance}>
                            <Text style={styles.entranceName}>审核题目</Text>
                            <Text style={styles.entranceDescription}>净化题库环境</Text>
                        </ImageBackground>
                    </TouchFeedback>
                </View>
            </View>
        );
    } else {
        return <View style={{ height: PxFit(Theme.itemSpace) }} />;
    }
});
const entranceWidth = (SCREEN_WIDTH - PxFit(Theme.itemSpace) * 2 - PxFit(10)) / 2;

const styles = StyleSheet.create({
    enters: {
        flexDirection: 'row',
        marginVertical: PxFit(Theme.itemSpace),
    },
    enterWrap: {},
    letEntrance: {
        width: entranceWidth,
        height: (entranceWidth * 485) / 505,
        // justifyContent: 'center',
        alignItems: 'center',
        padding: PxFit(10),
        borderRadius: PxFit(5),
        overflow: 'hidden',
        marginRight: PxFit(10),
    },
    entrance: {
        width: entranceWidth,
        height: (entranceWidth * 228) / 505,
        justifyContent: 'center',
        padding: PxFit(10),
        borderRadius: PxFit(5),
        overflow: 'hidden',
    },
    entranceName: {
        fontSize: PxFit(16),
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: PxFit(6),
    },
    entranceDescription: {
        fontSize: PxFit(13),
        color: '#fff',
    },
    questionsTitle: {
        fontSize: PxFit(18),
        color: Theme.defaultTextColor,
        fontWeight: 'bold',
        marginHorizontal: PxFit(Theme.itemSpace),
    },
});

export default ListHeader;
