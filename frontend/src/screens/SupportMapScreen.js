import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme, spacing } from '../config/theme';
import { defaultSupportPoints } from '../services/supportPointsService';

// Sadece native platformlarda react-native-maps'i import et
let MapView, Marker, PROVIDER_GOOGLE;
if ( Platform.OS !== 'web' )
{
  const maps = require( 'react-native-maps' );
  MapView = maps.default;
  Marker = maps.Marker;
  PROVIDER_GOOGLE = maps.PROVIDER_GOOGLE;
}

const typeIcons = {
  Karakol: 'shield',
  Hastane: 'hospital-box',
  ŞÖNİM: 'home-heart',
  Baro: 'gavel',
};

const typeColors = {
  Karakol: '#1E40AF',
  Hastane: '#DC2626',
  ŞÖNİM: '#9333EA',
  Baro: '#059669',
};

export default function SupportMapScreen ()
{
  const [ userLocation, setUserLocation ] = useState( null );
  const [ selectedPoint, setSelectedPoint ] = useState( null );
  const [ selectedType, setSelectedType ] = useState( 'Tümü' );

  useEffect( () =>
  {
    ( async () =>
    {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if ( status === 'granted' )
      {
        const location = await Location.getCurrentPositionAsync( {} );
        setUserLocation( {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        } );
      }
    } )();
  }, [] );

  // Filtreleme fonksiyonu - sadece kurum tipine göre
  const getFilteredPoints = () =>
  {
    return defaultSupportPoints.filter( point =>
    {
      const typeMatch = selectedType === 'Tümü' || point.type === selectedType;
      return typeMatch;
    } );
  };

  const filteredPoints = getFilteredPoints();

  const handleCall = ( phone ) =>
  {
    const phoneNumber = phone.replace( /[^0-9]/g, '' );
    Linking.openURL( `tel:${ phoneNumber }` );
  };

  const handleNavigate = ( point ) =>
  {
    const url = Platform.select( {
      ios: `maps:0,0?q=${ point.name }@${ point.position.lat },${ point.position.lng }`,
      android: `geo:0,0?q=${ point.position.lat },${ point.position.lng }(${ point.name })`,
    } );
    Linking.openURL( url );
  };

  const openInGoogleMaps = ( point ) =>
  {
    const url = `https://www.google.com/maps/search/?api=1&query=${ point.position.lat },${ point.position.lng }`;
    Linking.openURL( url );
  };

  if ( Platform.OS === 'web' )
  {
    return (
      <SafeAreaView style={ styles.container }>
        <ScrollView style={ styles.scrollView }>
          <View style={ styles.header }>
            <MaterialCommunityIcons name="map-marker-multiple" size={ 40 } color={ theme.light.primary } />
            <View style={ styles.headerTextContainer }>
              <Text style={ styles.title }>Destek Noktaları</Text>
              <Text style={ styles.subtitle }>
                Yakınınızdaki destek merkezleri
              </Text>
            </View>
          </View>
          <View style={ styles.webMapNotice }>
            <MaterialCommunityIcons name="information" size={ 24 } color={ theme.light.primary } />
            <Text style={ styles.webMapNoticeText }>
              Harita görünümü mobil uygulamada mevcuttur. Web'de liste görünümünü kullanabilirsiniz.
            </Text>
          </View>

          {/* Filtreleme Alanı */ }
          <View style={ styles.filterContainer }>
            <Text style={ styles.filterLabel }>Kurum Tipi:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={ false } style={ styles.filterScroll }>
              <TouchableOpacity
                style={ [ styles.filterChip, selectedType === 'Tümü' && styles.filterChipActive ] }
                onPress={ () => setSelectedType( 'Tümü' ) }
              >
                <Text style={ [ styles.filterChipText, selectedType === 'Tümü' && styles.filterChipTextActive ] }>
                  Tümü
                </Text>
              </TouchableOpacity>
              { Object.keys( typeIcons ).map( ( type ) => (
                <TouchableOpacity
                  key={ type }
                  style={ [ styles.filterChip, selectedType === type && styles.filterChipActive ] }
                  onPress={ () => setSelectedType( type ) }
                >
                  <MaterialCommunityIcons
                    name={ typeIcons[ type ] }
                    size={ 16 }
                    color={ selectedType === type ? 'white' : theme.light.primary }
                    style={ { marginRight: 4 } }
                  />
                  <Text style={ [ styles.filterChipText, selectedType === type && styles.filterChipTextActive ] }>
                    { type }
                  </Text>
                </TouchableOpacity>
              ) ) }
            </ScrollView>
          </View>

          <View style={ styles.content }>
            <Text style={ styles.resultCount }>
              { filteredPoints.length } destek noktası bulundu
            </Text>
            { filteredPoints.map( ( point ) => (
              <View key={ point.id } style={ styles.card }>
                <View style={ styles.cardHeader }>
                  <View style={ [ styles.iconCircle, { backgroundColor: typeColors[ point.type ] + '20' } ] }>
                    <MaterialCommunityIcons
                      name={ typeIcons[ point.type ] }
                      size={ 32 }
                      color={ typeColors[ point.type ] }
                    />
                  </View>
                  <View style={ styles.cardHeaderText }>
                    <Text style={ styles.pointName }>{ point.name }</Text>
                    <View style={ styles.typeTag }>
                      <Text style={ [ styles.typeTagText, { color: typeColors[ point.type ] } ] }>
                        { point.type }
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={ styles.cardContent }>
                  <View style={ styles.infoRow }>
                    <MaterialCommunityIcons name="map-marker" size={ 20 } color={ theme.light.mutedForeground } />
                    <Text style={ styles.address }>{ point.address }</Text>
                  </View>
                  <View style={ styles.cardActions }>
                    <TouchableOpacity
                      style={ [ styles.actionButton, styles.callButton ] }
                      onPress={ () => handleCall( point.phone ) }
                    >
                      <MaterialCommunityIcons name="phone" size={ 20 } color="white" />
                      <Text style={ styles.actionButtonText }>{ point.phone }</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={ [ styles.actionButton, styles.mapButton ] }
                      onPress={ () => openInGoogleMaps( point ) }
                    >
                      <MaterialCommunityIcons name="google-maps" size={ 20 } color="white" />
                      <Text style={ styles.actionButtonText }>Haritada Aç</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) ) }
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={ styles.container }>
      {/* Filtreleme Alanı - Native */ }
      <View style={ styles.filterContainerNative }>
        <ScrollView horizontal showsHorizontalScrollIndicator={ false } style={ styles.filterScrollNative }>
          <View style={ styles.filterGroup }>
            <TouchableOpacity
              style={ [ styles.filterChipNative, selectedType === 'Tümü' && styles.filterChipActiveNative ] }
              onPress={ () => setSelectedType( 'Tümü' ) }
            >
              <Text style={ [ styles.filterChipTextNative, selectedType === 'Tümü' && styles.filterChipTextActiveNative ] }>
                Tümü
              </Text>
            </TouchableOpacity>
            { Object.keys( typeIcons ).map( ( type ) => (
              <TouchableOpacity
                key={ type }
                style={ [ styles.filterChipNative, selectedType === type && styles.filterChipActiveNative ] }
                onPress={ () => setSelectedType( type ) }
              >
                <MaterialCommunityIcons
                  name={ typeIcons[ type ] }
                  size={ 16 }
                  color={ selectedType === type ? 'white' : theme.light.primary }
                  style={ { marginRight: 4 } }
                />
                <Text style={ [ styles.filterChipTextNative, selectedType === type && styles.filterChipTextActiveNative ] }>
                  { type }
                </Text>
              </TouchableOpacity>
            ) ) }
          </View>
        </ScrollView>
      </View>

      <View style={ styles.mapContainer }>
        <MapView
          key={ selectedType }
          provider={ PROVIDER_GOOGLE }
          style={ styles.map }
          region={ userLocation ? {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          } : {
            latitude: 38.9637,
            longitude: 35.2433,
            latitudeDelta: 5,
            longitudeDelta: 5,
          } }
          showsUserLocation={ true }
        >
          { filteredPoints.map( ( point ) => (
            <Marker
              key={ point.id }
              coordinate={ {
                latitude: point.position.lat,
                longitude: point.position.lng,
              } }
              title={ point.name }
              description={ point.type }
              pinColor={ typeColors[ point.type ] }
              onPress={ () => setSelectedPoint( point ) }
            />
          ) ) }
        </MapView>

        {/* Sonuç sayısı badge */ }
        <View style={ styles.resultBadge }>
          <MaterialCommunityIcons name="map-marker-multiple" size={ 18 } color={ theme.light.primary } />
          <Text style={ styles.resultBadgeText }>
            { filteredPoints.length } nokta
          </Text>
        </View>

        { selectedPoint && (
          <View style={ styles.infoCard }>
            <View style={ styles.infoHeader }>
              <MaterialCommunityIcons
                name={ typeIcons[ selectedPoint.type ] }
                size={ 28 }
                color={ typeColors[ selectedPoint.type ] }
              />
              <View style={ styles.infoHeaderText }>
                <Text style={ styles.infoName }>{ selectedPoint.name }</Text>
                <Text style={ styles.infoType }>{ selectedPoint.type }</Text>
              </View>
              <TouchableOpacity onPress={ () => setSelectedPoint( null ) }>
                <MaterialCommunityIcons name="close" size={ 24 } color={ theme.light.foreground } />
              </TouchableOpacity>
            </View>
            <Text style={ styles.infoAddress }>{ selectedPoint.address }</Text>
            <View style={ styles.infoButtons }>
              <TouchableOpacity
                style={ styles.actionButton }
                onPress={ () => handleCall( selectedPoint.phone ) }
              >
                <MaterialCommunityIcons name="phone" size={ 20 } color="white" />
                <Text style={ styles.actionButtonText }>Ara</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={ [ styles.actionButton, styles.navigateButton ] }
                onPress={ () => handleNavigate( selectedPoint ) }
              >
                <MaterialCommunityIcons name="navigation" size={ 20 } color="white" />
                <Text style={ styles.actionButtonText }>Yol Tarifi</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) }
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create( {
  container: {
    flex: 1,
    backgroundColor: theme.light.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: spacing.xl,
    backgroundColor: theme.light.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.light.border,
  },
  headerTextContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.light.foreground,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: theme.light.mutedForeground,
  },
  webMapNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.light.primary + '10',
    padding: spacing.md,
    margin: spacing.lg,
    marginBottom: spacing.sm,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: theme.light.primary,
  },
  webMapNoticeText: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: 14,
    color: theme.light.foreground,
    lineHeight: 20,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.md,
  },
  resultCount: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.light.mutedForeground,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: theme.light.card,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: theme.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.light.border,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  pointName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.light.foreground,
    marginBottom: spacing.sm,
  },
  typeTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: theme.light.muted,
  },
  typeTagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  address: {
    flex: 1,
    fontSize: 14,
    color: theme.light.mutedForeground,
    lineHeight: 20,
  },
  cardActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: 8,
    gap: spacing.xs,
  },
  callButton: {
    backgroundColor: theme.light.primary,
  },
  mapButton: {
    backgroundColor: '#34A853',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.light.border,
  },
  phoneText: {
    fontSize: 16,
    color: theme.light.primary,
    marginLeft: spacing.sm,
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  infoCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  infoHeaderText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  infoName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.light.foreground,
  },
  infoType: {
    fontSize: 14,
    color: theme.light.mutedForeground,
    marginTop: 2,
  },
  infoAddress: {
    fontSize: 14,
    color: theme.light.mutedForeground,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  infoButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.light.primary,
    padding: spacing.md,
    borderRadius: 8,
    gap: spacing.sm,
  },
  navigateButton: {
    backgroundColor: '#059669',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  // Filtreleme stilleri - Web
  filterContainer: {
    padding: spacing.lg,
    backgroundColor: theme.light.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.light.border,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.light.foreground,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  filterScroll: {
    marginBottom: spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: theme.light.muted,
    borderWidth: 1,
    borderColor: theme.light.border,
    marginRight: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: theme.light.primary,
    borderColor: theme.light.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: theme.light.foreground,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: 'white',
  },
  // Filtreleme stilleri - Native
  filterContainerNative: {
    backgroundColor: theme.light.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.light.border,
    paddingVertical: spacing.sm,
  },
  filterScrollNative: {
    paddingHorizontal: spacing.md,
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  filterChipNative: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    backgroundColor: theme.light.muted,
    borderWidth: 1,
    borderColor: theme.light.border,
  },
  filterChipActiveNative: {
    backgroundColor: theme.light.primary,
    borderColor: theme.light.primary,
  },
  filterChipTextNative: {
    fontSize: 13,
    color: theme.light.foreground,
    fontWeight: '500',
  },
  filterChipTextActiveNative: {
    color: 'white',
  },
  filterDivider: {
    width: 1,
    height: 24,
    backgroundColor: theme.light.border,
    marginHorizontal: spacing.sm,
  },
  resultBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    gap: spacing.xs,
  },
  resultBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.light.foreground,
  },
} );
