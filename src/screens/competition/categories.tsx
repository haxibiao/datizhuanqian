import React, { useMemo } from 'react';
import { StyleSheet, FlatList, View, Text, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { PageContainer, Row } from '@src/components';
import { Theme, SCREEN_WIDTH, PxFit } from 'utils';
import { useNavigation } from 'react-navigation-hooks';
import { GQL, useQuery } from 'apollo';
import { syncGetter } from 'common';
import { observer, app } from 'store';

import Category from './components/Category';

export default observer(props => {
    const navigation = useNavigation();

    const { data } = useQuery(GQL.CategoriesQuery, {
        variables: {
            limit: 100,
        },
    });

    const categories = useMemo(() => syncGetter('categories', data) || app.categoryCache || Array(12).fill(1), [data]);

    return (
        <PageContainer style={styles.container} white={true} title="选择题库">
            <FlatList
                contentContainerStyle={styles.contentStyle}
                columnWrapperStyle={styles.columnStyle}
                showsVerticalScrollIndicator={false}
                data={categories}
                numColumns={3}
                keyExtractor={(item, index) => (item.id ? item.id.toString() + Date.now() : index.toString())}
                renderItem={({ item, index }) => <Category category={item} navigation={navigation} />}
                onEndReachedThreshold={0.1}
                onEndReached={() => null}
                ListHeaderComponent={() => (
                    <View style={styles.listHeader}>
                        <TouchableOpacity activeOpacity={1} onPress={() => navigation.navigate('Matching')}>
                            <ImageBackground
                                style={styles.randomImage}
                                source={require('@src/assets/images/random_pk.png')}>
                                <Text style={styles.randomText}>随机题目</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                        <Row style={styles.categorySection}>
                            <Image style={styles.categoryIcon} source={require('@src/assets/images/category.png')} />
                            <Text style={styles.categoryText}>题目分类</Text>
                        </Row>
                    </View>
                )}
                ListFooterComponent={() => <View />}
            />
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    categoryIcon: {
        height: PxFit(16),
        marginRight: PxFit(5),
        width: PxFit(16),
    },
    categorySection: {
        marginTop: PxFit(Theme.itemSpace),
    },
    categoryText: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(16),
        fontWeight: 'bold',
    },
    columnStyle: {
        justifyContent: 'space-between',
        marginTop: PxFit(Theme.itemSpace),
    },
    container: {
        backgroundColor: '#fff',
        flex: 1,
    },
    contentStyle: {
        flexGrow: 1,
        padding: PxFit(Theme.itemSpace),
    },
    listHeader: {},
    randomImage: {
        alignItems: 'center',
        borderRadius: PxFit(10),
        height: ((SCREEN_WIDTH - PxFit(Theme.itemSpace) * 2) * 170) / 680,
        justifyContent: 'center',
        overflow: 'hidden',
        width: SCREEN_WIDTH - PxFit(Theme.itemSpace) * 2,
    },
    randomText: {
        color: '#fff',
        fontSize: PxFit(18),
        fontWeight: 'bold',
    },
});
