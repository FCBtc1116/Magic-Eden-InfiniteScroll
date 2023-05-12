const Card = ({ img, title, price }) => {
  return (
    <div className="w-full pb-4">
      <img className="rounded-lg" src={img} alt={title} />
      <div className="flex justify-between font-lg">
        <p>{title}</p>
        <p>{price} ETH</p>
      </div>
    </div>
  );
};

export default Card;
