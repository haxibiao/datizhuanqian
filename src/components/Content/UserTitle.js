/*
 * @Author: Gaoxuan
 * @Date:   2019-03-22 13:34:41
 */

import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, ImageBackground } from 'react-native';

class UserTitle extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let { navigation, user } = this.props;
        return (
            <ImageBackground
                source={require('@src/assets/images/bg_user_level.png')}
                style={{
                    height: PxFit(11),
                    width: (PxFit(11) * 82) / 35,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: PxFit(5),
                }}>
                <Text style={{ fontSize: PxFit(8), color: '#fff' }}>Lv.{user.level.level}</Text>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({});

export default UserTitle;
