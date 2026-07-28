// src/components/react/BuscadorGlobal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX, FiMapPin, FiBriefcase, FiStar } from 'react-icons/fi';

const BuscadorGlobal = ({ 
  clubes = [], 
  proveedores = [], 
  placeholder = 'Buscar clubes, proveedores, ciudades...',
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  // Combinar clubes y proveedores en un solo array para búsqueda
  const todosLosItems = [
    ...clubes.map(c => ({
      ...c,
      tipo: 'club',
      url: `/clubes/${c.estado_slug}-${c.ciudad_slug}-${c.slug}`,
      icon: <FiMapPin className="w-4 h-4 text-primary" />
    })),
    ...proveedores.map(p => ({
      ...p,
      tipo: 'proveedor',
      url: `/proveedores/${p.slug}`,
      icon: <FiBriefcase className="w-4 h-4 text-blue-500" />
    }))
  ];

  // Función de búsqueda
  const buscar = (termino) => {
    if (!termino || termino.length < 2) {
      setResultados([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    const q = termino.toLowerCase().trim();

    const filtrados = todosLosItems.filter(item => {
      const nombre = (item.nombre || '').toLowerCase();
      const ciudad = (item.ciudad || '').toLowerCase();
      const estado = (item.estado || '').toLowerCase();
      const especialidad = (item.especialidad || '').toLowerCase();
      const categoria = (item.categoria || '').toLowerCase();
      const tipo = (item.tipo || '').toLowerCase();
      const descripcion = (item.descripcion || '').toLowerCase();

      return (
        nombre.includes(q) ||
        ciudad.includes(q) ||
        estado.includes(q) ||
        especialidad.includes(q) ||
        categoria.includes(q) ||
        tipo.includes(q) ||
        descripcion.includes(q)
      );
    });

    // Ordenar: destacados primero, luego por nombre
    filtrados.sort((a, b) => {
      if (a.destacado && !b.destacado) return -1;
      if (!a.destacado && b.destacado) return 1;
      return (a.nombre || '').localeCompare(b.nombre || '');
    });

    setResultados(filtrados.slice(0, 8));
    setIsOpen(filtrados.length > 0);
    setIsLoading(false);
    setSelectedIndex(-1);
  };

  // Debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      buscar(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Cerrar resultados al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navegación con teclado
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < resultados.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const selected = resultados[selectedIndex];
      if (selected) {
        window.location.href = selected.url;
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
      inputRef.current?.blur();
    }
  };

  // Limpiar búsqueda
  const limpiarBusqueda = () => {
    setQuery('');
    setResultados([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Resaltar coincidencias
  const resaltarTexto = (texto, query) => {
    if (!query || !texto) return texto;
    const q = query.toLowerCase();
    const index = texto.toLowerCase().indexOf(q);
    if (index === -1) return texto;
    
    return (
      <>
        {texto.substring(0, index)}
        <span className="bg-gold/30 font-semibold">
          {texto.substring(index, index + q.length)}
        </span>
        {texto.substring(index + q.length)}
      </>
    );
  };

  return (
    <div className={`relative w-full max-w-2xl mx-auto ${className}`}>
      {/* Input de búsqueda */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FiSearch className="w-5 h-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.length >= 2 && resultados.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 text-gray-400 text-lg bg-white rounded-2xl border-2 border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm"
          aria-label="Buscar clubes y proveedores"
          autoComplete="off"
        />

        {/* Botón limpiar */}
        {query && (
          <button
            onClick={limpiarBusqueda}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}

        {/* Indicador de carga */}
        {isLoading && (
          <div className="absolute inset-y-0 right-12 flex items-center">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Resultados */}
      {isOpen && resultados.length > 0 && (
        <div 
          ref={resultsRef}
          className="absolute mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in"
          role="listbox"
        >
          {resultados.map((item, index) => (
            <a
              key={item.id || item.slug}
              href={item.url}
              className={`flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${
                index === selectedIndex ? 'bg-gray-50' : ''
              }`}
              role="option"
              aria-selected={index === selectedIndex}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {/* Icono según tipo */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                {item.logo ? (
                  <img 
                    src={item.logo} 
                    alt={item.nombre} 
                    className="w-8 h-8 rounded-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  item.icon || <FiMapPin className="w-4 h-4 text-gray-400" />
                )}
              </div>

              {/* Información */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800 truncate">
                    {resaltarTexto(item.nombre, query)}
                  </span>
                  {item.destacado && (
                    <FiStar className="w-3 h-3 text-gold fill-gold flex-shrink-0" />
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    item.tipo === 'club' 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-blue-50 text-blue-600'
                  }`}>
                    {item.tipo === 'club' ? 'Club' : 'Proveedor'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  {item.ciudad && (
                    <span className="truncate">
                      {resaltarTexto(item.ciudad, query)}
                      {item.estado && `, ${resaltarTexto(item.estado, query)}`}
                    </span>
                  )}
                  {item.especialidad && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="truncate">
                        {resaltarTexto(item.especialidad, query)}
                      </span>
                    </>
                  )}
                  {item.categoria && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span className="truncate">
                        {resaltarTexto(item.categoria, query)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Flecha */}
              <FiSearch className="w-4 h-4 text-gray-300 flex-shrink-0" />
            </a>
          ))}

          {/* Footer de resultados */}
          <div className="px-4 py-2 bg-gray-50 text-xs text-gray-400 text-center border-t border-gray-100">
            {resultados.length} resultados encontrados
          </div>
        </div>
      )}

      {/* Mensaje de "sin resultados" */}
      {isOpen && query.length >= 2 && resultados.length === 0 && !isLoading && (
        <div className="absolute mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 p-6 text-center">
          <FiSearch className="w-8 h-8 mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500">No encontramos resultados para <strong>"{query}"</strong></p>
          <p className="text-sm text-gray-400 mt-1">Prueba con otras palabras clave</p>
        </div>
      )}
    </div>
  );
};

export default BuscadorGlobal;