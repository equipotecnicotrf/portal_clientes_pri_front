import '../pages/HomePage.css';
import imagenes from '../../assets/imagenes';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
//import { Carousel } from 'react-bootstrap';
import BackgroundCarousel from './BackgroundCarousel';




const HomePage = () => {
  const navigate = useNavigate();
  
    return (   
      <div className="App">
<BackgroundCarousel />
<div className='logo-blanco'>
  <img src={imagenes.LogoBlanco}/>
   </div>
   <button onClick={() => navigate("/login")} className="btn enter-button" >INGRESO</button>

</div>
   
 );
  } 
  


export default HomePage
