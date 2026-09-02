import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { fetchRates } from "../services/ExchangeAPI";
import { Colors } from "../theme";

const FLOAT_INPUT_PATTERN = new RegExp("^\\d*(\\.\\d{0,2})?$");

export default function CashConverter() {
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("RUB");
  const [to, setTo] = useState("USD");
  const [result, setResult] = useState("0.00");
  const [lastUpdateDate, setLastUpdateDate] = useState("");

  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // loading rates from API (ExchcangeRate-API)
  useEffect(() => {
    async function loadRates() {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchRates("PLN");
        setRates(data.rates);
        setLastUpdateDate(data.date);
      } catch (error) {
        const err = error as Error;
        setError(err.message || "Error on loading currency rates");
      } finally {
        setLoading(false);
      }
    }

    loadRates();
  }, []);

  //input filter
  const handleChange = (val: string) => {
    if (!FLOAT_INPUT_PATTERN.test(val)) return;

    setAmount(val);

    if (val === "") {
      setResult("0.00");
      return;
    }
  };

  // calculating useEffect for money convert
  useEffect(() => {
    if (amount == "") return;

    const valToNumber = parseFloat(amount);
    const newResult = rates ? valToNumber * (rates[to] / rates[from]) : null;
    newResult ? setResult(newResult.toFixed(2)) : null;
  }, [from, to, amount, rates]);

  const options = rates
    ? Object.keys(rates).map((currency) => ({
        value: currency,
        label: currency,
      }))
    : [];

  //fast "if-renders"
  if (loading) {
    return (
      <View style={styles.converterWrapper}>
        <View style={styles.converterCard}>
          <Text>Currency loading...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.converterWrapper}>
        <View style={styles.converterCard}>
          <Text>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={styles.keyboardAwareView}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={styles.converterWrapper}>
        <View style={styles.converterCard}>
          <View style={styles.inputWrapper}>
            <Dropdown
              data={options}
              mode="default"
              search
              labelField={"label"}
              valueField={"value"}
              value={from}
              maxHeight={400}
              fontFamily="Text"
              searchPlaceholder="Search..."
              onChange={(item) => setFrom(item.value)}
              style={styles.dropdown}
              selectedTextStyle={{ fontFamily: "Text", fontSize: 18 }}
              itemTextStyle={{ fontFamily: "Text", fontSize: 16 }}
              containerStyle={{
                minWidth: 200,
                position: "relative",
                right: 0,
              }}
            />
            <TextInput
              value={amount}
              inputMode="decimal"
              onChangeText={handleChange}
              placeholder="0.00"
              placeholderTextColor={"black"}
              style={styles.input}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Dropdown
              data={options}
              mode="default"
              search
              labelField="label"
              valueField="value"
              value={to}
              maxHeight={400}
              onChange={(item) => setTo(item.value)}
              searchPlaceholder="Search currency..."
              style={styles.dropdown}
              selectedTextStyle={{ fontFamily: "Text", fontSize: 18 }}
              itemTextStyle={{ fontFamily: "Text", fontSize: 16 }}
            />
            <TextInput
              value={result}
              editable={false} // Запрещает ручной ввод и вызов клавиатуры
              selectTextOnFocus={false} // Отключает выделение текста при тапе
              style={styles.input}
            />
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
const styles = StyleSheet.create({
  converterWrapper: {
    height: "100%",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 40,
    padding: 10,
  },
  converterCard: {
    height: "70%",
    width: "100%",
    borderRadius: 30,
    gap: 20,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  inputWrapper: {
    width: "100%",
    height: 60,
    alignItems: "center",
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    width: "100%",
    textAlign: "left",
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    paddingLeft: "35%",
    fontSize: 16,
    fontFamily: "Text",
  },
  dropdown: {
    height: "100%",
    width: "30%",
    borderRadius: 20,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 2,
    alignSelf: "flex-start",
    position: "absolute",
    bottom: 0,
    left: 0,
    padding: 10,
    zIndex: 2,
    backgroundColor: "white",
    borderColor: Colors.primary,
    fontFamily: "Text",
  },
  keyboardAwareView: {
    flex: 1,
  },
});
