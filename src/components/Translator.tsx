import { useMemo, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Colors } from "../theme";
import ContentCard from "./ContentCard";

const languagesArray = {
  pl: "Polski",
  en: "English",
  uk: "Українська",
  ru: "Русский",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  it: "Italiano",
  pt: "Português",
  nl: "Nederlands",
  cs: "Čeština",
  sk: "Slovenčina",
  hu: "Magyar",
  ro: "Română",
  bg: "Български",
  el: "Ελληνικά",
  tr: "Türkçe",
  sv: "Svenska",
  da: "Dansk",
  fi: "Suomi",
  no: "Norsk",
  "zh-CN": "简体中文",
  ja: "日本語",
  ko: "한국어",
};

export default function Translator() {
  const [langFrom, setLangFrom] = useState("pl");
  const [langTo, setLangTo] = useState("en");
  const [textToTranslate, setTextToTranslate] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const dropdownData = useMemo(() => {
    return Object.entries(languagesArray).map(([key, value]) => ({
      label: value,
      value: key,
    }));
  }, [languagesArray]);

  async function translateTextFunc({ langFrom, langTo, textToTranslate }: any) {
    const fullTranslateData = {
      text: textToTranslate,
      source: langFrom,
      target: langTo,
    };

    try {
      const response = await fetch("http://100.89.93.93:8000/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(fullTranslateData),
      });

      if (!response.ok) throw new Error("No serwer response.");

      const result = await response.json();

      setTranslatedText(result.translated);
      return console.log(result.translated);
    } catch (err) {
      alert(`Error type : ${err}`);
    }
  }

  return (
    <View style={styles.contentWrapper}>
      <ContentCard height={450} label={"Translator"}>
        <Dropdown
          data={dropdownData}
          mode={"default"}
          search
          labelField={"label"}
          valueField={"value"}
          onChange={(item) => setLangFrom(item.value)}
          value={langFrom}
          maxHeight={400}
          fontFamily="Text"
          searchPlaceholder="Search language.."
          style={styles.dropdown}
          selectedTextStyle={{
            fontFamily: "Text",
            fontSize: 18,
            color: "black",
            textAlign: "center",
          }}
          itemTextStyle={{ fontFamily: "Text", fontSize: 14, color: "black" }}
          containerStyle={{
            maxHeight: 250,
            borderRadius: 10,
            paddingVertical: 10,
          }}
        />
        <TextInput
          style={styles.inputs}
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
          maxLength={300}
          placeholder="Type text.."
          placeholderTextColor={Colors.text}
          onChangeText={(text) => {
            setTextToTranslate(text);
            console.log(`Text to translate: ${textToTranslate}`);
            setTimeout(
              () => translateTextFunc({ langFrom, langTo, textToTranslate }),
              300,
            );
          }}
        />

        <View style={styles.separator}></View>

        <Dropdown
          data={dropdownData}
          mode={"default"}
          search
          labelField={"label"}
          valueField={"value"}
          onChange={(item) => setLangTo(item.value)}
          value={langTo}
          maxHeight={400}
          fontFamily="Text"
          searchPlaceholder="Search language.."
          style={styles.dropdown}
          selectedTextStyle={{
            fontFamily: "Text",
            fontSize: 18,
            color: "black",
            textAlign: "center",
          }}
          itemTextStyle={{ fontFamily: "Text", fontSize: 14 }}
          containerStyle={{
            maxHeight: 250,
            borderRadius: 10,
            paddingVertical: 10,
          }}
        />
        <TextInput
          style={styles.inputs}
          value={translatedText}
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
          maxLength={300}
          placeholder="Waiting for request.."
          placeholderTextColor={Colors.text}
          editable={false}
          onChangeText={(text) => {
            setTranslatedText(text);
          }}
        />
      </ContentCard>
    </View>
  );
}

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  translatorCard: {
    height: "70%",
    width: "100%",
    backgroundColor: "blue",
  },

  dropdown: {
    height: 30,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 5,
  },
  inputs: {
    width: "100%",
    minHeight: "20%",
    maxHeight: "25%",
    backgroundColor: "white",
    borderRadius: 10,
    color: "black",
    fontSize: 18,
    fontFamily: "Text",
    paddingHorizontal: 15,
  },

  separator: {
    width: "80%",
    height: 2,
    backgroundColor: Colors.text,
    borderRadius: 20,
    marginVertical: 5,
  },
});
