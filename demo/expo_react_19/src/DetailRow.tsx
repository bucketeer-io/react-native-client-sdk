import { StyleSheet, Text, View } from 'react-native';

interface DetailRowProps {
  label: string;
  value: string | number;
  testID: string;
}

function DetailRow({ label, value, testID }: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <Text testID={testID} style={styles.detailLabel}>
        {label}: {String(value)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#bdc3c7',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495e',
    flex: 1,
  },
});

export { DetailRow };
