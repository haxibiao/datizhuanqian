import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { Iconfont, Row } from '@src/components';
import { useNavigation } from 'react-navigation-hooks';
import CategoryItem from './CategoryItem';
import RecommendCategoryItem from './RecommendCategoryItem';

const HotTags = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Row>
                    <View style={styles.titleWrap}>
                        <Image source={require('@src/assets/images/category_tag.png')} style={styles.tagImage} />
                        <Text style={styles.title} numberOfLines={1}>
                            {title}
                        </Text>
                    </View>
                    <Row>
                        <Image
                            source={require('@src/assets/images/ic_home_refresh.png')}
                            style={{ height: PxFit(16), width: PxFit(16), marginRight: PxFit(6) }}
                        />
                        <Text style={{ color: '#888888', fontSize: Font(13) }}>换一批</Text>
                    </Row>
                </Row>
            </View>
            {/*    <FlatList
                    horizontal={true}
                    data={categories.slice(0, 3)}
                    renderItem={({ item }) => <CategoryItem tag={tag} category={item} />}
                    // ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
                    keyExtractor={keyExtractor}
                    showsHorizontalScrollIndicator={false}
                /> */}
            <Row
                style={{
                    justifyContent: categories.length < 3 ? 'flex-start' : 'space-between',
                    alignItems: 'flex-start',
                }}>
                {categories.slice(0, 3).map((item, index) => {
                    return <CategoryItem tag={tag} category={item} key={index} index={index} />;
                })}
            </Row>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: PxFit(5),
        paddingLeft: PxFit(5),
        backgroundColor: '#fff',
        borderRadius: PxFit(10),
        paddingBottom: PxFit(10),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: PxFit(12),
        // marginBottom: PxFit(Theme.itemSpace),
        // borderBottomWidth: PxFit(1),
        // borderColor: Theme.borderColor,
    },
    titleWrap: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: PxFit(Theme.itemSpace),
    },
    title: {
        color: Theme.defaultTextColor,
        fontSize: Font(16),
        lineHeight: PxFit(22),
        fontWeight: 'bold',
    },
    tagImage: {
        height: PxFit(22),
        width: PxFit(22),
        marginRight: PxFit(4),
    },
    columnStyle: {
        justifyContent: 'space-between',
        marginTop: PxFit(Theme.itemSpace),
    },
    moreCategory: {
        flexDirection: 'row',
        alignItems: 'center',
        height: PxFit(20),
        paddingLeft: PxFit(10),
    },
    moreCategoryText: {
        color: Theme.grey,
        fontSize: Font(13),
        marginRight: PxFit(2),
    },
    itemSeparator: {
        height: PxFit(Theme.itemSpace) * 2,
    },
});

export default HotTags;
