import { useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Mock order data
const orders = [
  { id: '1', client: 'John Doe', type: 'Veg', status: 'Delivered' },
  { id: '2', client: 'Jane Smith', type: 'Non-Veg', status: 'Pending' },
  { id: '3', client: 'Alice Johnson', type: 'Veg', status: 'Cancelled' },
];

// Optional: Type definition for params
type RootStackParamList = {
  OrderHistory: undefined;
  UpdateStatus: { orderId: string };
  MapScreen: { orderId: string }; // 👈 Added MapScreen route
};

const OrderHistory: React.FC = () => {
  const router = useRouter();

  // ✅ Navigate to MapScreen with orderId
  const handleTrackOrder = (id: string) => {
    router.push({ pathname: '/Map', params: { orderId: id } });
  };

  const handleUpdateStatus = (id: string) => {
    router.push({ pathname: '/UpdateStatus', params: { orderId: id } });
  };

  const renderOrderItem = ({ item }: { item: typeof orders[0] }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderRow}>
        <Text style={styles.label}>Client:</Text>
        <Text style={styles.value}>{item.client}</Text>
      </View>

      <View style={styles.orderRow}>
        <Text style={styles.label}>Order ID:</Text>
        <Text style={styles.value}>{item.id}</Text>
      </View>

      <View style={styles.orderRow}>
        <Text style={styles.label}>Type:</Text>
        <View style={styles.typeContainer}>
          <View
            style={[
              styles.typeDot,
              { backgroundColor: item.type === 'Veg' ? '#10B981' : '#EF4444' },
            ]}
          />
          <Text style={styles.value}>{item.type}</Text>
        </View>
      </View>

      <View style={styles.orderRow}>
        <Text style={styles.label}>Status:</Text>
        <Text
          style={[
            styles.value,
            item.status === 'Delivered'
              ? styles.delivered
              : item.status === 'Pending'
              ? styles.pending
              : styles.cancelled,
          ]}
        >
          {item.status}
        </Text>
      </View>

      {/* ✅ Buttons side by side */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.trackButton]}
          onPress={() => handleTrackOrder(item.id)}
        >
          <Text style={styles.buttonText}>Track</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.statusButton]}
          onPress={() => handleUpdateStatus(item.id)}
        >
          <Text style={styles.buttonText}>Update Status</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={require('../../assets/images/bg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Order History</Text>
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ImageBackground>
  );
};

// Styles
const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 16 },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#111827',
  },
  list: { paddingBottom: 20 },
  orderCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    alignItems: 'center',
  },
  label: { fontWeight: '500', color: '#6B7280' },
  value: { fontWeight: '600', color: '#111827' },
  typeContainer: { flexDirection: 'row', alignItems: 'center' },
  typeDot: { width: 12, height: 12, borderRadius: 6, marginRight: 6 },
  delivered: { color: '#10B981', fontWeight: '600' },
  pending: { color: '#FBBF24', fontWeight: '600' },
  cancelled: { color: '#EF4444', fontWeight: '600' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  trackButton: { backgroundColor: '#4F46E5' },
  statusButton: { backgroundColor: '#10B981' },
  buttonText: { color: '#fff', fontWeight: '500', fontSize: 16 },
});

export default OrderHistory;
