import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import api from '../api/api';  // axiosインスタンスをインポート
import style from '../assets/styles/PlotComponent.module.css';

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
  const [layout, setLayout] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/data');
        const fetchedData = response.data;
        console.log('Fetched data:', fetchedData); // デバッグ用ログ

        const xData = fetchedData.map((item: any) => new Date(item.SurveyDate));

        let yData;
        if (product === 'regular_gasoline') {
          yData = fetchedData.map((item: any) => parseFloat(item.Regular_Hokkaido));
        } else if (product === 'premium_gasoline') {
          yData = fetchedData.map((item: any) => parseFloat(item.High_octane_Hokkaido));
        } else if (product === 'kerosene') {
          yData = fetchedData.map((item: any) => parseFloat(item.Kerosene_Hokkaido));
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
            marker: { color: '#FF0000', size: 4 },  // マーカーの色を赤に変更
            line: { shape: 'spline', color: '#FF0000', width: 2 },  // ラインの色を赤に変更
          },
        ];
        console.log('Plot data:', plotData); // デバッグ用ログ
        const currentDate = new Date();
        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(currentDate.getFullYear() - 5);

        setData(plotData);
        setLayout({
          width: 900,
          height: 500,
          title: `${productMapping[product]}の価格推移`,
          xaxis: {
            title: '日付',
            type: 'date',
            range: [fiveYearsAgo.toISOString(), currentDate.toISOString()],
            showgrid: false,
            zeroline: false,
            showline: true,
            linecolor: '#ccc',
          },
          yaxis: {
            title: '価格 (円)',
            showgrid: true,
            zeroline: false,
            showline: true,
            linecolor: '#ccc',
            gridcolor: '#eee',
          },
          plot_bgcolor: '#f7f7f7',
          paper_bgcolor: '#ffffff',
          font: { family: 'Arial, sans-serif', size: 14, color: '#333' },
          margin: { t: 60, b: 60, l: 60, r: 60 },
          hovermode: 'x unified',
          hoverlabel: { bgcolor: "#fff", bordercolor: "#ccc", font: { size: 12 } },
        });
      } catch (error) {
        console.error('Error fetching plot data:', error);
      }
    };

    fetchData();
  }, [product]);

  return (
    <div className={style.plotContainer}>
      <h1 className={style.plotTitle}>{productMapping[product]}の価格変動データ</h1>
      {data.length > 0 ? (
        <Plot data={data} layout={layout} className={style['plotly-graph']} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PlotComponent;
