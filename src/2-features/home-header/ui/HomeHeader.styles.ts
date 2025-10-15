import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 28,
    height: 28,
    marginLeft: 16,
    resizeMode: 'contain',
  },
});