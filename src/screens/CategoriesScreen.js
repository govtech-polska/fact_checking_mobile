import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { StyleSheet, SafeAreaView, FlatList } from 'react-native';

import { WHITE, BLACK } from '../constants/colors';
import { strings } from '../constants/strings';
import {
  TouchableOpacityDebounce,
  Container,
  Title,
  CategoryCell,
} from '../components';
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
    const isSelected = selectedCategory && selectedCategory.id === item.id;
    return (
      <CategoryCell
        item={item}
        isSelected={isSelected}
        onCellTapped={() => dispatch(feedActions.setSelectedCategory(item))}
      />
    );
  };

  return (
    <SafeAreaView style={styles.bg}>
      <Container style={styles.container}>
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
  container: {
    flexDirection: 'row',
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
