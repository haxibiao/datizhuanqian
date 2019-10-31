import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, ImageBackground,Text,Dimensions } from 'react-native';

import { Theme, PxFit, SCREEN_WIDTH } from 'utils';
import { ScrollTabBar, PageContainer } from 'components';
import ScrollableTabView from 'react-native-scrollable-tab-view';
 
const { height, width } = Dimensions.get('window');

//导入累计收入排行页
import IncomingRank from './IncomingRank';
//导入连续正确答题数排行页
import CorrectAnsRank from './CorrectAnsRank';

interface Props{
    navigation: any
}

export default function rank(props: Props){

    const navigation = props.navigation;

    return (
        <PageContainer white title={"排行榜"}>
            <ImageBackground source={require('../../assets/images/background.jpg')} style={{width:'100%',height:'100%'}} resizeMode={"cover"}>
            <View style={styles.container}>
                <ScrollableTabView
                    initialPage={0}
                    renderTabBar={ (props:any) => <ScrollTabBar {...props} 
                            tabUnderlineWidth={PxFit(width/3)} 
                            underLineColor={"#EA6D27"}
                            activeTextStyle={{color: "#EA6D27"}}/>}
                >
                    <IncomingRank tabLabel="累计收入排名"/>
                    <CorrectAnsRank tabLabel="答对总数排名"/>
                </ScrollableTabView>
            </View>
            </ImageBackground>
        </PageContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.white,
        marginTop:20,
        marginHorizontal:10,
        borderTopLeftRadius:12,
        borderTopRightRadius:12,
        overflow:'hidden'
    },
});