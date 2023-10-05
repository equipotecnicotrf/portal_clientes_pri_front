import imagenes from '../../assets/imagenes';
import { Carousel } from 'react-bootstrap';
import '../pages/BackgroundCarousel.css'

const BackgroundCarousel = () => {
 return (
<div className="background-carousel">
<Carousel>
<Carousel.Item>
<img
           className="img1 img-fluid"
           src={imagenes.PlantaHome}
           alt="Primera diapositiva"
         />
</Carousel.Item>
<Carousel.Item>
<img
           className="img2 img-fluid"
           src={imagenes.Jayka}
           alt="Segunda diapositiva"
         />
</Carousel.Item>
<Carousel.Item>
<img
           className="img2 img-fluid"
           src={imagenes.Arboles}
           alt="Tercera diapositiva"
         />
</Carousel.Item>
<Carousel.Item>
<img
           className="img2 img-fluid"
           src={imagenes.Restos}
           alt="Cuarta diapositiva"
         />
</Carousel.Item>
       {/* Agrega más diapositivas según sea necesario */}
</Carousel>
</div>
 );
};

export default BackgroundCarousel;