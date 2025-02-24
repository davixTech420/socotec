/* import React from 'react';
import { View, Dimensions, Image, StyleSheet } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { useTheme } from 'react-native-paper';
import { SrcImagen } from '@/services/publicServices';

const { width: viewportWidth } = Dimensions.get('window');

// Mover la definición de styles aquí, antes del componente

const ImageCarousel = ({ images }) => {
  const theme = useTheme();

  const renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Image source={{ uri: SrcImagen(item.uri) }}  />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Carousel
        data={images}
        renderItem={renderItem}
        sliderWidth={viewportWidth}
        itemWidth={viewportWidth * 0.8}
        inactiveSlideScale={0.9}
        inactiveSlideOpacity={0.7}
        loop={true}
        autoplay={true}
        autoplayInterval={3000}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    width: viewportWidth * 0.8,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

export default ImageCarousel; */