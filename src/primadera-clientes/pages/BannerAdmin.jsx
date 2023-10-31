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



  return (
    <>

      <div style={bannerStyle}>
        <img className="Logo_Pri_Blanco"
          src={imagenes.LogoBlanco} alt="Logo" />
      </div>
      <div >
        <button className="Btn_Cerrar"
          onClick={((e) => logout(e))}>Cerrar Sesión</button>
        <img className="LogoReciclaje"
          src={imagenes.ReciclajeBlanco} />
      </div>
      {/*AJUSTE LCPG INI*/}
      <div >
        <button className="Btn_Home"
          onClick={() => navigate("/DropdownMenu")}> <FaHome /></button>
      </div>
      {/*AJUSTE LCPG FIN*/}

    </>
  );
};

export default Banner