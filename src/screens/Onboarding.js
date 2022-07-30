import React, {useState, useRef, useEffect} from 'react';
import {
  Dimensions,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  ImageBackground,
  Text,
  PixelRatio,
} from 'react-native';
import {Divider} from 'react-native-elements';
import {targets} from '../util/constants';
import {Slider} from 'react-native-elements/dist/slider/Slider';
import {connect} from 'react-redux';
import * as actions from '../redux/actions';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Onboarding = (props) => {
  const scrollViewRef = useRef();
  const [sliderState, setSliderState] = useState({currentPage: 0});
  const [daily, setDaily] = useState(2);
  const [monthly, setMonthly] = useState(1);
  const {width, height} = Dimensions.get('window');

  const setSliderPage = (event: any) => {
    const {currentPage} = sliderState;
    const {x} = event.nativeEvent.contentOffset;
    const indexOfNextScreen = Math.floor(x / width);
    if (indexOfNextScreen !== currentPage) {
      setSliderState({
        ...sliderState,
        currentPage: indexOfNextScreen,
      });
    }
  };

  const {currentPage: pageIndex} = sliderState;

  useEffect(() => {
    console.log(pageIndex);
  }, [pageIndex]);
  return (
    <View style={{flex: 1}}>
      <ImageBackground
        source={require('../../assets/images/onboarding_background.jpg')}
        style={styles.backgroundImage}
        imageStyle={{opacity: 0.8}}>
        <SafeAreaView style={{flex: 1, flexDirection: 'column'}}>
          <View style={styles.headWrapper}>
            <Text style={styles.header}>Welcome to Immersion Reader!</Text>
            <Text style={styles.paragraph}>Lets get you started...</Text>
          </View>
          <ScrollView
            ref={scrollViewRef}
            scrollEnabled={false}
            style={{flex: 1, height: '50%'}}
            horizontal={true}
            scrollEventThrottle={16}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            onScroll={(event: any) => {
              setSliderPage(event);
            }}>
            <View style={{width, height}}>
              <View style={styles.wrapper}>
                <Divider height={50} />
                <Text style={styles.paragraph}>
                  How Many Minutes do you want to read a day?
                </Text>
                <Slider
                  value={daily}
                  onValueChange={(value) => setDaily(value)}
                  minimumValue={1}
                  maximumValue={targets.daily.length}
                  thumbTintColor={'#03dbc7'}
                  style={styles.sliderStyle}
                  step={1}
                />
                <Divider height={50} />
                <Text style={styles.header}>
                  {targets.daily[daily - 1].name}
                </Text>
                <Text style={styles.paragraph}>
                  "{targets.daily[daily - 1].caption}"
                </Text>
              </View>
            </View>
            <View style={{width, height}}>
              <View style={styles.wrapper}>
                <Divider height={50} />
                <Text style={styles.paragraph}>
                  How Many Books do you want to read a month?
                </Text>
                <Slider
                  value={monthly}
                  onValueChange={(value) => setMonthly(value)}
                  minimumValue={1}
                  maximumValue={targets.monthly.length}
                  style={styles.sliderStyle}
                  thumbTintColor={'#03dbc7'}
                  step={1}
                />
                <Divider height={50} />
                <Text style={styles.header}>
                  {monthly} {monthly === 1 ? 'Book' : 'Books'}
                </Text>
                <Text style={styles.paragraph}>{}</Text>
              </View>
            </View>
          </ScrollView>
          <View style={styles.footerStyle}>
            <TouchableOpacity
              backgroundColor={'#000'}
              onPress={() => {
                scrollViewRef.current?.scrollTo({x: 0, y: 0, animated: true});
              }}>
              <Text style={{color: '#000', padding: 10}}>Prev</Text>
            </TouchableOpacity>
            <View style={styles.paginationWrapper}>
              {Array.from(Array(2).keys()).map((key, index) => (
                <View
                  style={[
                    styles.paginationDots,
                    {opacity: pageIndex === index ? 1 : 0.2},
                  ]}
                  key={index}
                />
              ))}
            </View>
            <TouchableOpacity
              backgroundColor={'#000'}
              onPress={() => {
                if (pageIndex === 1) {
                  props.setTargets({
                    daily: targets.daily[daily - 1].mins,
                    monthly: monthly,
                  });
                  props.navigation.replace('Library');
                } else {
                  scrollViewRef.current?.scrollToEnd({animated: true});
                }
              }}>
              <Text style={{color: '#000', padding: 10}}>Next</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

function mapStateToProps(state) {
  return {files: state.files};
}

export default connect(mapStateToProps, actions)(Onboarding);

const styles = StyleSheet.create({
  imageStyle: {
    height: PixelRatio.getPixelSizeForLayoutSize(135),
    width: '100%',
  },
  headWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
    height: '50%',
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  paginationWrapper: {
    // position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  paginationDots: {
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
    backgroundColor: '#000',
    //color of dots originally '0898A0'
    marginLeft: 10,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  footerStyle: {
    flex: 0.2,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-evenly',
    // margin: 50,
  },
  buttonStyle: {
    backgroundColor: '#000',
    elevation: 30,
    color: '#000',
  },
  sliderStyle: {
    width: '75%',
    padding: 20,
    marginTop: 50,
  },
});
