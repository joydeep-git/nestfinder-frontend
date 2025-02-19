import SimpleImageSlider from "react-simple-image-slider";

const ImageCarousal = ({ images, className = "" }: { images: { url: string }[]; className: string; }) => {
  return (
    <div className={className}>
      <SimpleImageSlider
        style={{ position: "relative", objectFit: "contain", margin: "0 auto" }}
        images={images}
        showBullets={false}
        showNavs={true}
        width="100%"
        height="100%"
        navStyle={2}
      />
    </div>
  )
};

export default ImageCarousal;
