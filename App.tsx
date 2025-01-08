import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import {
  Alert,
  Button,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

interface QRCodeWithToDataURL extends QRCode {
  toDataURL: (callback: (data: string) => void) => void;
}

export default function App() {
  const [codeData, setCodeData] = useState<string>("Hello World!");
  const [codeSize, setCodeSize] = useState<number>(128);
  const [qrCodeRef, setQrCodeRef] = useState<QRCodeWithToDataURL | null>(null);

  const handleInput = (str: string) => {
    const result = str === "" ? "Hello World!" : str;
    setCodeData(result);
  };

  const handleSettingsPress = () => {};

  const handleInfosPress = () => {};

  const handleSavePress = async () => {
    if (!qrCodeRef) {
      Alert.alert("Fehler", "QR-Code-Referenz nicht gefunden.");
      return;
    }

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Zugang verweigert",
          "Zugriff auf die Mediathek verweigert!"
        );
        return;
      }

      qrCodeRef?.toDataURL(async (data: string) => {
        const fileUri = `${FileSystem.documentDirectory}qrcode.png`;

        await FileSystem.writeAsStringAsync(fileUri, data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const asset = await MediaLibrary.createAssetAsync(fileUri);
        await MediaLibrary.createAlbumAsync("QR Codes", asset, false);

        Alert.alert("Erfolg", "QR-Code wurde in der Galerie gespeichert!");
      });
    } catch (error) {
      console.error("Fehler beim Speichern des QR-Codes:", error);
      Alert.alert("Fehler", "QR-Code konnte nicht gespeichert werden.");
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.AreaView}>
        <View style={styles.container}>
          <View style={styles.QRCodeContainer}>
            <QRCode
              getRef={(ref) => setQrCodeRef(ref)}
              value={codeData}
              size={codeSize}
            />
          </View>
          <StatusBar style="auto" />

          <View style={styles.Properties}>
            <View style={styles.InputActions}>
              <View>
                <TextInput
                  style={styles.InputField}
                  placeholder="Enter here your Text..."
                  onChangeText={(str: string) => handleInput(str)}
                  multiline={true}
                />
              </View>
            </View>
            <View style={styles.SaveActions}>
              <View style={styles.SaveActionsHeader}>
                <Text style={styles.Header}>Export</Text>
              </View>
              <View style={styles.SaveButton}>
                <AntDesign name="download" size={24} color="white" />
                <Button title="Speichern" onPress={handleSavePress} />
              </View>
            </View>
          </View>

          <View style={styles.ToolbarBottom}>
            <View style={styles.ToolbarBottomLeft}>
              <Pressable style={styles.PressableIcon}>
                <AntDesign name="setting" size={24} color="white" />
              </Pressable>
            </View>

            <View style={styles.ToolbarBottomRight}>
              <Pressable style={styles.PressableIcon}>
                <AntDesign name="infocirlceo" size={24} color="white" />
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  AreaView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#141414",
    alignItems: "center",
    justifyContent: "center",
  },
  Properties: {
    display: "flex",
    flexDirection: "column",
  },
  Header: {
    color: "#fff",
    fontSize: 24,
    textAlign: "center",
  },
  InputActions: {
    marginTop: 32,
    width: "100%",
  },
  SaveActions: {
    marginTop: 32,
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  SaveActionsHeader: {
    marginBottom: 18,
  },
  InputField: {
    padding: 10,
    backgroundColor: "gray",
    borderRadius: 5,
  },
  QRCodeContainer: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  ToolbarBottom: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 48,
    backgroundColor: "#505050",
    zIndex: 999,
    display: "flex",
    flexDirection: "row",
  },
  ToolbarBottomLeft: {
    marginRight: "auto",
    height: "100%",
    aspectRatio: 1,
  },
  ToolbarBottomRight: {
    marginLeft: "auto",
    height: "100%",
    aspectRatio: 1,
  },
  PressableIcon: {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  SaveButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 12,
  },
});
