import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';  // axiosインスタンスをインポート
import style from '../assets/styles/PriceData.module.css';
import PlotComponent from './PlotComponent';

interface PriceData {
  id: number;
  product_photo: string;
  purchase_date: string;
  shop_location: string;
  comments: string | null;
  price: number;
  importance: boolean;
}

const productMapping: { [key: string]: string } = {
  cucumber: 'きゅうり',
  tomato: 'とまと',
  carrot: 'にんじん',
  cabbage: 'キャベツ',
  lettuce: 'レタス',
  eggplant: 'なす',
  green_pepper: 'ピーマン',
  beef: '牛肉',
  pork: '豚肉',
  chicken: '鶏肉',
  regular_gasoline: 'レギュラー',
  premium_gasoline: 'ハイオク',
  kerosene: '灯油',
};

const PriceData: React.FC = () => {
  const { product } = useParams<{ product: string }>();
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
        const response = await api.get<PriceData[]>(`/price_data/${productName}`, {
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

  const handleViewDetails = (item: PriceData) => {
    navigate(`/price_data/${product}/${item.id}`, { state: { data: item } });
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div className={style.error}>{error}</div>;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const importantRecentData = priceData.filter(item => item.importance && new Date(item.purchase_date) > oneWeekAgo);
  const otherData = priceData.filter(item => !importantRecentData.includes(item));

  const isFuelProduct = ['regular_gasoline', 'premium_gasoline', 'kerosene'].includes(product);

  return (
    <div className={style.priceData}>
      <h1 className={style.title}>{productMapping[product]}の価格データ</h1>
      {priceData.length === 0 ? (
        <p>{productMapping[product]}の価格データがありません。</p>
      ) : (
        <div>
          {importantRecentData.length > 0 && (
            <div className={style.section}>
              <h2>重要なデータ（1週間以内）</h2>
              <div className={style.scrollContainer}>
                {importantRecentData.map((item) => (
                  <div key={item.id} className={`${style.priceItem} ${style.important}`}>
                    <img src={`${import.meta.env.VITE_API_BASE_URL}/photos/${encodeURIComponent(item.product_photo)}`} alt={productMapping[product]} className={style.productPhoto} />
                    <p>購入日: {item.purchase_date}</p>
                    <p>購入場所: {item.shop_location}</p>
                    <p>価格: {item.price !== undefined ? `${item.price}円` : '価格情報なし'}</p>
                    {item.importance && <p style={{ color: 'red' }}>重要</p>}
                    <p>コメント: {item.comments || 'コメントなし'}</p>
                    <button className={style.detailButton} onClick={() => handleViewDetails(item)}>詳細を見る</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {otherData.length > 0 && (
            <div className={style.section}>
              <h2>その他のデータ</h2>
              <div className={style.scrollContainer}>
                {otherData.map((item) => (
                  <div key={item.id} className={style.priceItem}>
                    <img src={`${import.meta.env.VITE_API_BASE_URL}/photos/${encodeURIComponent(item.product_photo)}`} alt={productMapping[product]} className={style.productPhoto} />
                    <p>購入日: {item.purchase_date}</p>
                    <p>購入場所: {item.shop_location}</p>
                    <p>価格: {item.price !== undefined ? `${item.price}円` : '価格情報なし'}</p>
                    {item.importance && <p style={{ color: 'red' }}>重要</p>}
                    <p>コメント: {item.comments || 'コメントなし'}</p>
                    <button className={style.detailButton} onClick={() => handleViewDetails(item)}>詳細を見る</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {isFuelProduct && <PlotComponent product={product} />}
    </div>
  );
};

export default PriceData;
