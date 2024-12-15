import { useLocation, useNavigate } from 'react-router-dom';
import ProductRecipeForm from './Components/ProductRecipeForm';

const EditRecipeProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  if (!product) {
    navigate('/productos/menu');
    return null;
  }

  const handleClose = () => {
    navigate('/productos/menu');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ProductRecipeForm 
        product={product} 
        onClose={handleClose}
      />
    </div>
  );
};

export default EditRecipeProduct;