interface BusinessStatusResponse {
  data: Array<{
    b_stt: string;
    b_no: string;
    tax_type: string;
    end_dt: string;
    utcc_yn: string;
    tax_type_cd: string;
    trt_cst_yn: string;
    rb_mby_yn: string;
    [key: string]: any;
  }>;
}

export const fetchBusinessStatus = async (b_no: string): Promise<BusinessStatusResponse> => {
  const serviceKey = encodeURIComponent("f+/t3oxIEJ/oHtebgyXHe0mYAvcAXsBZ1AL/NkiRuJAYUqlT4yXu7Nz3tBZ69eQJj4jvLfoKbe+1AZGcNaVhew==");
  const url = `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${serviceKey}`;

  const payload = {
    b_no: [b_no],
  };

  console.log('🔍 Checking business number:', b_no);
  console.log('📡 API URL:', url);
  console.log('📦 Payload:', payload);

  try {
    console.log('⏳ Sending request...');
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log('📥 Response status:', res.status);
    const headers: Record<string, string> = {};
    res.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log('📥 Response headers:', headers);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Error response:', errorText);
      throw new Error(`HTTP error: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    console.log('✅ API Response data:', data);
    return data;
  } catch (error) {
    console.error("❌ API error:", error);
    throw error;
  }
}; 