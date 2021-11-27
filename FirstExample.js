import React, {useRef, useEffect, useState} from 'react';
import {
  Text,
  Animated,
  ActivityIndicator,
  StyleSheet,
  Image,
  View,
} from 'react-native';
import * as axios from 'axios';

const getHeader = token => ({
  'Content-Type': 'application/json',
  accept: 'application/json',
  Authorization: 'Bearer ' + token,
});

export const withVerticalFlatlist = (BaseComponent, requestLink) => {
  return props => {
    const [data, setData] = useState();
    // const [error, setError] = useState();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const scrollY = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
      getData();
      return () => {
        setData(null);
        setLoaded(false);
      };
    }, []);

    //if using navigation you would want to put data fetching in useFocusEffect + useCallBack
    //=====================================================================================
    // useFocusEffect(
    //     React.useCallback(() => {
    //       getData();
    //       return () => {
    //         setData(null);
    //       };
    //     }, []),
    //   );

    const getData = () => {
      axios
        .get(requestLink, {
          //   headers: getHeader(token)
        })
        .then(res => {
          //   console.log(res.data.results);
          setData(res.data.results);
          setLoaded(true);
          setIsRefreshing(false);
        })
        .catch(err => {
          setLoaded(true);
          //   setError(true); // In case u have toast or some kind of component where you show error
        });
    };

    const onRefresh = () => {
      setIsRefreshing(true);
      getData();
    };

    const renderItem = ({item, index}) => {
      const inputRange = [-1, 0, 175 * index, 175 * (index + 2)];
      const inputOpacityRange = [-1, 0, 175 * index, 175 * (index + 1)];
      const scale = scrollY.interpolate({
        inputRange,
        outputRange: [1, 1, 1, 0],
      });
      const opacity = scrollY.interpolate({
        inputRange: inputOpacityRange,
        outputRange: [1, 1, 1, 0],
      });

      return (
        <Animated.View
          style={{
            ...styles.renderItem,
            transform: [{scale}],
            opacity: opacity,
          }}>
          <Image source={{uri: item.picture.large}} style={styles.pfp} />
          <View style={{marginHorizontal: 10}}>
            <Text style={styles.name}>
              {item.name.first} {item.name.last}
            </Text>
            <Text>{item.email}</Text>
          </View>
        </Animated.View>
      );
    };

    if (!loaded) {
      return <ActivityIndicator size={35} color={'black'} style={{flex: 1}} />;
    }

    return (
      <BaseComponent
        data={data}
        renderItem={renderItem}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        scrollY={scrollY}
        {...props}
      />
    );
  };
};
const styles = StyleSheet.create({
  renderItem: {
    flex: 1,
    flexDirection: 'row',
    height: 150,
    marginVertical: 10,
    paddingHorizontal: 15,
    elevation: 4,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  pfp: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});
