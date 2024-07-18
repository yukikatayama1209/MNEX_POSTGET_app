import React from 'react';
import { useNavigate } from 'react-router-dom';

const PriceDataSelection: React.FC = () => {
  const navigate = useNavigate();

  const handleProductSelect = (product: string) => {
    navigate(`/price_data/${product}`);
  };

  return (
    <div>
      <h1>商品を選択してください</h1>
      <button onClick={() => handleProductSelect('cucumber')}>きゅうり</button>
      <button onClick={() => handleProductSelect('tomato')}>トマト</button>
      <button onClick={() => handleProductSelect('carrot')}>にんじん</button>
      {/* 他の商品ボタンをここに追加できます */}
    </div>
  );
};

export default PriceDataSelection;
