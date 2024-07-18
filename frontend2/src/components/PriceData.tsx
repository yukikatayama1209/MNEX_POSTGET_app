import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';

interface PriceData {
  product_photo: string;
  purchase_date: string;
  shop_location: string;
  comments: string | null;
}

const productMapping: { [key: string]: string } = {
  cucumber: 'きゅうり',
  tomato: 'とまと',
  carrot: 'にんじん',
};

const PriceData: React.FC = () => {
  const { product } = useParams<{ product: string }>();
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  useEffect(() => {
    const fetchPriceData = async () => {
      const token = Cookies.get('token');
      if (!token) {
        setError('認証エラー: トークンが見つかりません');
        setLoading(false);
        return;
      }

      const productName = productMapping[product];
      if (!productName) {
        setError('指定された商品が見つかりません');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<PriceData[]>(`http://localhost:8000/price_data/${productName}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setPriceData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('価格データの取得に失敗しました', error);
        if (axios.isAxiosError(error) && error.response) {
          setError(`エラー: ${error.response.status} - ${error.response.data.detail || '不明なエラー'}`);
        } else {
          setError('価格データの取得中に不明なエラーが発生しました');
        }
        setLoading(false);
      }
    };

    fetchPriceData();
  }, [product]);

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div className="error">{error}</div>;

  const latestPriceData = priceData.sort((a, b) => new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime()).slice(0, 5);

  return (
    <div className="price-data">
      <h1>{productMapping[product]}の価格データ</h1>
      {latestPriceData.length === 0 ? (
        <p>{productMapping[product]}の価格データがありません。</p>
      ) : (
        latestPriceData.map((item, index) => (
          <div key={index} className="price-item" style={{ marginBottom: '20px' }}>
            <img src={`http://localhost:8000/photos/${item.product_photo}`} alt={productMapping[product]} className="product-photo" style={{ width: '25%' }} />
            <p>購入日: {item.purchase_date}</p>
            <p>購入場所: {item.shop_location}</p>
            <p>コメント: {item.comments || 'コメントなし'}</p>
            <button onClick={() => setSelectedLocation(item.shop_location)}>アクセスを見る</button>
            {selectedLocation === item.shop_location && (
              <iframe
                width="300"
                height="200"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps/embed/v1/place?key=API_KEY&q=${encodeURIComponent(item.shop_location)}`}>
              </iframe>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default PriceData;
