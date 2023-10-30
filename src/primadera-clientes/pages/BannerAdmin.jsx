import { useNavigate } from "react-router-dom";
import imagenes from "../../assets/imagenes";
import { FaHome, FaRegEdit } from "react-icons/fa";
import LoginService from '../../services/LoginService';
import '../pages/BannerAdmin.css';


const Banner = ({ backgroundColor }) => {
  const navigate = useNavigate();
  const logout = () => {
    LoginService.logout();
    navigate("/")
  }


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
    top: '0%',
    right: '10px',
    backgroundColor: backgroundColor || '#323333',
    zIndex: '1',
    color: 'white',
    border: 'none',
    width: '150px',

  }
  {/*AJUSTE LCPG INI*/ }
  const btnHome = {
    padding: '10px 20px',
    cursor: 'pointer',
    position: 'absolute',
    top: '20px',
    right: '170px',
    backgroundColor: backgroundColor || '#323333',
    borderRadius: '20px',
    color: 'white',
    border: 'none',

  }
  {/*AJUSTE LCPG FIN*/ }
  const logoStyle2 = {
    maxWidth: '150px',
    padding: '10px 20px',
    position: 'absolute',
    top: '43px',
    right: '10.5px',
    backgroundColor: backgroundColor || '#323333',
    borderRadius: '0px 0px 60px 60px',
    color: 'white',


  };


  return (
    <>

      <div style={bannerStyle}>
        <img src={imagenes.LogoBlanco} alt="Logo" style={logoStyle} />
      </div>
      <div >
        <button style={btnCrrSesion} onClick={((e) => logout(e))}>Cerrar Sesión</button>
        <img style={logoStyle2} src={imagenes.ReciclajeBlanco} />
      </div>
      {/*AJUSTE LCPG INI*/}
      <div >
        <button style={btnHome} onClick={() => navigate("/DropdownMenu")}> <FaHome /></button>
      </div>
      {/*AJUSTE LCPG FIN*/}

    </>
  );
};

export default Banner;