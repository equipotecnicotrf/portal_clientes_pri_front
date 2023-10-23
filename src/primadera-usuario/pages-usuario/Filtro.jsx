import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import ItemService from '../../services/ItemService';

const FiltroInven = () => {
    const [articulos, setArticulos] = useState([]);
    const [acabado, setAcabados] = useState([]);
    const [caras, setCaras] = useState([]);
    const [diseno, setDiseno] = useState([]);
    const [sustrato, setSustrato] = useState([]);
    const [espesor, setEspesor] = useState([]);
    const [formato, setFormato] = useState([]);
    const [searchText, setSearchText] = useState(''); // Nuevo estado para el texto de búsqueda

    useEffect(() => {
        ListArticulos();
        ListAcabado();
        ListCaras();
        ListDiseno();
        ListSustrato();
        ListEspesor();
        ListFormato();
    }, []);

    const ListArticulos = () => {
        ItemService.getItemsLinea()
            .then(response => {
                setArticulos(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const ListAcabado = () => {
        ItemService.getItemsAcabado()
            .then(response => {
                setAcabados(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const ListCaras = () => {
        ItemService.getItemsCaras()
            .then(response => {
                setCaras(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const ListDiseno = () => {
        ItemService.getItemsDiseno()
            .then(response => {
                setDiseno(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const ListSustrato = () => {
        ItemService.getItemsSustrato()
            .then(response => {
                setSustrato(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const ListEspesor = () => {
        ItemService.getItemsEspesor()
            .then(response => {
                setEspesor(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const ListFormato = () => {
        ItemService.getItemsFormato()
            .then(response => {
                setFormato(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    // Función para filtrar diseño según el texto de búsqueda
    const filterDiseño = () => {
        return diseno.filter((disenoitems) => {
            const diseñoText = `${disenoitems}`;
            return diseñoText.toLowerCase().includes(searchText.toLowerCase());
        });
    };





    const products = [
        { id: 1, name: 'Linea', category: 'Linea' },
        { id: 2, name: 'Acabados', category: 'Acabados' },
        { id: 3, name: 'Caras', category: 'Caras' },
        { id: 4, name: 'Diseños', category: 'Diseños' },
        { id: 5, name: 'Sustrato', category: 'Sustrato' },
        { id: 6, name: 'Espesor', category: 'Espesor' },
        { id: 7, name: 'Formato', category: 'Formato' },
        // ...
    ];

    const categories = ['Linea', 'Acabados', 'Caras', 'Diseños', 'Sustrato', 'Espesor', 'Formato'];

    const [selectedFilters, setSelectedFilters] = useState([]);
    const [expandedSections, setExpandedSections] = useState([]);

    const handleFilterChange = (category) => {
        setSelectedFilters((prevFilters) => {
            if (prevFilters.includes(category)) {
                return prevFilters.filter((filter) => filter !== category);
            } else {
                return [...prevFilters, category];
            }
        });
    };

    const handleSectionToggle = (category) => {
        setExpandedSections((prevSections) => {
            if (prevSections.includes(category)) {
                return prevSections.filter((section) => section !== category);
            } else {
                return [...prevSections, category];
            }
        });
    };

    const StyleFilter = {
        fontColor: '#717171',
        fontSize: '20px',
        marginBottom: '-20px',
    };
    const StyleProducts = {
        fontColor: '#717171',
        fontSize: '15px',
        marginTop: '-10px',
        marginBottom: '15px',
        maxHeight: '150px', // Altura máxima del contenedor de desplazamiento
        overflow: 'auto', // Habilitar el desplazamiento cuando los productos excedan la altura del contenedor

    };

    const StyleUpArrows = {
        fontSize: '15px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: 'translate(30px, -21px)',
    };

    const StyleDownArrows = {
        fontSize: '10px',

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: 'translate(30px, -21px)',
    };

    const CategoriasStyle = {
        width: '160px',
    }
    const StyleSearchBar = {

    }

    const StyleProductList = {
        display: 'flex',
        flexDirection: 'column', // Muestra los checkbox de manera vertical
    }

    const StyleSearchIcon = {

    }

    return (
        <div style={CategoriasStyle}>
            {categories.map((category) => (
                <div key={category}>
                    {category === 'Diseños' && !expandedSections.includes(category) ? (
                        <div style={StyleFilter} onClick={() => handleSectionToggle(category)}>
                            {category}
                            <strong>
                                {expandedSections.includes(category) ? (
                                    <span style={StyleUpArrows}>&#94;</span>
                                ) : (
                                    <span style={StyleDownArrows}>&#5167;</span>
                                )}
                            </strong>
                        </div>
                    ) : (
                        <>
                            <div style={StyleFilter} onClick={() => handleSectionToggle(category)}>
                                {category}
                                <strong>
                                    {expandedSections.includes(category) ? (
                                        <span style={StyleUpArrows}>&#94;</span>
                                    ) : (
                                        <span style={StyleDownArrows}>&#5167;</span>
                                    )}
                                </strong>
                            </div>
                            {expandedSections.includes(category) && (
                                <div style={StyleProducts}>
                                    {category === 'Diseños' ? (
                                        <>
                                            <div style={StyleSearchBar}>
                                                <input
                                                    type="text"
                                                    placeholder="Buscar productos de diseño..."
                                                    value={searchText}
                                                    onChange={(e) => setSearchText(e.target.value)}
                                                />
                                                <FaSearch style={StyleSearchIcon} />
                                            </div>
                                            <div style={StyleProductList}>
                                                {filterDiseño()
                                                    .map((disenoValue) => (
                                                        <label key={disenoValue}>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedFilters.includes(disenoValue)}
                                                                onChange={() => handleFilterChange(disenoValue)}
                                                            />
                                                            {disenoValue}
                                                        </label>
                                                    ))}
                                            </div>
                                        </>
                                    ) : category === 'Linea' ? (
                                        <div style={StyleProductList}>
                                            {articulos.map((lineaValue) => (
                                                <label key={lineaValue}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedFilters.includes(lineaValue)}
                                                        onChange={() => handleFilterChange(lineaValue)}
                                                    />
                                                    {lineaValue}
                                                </label>

                                            ))}
                                        </div>
                                    ) : category === 'Acabados' ? (
                                        <div style={StyleProductList}>
                                            {acabado.map((acabadosValue) => (
                                                <label key={acabadosValue}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedFilters.includes(acabadosValue)}
                                                        onChange={() => handleFilterChange(acabadosValue)}
                                                    />
                                                    {acabadosValue}
                                                </label>
                                            ))}
                                        </div>
                                    ) : category === 'Caras' ? (
                                        <div style={StyleProductList}>
                                            {caras.map((carasValue) => (
                                                <label key={carasValue}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedFilters.includes(carasValue)}
                                                        onChange={() => handleFilterChange(carasValue)}
                                                    />
                                                    {carasValue}
                                                </label>
                                            ))}
                                        </div>
                                    ) : category === 'Sustrato' ? (
                                        <div style={StyleProductList}>
                                            {sustrato.map((sustratoValue) => (
                                                <label key={sustratoValue}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedFilters.includes(sustratoValue)}
                                                        onChange={() => handleFilterChange(sustratoValue)}
                                                    />
                                                    {sustratoValue}
                                                </label>
                                            ))}
                                        </div>
                                    ) : category === 'Espesor' ? (
                                        <div style={StyleProductList}>
                                            {espesor.map((espesorValue) => (
                                                <label key={espesorValue}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedFilters.includes(espesorValue)}
                                                        onChange={() => handleFilterChange(espesorValue)}
                                                    />
                                                    {espesorValue}
                                                </label>
                                            ))}
                                        </div>
                                    ) : category === 'Formato' ? (
                                        <div style={StyleProductList}>
                                            {formato.map((formatoValue) => (
                                                <label key={formatoValue}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedFilters.includes(formatoValue)}
                                                        onChange={() => handleFilterChange(formatoValue)}
                                                    />
                                                    {formatoValue}
                                                </label>
                                            ))}
                                        </div>
                                    ) : (
                                        products
                                            .filter((product) => product.category === category)
                                            .map((product) => (
                                                <label key={product.id}>
                                                    <input type="checkbox" />
                                                    {product.name}
                                                </label>
                                            ))
                                    )}
                                </div>
                            )}
                        </>
                    )}
                    <hr style={{ border: 'none', borderTop: '1px solid black', marginTop: '-10px', width: '120px' }} />
                </div>
            ))}
        </div>
    );
};

export default FiltroInven;