'use strict';

import React, { Component } from 'react'
import {
	StyleSheet,
	Image,
	View,
	TouchableHighlight,
	FlatList,
	Text,
	ListView,
	RefreshControl,
	Linking,
} from 'react-native';
import SearchResultDetails from './SearchResultDetails';
import ListItem from './components/ListItem';
import { urlForQueryAndPage } from './services/SearchHandlers';

export default class SearchResults extends Component<{}> {
	constructor( props ) {
		super( props );
		this.state = {
			refreshing: false,
		};
	}

	_keyExtractor = ( item, index ) => index;

	_renderItem = ( { item, index } ) => (
		<ListItem
			item={item}
			index={index}
			onPressItem={this._onPressItem}
		/>
	);

	_onPressItem = ( index, item ) => {
		this.props.navigator.push( {
			title: 'Detail',
			component: SearchResultDetails,
			passProps: {
				item: item,
				index: index
			}
		} );
	};

	_executeQuery = ( query ) => {
		this.setState( { isLoading: true } );
		fetch( query )
			.then( response => response.json() )
			.then( json => this._handleResponse( json.response ) )
			.catch( error =>
				this.setState( {
					isLoading: false,
					message: 'Something bad happened ' + error
				} ) );
	};

	_handleResponse = ( response ) => {
		this.setState( {
			isLoading: false,
			message: ''
		} );
		if ( response.application_response_code.substr( 0, 1 ) === '1' ) {
			this.props.navigator.replace( {
				title: 'Results',
				component: SearchResults,
				passProps: { listings: response.listings }
			} );
		} else {
			this.setState( { message: 'Location not recognized; please try again.' } );
		}
	};

	_onSearchPressed = () => {
		const query = urlForQueryAndPage( 'place_name', this.props.place_name, 1 );

		this._executeQuery( query );
	};

	_onRefresh() {
		this._onSearchPressed();
	}

	render() {
		return (
			<FlatList
				data={this.props.listings}
				keyExtractor={this._keyExtractor}
				renderItem={this._renderItem}
				refreshControl={
					<RefreshControl
						refreshing={this.state.refreshing}
						onRefresh={this._onRefresh.bind(this)}
					/>
				}
			/>
		);
	}
}

const styles = StyleSheet.create( {
	thumb: {
		width: 80,
		height: 80,
		marginRight: 10
	},
	textContainer: {
		flex: 1
	},
	separator: {
		height: 1,
		backgroundColor: '#dddddd'
	},
	price: {
		fontSize: 25,
		fontWeight: 'bold',
		color: '#48BBEC'
	},
	title: {
		fontSize: 20,
		color: '#656565'
	},
	rowContainer: {
		flexDirection: 'row',
		padding: 10
	},
} );
