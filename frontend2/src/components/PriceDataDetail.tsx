import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import style from '../assets/styles/PriceDataDetail.module.css';

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

const PriceDataDetail: React.FC = () => {
  const { product } = useParams<{ product: string }>();
  const location = useLocation();
  const data = location.state?.data;

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!data) {
    return <div>データがありません</div>;
  }

  return (
    <div className={style.priceDataDetailContainer}>
      <div className={style.priceDataDetail}>
        <h1 className={style.title}>{productMapping[product]}の詳細情報</h1>
        <img src={`${import.meta.env.VITE_API_BASE_URL}/photos/${encodeURIComponent(data.product_photo)}`} alt={productMapping[product]} className={style.productPhoto} />
        <p className={style.largeText}>購入日: {data.purchase_date}</p>
        <p className={style.largeText}>購入場所: {data.shop_location}</p>
        <p className={style.price}>価格: {data.price !== undefined ? `${data.price}円` : '価格情報なし'}</p>
        {data.importance && <p style={{ color: 'red' }}>重要</p>}
        <p>コメント: {data.comments || 'コメントなし'}</p>
        <div className={style.mapContainer}>
          <h2 className={style.mapTitle}>お店へのアクセス</h2>
          <iframe
            width="600"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${encodeURIComponent(data.shop_location)}`}>
          </iframe>
        </div>
      </div>
    </div>
  );
};

export default PriceDataDetail;
