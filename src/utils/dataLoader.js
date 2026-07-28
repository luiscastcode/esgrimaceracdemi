// src/utils/dataLoader.js
import clubesData from '../data/clubes.json';
import estadosData from '../data/estados.json';
import guiasData from '../data/guias.json';
import reglamentoData from '../data/reglamento.json';
import proveedoresData from '../data/proveedores.json';

// --- FUNCIÓN DE SEGURIDAD PARA EXTRAER SLUG COMO STRING ---
function getSlugSafe(obj, field = 'slug') {
  if (!obj) return '';
  const value = obj[field];
  
  // Si es string, devolverlo
  if (typeof value === 'string') return value;
  
  // Si es objeto, intentar extraer el string
  if (typeof value === 'object' && value !== null) {
    return String(value.slug || value.nombre || value.id || '');
  }
  
  // Cualquier otro caso, convertir a string
  return String(value || '');
}

// ============================================
// CLUBES
// ============================================

/**
 * Obtiene todos los clubes
 * @returns {Promise<Array>} Lista de todos los clubes
 */
export async function getTodosClubes() {
  return clubesData.clubes || [];
}

/**
 * Obtiene clubes por estado
 * @param {string} estadoSlug - Slug del estado
 * @returns {Promise<Array>} Lista de clubes en ese estado
 */
export async function getClubesByEstado(estadoSlug) {
  const slug = String(estadoSlug || '');
  return (clubesData.clubes || []).filter(c => {
    const cSlug = getSlugSafe(c, 'estado_slug') || getSlugSafe(c, 'estado');
    return cSlug === slug;
  });
}

/**
 * Obtiene clubes por ciudad
 * @param {string} estadoSlug - Slug del estado
 * @param {string} ciudadSlug - Slug de la ciudad
 * @returns {Promise<Array>} Lista de clubes en esa ciudad
 */
export async function getClubesByCiudad(estadoSlug, ciudadSlug) {
  const estado = String(estadoSlug || '');
  const ciudad = String(ciudadSlug || '');
  return (clubesData.clubes || []).filter(c => {
    const cEstado = getSlugSafe(c, 'estado_slug') || getSlugSafe(c, 'estado');
    const cCiudad = getSlugSafe(c, 'ciudad_slug') || getSlugSafe(c, 'ciudad');
    return cEstado === estado && cCiudad === ciudad;
  });
}

/**
 * Obtiene un club por su slug
 * @param {string} slug - Slug del club
 * @returns {Promise<Object|null>} El club encontrado o null
 */
export async function getClubBySlug(slug) {
  const slugStr = String(slug || '');
  return (clubesData.clubes || []).find(c => {
    const cSlug = getSlugSafe(c, 'slug') || getSlugSafe(c, 'id');
    return cSlug === slugStr;
  });
}

/**
 * Obtiene los clubes destacados
 * @param {number} limit - Cantidad máxima a retornar
 * @returns {Promise<Array>} Lista de clubes destacados
 */
export async function getClubesDestacados(limit = 6) {
  return (clubesData.clubes || [])
    .filter(c => c.destacado)
    .slice(0, limit);
}

/**
 * Obtiene el total de clubes
 * @returns {Promise<number>} Cantidad total de clubes
 */
export async function getTotalClubes() {
  return (clubesData.clubes || []).length;
}

/**
 * Obtiene clubes relacionados (mismo estado, diferente club)
 * @param {string} estado - Nombre del estado
 * @param {string} id - ID del club a excluir
 * @param {number} limit - Cantidad máxima a retornar
 * @returns {Promise<Array>} Lista de clubes relacionados
 */
export async function getClubesRelacionados(estado, id, limit = 3) {
  const estadoStr = String(estado || '');
  const idStr = String(id || '');
  return (clubesData.clubes || [])
    .filter(c => {
      const cEstado = getSlugSafe(c, 'estado') || getSlugSafe(c, 'estado_slug');
      return cEstado === estadoStr && String(c.id || '') !== idStr;
    })
    .slice(0, limit);
}

