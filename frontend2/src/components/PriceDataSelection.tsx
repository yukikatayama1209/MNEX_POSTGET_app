import React from 'react';
import { useNavigate } from 'react-router-dom';
import style from '../assets/styles/PriceDataSelection.module.css';

const PriceDataSelection: React.FC = () => {
  const navigate = useNavigate();

  const handleProductSelect = (product: string) => {
    navigate(`/price_data/${product}`);
  };

  return (
    <div className={style.container}>
      <h1>商品を選択してください</h1>

      <div className={`${style.section} ${style.vegetables}`}>
        <h2>野菜</h2>
        <div className={style.buttonContainer}>
          <button onClick={() => handleProductSelect('cucumber')}>きゅうり</button>
          <button onClick={() => handleProductSelect('tomato')}>トマト</button>
          <button onClick={() => handleProductSelect('carrot')}>にんじん</button>
          <button onClick={() => handleProductSelect('cabbage')}>キャベツ</button>
          <button onClick={() => handleProductSelect('lettuce')}>レタス</button>
          <button onClick={() => handleProductSelect('eggplant')}>なす</button>
          <button onClick={() => handleProductSelect('green_pepper')}>ピーマン</button>
        </div>
      </div>

      <div className={`${style.section} ${style.meats}`}>
        <h2>お肉</h2>
        <div className={style.buttonContainer}>
          <button onClick={() => handleProductSelect('beef')}>牛肉</button>
          <button onClick={() => handleProductSelect('pork')}>豚肉</button>
          <button onClick={() => handleProductSelect('chicken')}>鶏肉</button>
        </div>
      </div>

      <div className={`${style.section} ${style.fuel}`}>
        <h2>ガソリン</h2>
        <div className={style.buttonContainer}>
          <button onClick={() => handleProductSelect('regular_gasoline')}>レギュラー</button>
          <button onClick={() => handleProductSelect('premium_gasoline')}>ハイオク</button>
          <button onClick={() => handleProductSelect('kerosene')}>灯油</button>
        </div>
      </div>
    </div>
  );
};

export default PriceDataSelection;
