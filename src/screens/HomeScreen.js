// libs
import React, {useState, Fragment, useEffect} from 'react';
import {FlatGrid} from 'react-native-super-grid';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {connect} from 'react-redux';
import * as actions from '../redux/actions';
import {LinearProgress} from 'react-native-elements';
import {BottomSheet, ListItem} from 'react-native-elements';
import {Divider} from 'react-native-elements/dist/divider/Divider';
// internal
import {coverColours as colours, feedbackUrl} from '../util/constants';
import {getBookData} from '../util/operations';
import {
  getStoragePermission,
  checkStoragePermissions,
} from '../util/permissions';

const HomeScreen = (props) => {
  const books = Object.values(props.files.books);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [showNoSupportAlert, setShowNoSupportAlert] = useState(false);
  const list = [
    {
      title:
        selectedBook.endDate === null ? 'Mark Completed' : 'Mark Incomplete',
      onPress: () => {
        if (selectedBook.startDate === null) {
          Alert.alert('Oops!', 'Book has not been opened yet!');
        } else {
          selectedBook.endDate === null
            ? props.markComplete(selectedBook)
            : props.markIncomplete(selectedBook);
          props.toggleCompletion(selectedBook);
        }
        setIsVisible(false);
      },
    },
    {
      title: 'Delete Book',
      onPress: () => {
        Alert.alert(
          'Warning',
          'Are you sure you want to delete this book?',
          [
            {
              text: 'Yes',
              onPress: () => {
                props.deleteBook(selectedBook);
                setIsVisible(false);
              },
            },
            {
              text: 'No',
              style: 'cancel',
              onPress: () => setIsVisible(false),
            },
          ],
          {
            cancelable: true,
          },
        );
      },
    },
    {
      title: 'Cancel',
      containerStyle: {backgroundColor: 'red'},
      titleStyle: {color: 'white'},
      onPress: () => setIsVisible(false),
    },
  ];
  useEffect(() => {
    props.updateStats();
    props.navigation.setOptions({
      headerStyle: {
        backgroundColor: '#6300ef',
      },
      headerTitleStyle: {
        color: '#fff',
      },
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => getFeedback()}
            style={{paddingRight: 20}}
            color="#fff">
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <MaterialIcon name="record-voice-over" size={24} color="white" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => goToStatistics()}
            style={{paddingRight: 20}}
            color="#fff">
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <MaterialIcon name="timeline" size={24} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      ),
    });
  });

  const goToStatistics = () => {
    props.files.onboarded
      ? props.navigation.navigate('Statistics')
      : props.navigation.navigate('Onboarder');
  };

  const getFeedback = () => {
    Linking.openURL(feedbackUrl);
  };

  const gotPermission = async () => {
    if (Platform.OS === 'android') {
      let granted = await checkStoragePermissions();
      if (granted) return true;
      else await getStoragePermission();

      granted = await checkStoragePermissions();

      if (granted) return true;
      else return false;
    } else return true;
  };

  const selectMultipleFile = async () => {
    //Opening Document Picker for selection of multiple file
    setLoading(true);

    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'documentDirectory',
      });
      for (const res of results) {
        if (res.type === 'application/epub+zip') {
          let [title, author, coverPath] = await getBookData(res);

          if (title === undefined || title === '')
            title = res.name.substring(0, res.name.lastIndexOf('.'));

          if (author === undefined || author === '') author = '(Unknown)';

          let newBook = {
            title: title,
            author: author,
            coverPath: coverPath,
            uri: Platform.OS === 'ios' ? decodeURI(res.uri) : res.uri,
            name: res.name,
            fileCopyUri:
              Platform.OS === 'ios'
                ? decodeURI(res.fileCopyUri)
                : res.fileCopyUri,
            bgcolor: colours[Math.floor(Math.random() * 16 + 1)],
          };
          props.addBook(newBook);
        } else setShowNoSupportAlert(true);
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        alert('Unknown Error: ' + JSON.stringify(err));
        setLoading(false);
        throw err;
      }
    }
    if (showNoSupportAlert) {
      Alert.alert('Oops!', 'Only .epub files are supported!');
      setShowNoSupportAlert(false);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        {books.length === 0 ? (
          <View style={[styles.container, {flexDirection: 'column'}]}>
            <Image
              source={require('../../assets/images/guy_reading_book.jpg')}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyText}>
              Go Ahead and add your favourite books!
            </Text>
            <Text
              style={{
                flex: 1,
                alignContent: 'flex-start',
                textAlign: 'center',
                fontSize: 10,
              }}>
              (Only .epub files are supported at the moment)
            </Text>
          </View>
        ) : (
          <FlatGrid
            itemDimension={130}
            data={books}
            style={styles.gridView}
            spacing={10}
            renderItem={({item}) => (
              <>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedBook(item);
                    props.navigation.replace('Reader', item);
                  }}
                  onLongPress={() => {
                    setSelectedBook(item);
                    setIsVisible(true);
                  }}
                  style={[
                    styles.itemContainer,
                    {backgroundColor: item.bgcolor},
                  ]}>
                  {item.endDate !== null && (
                    <>
                      <MaterialIcon
                        style={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          zIndex: 2,
                        }}
                        name="circle"
                        size={15}
                        color="white"
                      />
                      <MaterialIcon
                        style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          zIndex: 2,
                        }}
                        name="verified"
                        size={20}
                        color="green"
                      />
                    </>
                  )}
                  {item.coverPath === undefined ||
                  item.coverPath.trim() === '' ? (
                    <Fragment>
                      <Text style={styles.titleStyle}>{item.title}</Text>
                      <Text style={styles.authorStyle}>{item.author}</Text>
                    </Fragment>
                  ) : (
                    <Image
                      source={{uri: item.coverPath}}
                      style={styles.bookCover}
                    />
                  )}
                </TouchableOpacity>
                <Divider width={10} opacity={0} />
                {item.pages.currentPage != undefined &&
                item.pages.locations.length != undefined &&
                item.pages.locations.length != 0 ? (
                  <LinearProgress
                    style={{height: 10, borderRadius: 20}}
                    value={item.pages.currentPage / item.pages.locations.length}
                    variant="determinate"
                  />
                ) : (
                  <Divider width={10} opacity={0} />
                )}
              </>
            )}
          />
        )}
        <BottomSheet
          isVisible={isVisible}
          containerStyle={{backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)'}}>
          {list.map((l, i) => (
            <ListItem
              key={i}
              containerStyle={l.containerStyle}
              onPress={l.onPress}>
              <ListItem.Content>
                <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
        </BottomSheet>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator
              animating={true}
              size="large"
              style={{opacity: 1}}
              color="#fff"
            />
          </View>
        ) : (
          <TouchableOpacity
            onPress={async () => {
              let go = await gotPermission();
              if (go) await selectMultipleFile();
            }}
            style={styles.fab}>
            <View style={styles.fabView}>
              <MaterialIcon name="add" size={28} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

function mapStateToProps(state) {
  return {files: state.files};
}

export default connect(mapStateToProps, actions)(HomeScreen);

const styles = StyleSheet.create({
  gridView: {
    paddingBottom: 50,
    flex: 1,
    flexDirection: 'column',
  },
  itemContainer: {
    borderRadius: 6,
    height: 250,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 3},
    shadowOpacity: 0.7,
    shadowRadius: 1,
  },
  titleStyle: {
    flex: 3,
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    padding: 10,
    paddingTop: 20,
  },
  authorStyle: {
    textAlign: 'center',
    flex: 1,
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
  container: {
    flex: 12,
    backgroundColor: '#fff',
  },
  bookCover: {
    height: '100%',
    resizeMode: 'stretch',
    borderRadius: 5,
  },
  buttonStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#DDDDDD',
    padding: 5,
  },
  imageIconStyle: {
    height: 20,
    width: 20,
    resizeMode: 'stretch',
  },
  fab: {
    elevation: 15,
    backgroundColor: '#03dbc7',
    position: 'absolute',
    bottom: 60,
    right: 60,
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 4, height: 4},
    shadowOpacity: 0.7,
    shadowRadius: 1,
  },
  fabView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyImage: {
    width: '100%',
    // height: '100%',
    flex: 2,
    resizeMode: 'contain',
    opacity: 1,
    alignContent: 'center',
    alignItems: 'flex-end',
  },
  emptyText: {
    alignContent: 'flex-start',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '900',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.7,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
