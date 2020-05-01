/*
 * @Author: Gaoxuan
 * @Date:   2019-05-24 14:04:38
 */
import React, { Component } from 'react';
import { StyleSheet, Image, ScrollView } from 'react-native';
import { PageContainer } from 'components';
class Recruit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: 0.1,
        };
    }

    render() {
        return (
            <PageContainer white title={'版主招募'}>
                <ScrollView style={{ flex: 1 }}>
                    <Image
                        source={require('../../assets/images/recruit1.jpg')}
                        style={{
                            width: Device.WIDTH,
                            height: (Device.WIDTH * 1920) / 1080,
                        }}
                    />
                    <Image
                        source={require('../../assets/images/recruit2.jpg')}
                        style={{
                            width: Device.WIDTH,
                            height: (Device.WIDTH * 1920) / 1080,
                        }}
                    />
                    <Image
                        source={require('../../assets/images/recruit3.jpg')}
                        style={{
                            width: Device.WIDTH,
                            height: (Device.WIDTH * 1920) / 1080,
                        }}
                    />
                    <Image
                        source={require('../../assets/images/recruit4.jpg')}
                        style={{
                            width: Device.WIDTH,
                            height: (Device.WIDTH * 1920) / 1080,
                        }}
                    />
                </ScrollView>
            </PageContainer>
        );
    }
}

export default Recruit;
