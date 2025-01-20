import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = process.env.METSIS_RESTAPI_URL!;
const NETSIS_USER = process.env.NETSIS_USER!;
const NETSIS_PASSWORD = process.env.NETSIS_PASSEORD!;
const NETSIS_SIRKET = process.env.NETSIS_SIRKET!;
const NETSIS_SUBE = process.env.NETSIS_SUBE!;
const NETSIS_DBUSER = process.env.NETSIS_DBUSER!;
const NETSIS_DBPASSWORD = '';
const NETSIS_DBTYPE = 0;

let token: string | null = null; // Geçerli token
let tokenExpiration: number | null = null; // Token süresi



// Token kontrol ve yenileme
async function ensureToken() {
  if (!token || !tokenExpiration || Date.now() >= tokenExpiration) {
    console.log("Token expired, attempting to re-login...");
    try {
      await loginToNetsis();
    } catch (error) {
      console.error("Token renewal failed:", error);
      throw new Error("Token renewal failed. Please check credentials or server.");
    }
  } else {
    console.log("Token is still valid.");
  }
}

// Netsis API çağrısı
export async function callNetsisAPI(
  endpoint: string,
  method: string = 'GET',
  params?: Record<string, any>,
  body?: Record<string, any>,
  customHeaders?: Record<string, string>
): Promise<any> {
  try {
    await ensureToken();

    let url = `${BASE_URL}/${endpoint}`;

    // Query string ekle
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      url += `?${queryString}`;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...customHeaders,
    };

    const requestOptions: RequestInit = {
      method,
      headers,
    };

    if (body) {
      requestOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, requestOptions);

    if (response.status === 401) {
      console.warn("Unauthorized error. Attempting to refresh token...");
      await loginToNetsis(); // Token yenile
      return callNetsisAPI(endpoint, method, params, body, customHeaders); // Yeniden dene
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Netsis API error callNetsisAPI: ${response.status} ${response.statusText}. Details: ${errorText} url:${url}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in callNetsisAPI:", error);
    throw error;
  }
}

// Token al
async function loginToNetsis() {
  const url = `${BASE_URL}/api/v2/token`;
  const body = new URLSearchParams({
    grant_type: 'password',
    branchcode: NETSIS_SUBE,
    password: NETSIS_PASSWORD,
    username: NETSIS_USER,
    dbname: NETSIS_SIRKET,
    dbuser: NETSIS_DBUSER,
    dbpassword: NETSIS_DBPASSWORD,
    dbtype: NETSIS_DBTYPE.toString(),
  });
console.log(body);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Login failed: ${response.status} ${response.statusText}. Details: ${errorText}`);
  }

  const data = await response.json();
  token = data.access_token;
  tokenExpiration = Date.now() + data.expires_in * 1000; // expires yerine expires_in
  //console.log("Token renewed successfully:", token);
}

// POST metodu
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { endpoint, params, payload, headers } = body;

    const data = await callNetsisAPI(endpoint, 'POST', params, payload, headers);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Netsis API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET metodu
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const endpoint = searchParams.get('endpoint') || '';
    const params: Record<string, string> = {};

    // Query string parametrelerini al
    searchParams.forEach((value, key) => {
      if (key !== 'endpoint') {
        params[key] = value;
      }
    });

    const data = await callNetsisAPI(endpoint, 'GET', params);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Netsis API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
