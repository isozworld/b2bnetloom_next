

export async function getEbatTurleri(categories: string[]): Promise<string[]> {
  try {
    if (categories.length === 0) {
      throw new Error('En az bir kategori seçilmelidir.');
    }

    const formattedCategories = categories.map((category) => `'${category}'`).join(', ');
    const TSql = `
      SELECT DISTINCT 
        CASE 
          WHEN KOD_3 = '0015' THEN 'STANDART'
          WHEN KOD_3 = '0017' THEN 'STANDART'
          WHEN KOD_3 = '0023' THEN 'STANDART'
          WHEN KOD_3 = '0025' THEN 'STANDART'
          WHEN KOD_3 = '0033' THEN 'STANDART'
          WHEN KOD_3 = '0055' THEN 'STANDART'
          WHEN KOD_3 = '0083' THEN 'STANDART'
          WHEN KOD_3 = '0175' THEN 'STANDART'
          WHEN KOD_3 = '0103' THEN 'STANDART'
          WHEN KOD_3 = '9011' THEN 'STANDART'
          WHEN KOD_3 = '0031' THEN 'STANDART'
          WHEN KOD_3 = '0047' THEN 'STANDART'
          WHEN KOD_3 = '0067' THEN 'STANDART'
          WHEN KOD_3 = '0065' THEN 'STANDART'
          WHEN KOD_3 = '0031' THEN 'STANDART'
          WHEN KOD_3 = '9823' THEN 'STANDART'
          WHEN KOD_3 = '0053' THEN 'STANDART'
          WHEN KOD_3 = '0179' THEN 'DAIRE'
          WHEN KOD_3 = '0889' THEN 'DAIRE'
          WHEN KOD_3 = '1181' THEN 'DAIRE'
          WHEN KOD_3 = '0285' THEN 'DAIRE'
          WHEN KOD_3 = '0532' THEN 'OVAL'
          WHEN KOD_3 = '0533' THEN 'OVAL'
          WHEN KOD_3 = '0531' THEN 'OVAL'
          WHEN KOD_3 = '0534' THEN 'OVAL'
          WHEN KOD_3 = '0964' THEN 'OVAL'
          WHEN KOD_3 = '0986' THEN 'OVAL'
          WHEN KOD_3 = '0984' THEN 'OVAL'
          WHEN KOD_3 = '0888' THEN 'OVAL'
          WHEN KOD_3 = '0203' THEN 'TOP RULO'
          WHEN KOD_3 = '0205' THEN 'TOP RULO'
          WHEN KOD_3 = '0207' THEN 'TOP RULO'
          WHEN KOD_3 = '0210' THEN 'TOP RULO'
          WHEN KOD_3 = '0211' THEN 'TOP RULO'
          WHEN KOD_3 = '0214' THEN 'TOP RULO'
          WHEN KOD_3 = '0656' THEN 'KESME'
          WHEN KOD_3 = '1159' THEN 'KESME'
          WHEN KOD_3 = '1738' THEN 'KESME'
          WHEN KOD_3 = '1740' THEN 'KESME'
          WHEN KOD_3 = '1741' THEN 'KESME'
          WHEN KOD_3 = '2342' THEN 'KESME'
          WHEN KOD_3 = '2951' THEN 'KESME'
          WHEN KOD_3 = '0768' THEN 'KESME'
          WHEN KOD_3 = '1766' THEN 'KESME'
        END AS EBATTURU
      FROM SUMOHALI2024.dbo.TBLSTSABIT AS ST 
      LEFT OUTER JOIN SUMOHALI2024.dbo.KATALOGDESEN AS KD ON KD.STOKKODU = ST.STOK_KODU 
      INNER JOIN SUMOIHURETIM.dbo.STK_DESEN AS D ON D.Kod = ST.KOD_1 
      INNER JOIN SUMOIHURETIM.dbo.STK_PALET AS PLT ON PLT.ID = D.STKPALETID AND PLT.Kod = ST.KOD_2 
      INNER JOIN SUMOIHURETIM.dbo.STK_EBAT AS E ON E.Kod = ST.KOD_3 
      INNER JOIN SUMOIHURETIM.dbo.STK_KALITE AS K ON ST.GRUP_KODU = K.Kod 
      INNER JOIN SUMOIHURETIM.dbo.STK_PALET AS P ON D.STKPALETID = P.ID 
      INNER JOIN SUMOHALI2024.dbo.TBLSTSABITEK AS STEK ON STEK.STOK_KODU = ST.STOK_KODU 
      CROSS JOIN (SELECT DISTINCT DEPO_KODU FROM SUMOIHURETIM.dbo.STK_SIPREZERVDP) AS RZD
      WHERE (1 = 1) 
        AND (ISNULL(D.Kod, '') LIKE '%%') 
        AND (K.Kod LIKE '%%') 
        AND (ISNULL(E.Kod, '') LIKE '%%') 
        AND (LEFT(ST.STOK_KODU, 2) = 'M-') 
        AND (K.Ad LIKE '%%') 
        AND (STEK.KULL5N = '1') 
        AND (RZD.DEPO_KODU = 103)
        AND D.Ad IN (${formattedCategories})
    `;

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

    if (data.data.IsSuccessful && Array.isArray(data.data.Data)) {
      return data.data.Data.map((item: { EBATTURU: string }) => item.EBATTURU);
    } else {
      throw new Error('API response format is invalid or IsSuccessful is false');
    }
  } catch (error: any) {
    console.error('Error in getEbatTurleri:', error.message || error);
    throw new Error('Ebat türleri alınamadı.');
  }
}
