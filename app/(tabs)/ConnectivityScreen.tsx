import NetInfo from "@react-native-community/netinfo";
import * as FileSystem from "expo-file-system";
import React, { useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RNBluetoothClassic, { BluetoothDevice } from "react-native-bluetooth-classic";
import { NetworkInfo } from "react-native-network-info";
import { check, PERMISSIONS, request } from "react-native-permissions";
import TcpSocket from "react-native-tcp-socket";

const PORT = 5000;

const ConnectivityScreen = () => {
  const [wifiStatus, setWifiStatus] = useState<string>("Not checked yet");
  const [bluetoothStatus, setBluetoothStatus] = useState<string>("Idle");
  const [fileInfo, setFileInfo] = useState<string>("No file selected");
  const [shareStatus, setShareStatus] = useState<string>("Waiting to connect");
  const [bluetoothDevices, setBluetoothDevices] = useState<BluetoothDevice[]>([]);
  const [wifiClients, setWifiClients] = useState<string[]>([]);

  const serverRef = useRef<any | null>(null);

  // ------------------ Helpers ------------------
  const notify = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  const DOCUMENT_DIR = FileSystem.FileSystem.documentDirectory as string | null;

  // ------------------ Wi-Fi ------------------
  const checkWifiConnection = () => {
    setWifiStatus("Checking...");
    NetInfo.fetch().then((state) => {
      setWifiStatus(`Type: ${state.type}, Connected: ${state.isConnected}`);
    });
  };

  // ------------------ Bluetooth ------------------
  const checkBluetoothPermission = async () => {
    const permission =
      Platform.OS === "ios"
        ? PERMISSIONS.IOS.BLUETOOTH
        : PERMISSIONS.ANDROID.BLUETOOTH_SCAN;

    let result = await check(permission);
    if (result !== "granted") {
      result = await request(permission);
    }
    setBluetoothStatus(`Permission: ${result}`);
  };

  const scanForDevices = async () => {
    setBluetoothStatus("Scanning...");
    try {
      const paired = await RNBluetoothClassic.getBondedDevices();
      setBluetoothDevices(paired);
      setBluetoothStatus(`Found ${paired.length} paired device(s).`);
      paired.forEach((device) => notify("Paired Device", `Device found: ${device.name}`));
    } catch (error) {
      setBluetoothStatus("Error scanning for devices.");
      notify("Bluetooth Error", "Error scanning for devices.");
    }
  };

  // ------------------ Wi-Fi Direct File Sharing ------------------
  const startServer = async () => {
    if (!DOCUMENT_DIR) {
      setShareStatus("Error: Document directory not available.");
      notify("File System Error", "Document directory is not available.");
      return;
    }

    const localIP = await NetworkInfo.getIPAddress();
    setShareStatus("Starting server...");
    setWifiClients([]);

    const server = TcpSocket.createServer((socket: TcpSocketType) => {
      const clientInfo = `${socket.remoteAddress}:${socket.remotePort}`;
      setWifiClients((prev) => [...prev, clientInfo]);
      notify("New Wi-Fi Client", `Client connected: ${clientInfo}`);

      socket.on("data", async (data: any) => {
        try {
          const path = `${DOCUMENT_DIR}received_file`;
          await FileSystem.writeAsStringAsync(path, data, { encoding: "base64" });
          setShareStatus(`File received at ${path}`);
          notify("File Received", `File received from ${clientInfo}`);
        } catch (err) {
          setShareStatus("Error saving file: " + err);
        }
      });

      socket.on("close", () => {
        setShareStatus("Client disconnected");
        setWifiClients((prev) => prev.filter((c) => c !== clientInfo));
        notify("Client Disconnected", `Client disconnected: ${clientInfo}`);
      });

      socket.on("error", (err: any) => {
        setShareStatus("Socket error: " + err);
        notify("Socket Error", `${err}`);
      });
    }).listen({ port: PORT, host: "0.0.0.0" });

    serverRef.current = server;
    setShareStatus(`Server running at ${localIP}:${PORT}`);
  };

  // ------------------ UI Components ------------------
  const ActionButton = ({ title, onPress, color }: any) => (
    <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  const StatusBadge = ({ status }: any) => (
    <View
      style={[
        styles.statusBadge,
        status.includes("Error") || status.includes("Not") ? styles.statusError : styles.statusOk,
      ]}
    >
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );

  const renderDeviceList = (devices: BluetoothDevice[] | string[]) => (
    <FlatList
      data={devices}
      keyExtractor={(item, index) => (typeof item === "string" ? item : item.id || index.toString())}
      renderItem={({ item }) => <Text style={{ paddingVertical: 2 }}>• {typeof item === "string" ? item : item.name}</Text>}
    />
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Wi-Fi */}
      <View style={[styles.card, { borderLeftColor: "#007bff" }]}>
        <Text style={styles.header}>📶 Wi-Fi</Text>
        <ActionButton title="Check Connection" onPress={checkWifiConnection} color="#007bff" />
        <StatusBadge status={wifiStatus} />
      </View>

      {/* Bluetooth */}
      <View style={[styles.card, { borderLeftColor: "#17a2b8" }]}>
        <Text style={styles.header}>🔵 Bluetooth</Text>
        <ActionButton title="Check Permission" onPress={checkBluetoothPermission} color="#17a2b8" />
        <ActionButton title="Scan Devices" onPress={scanForDevices} color="#17a2b8" />
        <StatusBadge status={bluetoothStatus} />
        {bluetoothDevices.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontWeight: "bold" }}>Paired Devices:</Text>
            {renderDeviceList(bluetoothDevices)}
          </View>
        )}
      </View>

      {/* Wi-Fi Direct */}
      <View style={[styles.card, { borderLeftColor: "#28a745" }]}>
        <Text style={styles.header}>📡 Wi-Fi File Sharing</Text>
        <ActionButton title="Start Server" onPress={startServer} color="#28a745" />
        <StatusBadge status={shareStatus} />
        {wifiClients.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontWeight: "bold" }}>Connected Clients:</Text>
            {renderDeviceList(wifiClients)}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ConnectivityScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f7", padding: 10 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  statusBadge: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  statusOk: { backgroundColor: "#d4edda" },
  statusError: { backgroundColor: "#f8d7da" },
  statusText: { color: "#155724", fontSize: 14 },
});
