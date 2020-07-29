import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Text, StyleSheet, SafeAreaView, FlatList, View } from 'react-native';

import { WHITE, CINNABAR, BLACK } from '../constants/colors';
import { strings } from '../constants/strings';
import { TouchableOpacityDebounce, Container, Title } from '../components';
import { getAllCategories } from '../selectors';
import { feedActions } from '../storages/verified/actions';
import Close from '../resources/img/close.svg';

const CategoriesScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const categories = useSelector(({ articles }) => getAllCategories(articles));
  const selectedCategory = useSelector(
    ({ articles }) => articles.selectedCategory.data
  );

  const drawCategoryCell = ({ item }) => {
    return (
      <TouchableOpacityDebounce
        style={styles.categoryCell}
        onPress={() => {
          dispatch(feedActions.setSelectedCategory(item));
        }}
      >
        <View
          style={{
            ...styles.textContainer,
            backgroundColor:
              selectedCategory.id === item.id ? CINNABAR : 'transparent',
          }}
        >
          <Text style={{ textTransform: 'capitalize' }}>{item.name}</Text>
        </View>
        <View style={{ flex: 1 }} />
      </TouchableOpacityDebounce>
    );
  };

  return (
    <SafeAreaView style={styles.bg}>
      <Container style={{ flexDirection: 'row' }}>
        <TouchableOpacityDebounce
          style={styles.closeButton}
          onPress={navigation.goBack}
        >
          <Close width={30} height={30} fill={BLACK} />
        </TouchableOpacityDebounce>

        <Title title={strings.categories.title} />
      </Container>
      <FlatList
        data={categories}
        keyExtractor={(category) => category.id.toString()}
        renderItem={drawCategoryCell}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </SafeAreaView>
  );
};

CategoriesScreen.propTypes = {
  navigation: PropTypes.shape({
    push: PropTypes.func,
    goBack: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      selectedCategoryId: PropTypes.string,
    }),
  }),
  item: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  selectedCategory: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: WHITE,
  },
  categoryCell: {
    flexDirection: 'row',
    marginHorizontal: 2,
    marginVertical: 5,
    height: 40,
    minWidth: 50,
    paddingHorizontal: 5,
  },
  textContainer: {
    backgroundColor: CINNABAR,
    borderRadius: 20,
    justifyContent: 'center',
    minWidth: 50,
    paddingHorizontal: 5,
  },
  closeButton: {
    marginTop: 16,
    marginBottom: 8,
    marginRight: 16,
    width: 24,
    height: 24,
  },
});

export default CategoriesScreen;
