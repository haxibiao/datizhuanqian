import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Config, SCREEN_WIDTH, Theme, PxFit } from 'utils';
import { observer, app } from 'store';

const ListHeader = props => {
    const { navigation } = props;
    return (
        <>
            <View style={styles.enters}>
                <TouchableOpacity
                    style={styles.enterWrap}
                    activeOpacity={1}
                    onPress={() => navigation.navigate('Matching')}>
                    <ImageBackground
                        source={require('@src/assets/images/competitor.png')}
                        style={[styles.entrance, { marginRight: PxFit(10) }]}>
                        <Text style={styles.entranceName}>答题对战</Text>
                        <Text style={styles.entranceDescription}>PK赢奖金</Text>
                    </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.enterWrap}
                    activeOpacity={1}
                    onPress={() => navigation.navigate('Rank')}>
                    <ImageBackground source={require('@src/assets/images/answer_rank.png')} style={styles.entrance}>
                        <Text style={styles.entranceName}>排行榜</Text>
                        <Text style={styles.entranceDescription}>今日榜单排名</Text>
                    </ImageBackground>
                </TouchableOpacity>
            </View>
            <Text style={styles.questionsTitle}>热门题库</Text>
        </>
    );
};
const entranceWidth = (SCREEN_WIDTH - PxFit(Theme.itemSpace) * 2 - PxFit(10)) / 2;

const styles = StyleSheet.create({
    enters: {
        flexDirection: 'row',
        margin: PxFit(Theme.itemSpace),
    },
    enterWrap: {},
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