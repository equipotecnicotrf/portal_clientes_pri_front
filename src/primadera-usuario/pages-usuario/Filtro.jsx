import React, { useState } from 'react';

const products = [
    { id: 1, name: 'Producto 1', category: 'Linea' },
    { id: 2, name: 'Producto 2', category: 'Acabados' },
    { id: 3, name: 'Producto 3', category: 'Caras' },
    { id: 4, name: 'Producto 4', category: 'Diseños' },
    { id: 5, name: 'Producto 5', category: 'Sustrato' },
    { id: 6, name: 'Producto 6', category: 'Espesor' },
    { id: 7, name: 'Producto 7', category: 'Formato' },
    // ...
];

const categories = ['Linea', 'Acabados', 'Caras', 'Diseños', 'Sustrato', 'Espesor', 'Formato'];

const FiltroInven = () => {
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
    };
    const StyleProducts = {
        fontColor: '#717171',
        fontSize: '15px',
    };

    const StyleArrows = {

        fontSize: '30px',

    };

    return (
        <div>

            {categories.map((category) => (
                <div key={category}>
                    <div style={StyleFilter} onClick={() => handleSectionToggle(category)}>
                        {category}
                        {expandedSections.includes(category) ? <strong><span style={StyleArrows}>&#94;</span></strong> :
                            <strong><span >&#5167;</span></strong>}
                    </div>
                    {expandedSections.includes(category) && (
                        <div style={StyleProducts}>
                            {products
                                .filter((product) => product.category === category)
                                .map((product) => (
                                    <label key={product.id}>
                                        <input type="checkbox" />
                                        {product.name}
                                    </label>
                                ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default FiltroInven;