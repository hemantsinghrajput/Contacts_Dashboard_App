import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BarChart, Grid, XAxis } from 'react-native-svg-charts';
import { Text } from 'react-native-svg';

interface Props {
  data: { hour: string; count: number }[];
}

const Graph: React.FC<Props> = ({ data }) => {
  const counts = data.map((d) => d.count);
  const labels = data.map((d) => `${d.hour}:00`);
  const CUT_OFF = Math.max(...counts) * 0.5;

  const Labels = ({
    x,
    y,
    bandwidth,
    data,
  }: {
    x: (index: number) => number;
    y: (value: number) => number;
    bandwidth: number;
    data: number[];
  }) =>
    data.map((value, index) => (
      <Text
        key={index}
        x={x(index) + bandwidth / 2}
        y={value < CUT_OFF ? y(value) - 10 : y(value) + 15}
        fontSize={12}
        fill={value < CUT_OFF ? 'black' : 'white'}
        alignmentBaseline="middle"
        textAnchor="middle"
      >
        {value}
      </Text>
    ));

  return (
    <View style={styles.container}>
      <BarChart
        style={{ height: 200 }}
        data={counts}
        svg={{ fill: '#4F8EF7' }}
        contentInset={{ top: 20, bottom: 20 }}
        spacingInner={0.3}
        gridMin={0}
        decorator={Labels}
      >
        <Grid />
      </BarChart>
      <XAxis
        style={{ marginTop: 10 }}
        data={counts}
        formatLabel={(value: number, index: number) => labels[index]}
        contentInset={{ left: 20, right: 20 }}
        svg={{ fontSize: 12, fill: '#333' }}
      />
    </View>
  );
};

export default Graph;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
