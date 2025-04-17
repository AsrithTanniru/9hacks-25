import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const NFCList = () => {
  const nfcItems = [
    {
      id: '1',
      title: '12 3212 1223 4',
      date: 'Added December 27, 2020'
    },
    {
      id: '2',
      title: '65 2457 9999 1',
      date: 'Added December 28, 2020'
    }
  ];

  return (
    <View style={styles.nfcList}>
      {nfcItems.map(item => (
        <View key={item.id} style={styles.nfcItem}>
          <Text style={styles.nfcIcon}>📶</Text>
          <View style={styles.nfcItemContent}>
            <Text style={styles.nfcItemTitle}>{item.title}</Text>
            <Text style={styles.nfcItemSubtitle}>{item.date}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  nfcList: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  nfcItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  nfcIcon: {
    fontSize: 24,
    marginRight: 15,
    color: '#4040ff',
  },
  nfcItemContent: {
    flex: 1,
  },
  nfcItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  nfcItemSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
});

export default NFCList;
