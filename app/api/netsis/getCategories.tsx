import { callNetsisAPI } from './route';

export async function getCategories(): Promise<string[]> {
    try {
    const TSql = `select D.Ad    
FROM SUMOHALI2024.dbo.TBLSTSABIT AS ST LEFT OUTER JOIN
     SUMOHALI2024.dbo.KATALOGDESEN AS KD ON KD.STOKKODU = ST.STOK_KODU INNER JOIN
     SUMOIHURETIM.dbo.STK_DESEN AS D ON D.Kod = ST.KOD_1 INNER JOIN
     SUMOIHURETIM.dbo.STK_PALET AS PLT ON PLT.ID = D.STKPALETID AND PLT.Kod = ST.KOD_2 INNER JOIN
     SUMOIHURETIM.dbo.STK_EBAT AS E ON E.Kod = ST.KOD_3 INNER JOIN
     SUMOIHURETIM.dbo.STK_KALITE AS K ON ST.GRUP_KODU = K.Kod INNER JOIN
     SUMOIHURETIM.dbo.STK_PALET AS P ON D.STKPALETID = P.ID INNER JOIN
     SUMOHALI2024.dbo.TBLSTSABITEK AS STEK ON STEK.STOK_KODU = ST.STOK_KODU CROSS JOIN
     (SELECT DISTINCT DEPO_KODU FROM SUMOIHURETIM.dbo.STK_SIPREZERVDP) AS RZD
WHERE (1 = 1) AND (ISNULL(D.Kod, '') LIKE '%%') AND (K.Kod LIKE '%%') 
  AND (ISNULL(E.Kod, '') LIKE '%%') AND (LEFT(ST.STOK_KODU, 2) = 'M-') 
  AND (K.Ad LIKE '%%') AND (STEK.KULL5N = '1') AND (RZD.DEPO_KODU = 103)
GROUP BY D.Ad`;
const queryParams = new URLSearchParams({
    endpoint: 'api/v2/Queries',
    TSql,
  }).toString();

  const res = await fetch(`/api/netsis?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`API call failed with status ${res.status}`);
  }

  const data = await res.json();
  //console.log("getCategoris tarafı data::",data)
  if (data.data.IsSuccessful && Array.isArray(data.data.Data)) {
 
    // Data'yı ayrıştır ve Ad alanlarını al
    return data.data.Data.map((item: { Ad: string }) => item.Ad);
  } else {
    throw new Error('API response format is invalid or IsSuccessful is false');
  }
} catch (error: any) {
  console.error('Error in getCategories:', error.message || error);
  throw new Error('Kategori verileri alınamadı.');
}
}