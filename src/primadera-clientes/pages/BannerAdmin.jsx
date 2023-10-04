import { useNavigate } from "react-router-dom";
import imagenes from "../../assets/imagenes";



const Banner = ({ backgroundColor }) => {
  const navigate = useNavigate();
    const bannerStyle = {
    backgroundImage: `url(${imagenes.bannerAdmin}`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      textAling: 'center',
      padding: '50px',
      height: '20px'
    };  
    const logoStyle = {
      maxWidth: '478px', // Ajusta según tus necesidades
      marginTop: '-40px',
    };
    const btnCrrSesion = {
       padding: '10px 20px',
       cursor: 'pointer',
       position: 'absolute',
       top: '20px',
       right: '10px',
       backgroundColor: backgroundColor || '#323333',
       borderRadius: '20px',
       color: 'white',
       
    }
    
   
    return (
        <>
        
        <div style={bannerStyle}>
        <img src={imagenes.LogoBlanco} alt="Logo" style={logoStyle} />        
        </div>

        <div >
          <button style={btnCrrSesion} onClick={() => navigate("/login")}>Cerrar Sesión</button>
        </div>

        </>
    );
   };
   
   export default Banner;