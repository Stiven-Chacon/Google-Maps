import React from 'react';
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform, StyleSheet, View,ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
//import { GOOGLE_MAPS_KEY } from '@env';
const carImage = require('./Assets/img/car.png')
const App = () => {
  {/* Pin de origen */ }
  const [origin, setOrigin] = React.useState({
    latitude: 0,
    longitude: 0
  })

  {/* Pin de destinatario */ }
  const [destinatario, setDestinatario] = React.useState({
    latitude: 5.0744744531285075,
    longitude: -75.52731297446452,
  })
  /* Colocamos un loading para que no muestre nada hasta que la ubicacion de origen sea diferente a 0 */
  const [loading, setLoading] = React.useState(true);

  //Funcion para la ubicacion precisa del telefono
  React.useEffect(() => {
    // Solicitar permisos de ubicación (solo para Android)
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ]).then((result) => {
        if (
          result['android.permission.ACCESS_FINE_LOCATION'] === 'granted' &&
          result['android.permission.ACCESS_COARSE_LOCATION'] === 'granted'
        ) {
          console.log('Permisos de ubicación concedidos');
          /* Guardamos la ubicacion en el telefono en Origin */
          Geolocation.getCurrentPosition((position) => {
            setOrigin({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            setLoading(false);
          }, (error) => {
            console.error('Error fetching location:', error.message);
            setLoading(false);
          });
        } else {
          console.log('Permisos de ubicación denegados');
          setLoading(false);
        }
      });
    }
  }, []);
/* Aca hacemos una validacion que si loading es true que lo muestre en lo contrario que lo apague
Y consigo lo apaga y muestra la ubicacion del telefono*/
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.09,
          longitudeDelta: 0.04
        }}>
        {/* Pin de origen */}
        <Marker
          draggable
          coordinate={origin}
          onDragEnd={(direction) => setOrigin(direction.nativeEvent.coordinate)}
          image={carImage}
        />
        {/* Pin de destinatario */}
        <Marker
          draggable
          coordinate={destinatario}
          onDragEnd={(direction) => setDestinatario(direction.nativeEvent.coordinate)}

        />
        {/* Linea que marca el camino por las calles */}
        <MapViewDirections
          origin={origin}
          destination={destinatario}
          apikey='TU_API_KEY'
          strokeColor="black"
          strokeWidth={5}
        />

        {/* linea de destinatario a origen */}
        <Polyline
          coordinates={[origin, destinatario]}
          strokeColor='red'
          strokeWidth={3}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default App;
