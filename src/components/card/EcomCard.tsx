import EcomButton from "../button/EcomButton";
import "./EcomCard.css";

interface ProductProps {
  name: string;
  price: number;
  image: string;
}

const EcomCard = ({ name, price, image }: ProductProps) => {
  return (
    <div className="product-card">
      {/* {image && <img src={image} className="product-img" alt="product-image" />} */}
      <img src={image} className="product-img" alt="product-image" />
      <h5 className="product-title">{name}</h5>
      <p className="product-price">₹{price}</p>

      <div>
        <EcomButton icon="fa-solid fa-heart me-1" className="wish-btn me-2" />
        <EcomButton className="add-btn" text="Add to Cart" />
      </div>
    </div>
  );
};

export default EcomCard;

