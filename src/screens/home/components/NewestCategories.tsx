import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { TouchFeedback, Row } from '@src/components';
import { useNavigation } from 'react-navigation-hooks';
import CategoryItem from './CategoryItem';
import RecommendCategoryItem from './RecommendCategoryItem';
import { useQuery, GQL } from '@src/apollo';
import { app } from '@src/store';

const RecommendCategories = () => {
    const { client } = app;
    const [categories, setCategories] = useState([]);
    const count = useRef(0);
    const NewestCategoriesQuery = useCallback(() => {
        return client.query({
            query: GQL.NewestCategoriesQuery,
            variables: { offset: count.current, limit: 3 },
            fetchPolicy: 'network-only',
        });
    }, [client]);

    const getData = async () => {
        const newestCategoriesQuery = await Helper.exceptionCapture(() => NewestCategoriesQuery());

        const newestCategories = Helper.syncGetter('data.newestCategories', newestCategoriesQuery[1]) || [];

        setCategories(newestCategories);
        count.current += newestCategories.length;
    };

    useEffect(() => {
        getData();
    }, []);

    if (categories.length < 1) {
        return null;
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Row>
                    <View style={styles.titleWrap}>
                        <Image source={require('@src/assets/images/category_tag.png')} style={styles.tagImage} />
                        <Text style={styles.title} numberOfLines={1}>
                            最近上线
                        </Text>
                    </View>
                    <TouchFeedback style={{ flexDirection: 'row', alignItems: 'center' }} onPress={getData}>
                        <Image
                            source={require('@src/assets/images/ic_home_refresh.png')}
                            style={{ height: PxFit(16), width: PxFit(16), marginRight: PxFit(6) }}
                        />
                        <Text style={{ color: '#888888', fontSize: Font(13) }}>换一批</Text>
                    </TouchFeedback>
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
                    return <CategoryItem category={item} key={index} index={index} />;
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
        marginTop: PxFit(15),
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

export default RecommendCategories;
