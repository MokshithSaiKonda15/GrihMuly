// src/app/index.tsx
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  formatCurrencyINR,
  HouseFeatures,
  predictHousePrice,
} from '../services/housePricePredictor';

export default function GrihMulyScreen() {
  const [area, setArea] = useState('5000');
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('2');
  const [stories, setStories] = useState('2');
  const [parking, setParking] = useState('1');

  const [mainroad, setMainroad] = useState(true);
  const [guestroom, setGuestroom] = useState(false);
  const [basement, setBasement] = useState(false);
  const [hotwaterheating, setHotwaterheating] = useState(false);
  const [airconditioning, setAirconditioning] = useState(true);
  const [prefarea, setPrefarea] = useState(true);

  const [furnishingStatus, setFurnishingStatus] = useState<
    'semi-furnished' | 'unfurnished' | 'furnished'
  >('semi-furnished');

  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);

  const handlePredict = () => {
    const features: HouseFeatures = {
      area: parseFloat(area) || 0,
      bedrooms: parseInt(bedrooms, 10) || 0,
      bathrooms: parseInt(bathrooms, 10) || 0,
      stories: parseInt(stories, 10) || 0,
      parking: parseInt(parking, 10) || 0,
      mainroad,
      guestroom,
      basement,
      hotwaterheating,
      airconditioning,
      prefarea,
      furnishingStatus,
    };

    const price = predictHousePrice(features);
    setPredictedPrice(price);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1412" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>🏠 GrihMuly</Text>
          <Text style={styles.subtitle}>
            Enter property details to estimate market value
          </Text>
        </View>

        {/* Property Dimensions & Layout Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📐 Property Dimensions & Layout</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Area (sq ft)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={area}
              onChangeText={setArea}
              placeholder="e.g. 5000"
              placeholderTextColor="#888"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Bedrooms</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={bedrooms}
                onChangeText={setBedrooms}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Bathrooms</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={bathrooms}
                onChangeText={setBathrooms}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Stories</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={stories}
                onChangeText={setStories}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Parking (vehicles)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={parking}
                onChangeText={setParking}
              />
            </View>
          </View>
        </View>

        {/* Amenities Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>✨ Amenities & Locality</Text>

          {[
            { label: 'Nearest to Main Road?', value: mainroad, setter: setMainroad },
            { label: 'Guestroom Available?', value: guestroom, setter: setGuestroom },
            { label: 'Basement Available?', value: basement, setter: setBasement },
            { label: 'Hot Water Heater?', value: hotwaterheating, setter: setHotwaterheating },
            { label: 'Air Conditioning?', value: airconditioning, setter: setAirconditioning },
            { label: 'Preferred Area?', value: prefarea, setter: setPrefarea },
          ].map((item, index) => (
            <View key={index} style={styles.switchRow}>
              <Text style={styles.switchLabel}>{item.label}</Text>
              <Switch
                value={item.value}
                onValueChange={item.setter}
                trackColor={{ false: '#444', true: '#FFD700' }}
                thumbColor={item.value ? '#1a1412' : '#f4f3f4'}
              />
            </View>
          ))}
        </View>

        {/* Furnishing Status */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🛋️ Furnishing Status</Text>
          <View style={styles.pillContainer}>
            {(['semi-furnished', 'unfurnished', 'furnished'] as const).map((status) => {
              const isSelected = furnishingStatus === status;
              return (
                <TouchableOpacity
                  key={status}
                  style={[styles.pill, isSelected && styles.pillSelected]}
                  onPress={() => setFurnishingStatus(status)}
                >
                  <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                    {status === 'semi-furnished'
                      ? 'Semi-Furnished'
                      : status === 'unfurnished'
                      ? 'Unfurnished'
                      : 'Furnished'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Predict Button */}
        <TouchableOpacity style={styles.button} onPress={handlePredict} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Predict Price 📊</Text>
        </TouchableOpacity>

        {/* Result Card */}
        {predictedPrice !== null && (
          <View style={styles.resultCard}>
            <Text style={styles.resultHeading}>Estimated Market Price</Text>
            <Text style={styles.resultValue}>{formatCurrencyINR(predictedPrice)}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#12100e',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 18,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFD700',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#b0a695',
    marginTop: 6,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#201b17',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#382f29',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e6d5b8',
    marginBottom: 14,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: '#a3978b',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#2d251f',
    color: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#42372f',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2d251f',
  },
  switchLabel: {
    fontSize: 14,
    color: '#dfd7cd',
  },
  pillContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  pill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#2d251f',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#42372f',
  },
  pillSelected: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  pillText: {
    color: '#a3978b',
    fontSize: 12,
    fontWeight: '600',
  },
  pillTextSelected: {
    color: '#1a1412',
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#1a1412',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultCard: {
    backgroundColor: 'rgba(0, 255, 127, 0.08)',
    borderWidth: 2,
    borderColor: '#00FF7F',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  resultHeading: {
    color: '#b0f5d0',
    fontSize: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  resultValue: {
    color: '#00FF7F',
    fontSize: 32,
    fontWeight: '900',
  },
});