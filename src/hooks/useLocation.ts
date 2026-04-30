import { useState, useCallback, useEffect } from 'react';

export type LocationData = {
  latitude: number | null;
  longitude: number | null;
  address: string;
  city: string;
  loading: boolean;
  error: string | null;
};

export function useLocation() {
  const [location, setLocation] = useState<LocationData>({
    latitude: null,
    longitude: null,
    address: '',
    city: '',
    loading: true,
    error: null,
  });

  const fetchAddress = async (lat: number, lon: number) => {
    try {
      // Use Nominatim API for reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'zh-TW,zh;q=0.9',
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('無法取得地址資訊');
      }

      const data = await response.json();
      
      if (data && data.address) {
        // Extract city to match with PoliceNumbers
        const city = String(data.address.city || data.address.county || data.address.state || '').toLowerCase();
        
        // Convert OSM format "26號, 復國一路475巷, ..., 臺灣" to "臺南市永康區...復國一路475巷26號"
        const parts = (data.display_name || '').split(',').map((p: string) => p.trim());
        const formattedAddress = parts
          .reverse()
          .filter((p: string) => !p.includes('臺灣') && !p.includes('台灣') && !p.includes('Taiwan') && !/^\d{3,6}$/.test(p)) // remove country and postal codes
          .join('');
        
        setLocation({
          latitude: lat,
          longitude: lon,
          address: formattedAddress,
          city: city,
          loading: false,
          error: null,
        });
      } else {
         setLocation({
          latitude: lat,
          longitude: lon,
          address: '無法解析地址，請手動輸入',
          city: '',
          loading: false,
          error: null,
        });
      }
    } catch (err) {
      console.error(err);
      setLocation({
        latitude: lat,
        longitude: lon,
        address: '取得地址失敗，請手動輸入',
        city: '',
        loading: false,
        error: 'Reverse geocoding failed',
      });
    }
  };

  const refreshLocation = useCallback(() => {
    setLocation(prev => ({ ...prev, loading: true, error: null }));
    
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: '您的裝置不支援地理位置功能',
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchAddress(latitude, longitude);
      },
      (error) => {
        let errorMsg = '無法取得位置，請確認已開啟定位權限';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = '您拒絕了定位權限，請至設定開啟';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = '位置資訊不可用';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = '定位逾時，請重試';
        }
        
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: errorMsg,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0, // Force getting fresh position
      }
    );
  }, []);

  useEffect(() => {
    refreshLocation();
  }, [refreshLocation]);

  return { ...location, refreshLocation };
}
