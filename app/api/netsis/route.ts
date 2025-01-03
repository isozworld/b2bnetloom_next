import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.METSIS_RESTAPI_URL!;
const NETSIS_USER = process.env.NETSIS_USER!;
const NETSIS_PASSWORD = process.env.NETSIS_PASSEORD!;
const NETSIS_SIRKET = process.env.NETSIS_SIRKET!;
const NETSIS_SUBE = process.env.NETSIS_SUBE!;
const NETSIS_DBUSER = 'TEMELSET';
const NETSIS_DBPASSWORD = '';
const NETSIS_DBTYPE = 0;

let token: string | null = null; // Geçerli token
let tokenExpiration: number | null = null; // Token süresi

// Token al
async function loginToNetsis() {
    const url = `${BASE_URL}/api/v2/token`;
    console.log("url",url);
    const body = new URLSearchParams({
        grant_type: 'password',
        branchcode: NETSIS_SUBE, // Convert to string
        password: NETSIS_PASSWORD,
        username: NETSIS_USER,
        dbname: NETSIS_SIRKET,
        dbuser: NETSIS_DBUSER,
        dbpassword: NETSIS_DBPASSWORD,
        dbtype: NETSIS_DBTYPE.toString(), // Convert to string
      });
  
    console.log(body.toString()); // Veriyi URL-encoded formatında logla
  
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });
 
    if (!response) {
      throw new Error(`Login failed: ${response}`);
    }
  
    const data = await response.json();
    token = data.access_token;
    console.log("token:::::::::::", token);
    const tokenExpiration = Date.now() + data.expires_in * 1000; // expires_in saniye cinsindedir
  }
  

// Token kontrol ve yenileme
async function ensureToken() {
  if (!token || !tokenExpiration || Date.now() >= tokenExpiration) {
    console.log('Token expired or missing. Logging in...');
    await loginToNetsis();
  }
}

// Netsis API çağrısı
async function callNetsisAPI(endpoint: string, method: string = 'GET', body?: Record<string, any>) {
    await ensureToken(); // Token kontrol
  
    const url = `${BASE_URL}/${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  
    const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({
          Offset: 0,
          Limit: 1, // Sadece gerekli alanları gönderin
        }),
      });
      

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Netsis API Error:", errorText); // Hata mesajını detaylı logla
        throw new Error(`Netsis API error: ${response.statusText}. ${errorText}`);
      }
      
  
    try {
      const data = await response.json();
      console.log("Response JSON:", data); // Yanıtı logla
      return data;
    } catch (error) {
      throw new Error(`Failed to parse JSON response: ${error}`);
    }
  }
  

// POST metodu
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { endpoint, payload } = body;
    console.log("-----------------",endpoint);
    console.log("-----------------",payload);
    // Netsis API'ye çağrı yap
    const data = await callNetsisAPI(endpoint, 'POST', payload);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Netsis API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET metodu (örnek olarak ekledim)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const endpoint = searchParams.get('endpoint') || '';

    // Netsis API'ye çağrı yap
    const data = await callNetsisAPI(endpoint, 'GET');

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Netsis API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
