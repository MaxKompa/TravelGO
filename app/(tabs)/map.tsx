import Background from "@/src/components/Background";
import Header from "@/src/components/Header";
import NavButton from "@/src/components/NavButton";
import TripLocationsList from "@/src/components/TripLocationsList";
import { useTripState } from "@/src/store/useTripState";
import { Colors } from "@/src/theme";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Mapbox from "@rnmapbox/maps";
import { usePathname } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

Mapbox.setAccessToken(
  "pk.eyJ1IjoiZGFuaWRldjIwMDYiLCJhIjoiY212eTluZXhzMHBjaDJ4c2Y3eHdpZmpkbSJ9.MbTFtJUSXXvDpjCwpB_x5g",
); // вынести в .env
const MB_TOKEN =
  "pk.eyJ1IjoiZGFuaWRldjIwMDYiLCJhIjoiY212eTluZXhzMHBjaDJ4c2Y3eHdpZmpkbSJ9.MbTFtJUSXXvDpjCwpB_x5g";

export default function MapScreen() {
  const snapPoints = useMemo(() => ["20%", "65%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const selectedLocations = useTripState((state) => state.selectedLocations);
  const [tripMethod, setTripMethod] = useState("walking");
  const initMapCameraCenter = useMemo(() => {
    if (selectedLocations.length > 0) {
      return [selectedLocations[0].longitude, selectedLocations[0].latitude];
    } else {
      return [21.0122, 52.2297];
    }
  }, [selectedLocations]);

  const path = usePathname();

  const [routeGeoJSON, setRouteGeoJSON] = useState<any>(null);

  // запрос на построение маршрута
  const fetchTheMapLine = async () => {
    const coordinatesStr = selectedLocations
      .map((point) => `${point.longitude},${point.latitude}`)
      .join(";");
    const urlForMapLine = `https://api.mapbox.com/optimized-trips/v1/mapbox/${tripMethod}/${coordinatesStr}?geometries=geojson&source=first&destination=last&roundtrip=false&access_token=${MB_TOKEN}`;
    try {
      const response = await fetch(urlForMapLine);

      if (!response.ok) {
        throw new Error(`Mapbox server error: ${response.status}`);
      }

      const geoLine = await response.json();

      if (geoLine.trips && geoLine.trips.length > 0) {
        setRouteGeoJSON(geoLine.trips[0].geometry);
      }
    } catch (e) {
      console.log(`Can't build a trip route! Problem : ${e}`);
    }
  };

  //обработка прорисовки маршрута
  useEffect(() => {
    if (selectedLocations.length < 2) {
      console.log("Request not send: required points not selected ( min 2 )");
      setRouteGeoJSON(null);
      return;
    }
    console.log("еффект поиска карты сработал ");
    fetchTheMapLine();
  }, [selectedLocations, tripMethod]);

  return (
    <Background>
      <Header text="Map" />
      <View style={styles.mapConteiner}>
        <Mapbox.MapView
          style={{ flex: 1 }}
          styleURL="mapbox://styles/mapbox/streets-v12"
        >
          <Mapbox.Camera
            zoomLevel={12}
            centerCoordinate={initMapCameraCenter}
          />

          {routeGeoJSON && (
            <Mapbox.ShapeSource
              id="routeSource"
              shape={{
                type: "Feature",
                geometry: routeGeoJSON,
                properties: {},
              }}
            >
              <Mapbox.LineLayer
                id="lineSource"
                style={{
                  lineColor: Colors.primary2,
                  lineWidth: 3,
                  lineCap: "round",
                  lineJoin: "round",
                }}
              />
            </Mapbox.ShapeSource>
          )}

          {selectedLocations.map((loc, index) => (
            <Mapbox.PointAnnotation
              key={loc.id.toString()}
              id={loc.id.toString()}
              coordinate={[loc.longitude, loc.latitude]}
            >
              <View style={styles.pointBackground}>
                <Text style={styles.pointNum}>{`${index + 1}.`}</Text>
              </View>
              {<Mapbox.Callout title={loc.name} />}
            </Mapbox.PointAnnotation>
          ))}
        </Mapbox.MapView>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        overDragResistanceFactor={10}
        enableDynamicSizing={false}
      >
        <View style={styles.buttonConteiner}>
          <NavButton
            setTripMethod={setTripMethod}
            tripMethod={tripMethod}
            height={40}
            width={40}
            buttonType="walking"
          />
          <NavButton
            setTripMethod={setTripMethod}
            tripMethod={tripMethod}
            height={40}
            width={40}
            buttonType="cycling"
          />
          <NavButton
            setTripMethod={setTripMethod}
            tripMethod={tripMethod}
            height={40}
            width={40}
            buttonType="driving"
          />
        </View>

        <BottomSheetScrollView
          style={styles.scrollView}
          contentContainerStyle={{
            paddingBottom: 70,
            paddingTop: 10,
          }}
        >
          <TripLocationsList />
        </BottomSheetScrollView>
      </BottomSheet>
      {/* <View style={styles.infoConteiner}></View> */}
    </Background>
  );
}

const styles = StyleSheet.create({
  mapConteiner: {
    marginTop: 100,
    width: "100%",
    flex: 1,
    backgroundColor: Colors.text,
  },

  buttonConteiner: {
    width: "90%",
    alignSelf: "center",
    padding: 5,
    justifyContent: "space-between",
    flexDirection: "row",
  },

  scrollView: {
    width: "100%",
    flex: 1,
  },
  separator: {
    width: 2,
    height: 30,
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: "center",
  },

  pointBackground: {
    height: 30,
    width: 30,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    padding: 5,
  },

  pointNum: {
    fontFamily: "Text",
    fontSize: 17,
    color: Colors.secondary,
    textAlign: "center",
  },
});
