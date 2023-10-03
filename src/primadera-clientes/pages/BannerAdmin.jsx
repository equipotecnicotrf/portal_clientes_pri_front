import imagenes from "../../assets/imagenes";



const Banner = () => {
    const bannerStyle = {
    backgroundImage: `url(${imagenes.bannerAdmin}`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      textAling: 'center',
      padding: '50px',
    };
   
    
   
    const logoStyle = {
      maxWidth: '478px', // Ajusta según tus necesidades
      margin: '10px',
    };
    
   
    return (
        <>
        
        <div style={bannerStyle}>
        <img src={imagenes.LogoBlanco} alt="Logo" style={logoStyle} />        
        </div>

        </>
    );
   };
   
   export default Banner;