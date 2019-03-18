/*
* @flow
* created by wyk made in 2019-01-10 11:57:47
*/
'use strict';

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Theme, PxFit } from '../../utils';

function ItemSeparator(props: { height: number, color: any }) {
	let height = props.height || PxFit(8);
	let color = props.color || Theme.groundColour;
	return <View style={{ height, backgroundColor: color }} />;
}

const styles = StyleSheet.create({});

export default ItemSeparator;
