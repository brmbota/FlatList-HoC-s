import React from 'react';
import {StyleSheet, Animated, View} from 'react-native';
import {withVerticalFlatlist} from './FirstExample';

const App = props => {
  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={props.data}
        style={{width: '100%'}}
        renderItem={props.renderItem}
        onRefresh={props.onRefresh}
        refreshing={props.refreshing}
        keyExtractor={item => item.login.uuid}
        contentContainerStyle={{
          padding: 10,
        }}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: props.scrollY}}}],
          {
            useNativeDriver: true,
          },
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#89cff0',
  },
});

export default withVerticalFlatlist(
  App,
  'https://randomuser.me/api/?results=15',
);