/**
 * Busca clubes por término de búsqueda
 * @param {string} query - Término de búsqueda
 * @returns {Promise<Array>} Lista de clubes que coinciden
 */
export async function buscarClubes(query) {
  const q = String(query || '').toLowerCase();
  if (!q) return [];
  
  return (clubesData.clubes || []).filter(c =>
    String(c.nombre || '').toLowerCase().includes(q) ||
    String(c.ciudad || '').toLowerCase().includes(q) ||
    String(c.estado || '').toLowerCase().includes(q) ||
    String(c.especialidad || '').toLowerCase().includes(q) ||
    String(c.descripcion || '').toLowerCase().includes(q)
  );
}

// ============================================
// ESTADOS
// ============================================

/**
 * Obtiene todos los estados
 * @returns {Promise<Array>} Lista de todos los estados
 */
export async function getEstados() {
  return estadosData.estados || [];
}

/**
 * Obtiene información de un estado por su slug
 * @param {string} slug - Slug del estado
 * @returns {Promise<Object|null>} El estado encontrado o null
 */
export async function getEstadoInfo(slug) {
  const slugStr = String(slug || '');
  const estados = await getEstados();
  return estados.find(e => String(e.slug) === slugStr);
}

/**
 * Obtiene las ciudades de un estado
 * @param {string} estadoSlug - Slug del estado
 * @returns {Promise<Array>} Lista de ciudades del estado
 */
export async function getCiudadesByEstado(estadoSlug) {
  const slugStr = String(estadoSlug || '');
  const estado = await getEstadoInfo(slugStr);
  return estado?.ciudades || [];
}

// ============================================
// GUÍAS
// ============================================

/**
 * Obtiene todas las categorías de guías
 * @returns {Promise<Array>} Lista de categorías de guías
 */
export async function getGuias() {
  return guiasData.categorias || [];
}

/**
 * Obtiene una guía específica por su slug
 * @param {string} slug - Slug de la guía
 * @returns {Promise<Object|null>} La guía encontrada o null
 */
export async function getGuiaBySlug(slug) {
  const slugStr = String(slug || '');
  const categorias = await getGuias();
  return categorias.find(g => String(g.slug) === slugStr) || null;
}

// ============================================
// REGLAMENTO
// ============================================

/**
 * Obtiene todos los datos del reglamento
 * @returns {Promise<Object>} Datos del reglamento
 */
export async function getReglamento() {
  return reglamentoData || {};
}

/**
 * Obtiene las armas del reglamento
 * @returns {Promise<Array>} Lista de armas
 */
export async function getArmas() {
  return reglamentoData?.armas || [];
}

/**
 * Obtiene información de un arma específica
 * @param {string} slug - Slug del arma
 * @returns {Promise<Object|null>} El arma encontrada o null
 */
export async function getArmaBySlug(slug) {
  const slugStr = String(slug || '');
  const armas = await getArmas();
  return armas.find(a => String(a.slug) === slugStr) || null;
}

/**
 * Obtiene las competencias internacionales
 * @returns {Promise<Object>} Datos de competencias
 */
export async function getCompetencias() {
  return reglamentoData?.competencias || {};
}

// ============================================
// PROVEEDORES
// ============================================

/**
 * Obtiene todos los proveedores
 * @returns {Promise<Array>} Lista de todos los proveedores
 */
export async function getProveedores() {
  return proveedoresData.proveedores || [];
}

/**
 * Obtiene un proveedor por su slug
 * @param {string} slug - Slug del proveedor
 * @returns {Promise<Object|null>} El proveedor encontrado o null
 */
export async function getProveedorBySlug(slug) {
  const slugStr = String(slug || '');
  return (proveedoresData.proveedores || []).find(p => 
    String(p.slug || p.id || '') === slugStr
  ) || null;
}

