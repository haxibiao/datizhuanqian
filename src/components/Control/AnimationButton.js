/*
* @flow
* created by wyk made in 2019-02-13 14:51:53
*/
'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View,TouchableOpacity, ActivityIndicator } from 'react-native';
import { Mutation} from 'react-apollo';
import { Methods } from '../../helpers';

type IndicatorSize = number | 'small' | 'large';

type Props = {
	mutation:any,
	variables:any,
	onCompleted:Function,
	onError:Function,
	waitingSpinnerSize?: IndicatorSize,
	waitingSpinnerColor?: ?string,
	...TouchableWithoutFeedback.propTypes
};

type State = {
	loading: boolean,
};

class AnimationButton extends Component<Props,State> {
	static defaultProps = {
		variables:{},
		onCompleted:(result)=>result,
		onError:()=>null,
		waitingSpinnerSize: 'small',
		waitingSpinnerColor: '#fff',
		activeOpacity: 0.6,
	};

	constructor(props:Props) {
	  super(props);
	  this.state = {
	  	loading:false
	  };
	}

	onCompleted = (result)=> {
		if(this.props.onCompleted instanceof Function){
			this.props.onCompleted(result);
		}
		this.setState({loading:false});
	}

	onError = (error)=> {
		if(this.props.onError instanceof Function){
			this.props.onError();
		}else {
			Methods.toast('哎呀，出问题啦');
		}
		this.setState({loading:false})
	}

	onPress = (mutate:Function)=> {
		this.setState({loading:true});
		mutate();
	}

	render() {
		let { style,children,waitingSpinnerSize,waitingSpinnerColor,mutation,variables,disabled,...others } = this.props;
		let {loading}=this.state;
		return (
			<Mutation
				mutation={mutation}
				variables={variables}
				onCompleted={this.onCompleted}
				onError={this.onError}
			>
				{mutate=>{
					return (
						<TouchableOpacity {...others} onPress={()=>this.onPress(mutate)} style={[styles.button,style,disabled&&{opacity: 0.6}]} disabled={loading||disabled}>
							{loading?<View style={styles.indicator}><ActivityIndicator color={waitingSpinnerColor} size={waitingSpinnerSize} /></View>:children}
						</TouchableOpacity>
					)
				}}
			</Mutation>
		);
	}
}

const styles = StyleSheet.create({
	button:{
		flex:1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	indicator:{
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export default AnimationButton;