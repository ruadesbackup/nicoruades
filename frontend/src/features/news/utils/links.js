// Utilidad para modificar los enlaces en el HTML para que abran en nueva pestaña
export function addTargetBlankToLinks(html) {
  if (!html) return html;
  // Usar expresión regular para agregar target y rel a los enlaces
  return html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (match, group1) => {
    // Si ya tiene target o rel, no duplicar
    let result = match;
    if (!/target=/.test(group1)) {
      result = result.replace('<a', '<a target="_blank"');
    }
    if (!/rel=/.test(group1)) {
      result = result.replace('<a', '<a rel="noopener noreferrer"');
    }
    return result;
  });
}
