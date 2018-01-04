'use strict';

import React, { Component } from 'react'
import {
  StyleSheet,
  Image,
  View,
  TouchableHighlight,
  FlatList,
  Text,
  Dimensions,
} from 'react-native';
import MapView from 'react-native-maps';

const { width, height } = Dimensions.get( 'window' );

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const customStyle = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#242f3e',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#746855',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#242f3e',
      },
    ],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#263c3f',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#6b9a76',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#38414e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#212a37',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9ca5b3',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#746855',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#1f2835',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#f3d19c',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [
      {
        color: '#2f3948',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#17263c',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#515c6d',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#17263c',
      },
    ],
  },
];

function ShowRoomNumber( props ) {
  const item = props.item;
  if ( typeof item.room_number !== 'undefined' ) {
    return <Text style={styles.price}>Rooms: {item.room_number}</Text>;
  }

  return <Text style={styles.price}>Rooms: n.a.</Text>;
};

export default class SearchResultDetails extends Component<{}> {
  constructor( props ) {
    super( props );

    this.state = {
      marker1: true,
      marker2: false,
    };
  }

  render() {
    const item = this.props.item;
    const index = this.props.index;
    const price = item.price_formatted.split( ' ' )[ 0 ];
    return (
      <View style={styles.container}>
        <View style={styles.contentview}>
          <Text style={styles.title}>{item.title}</Text>

          <Image style={styles.image} source={{ uri: item.img_url }} />
          <ShowRoomNumber item={item} />
          <Text style={styles.price}>Price: {price}</Text>
        </View>
        <View style={styles.mapview}>
          <MapView
            provider={this.props.provider}
            style={styles.map}
            initialRegion={{
              latitude: item.latitude,
              longitude: item.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
            customMapStyle={customStyle}
          >
            <MapView.Marker
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              centerOffset={{
                x: -42,
                y: -60
              }}
              anchor={{
                x: 0.84,
                y: 1
              }}
              opacity={0.6}
              // image={this.state.marker2 ? flagBlueImg : flagPinkImg}
            />
          </MapView>
        </View>
      </View>
    );
  }
}

SearchResultDetails.propTypes = {
  provider: MapView.ProviderPropType,
};

const styles = StyleSheet.create( {
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#48BBEC',
    marginBottom: 20,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 65,
    padding: 10,
  },
  mapview: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  contentview: {
    flex: 2,
  },
  image: {
    width: 217,
    height: 138,
    marginBottom: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  }
} );
