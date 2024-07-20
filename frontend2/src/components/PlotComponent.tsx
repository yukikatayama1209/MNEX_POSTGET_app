import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

interface PlotComponentProps {
  product: string;
}

const productMapping: { [key: string]: string } = {
  regular_gasoline: 'レギュラー',
  premium_gasoline: 'ハイオク',
  kerosene: '灯油',
};

const PlotComponent: React.FC<PlotComponentProps> = ({ product }) => {
  const [data, setData] = useState<any[]>([]);
  const [layout, setLayout] = useState({ width: 720, height: 440, title: '' });

  useEffect(() => {
    fetch('http://localhost:8000/data')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data); // デバッグ用ログ

        const xData = data.map((item: any) => new Date(item.SurveyDate));
        
        let yData;
        if (product === 'regular_gasoline') {
          yData = data.map((item: any) => parseFloat(item.Regular_Hokkaido));
        } else if (product === 'premium_gasoline') {
          yData = data.map((item: any) => parseFloat(item.High_octane_Hokkaido));
        } else if (product === 'kerosene') {
          yData = data.map((item: any) => parseFloat(item.Kerosene_Hokkaido));
        } else {
          yData = []; // デフォルト値として空の配列を設定
        }

        console.log('xData:', xData); // デバッグ用ログ
        console.log('yData:', yData); // デバッグ用ログ

        const plotData = [
          {
            x: xData,
            y: yData,
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'red' },
          },
        ];
        console.log('Plot data:', plotData); // デバッグ用ログ
        setData(plotData);
        setLayout({ width: 720, height: 440, title: `${productMapping[product]}の価格推移` });
      })
      .catch(error => console.error('Error fetching plot data:', error));
  }, [product]);

  return (
    <div>
      <h1>Plotly Graph</h1>
      {data.length > 0 ? (
        <Plot data={data} layout={layout} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PlotComponent;
