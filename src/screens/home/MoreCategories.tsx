import React, { useRef, useMemo, useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { CustomRefreshControl, ListFooter, PageContainer } from '@src/components';
import { syncGetter } from '@src/common';
import { SCREEN_WIDTH, Theme, PxFit } from '@src/utils';
import { useQuery, GQL } from '@src/apollo';
import { observer, app } from '@src/store';
import { useNavigation } from 'react-navigation-hooks';
import ListHeader from './components/ListHeader';
import CategoryItem from './components/CategoryItem';

const MoreCategories = props => {
    const navigation = useNavigation();
    const { categories, title, tag } = navigation.state.params;
    const keyExtractor = useCallback((item, index) => {
        return item.id ? item.id.toString() : index.toString();
    }, []);

    const renderItem = useCallback(({ item }) => {
        return <CategoryItem title={item.name} tag={tag} category={item} />;
    }, []);

    return (
        <PageContainer title={title} white style={styles.container}>
            <FlatList
                contentContainerStyle={styles.contentStyle}
                data={categories}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                onEndReachedThreshold={0.2}
                ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
                ListFooterComponent={() => <ListFooter finished={true} />}
                showsVerticalScrollIndicator={false}
            />
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    contentStyle: {
        flexGrow: 1,
        paddingVertical: PxFit(20),
        padding: PxFit(Theme.itemSpace),
        backgroundColor: '#fff',
    },
    itemSeparator: {
        height: PxFit(1),
        marginLeft: PxFit(70 + Theme.itemSpace),
        marginVertical: PxFit(20),
        backgroundColor: '#f0f0f0',
    },
});

export default MoreCategories;
