'use strict';

import React, { Component } from 'react'
import {
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  FlatList,
  Text,
  Linking,
} from 'react-native';
import SearchResultDetails from './SearchResultDetails';
import PTRView from 'react-native-pull-to-refresh';

function urlForQueryAndPage( key, value, pageNumber ) {
  const data = {
    country: 'uk',
    pretty: '1',
    encoding: 'json',
    listing_type: 'buy',
    action: 'search_listings',
    page: pageNumber,
  };
  data[ key ] = value;

  const querystring = Object.keys( data )
    .map( key => key + '=' + encodeURIComponent( data[ key ] ) )
    .join( '&' );

  return 'https://api.nestoria.co.uk/api?' + querystring;
}

class ListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem( this.props.index, this.props.item );
  };
  render() {
    const item = this.props.item;
    const price = item.price_formatted.split( ' ' )[ 0 ];
    return (
      <TouchableHighlight
        onPress={this._onPress}
        underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            <Image style={styles.thumb} source={{ uri: item.img_url }} />
            <View style={styles.textContainer}>
              <Text style={styles.price}>{price}</Text>
              <Text style={styles.title}
                    numberOfLines={1}>{item.title}</Text>
            </View>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    );
  }
}

export default class SearchResults extends Component<{}> {
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
      this.props.navigator.replace ( {
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

  _refresh = () => {
    return new Promise( (  ) => {
      this._onSearchPressed()
    } );
  };

  render() {
    return (
      <PTRView onRefresh={this._refresh}>
        <FlatList
          data={this.props.listings}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />
      </PTRView>
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