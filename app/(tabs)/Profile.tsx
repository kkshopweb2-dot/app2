import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ProfileScreen: React.FC = () => {
  const router = useRouter();

  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    profilePic: "https://i.pravatar.cc/150?img=12",
    totalOrders: 24,
    pendingOrders: 2,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const recentOrders = [
    { id: "1", type: "Veg", status: "Delivered" },
    { id: "2", type: "Non-Veg", status: "Pending" },
    { id: "3", type: "Veg", status: "Delivered" },
  ];

  // ✅ Save updated profile
  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
    Alert.alert("Profile Updated", "Your profile details were updated successfully.");
  };

  // ✅ Cancel editing
  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  // ✅ Logout Function
  const handleLogout = async () => {
    Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            // Clear session/token from AsyncStorage (if you store login data)
            await AsyncStorage.removeItem("userToken");
            await AsyncStorage.removeItem("userData");

            // Navigate to login screen
            router.replace("/LoginScreen");
          } catch (error) {
            console.error("Logout error:", error);
          }
        },
      },
    ]);
  };

  const renderOrderItem = ({ item }: { item: typeof recentOrders[0] }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderText}>Order: {item.id}</Text>
      <Text style={styles.orderText}>Type: {item.type}</Text>
      <Text
        style={[
          styles.orderText,
          item.status === "Delivered"
            ? styles.delivered
            : item.status === "Pending"
            ? styles.pending
            : styles.cancelled,
        ]}
      >
        Status: {item.status}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image source={{ uri: user.profilePic }} style={styles.avatar} />

        {isEditing ? (
          <>
            <TextInput
              style={styles.input}
              value={editedUser.name}
              onChangeText={(text) =>
                setEditedUser({ ...editedUser, name: text })
              }
              placeholder="Name"
            />
            <TextInput
              style={styles.input}
              value={editedUser.email}
              onChangeText={(text) =>
                setEditedUser({ ...editedUser, email: text })
              }
              placeholder="Email"
            />
            <TextInput
              style={styles.input}
              value={editedUser.phone}
              onChangeText={(text) =>
                setEditedUser({ ...editedUser, phone: text })
              }
              placeholder="Phone"
            />
          </>
        ) : (
          <>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
            <Text style={styles.phone}>{user.phone}</Text>
          </>
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{user.totalOrders}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{user.pendingOrders}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {/* Recent Orders */}
      <View style={styles.recentOrdersContainer}>
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        <FlatList
          data={recentOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        {isEditing ? (
          <>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#10B981" }]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.logoutButton]}
              onPress={handleCancel}
            >
              <Text style={[styles.buttonText, { color: "#6B7280" }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.logoutButton]}
              onPress={handleLogout}
            >
              <Text style={[styles.buttonText, { color: "#EF4444" }]}>
                Logout
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111827",
  },
  email: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  phone: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 6,
    width: "80%",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    color: "#111827",
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  statBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    width: "40%",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  recentOrdersContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#111827",
  },
  orderCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    width: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  orderText: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 4,
  },
  delivered: { color: "#10B981", fontWeight: "600" },
  pending: { color: "#FBBF24", fontWeight: "600" },
  cancelled: { color: "#EF4444", fontWeight: "600" },
  actionsContainer: {
    alignItems: "center",
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: "#F3F4F6",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default ProfileScreen;
