import React, {useState, useEffect} from 'react';
import {
  TextInput,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import SearchItem from './SearchItem';
import {contrastColor} from '../util/constants';
import {Divider} from 'react-native-elements/dist/divider/Divider';

function BookSearch(props) {
  const [input, setInput] = useState('');
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [resultsText, setResultsText] = useState('');

  useEffect(() => {
    setCurrentPage(0);
    setResultsText(`${props.searchResults.length} Results for "${input}"`);
    console.log('RESULTS : ', props.searchResults);
    setPages(Math.ceil(props.searchResults.length / 10));
  }, [props.searchResults]);

  function renderResults() {
    return input && props.searchResults
      ? props.searchResults
          .slice(currentPage * 10, (currentPage + 1) * 10)
          .map((result, i) => (
            <SearchItem
              {...result}
              onPress={props.goToSearchResult}
              key={i}
              bg={props.bg}
              fg={props.fg}
            />
          ))
      : null;
  }

  function changePage(n) {
    var newPage = n;
    if (newPage < 0 || newPage > pages) return;
    setCurrentPage(newPage);
  }

  return (
    <View style={styles.scrollView}>
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Search"
        allowFontScaling={false}
        returnKeyType="search"
        style={{...styles.input, borderColor: props.fg, color: props.fg}}
        onSubmitEditing={() => props.onSearch(input)}
      />
      {input !== '' && props.searchResults.length > 0 && (
        <Text style={{color: props.fg}}>{resultsText}</Text>
      )}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {renderResults()}
      </ScrollView>
      <Divider />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 60,
        }}>
        {/* <TouchableWithoutFeedback onPress={() => changePage(currentPage - 1)}>
          <View style={styles.buttonWrapper}>
            <MaterialIcon name="chevron-left" size={20} />
          </View>
        </TouchableWithoutFeedback> */}

        {input !== '' && props.searchResults.length > 0 && (
          <ScrollView
            horizontal={true}
            contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
            {[...Array(pages).keys()].map((i) => {
              return (
                <TouchableOpacity
                  style={{
                    ...styles.pageNoButton,
                    backgroundColor: i == currentPage ? '#808080' : props.bg,
                  }}
                  backgroundColor="#fff"
                  key={i}
                  onPress={() => changePage(i)}>
                  <Text style={{color: props.fg}}>{i + 1}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
        {/* <TouchableWithoutFeedback onPress={() => changePage(currentPage - 1)}>
          <View style={styles.buttonWrapper}>
            <MaterialIcon name="chevron-right" size={20} />
          </View>
        </TouchableWithoutFeedback> */}
      </View>
    </View>
  );
}

export default BookSearch;

const styles = {
  scrollView: {flex: 1},
  scrollViewContent: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingBottom: 50,
  },
  buttonWrapper: {
    height: 52,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    fontSize: 15,
    height: 36,
    width: '95%',
    color: contrastColor,
    paddingRight: 15,
    paddingLeft: 15,
    paddingTop: 0,
    paddingBottom: 0,
    borderWidth: 1,

    borderRadius: 20,
  },
  pageNoButton: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    width: 35,
    borderRadius: 35,
    margin: 5,
  },
};
