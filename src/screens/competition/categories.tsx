import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, FlatList, View, Text, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { Theme, SCREEN_WIDTH, Tools, PxFit } from 'utils';
import { useNavigation } from 'react-navigation-hooks';
import { GQL, useQuery, useApolloClient } from 'apollo';
import { syncGetter, exceptionCapture, GetSpecifyDate } from 'common';
import { PageContainer } from 'components';
import { observer, app } from 'store';

export default observer(props => {
    const { me } = app;
    const navigation = useNavigation();
    const client = useApolloClient();

    const { data, refetch } = useQuery(GQL.CategoriesQuery, {
        variables: {
            limit: 100,
        },
    });

    const categories = syncGetter('categories', data);

    return (
        <PageContainer style={styles.container}>
            <View />
            <FlatList
                showsVerticalScrollIndicator={false}
                data={categories}
                keyExtractor={(item, index) => (item.id ? item.id.toString() + Date.now() : index.toString())}
                renderItem={({ item, index }) => <View category={item} navigation={navigation} />}
                onEndReachedThreshold={0.1}
                onEndReached={() => null}
                ListHeaderComponent={() => <View />}
                ListFooterComponent={() => <View finished={this.state.finished} />}
            />
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
    },
});
