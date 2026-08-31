const fs = require('fs');
const file = 'c:\\Users\\HP\\Desktop\\bns\\src\\context\\ProductContext.jsx';
let content = fs.readFileSync(file, 'utf8');

const lines = content.split('\n');

// Find the useEffect block for loading products (starts with "// Charger les produits")
let startIdx = -1;
let endIdx = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Charger les produits')) {
    startIdx = i - 1; // Include the blank line before
    break;
  }
}

// Find the closing "}, [])" of this useEffect
if (startIdx !== -1) {
  for (let i = startIdx; i < lines.length; i++) {
    if (lines[i].trim() === '}, [])') {
      endIdx = i;
      break;
    }
  }
}

if (startIdx !== -1 && endIdx !== -1) {
  const newBlock = [
    '  // Charger les produits depuis l\'API backend + auto-refresh temps reel',
    '  useEffect(() => {',
    '    async function loadProducts() {',
    '      try {',
    '        const res = await productsApi.getAll({ limit: 200 })',
    '        setProducts(res.data || [])',
    '      } catch (err) {',
    '        logError(\'Erreur chargement produits :\', err)',
    '        try {',
    '          const stored = localStorage.getItem(\'bns_products\')',
    '          if (stored) setProducts(JSON.parse(stored))',
    '        } catch { setProducts([]) }',
    '      } finally {',
    '        setReady(true)',
    '      }',
    '    }',
    '',
    '    loadProducts()',
    '',
    '    // Polling temps reel : refresh produits toutes les 30s',
    '    const interval = setInterval(() => {',
    '      if (!document.hidden) loadProducts()',
    '    }, 30000)',
    '',
    '    // Refresh quand l\'onglet redevient visible',
    '    const handleVisibility = () => {',
    '      if (!document.hidden) loadProducts()',
    '    }',
    '    document.addEventListener(\'visibilitychange\', handleVisibility)',
    '',
    '    return () => {',
    '      clearInterval(interval)',
    '      document.removeEventListener(\'visibilitychange\', handleVisibility)',
    '    }',
    '  }, [])',
  ];

  lines.splice(startIdx, endIdx - startIdx + 1, ...newBlock);
  fs.writeFileSync(file, lines.join('\n'), 'utf8');
  console.log('OK: ProductContext auto-refresh added (lines ' + (startIdx+1) + '-' + (endIdx+1) + ')');
} else {
  console.log('Could not find target block. startIdx=' + startIdx + ' endIdx=' + endIdx);
}
