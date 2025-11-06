import { MaterialIcons } from "@expo/vector-icons";
import * as Location from 'expo-location';
import React, { useEffect, useState } from "react";
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

const { width } = Dimensions.get("window");

const RiderMapScreen: React.FC = () => {
  const restaurantLocation = { latitude: 37.78825, longitude: -122.4324 };
  const customerLocation = { latitude: 37.78925, longitude: -122.4224 };
  const routeCoordinates = [
    restaurantLocation,
    { latitude: 37.78875, longitude: -122.4274 },
    
    customerLocation,
  ];

  const [riderLocation, setRiderLocation] = useState<Location.LocationObject | null>(null);
  const [status, setStatus] = useState<"pickup" | "delivering" | "delivered">("pickup");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setRiderLocation(location);

      Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1 }, (newLocation) => {
        setRiderLocation(newLocation);
      });
    })();
  }, []);

  const initialRegion = riderLocation ? {
    latitude: riderLocation.coords.latitude,
    longitude: riderLocation.coords.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  } : {
    latitude: restaurantLocation.latitude,
    longitude: restaurantLocation.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const handleAction = () => {
    if (status === "pickup") setStatus("delivering");
    else if (status === "delivering") setStatus("delivered");
  };

  return (
    <View style={styles.container}>
      {/* Map card */}
      <View style={styles.mapCard}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          region={riderLocation ? { ...initialRegion, latitude: riderLocation.coords.latitude, longitude: riderLocation.coords.longitude } : initialRegion}
          zoomEnabled={true}
          scrollEnabled={true}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          <Polyline coordinates={routeCoordinates} strokeColor="#10B981" strokeWidth={4} />
          <Marker coordinate={restaurantLocation} title="Pickup: Restaurant">
            <View style={[styles.markerCircle, { backgroundColor: "#4F46E5" }]}>
              <MaterialIcons name="restaurant" size={20} color="#fff" />
            </View>
          </Marker>
          <Marker coordinate={customerLocation} title="Drop-off: Customer">
            <View style={[styles.markerCircle, { backgroundColor: "#10B981" }]}>
              <MaterialIcons name="home" size={20} color="#fff" />
            </View>
          </Marker>
          {riderLocation && (
            <Marker coordinate={riderLocation.coords} title="You (Rider)">
              <View style={[styles.markerCircle, { backgroundColor: "#FBBF24" }]}>
                <MaterialIcons name="delivery-dining" size={22} color="#000" />
              </View>
            </Marker>
          )}
        </MapView>
      </View>

      {/* Info panel below map */}
      <View style={styles.infoPanel}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Order #4521</Text>
          <Text style={styles.restaurant}>From: Spice Villa</Text>
          <Text style={styles.customer}>To: John Doe</Text>
        </View>

        <View style={styles.statusContainer}>
          <MaterialIcons
            name={
              status === "pickup"
                ? "restaurant-menu"
                : status === "delivering"
                ? "delivery-dining"
                : "check-circle"
            }
            size={28}
            color={status === "delivered" ? "#10B981" : "#4F46E5"}
          />
          <Text style={styles.statusText}>
            {status === "pickup"
              ? "Go to restaurant to pick up"
              : status === "delivering"
              ? "Delivering to customer..."
              : "Order delivered!"}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: status === "delivered" ? "#9CA3AF" : "#4F46E5" },
          ]}
          disabled={status === "delivered"}
          onPress={handleAction}
        >
          <Text style={styles.buttonText}>
            {status === "pickup"
              ? "Mark as Picked Up"
              : status === "delivering"
              ? "Mark as Delivered"
              : "Completed"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    paddingVertical: 20,
  },
  mapCard: {
    width: width - 32,
    height: 300,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
    marginBottom: 16,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  markerCircle: {
    borderRadius: 20,
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  infoPanel: {
    width: width - 32,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
  },
  orderInfo: {
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 10,
  },
  orderId: { fontSize: 18, fontWeight: "700", color: "#111827" },
  restaurant: { fontSize: 14, color: "#4B5563", marginTop: 4 },
  customer: { fontSize: 14, color: "#4B5563", marginTop: 2 },
  statusContainer: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  statusText: { fontSize: 15, fontWeight: "500", marginLeft: 8, color: "#111827" },
  actionButton: { paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});

export default RiderMapScreen;