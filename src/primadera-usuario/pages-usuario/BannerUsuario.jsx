import { useNavigate } from "react-router-dom";
import imagenes from "../../assets/imagenes";
import { FaHome, FaRegEdit } from "react-icons/fa";
import LoginService from '../../services/LoginService';
import { Carousel } from 'react-bootstrap';
import './BannerUsuario.css'


const BannerUser = ({ backgroundColor }) => {

    const navigate = useNavigate();
    const logout = () => {
        LoginService.logout();
        navigate("/")
    };

    const bannerStyle = {
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        textAling: 'center',
        height: '200px'
    };

    const backgroundS = {
        backgroundImage: `url(${imagenes.fondoTextura}`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
    };

    const logoStyle = {
        maxWidth: '214.5px',
        padding: '10px 20px',
        position: 'absolute',
        top: '32px',
        right: '0px',

        borderRadius: '0px 0px 60px 60px',
        color: 'white',


    };

    const btnCrrSesion = {
        padding: '10px 20px',
        cursor: 'pointer',
        position: 'absolute',
        top: '0%',
        right: '32.5px',
        backgroundColor: backgroundColor || '#4d4d4d',
        zIndex: '1',
        color: 'white',
        border: 'none',
        width: '150px',

    };

    const imgCreamos = {
        width: '200px',
        height: '100px',
        margin: 'auto',
        display: 'block',
        position: 'fixed',
        bottom: '0',
        left: '50%',
        transform: 'translateX(-50%)',
    };

    {/*AJUSTE LCPG INI*/ }

    {/*AJUSTE LCPG FIN*/ }
    const styles = {
        container: {
            position: 'fixed',
            bottom: '30%',
            right: '0',
            transform: 'translateY(-50%)',
            zIndex: '5',
            width: 'fit-content',


        },
        icon: {
            width: '50px',

            borderRadius: '40px 0 0 40px',

            cursor: 'pointer',

        },
    };


    return (
        <>

            <div className='Back'>
                <Carousel >
                    <Carousel.Item className="Carrusel" style={bannerStyle}>
                        <img
                            className="img1_img-fluid"
                            src={imagenes.BannerSenior}
                            alt="Primera diapositiva"
                        />
                    </Carousel.Item>
                    <Carousel.Item className="Carrusel" style={bannerStyle}>
                        <img
                            className="img2_img-fluid"
                            src={imagenes.BannerArboles}
                            alt="Segunda diapositiva"
                        />
                    </Carousel.Item >
                    <Carousel.Item className="Carrusel" style={bannerStyle}>
                        <img
                            className="img3_img-fluid"
                            src={imagenes.BannerTroncos}
                            alt="Tercera diapositiva"
                        />
                    </Carousel.Item>
                    <Carousel.Item className="Carrusel" style={bannerStyle}>
                        <img
                            className="img4_img-fluid"
                            src={imagenes.BannerIndustria}
                            alt="Cuarta diapositiva"
                        />
                    </Carousel.Item>
                </Carousel>

            </div>
            <div style={styles.container}>
                <a href="https://api.whatsapp.com/send?phone=573232348803" target="_blank" rel="noopener noreferrer">
                    <img src={imagenes.wpp} alt="Icono de WhatsApp" style={styles.icon} />
                </a>
            </div>

            <div className="div_close">
                <button style={btnCrrSesion} onClick={((e) => logout(e))}>Cerrar Sesión</button>
                <img className="Img_Recicla" style={logoStyle} src={imagenes.ReciclajeBlanco} />
            </div>
            {/*AJUSTE LCPG INI*/}



        </>
    );
};

export default BannerUser;