/**
 * Obtiene proveedores por categoría
 * @param {string} categoria - Categoría del proveedor
 * @returns {Promise<Array>} Lista de proveedores en esa categoría
 */
export async function getProveedoresByCategoria(categoria) {
  const cat = String(categoria || '').toLowerCase();
  return (proveedoresData.proveedores || []).filter(p =>
    String(p.categoria || '').toLowerCase() === cat
  );
}

/**
 * Obtiene proveedores por tipo
 * @param {string} tipo - Tipo de proveedor (Tienda física, Taller, etc.)
 * @returns {Promise<Array>} Lista de proveedores de ese tipo
 */
export async function getProveedoresByTipo(tipo) {
  const tip = String(tipo || '').toLowerCase();
  return (proveedoresData.proveedores || []).filter(p =>
    String(p.tipo || '').toLowerCase() === tip
  );
}

/**
 * Obtiene los proveedores destacados
 * @param {number} limit - Cantidad máxima a retornar
 * @returns {Promise<Array>} Lista de proveedores destacados
 */
export async function getProveedoresDestacados(limit = 6) {
  return (proveedoresData.proveedores || [])
    .filter(p => p.destacado)
    .slice(0, limit);
}

/**
 * Busca proveedores por término de búsqueda
 * @param {string} query - Término de búsqueda
 * @returns {Promise<Array>} Lista de proveedores que coinciden
 */
export async function buscarProveedores(query) {
  const q = String(query || '').toLowerCase();
  if (!q) return [];
  
  return (proveedoresData.proveedores || []).filter(p =>
    String(p.nombre || '').toLowerCase().includes(q) ||
    String(p.categoria || '').toLowerCase().includes(q) ||
    String(p.tipo || '').toLowerCase().includes(q) ||
    String(p.ciudad || '').toLowerCase().includes(q) ||
    String(p.estado || '').toLowerCase().includes(q) ||
    String(p.descripcion || '').toLowerCase().includes(q)
  );
}

// ============================================
// BÚSQUEDA GLOBAL
// ============================================

/**
 * Busca globalmente en clubes y proveedores
 * @param {string} query - Término de búsqueda
 * @returns {Promise<Object>} Objeto con resultados de clubes y proveedores
 */
export async function buscarGlobal(query) {
  const q = String(query || '').toLowerCase();
  if (!q) {
    return { clubes: [], proveedores: [] };
  }
  
  const clubes = await buscarClubes(q);
  const proveedores = await buscarProveedores(q);
  
  return { clubes, proveedores };
}

// ============================================
// FUNCIONES DE DEBUG
// ============================================

/**
 * Función de debug para verificar datos cargados
 * @returns {Promise<Object>} Datos de debug
 */
export async function debugData() {
  const estados = await getEstados();
  const clubes = await getTodosClubes();
  const proveedores = await getProveedores();
  
  console.log('📊 DEBUG - Datos cargados:');
  console.log(`   Estados: ${estados.length}`);
  console.log(`   Clubes: ${clubes.length}`);
  console.log(`   Proveedores: ${proveedores.length}`);
  
  return { estados, clubes, proveedores };
}

// ============================================
// EXPORTACIÓN POR DEFECTO
// ============================================

export default {
  // Clubes
  getTodosClubes,
  getClubesByEstado,
  getClubesByCiudad,
  getClubBySlug,
  getClubesDestacados,
  getTotalClubes,
  getClubesRelacionados,
  buscarClubes,
  
  // Estados
  getEstados,
  getEstadoInfo,
  getCiudadesByEstado,
  
  // Guías
  getGuias,
  getGuiaBySlug,
  
  // Reglamento
  getReglamento,
  getArmas,
  getArmaBySlug,
  getCompetencias,
  
  // Proveedores
  getProveedores,
  getProveedorBySlug,
  getProveedoresByCategoria,
  getProveedoresByTipo,
  getProveedoresDestacados,
  buscarProveedores,
  
  // Búsqueda global
  buscarGlobal,
  
  // Debug
  debugData
};