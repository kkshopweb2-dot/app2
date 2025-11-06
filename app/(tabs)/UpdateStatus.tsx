import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from 'expo-image-picker'; // 👈 Import expo-image-picker

const UpdateStatusScreen: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [screenshot, setScreenshot] = useState<string | null>(null);

  // Mock order details (you can replace these with props or API data)
  const order = {
    id: "ORD-4521",
    customerName: "John Doe",
    message: "Please deliver before 8 PM.",
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=600&q=80",
  };

  const handleUpdateStatus = () => {
    console.log("Updating status to:", selectedStatus);
    Alert.alert(
      "Status Updated",
      `Order status updated to: ${selectedStatus}${
        screenshot ? "\nScreenshot uploaded ✅" : ""
      }`
    );
  };

  const handleUploadScreenshot = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Denied",
        "You need to grant permission to access the photo library to upload a screenshot."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      if (result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setScreenshot(uri || null);
        console.log("Screenshot selected:", uri);
      }
    } else {
      console.log("User cancelled image picker");
    }
  };

  return (
    <View style={styles.container}>
      {/* Order Card */}
      <View style={styles.orderCard}>
        <Image source={{ uri: order.image }} style={styles.orderImage} />
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Order ID: {order.id}</Text>
          <Text style={styles.customerName}>{order.customerName}</Text>
          <Text style={styles.message}>{order.message}</Text>
        </View>
      </View>

      {/* Status Selector */}
      <View style={styles.statusContainer}>
        <Text style={styles.label}>Select Order Status</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedStatus}
            onValueChange={(itemValue: any) => setSelectedStatus(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Pending" value="pending" />
            <Picker.Item label="Out for Delivery" value="out_for_delivery" />
            <Picker.Item label="Delivered" value="delivered" />
            <Picker.Item label="Cancelled" value="cancelled" />
          </Picker>
        </View>
      </View>

      {/* Screenshot Upload */}
      <View style={styles.uploadContainer}>
        <Text style={styles.label}>Upload Screenshot (optional)</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={handleUploadScreenshot}>
          <Text style={styles.uploadButtonText}>
            {screenshot ? "Change Screenshot" : "Upload Screenshot"}
          </Text>
        </TouchableOpacity>
        {screenshot && (
          <Image source={{ uri: screenshot }} style={styles.previewImage} />
        )}
      </View>

      {/* Update Button */}
      <TouchableOpacity style={styles.button} onPress={handleUpdateStatus}>
        <Text style={styles.buttonText}>Update Status</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  orderCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    marginBottom: 25,
  },
  orderImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  orderInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  orderId: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  message: {
    fontSize: 14,
    color: "#4B5563",
    marginTop: 4,
  },
  statusContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 10,
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  uploadContainer: {
    marginBottom: 30,
  },
  uploadButton: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "500",
  },
  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default UpdateStatusScreen;
