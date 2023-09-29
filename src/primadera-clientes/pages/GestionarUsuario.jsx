import Banner from './BannerAdmin';
import imagenes from "../../assets/imagenes";
import '../pages/GestionarUsuario.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const DataTable = ({backgroundColor}) => {
  const bannerStyle = {
    backgroundColor: backgroundColor || '#878787',
    color: '#fff',
    padding: '20px',
    textAlign: 'center',
    
    
  };
  const backgroundStyle = {
    backgroundImage: `url(${imagenes.FondoAdmin}`, 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh', // Altura de la pantalla completa
  };

  
  
     const data = [
       { id: 1, name: 'John Doe', age: 25 },
       { id: 2, name: 'Jane Doe', age: 30 },
     ];
    
     return (
         <>
         <div className='Back' style={backgroundStyle}>
         <Banner />
        
     <div className='DataTable' style={bannerStyle} >
    <table className=' table-sm table-borderless' style={bannerStyle} >
    <thead >
    <tr >
    <th>Cliente</th>
    <th>Nombre</th>
    <th>Telefono</th>
    <th>Correo</th>
    <th>Estado</th>
    <th>Rol</th>
    <th>Acciones</th>
    </tr>
    </thead>
    <tbody >
           {data.map((item) => (
    <tr key={item.id}>
    <td>{item.id}</td>

<td>{item.name}</td>

<td>{item.age}</td>
    </tr>
           ))}
    </tbody>
    </table>
    

    
    </div>
    <div className='Buttons mt-12'>
    <button className='btn1 p-2 btn-sm'>Gestionar Roles</button>
     <button className='btn2 p-2 m-2 btn-sm'>Crear usuario</button>
    </div>
     
    </div>
    
    </>
    
     );
     
    };
    
    export default DataTable;

