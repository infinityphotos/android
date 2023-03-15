import "./native-node-modules-hack.js";

import { WebBundlr } from "@bundlr-network/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import { SaveFormat } from "expo-image-manipulator";
import { StatusBar } from "expo-status-bar";
import lz from "lz-string";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View
} from "react-native";
import ImageView from "react-native-image-viewing";
import SolanaPrivateKeyWallet from "./utils/SolanaWallet/SolanaWallet";

const key: number[] = JSON.parse(
  "[224,132,224,96,91,23,248,141,53,46,104,207,7,103,210,101,76,84,9,16,163,47,242,181,10,101,186,56,138,168,39,58,35,150,203,185,83,226,91,118,215,176,221,39,190,83,112,210,212,190,185,1,204,241,218,171,165,138,205,94,149,142,131,115]".toString()
);

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function Loader() {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size={52} color="#841584" />
    </View>
  );
}

export default function HomeScreen() {
  const [loader, showLoader] = useState(false);
  const [images, setImages] = useState([] as any[]);
  const [imageViewerVisible, toggleImageViewer] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([] as any[]);

  useEffect(() => {
    AsyncStorage.getItem("uploadedData").then((resp) => {
      if (resp) {
        const dataURLs = JSON.parse(resp);
        AsyncStorage.multiGet(dataURLs).then((thumbnailDatas) => {
          const data = thumbnailDatas.map((thumbnailData) => {
            if (thumbnailData[1]) {
              const thumbnail = JSON.parse(thumbnailData[1]);
              thumbnail.data = "data:image/png;base64," + thumbnail.data;
              return thumbnail;
            }
            return null;
          });
          setUploadedFiles(data);
        });
      }
    });
  }, []);

  const onUploadFile = () => {
    uploadFile()
      .then((dataURL) => {
        AsyncStorage.getItem(dataURL).then((resp) => {
          if (resp) {
            const thumbnailData = JSON.parse(resp);
            thumbnailData.data = "data:image/png;base64," + thumbnailData.data;
            setUploadedFiles([...uploadedFiles, thumbnailData]);
          }
        });
      })
      .catch((err) => {
        ToastAndroid.show(err, ToastAndroid.SHORT);
      });
  };

  const downloadFile = async (dataURL: string) => {
    fetch(dataURL)
      .then(async (resp: Response) => {
        const data = await resp.json();
        const imageData = lz.decompress(data.data);
        setImages([{ uri: "data:image/png;base64," + imageData }]);
        showLoader(false);
      })
      .catch((err) => {
        ToastAndroid.show("Internet Unavailable", ToastAndroid.LONG);
        showLoader(false);
      });
  };

  const onOpenView = (thumbnailData: any) => {
    showLoader(true);
    setImages([{ uri: thumbnailData.data }]);
    toggleImageViewer(true);
    downloadFile(thumbnailData.dataURL);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent={false} backgroundColor={"transparent"} />
      <View style={{ display: "flex", alignItems: "center", margin: 5 }}>
        <Text style={{ fontSize: 20 }}>📸</Text>
      </View>
      <View style={{ display: "flex", alignItems: "center", margin: 5 }}>
        <Text style={{ fontSize: 20 }}>Infinity Photos</Text>
      </View>
      <View style={styles.urlsList}>
        <View style={{ display: "flex", alignItems: "center" }}>
          <Text style={{ fontSize: 18 }}>Your Photos</Text>
        </View>
        <ScrollView style={{ padding: 10 }}>
          {uploadedFiles.map((thumbnailData, i) => (
            <TouchableOpacity
              key={i}
              style={{
                borderBottomWidth: 1,
                flex: 1,
                marginBottom: 5,
                alignItems: "flex-start",
                flexWrap: "nowrap",
                flexDirection: "row",
              }}
              onPress={() => onOpenView(thumbnailData)}
            >
              <Image
                source={{ uri: thumbnailData.data }}
                style={{
                  width: 64,
                  height: 64,
                  marginRight: 10,
                }}
              />
              <View>
                <Text>{thumbnailData.name}</Text>
                <Text style={{ opacity: 0.5 }}>
                  Size: {formatBytes(thumbnailData.size)}, Type:{" "}
                  {thumbnailData.type}
                </Text>
                <Text style={{ opacity: 0.5 }}>
                  URL: {thumbnailData?.dataURL?.slice(0, 25) + "..."}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.uploadFileForm}>
        <TouchableOpacity
          style={styles.uploadFileButton}
          onPress={onUploadFile}
        >
          <Text style={styles.plusIconText}>+</Text>
        </TouchableOpacity>
      </View>
      <ImageView
        images={images}
        imageIndex={0}
        visible={imageViewerVisible}
        onRequestClose={() => toggleImageViewer(!imageViewerVisible)}
        HeaderComponent={loader ? Loader : undefined}
      ></ImageView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    top: Dimensions.get("window").height / 2,
  },
  input: {
    borderBottomWidth: 2,
    borderColor: "black",
  },
  urlsList: {
    padding: 10,
    display: "flex",
  },
  uploadFileForm: {
    position: "absolute",
    bottom: 12,
    right: 12,
  },
  uploadFileButton: {
    color: "white",
    backgroundColor: "#841584",
    width: 50,
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  plusIconText: {
    color: "white",
    fontSize: 20,
  },
});

async function uploadData(data: string): Promise<string> {
  const solanaWallet = new SolanaPrivateKeyWallet(key);
  const bundlr = new WebBundlr(
    "https://devnet.bundlr.network",
    "solana",
    solanaWallet,
    {
      providerUrl: "https://api.devnet.solana.com/",
    }
  );

  //Wait for bundlr to get initialized
  await bundlr.ready();

  // get your account address (associated with your private key)
  const address = bundlr.address;
  console.log(address);

  // get your accounts balance
  const balance = await bundlr.getLoadedBalance();
  console.log(balance);

  // convert it into decimal units
  const decimalBalance = bundlr.utils.unitConverter(balance);

  console.log(decimalBalance);

  // you should have 0 balance (unless you've funded before), so lets add some funds:
  // Reminder: this is in atomic units (see https://docs.bundlr.network/docs/faq#what-are-baseatomic-units)
  // const fundStatus = await bundlr.fund(100000000);
  // this will take up to an hour to show up for arweave - other currencies are faster.

  // create a Bundlr Transaction
  const tx = bundlr.createTransaction(data);

  // want to know how much you'll need for an upload? simply:
  // get the number of bytes you want to upload
  const size = tx.size;
  console.log("size: " + size);
  // query the bundlr node to see the price for that amount
  const cost = await bundlr.getPrice(size);
  console.log("cost: " + cost);

  // sign the transaction
  await tx.sign();
  // get the transaction's ID:
  const id = tx.id;
  // upload the transaction
  const result = await tx.upload();

  const dataURL = "https://arweave.net/" + id;
  console.log(dataURL);
  return dataURL;
  // once the upload succeeds, your data will be instantly accessible at `https://arweave.net/${id}`
}

async function uploadFile(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    DocumentPicker.getDocumentAsync({ type: "image/*" }).then((fileMeta) => {
      if (fileMeta.type === "success") {
        FileSystem.readAsStringAsync(fileMeta.uri, { encoding: "base64" }).then(
          async (file) => {
            if (file) {
              const compressedFile = lz.compress(file);
              const txData = JSON.stringify({
                name: fileMeta.name,
                type: fileMeta.mimeType,
                isFile: true,
                data: compressedFile,
              });
              const dataURL = await uploadData(txData);
              ImageManipulator.manipulateAsync(
                fileMeta.uri,
                [{ resize: { width: 64 } }],
                {
                  base64: true,
                  format: SaveFormat.PNG,
                  compress: 0.0,
                }
              )
                .then(async (resp) => {
                  const thumbnailData = {
                    name: fileMeta.name,
                    type: fileMeta.mimeType,
                    size: fileMeta.size,
                    data: resp.base64,
                    dataURL: dataURL,
                  };
                  await AsyncStorage.setItem(
                    dataURL,
                    JSON.stringify(thumbnailData)
                  );
                  resolve(dataURL);
                  AsyncStorage.getItem("uploadedData")
                    .then((resp) => {
                      if (resp) {
                        AsyncStorage.setItem(
                          "uploadedData",
                          JSON.stringify([...JSON.parse(resp), dataURL])
                        );
                      } else {
                        AsyncStorage.setItem(
                          "uploadedData",
                          JSON.stringify([dataURL])
                        );
                      }
                    })
                    .catch((err) => {
                      AsyncStorage.setItem(
                        "uploadedData",
                        JSON.stringify([dataURL])
                      );
                    });
                })
                .catch((err) => {
                  resolve(dataURL);
                });
            } else {
              reject("Invalid File");
            }
          }
        );
      } else if (fileMeta.type === "cancel") {
        reject("No File Selected");
      }
    });
  });
}
