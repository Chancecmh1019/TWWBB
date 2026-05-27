import React, { useState, useEffect } from 'react';
import { MapPin, RefreshCw, AlertTriangle, Car, ShieldAlert, Volume2, HelpCircle, ChevronRight, X, Send } from 'lucide-react';
import { useLocation } from './hooks/useLocation';
import { PoliceNumbers, ReportCategories, ReportItem } from './data/constants';
import { cn } from './lib/utils';
import { AnimatePresence, motion } from 'motion/react';

// Icon Map
const iconMap: Record<string, React.ElementType> = {
  car: Car,
  alertTriangle: AlertTriangle,
  volume2: Volume2,
  shieldAlert: ShieldAlert,
  helpCircle: HelpCircle
};

export default function App() {
  const { latitude, longitude, address: autoAddress, city, loading, error, refreshLocation } = useLocation();
  
  const [selectedCategory, setSelectedCategory] = useState<typeof ReportCategories[0] | null>(null);
  const [selectedItem, setSelectedItem] = useState<ReportItem | null>(null);
  
  const [manualAddress, setManualAddress] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [description, setDescription] = useState('');
  const [includeWarning, setIncludeWarning] = useState(true);
  const [vehicleCount, setVehicleCount] = useState<'single' | 'multiple'>('single');

  // Sync auto address with manual when found
  useEffect(() => {
    if (autoAddress) {
      setManualAddress(autoAddress);
    }
  }, [autoAddress]);

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    // add hyphen automatically after English letters if transition to numbers and no hyphen exists
    if (!val.includes('-')) {
       const match = val.match(/^([A-Z]{2,3})([0-9]{1,4})$/);
       if (match) {
          val = `${match[1]}-${match[2]}`;
       }
    }
    setPlateNumber(val);
  };

  // Derive phone number
  const phoneNumber = city ? PoliceNumbers[city] || "" : "";

  const handleSend = () => {
    const finalAddress = manualAddress.trim() || '未提供正確地址';
    
    // Construct SMS Text
    let smsText = `【發生地點】${finalAddress}\n`;
    smsText += `【座標定位】${latitude?.toFixed(6) || '未取得'}, ${longitude?.toFixed(6) || '未取得'}\n`;
    smsText += `【報案類型】${selectedCategory?.title} - ${selectedItem?.label}\n`;
    
    if (vehicleCount === 'multiple') {
      smsText += `【違規數量】多輛\n`;
    }
    
    if (plateNumber.trim()) {
      smsText += `【車牌號碼】${plateNumber.trim().toUpperCase()}\n`;
    }
    if (description.trim()) {
      smsText += `【補充說明】${description.trim()}\n`;
    }
    
    smsText += `\n請即刻派員前往處理。`;
    
    if (includeWarning) {
      smsText += `\n\n【備註】報案人已於現場錄影蒐證。若未見警員切實到場查處，或僅以電話通知違規人移車而不予開單，將依法把蒐證影片與報案紀錄上傳至網路平台(如爆料公社)及1999市民專線交由公眾檢視，請依法嚴格執行，切勿瀆職。`;
    }

    if (!phoneNumber) {
      alert(`無法辨識城市，請手動確認要發送的警察局簡訊號碼。\n內容：\n${smsText}`);
      const separator = /iPad|iPhone|iPod/.test(navigator.userAgent) ? '&' : '?';
      window.open(`sms:${separator}body=${encodeURIComponent(smsText)}`);
      return;
    }

    const separator = /iPad|iPhone|iPod/.test(navigator.userAgent) ? '&' : '?';
    window.open(`sms:${phoneNumber}${separator}body=${encodeURIComponent(smsText)}`);
  };

  const closeForm = () => {
    setSelectedItem(null);
    setPlateNumber('');
    setDescription('');
    setIncludeWarning(true);
    setVehicleCount('single');
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-[#f2f2f7] relative pb-8">
      {/* Header */}
      <header className="ios-blur pt-12 pb-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] sticky top-0 z-20 border-b border-gray-200/50 flex justify-center items-center">
        <h1 className="text-[17px] font-semibold text-gray-900 tracking-wide">臺灣警察簡訊報案小幫手</h1>
      </header>

      <main className="px-5 py-5 space-y-6">
        
        {/* Location Banner */}
        <section className="bg-gray-100 rounded-3xl overflow-hidden shadow-sm relative border border-gray-200">
          <div className="absolute inset-0 map-grid opacity-50 pointer-events-none"></div>
          
          <div className="relative z-10 p-5 flex flex-col items-center">
             <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg border-4 border-white animate-pulse">
                <div className="w-3 h-3 bg-white rounded-full"></div>
             </div>
             <div className="mt-3 px-4 py-1.5 bg-black text-white text-[10px] font-semibold rounded-full tracking-wider uppercase shadow-md">
                {loading ? '定位中...' : '當前標註位置'}
             </div>
          </div>
          
          <div className="relative z-10 px-5 pb-5 space-y-3">
            <div className="ios-blur p-4 rounded-2xl border border-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">系統狀態</span>
                <button 
                  onClick={refreshLocation}
                  className="flex items-center text-[10px] font-bold text-gray-500 hover:text-black uppercase tracking-widest bg-white px-2.5 py-1.5 rounded-lg shadow-sm border border-gray-100 transition-colors active:bg-gray-50"
                >
                  <RefreshCw className={cn("w-3 h-3 mr-1.5", loading && "animate-spin")} />
                  {loading ? '等待...' : '強制重整'}
                </button>
              </div>
              
              {error ? (
                <div className="text-xs text-red-500 font-mono font-medium">{error}</div>
              ) : (
                <div className="flex items-center space-x-2 text-green-600 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {loading ? 'GPS 搜尋中' : '高精度 GPS 已鎖定'}
                  </span>
                </div>
              )}
              
              <div className="text-[10px] text-gray-500 space-y-1 font-mono tracking-wider">
                  <div>LAT: {latitude ? latitude.toFixed(6) : '---'}° N</div>
                  <div>LNG: {longitude ? longitude.toFixed(6) : '---'}° E</div>
              </div>
            </div>

            <div className="ios-blur p-4 rounded-2xl border border-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">檢舉地點資訊</span>
                   {city && PoliceNumbers[city] && (
                    <span className="px-2 py-1 bg-white shadow-sm font-bold text-[9px] rounded-md text-gray-500 tracking-widest border border-gray-100">
                      發送至 {city}
                    </span>
                   )}
                </div>
                
                <input 
                  type="text" 
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  placeholder={loading ? '自動辨識中...' : '請輸入或修改詳細地址'}
                  className="w-full bg-white/70 border border-gray-200/50 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-black/5"
                />
            </div>
          </div>
        </section>

        {/* Categories / Items */}
        <section>
          {selectedCategory ? (
            <div className="space-y-4">
              <button 
                onClick={() => setSelectedCategory(null)}
                className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center hover:text-black transition-colors"
              >
                ← 返回分類
              </button>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight px-1 mb-2">{selectedCategory.title}</h2>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
                {selectedCategory.items.map((item, index) => (
                  <button 
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={cn(
                      "w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 active:bg-gray-100 text-left transition-colors",
                      index !== selectedCategory.items.length - 1 && "border-b border-gray-50"
                    )}
                  >
                    <div>
                      <span className="font-semibold text-sm">{item.label}</span>
                      {item.requiresPlate && (
                        <span className="ml-2 text-[10px] bg-gray-100 font-bold uppercase text-gray-500 px-1.5 py-0.5 rounded tracking-widest">需車號</span>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block px-1">請選擇報案類型</label>
              <div className="grid grid-cols-2 gap-3">
                {ReportCategories.map((category) => {
                  const Icon = iconMap[category.iconName] || HelpCircle;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category)}
                      className="flex flex-col items-center justify-center p-5 border border-gray-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-2xl hover:border-gray-300 active:scale-[0.98] transition-all gap-3"
                    >
                      <Icon className="w-6 h-6 text-black" strokeWidth={1.5} />
                      <span className="font-bold text-xs text-gray-900 tracking-wide">{category.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Form Bottom Sheet Modal */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={closeForm}
              className="fixed inset-0 bg-black z-40 max-w-md mx-auto"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 w-full max-w-md bg-white rounded-t-3xl z-50 overflow-hidden shadow-2xl border-t border-gray-200 flex flex-col max-h-[90vh]"
            >
              <div className="p-6 overflow-y-auto scroll-hide space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h3 className="text-xl font-bold tracking-tight text-gray-900">{selectedItem.label}</h3>
                  <button onClick={closeForm} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full active:bg-gray-200 transition-colors">
                    <X className="w-4 h-4 text-gray-500 font-bold" strokeWidth={2.5} />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                      檢舉地點資訊 (可手動修改) <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={manualAddress}
                      onChange={(e) => setManualAddress(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  {(selectedCategory?.id === 'parking' || selectedCategory?.id === 'occupy' || selectedCategory?.id === 'noise' || selectedItem?.label.includes('車')) && (
                    <div className="space-y-4">
                      {/* Vehicle Count Toggle */}
                      <div className="flex bg-gray-100/80 p-1 rounded-xl">
                        <button 
                          onClick={() => setVehicleCount('single')}
                          className={cn("flex-1 py-2 text-xs font-bold rounded-lg transition-all", vehicleCount === 'single' ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-700")}
                        >
                          單輛車
                        </button>
                        <button 
                          onClick={() => setVehicleCount('multiple')}
                          className={cn("flex-1 py-2 text-xs font-bold rounded-lg transition-all", vehicleCount === 'multiple' ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-700")}
                        >
                          多輛車
                        </button>
                      </div>

                      <div>
                        <div className="flex items-end justify-between mb-2">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                            車牌號碼 (選填)
                          </label>
                          <span className="text-[9px] text-gray-400 font-medium">不填將迫使警員親自到場</span>
                        </div>
                        
                        {vehicleCount === 'single' ? (
                          <input 
                            type="text" 
                            value={plateNumber}
                            onChange={handlePlateChange}
                            placeholder="例如：ABC-1234"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black uppercase tracking-wider block"
                          />
                        ) : (
                          <textarea 
                            value={plateNumber}
                            onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                            placeholder="例如：ABC-1234, DEF-5678"
                            rows={2}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black uppercase tracking-wider block resize-none"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                      補充說明 (選填)
                    </label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="簡述情況"
                      rows={2}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black resize-none"
                    />
                  </div>
                  
                  <div className="flex items-start bg-red-50/50 p-3 rounded-xl border border-red-100">
                     <div className="flex items-center h-5">
                       <input 
                         type="checkbox" 
                         id="includeWarning" 
                         checked={includeWarning} 
                         onChange={(e) => setIncludeWarning(e.target.checked)}
                         className="w-4 h-4 text-red-600 bg-white border-red-300 rounded focus:ring-red-500 focus:ring-2"
                       />
                     </div>
                     <label htmlFor="includeWarning" className="ml-3 text-xs font-medium text-red-800">
                       附加聲明：要求員警確實出勤，並警告若不處理將上傳影片至網路公審以防吃案。
                     </label>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col space-y-3 shrink-0">
                <button 
                  onClick={handleSend}
                  disabled={!manualAddress.trim()}
                  className="w-full bg-black text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all text-sm uppercase tracking-widest active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-30 disabled:shadow-none disabled:active:scale-100"
                >
                  <Send className="w-4 h-4" />
                  送出簡訊報案 (SMS)
                </button>
                
                {!phoneNumber && city && (
                  <p className="text-[10px] text-red-500 text-center font-bold tracking-widest">
                    未找到「{city}」對應的報案號碼。
                  </p>
                )}
                 <div className="flex justify-center space-x-4">
                    <span className="text-[10px] text-gray-400 tracking-widest">系統版本 v2.4.0</span>
                    <span className="text-[10px] text-gray-400 tracking-widest">隱私加密傳輸</span>
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}    // add hyphen automatically after English letters if transition to numbers and no hyphen exists
    if (!val.includes('-')) {
       const match = val.match(/^([A-Z]{2,3})([0-9]{1,4})$/);
       if (match) {
          val = `${match[1]}-${match[2]}`;
       }
    }
    setPlateNumber(val);
  };

  // Derive phone number
  const phoneNumber = city ? PoliceNumbers[city] || "" : "";

  const handleSend = () => {
    const finalAddress = manualAddress.trim() || '未提供正確地址';
    
    // Construct SMS Text
    let smsText = `【報案類型】${selectedCategory?.title} - ${selectedItem?.label}\n`;
    smsText += `【發生地點】${finalAddress}\n`;
    if (plateNumber.trim()) {
      smsText += `【車牌號碼】${plateNumber.trim().toUpperCase()}\n`;
    }
    if (description.trim()) {
      smsText += `【補充說明】${description.trim()}\n`;
    }
    smsText += `\n請警察機關協助派員前往處理，感謝您。\n`;
    
    if (includeWarning) {
      smsText += `\n【備註】報案人已於現場錄影蒐證。若未見警員切實到場查處，或僅以電話通知違規人移車而不予開單，將依法把蒐證影片與報案紀錄上傳至網路平台(如爆料公社)及1999市民專線交由公眾檢視，請依法嚴格執行，切勿瀆職。\n\n`;
    }
    
    smsText += `(座標定位：${latitude?.toFixed(6) || '未取得'}, ${longitude?.toFixed(6) || '未取得'})`;

    if (!phoneNumber) {
      alert(`無法辨識城市，請手動確認要發送的警察局簡訊號碼。\n內容：\n${smsText}`);
      const separator = /iPad|iPhone|iPod/.test(navigator.userAgent) ? '&' : '?';
      window.open(`sms:${separator}body=${encodeURIComponent(smsText)}`);
      return;
    }

    const separator = /iPad|iPhone|iPod/.test(navigator.userAgent) ? '&' : '?';
    window.open(`sms:${phoneNumber}${separator}body=${encodeURIComponent(smsText)}`);
  };

  const closeForm = () => {
    setSelectedItem(null);
    setPlateNumber('');
    setDescription('');
    setIncludeWarning(true);
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-[#f2f2f7] relative pb-8">
      {/* Header */}
      <header className="ios-blur pt-12 pb-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] sticky top-0 z-20 border-b border-gray-200/50 flex justify-center items-center">
        <h1 className="text-[17px] font-semibold text-gray-900 tracking-wide">臺灣警察簡訊報案小幫手</h1>
      </header>

      <main className="px-5 py-5 space-y-6">
        
        {/* Location Banner */}
        <section className="bg-gray-100 rounded-3xl overflow-hidden shadow-sm relative border border-gray-200">
          <div className="absolute inset-0 map-grid opacity-50 pointer-events-none"></div>
          
          <div className="relative z-10 p-5 flex flex-col items-center">
             <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-lg border-4 border-white animate-pulse">
                <div className="w-3 h-3 bg-white rounded-full"></div>
             </div>
             <div className="mt-3 px-4 py-1.5 bg-black text-white text-[10px] font-semibold rounded-full tracking-wider uppercase shadow-md">
                {loading ? '定位中...' : '當前標註位置'}
             </div>
          </div>
          
          <div className="relative z-10 px-5 pb-5 space-y-3">
            <div className="ios-blur p-4 rounded-2xl border border-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">系統狀態</span>
                <button 
                  onClick={refreshLocation}
                  className="flex items-center text-[10px] font-bold text-gray-500 hover:text-black uppercase tracking-widest bg-white px-2.5 py-1.5 rounded-lg shadow-sm border border-gray-100 transition-colors active:bg-gray-50"
                >
                  <RefreshCw className={cn("w-3 h-3 mr-1.5", loading && "animate-spin")} />
                  {loading ? '等待...' : '強制重整'}
                </button>
              </div>
              
              {error ? (
                <div className="text-xs text-red-500 font-mono font-medium">{error}</div>
              ) : (
                <div className="flex items-center space-x-2 text-green-600 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {loading ? 'GPS 搜尋中' : '高精度 GPS 已鎖定'}
                  </span>
                </div>
              )}
              
              <div className="text-[10px] text-gray-500 space-y-1 font-mono tracking-wider">
                  <div>LAT: {latitude ? latitude.toFixed(6) : '---'}° N</div>
                  <div>LNG: {longitude ? longitude.toFixed(6) : '---'}° E</div>
              </div>
            </div>

            <div className="ios-blur p-4 rounded-2xl border border-white/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">檢舉地點資訊</span>
                   {city && PoliceNumbers[city] && (
                    <span className="px-2 py-1 bg-white shadow-sm font-bold text-[9px] rounded-md text-gray-500 tracking-widest border border-gray-100">
                      發送至 {city}
                    </span>
                   )}
                </div>
                
                <input 
                  type="text" 
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  placeholder={loading ? '自動辨識中...' : '請輸入或修改詳細地址'}
                  className="w-full bg-white/70 border border-gray-200/50 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-black/5"
                />
            </div>
          </div>
        </section>

        {/* Categories / Items */}
        <section>
          {selectedCategory ? (
            <div className="space-y-4">
              <button 
                onClick={() => setSelectedCategory(null)}
                className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center hover:text-black transition-colors"
              >
                ← 返回分類
              </button>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight px-1 mb-2">{selectedCategory.title}</h2>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
                {selectedCategory.items.map((item, index) => (
                  <button 
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={cn(
                      "w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 active:bg-gray-100 text-left transition-colors",
                      index !== selectedCategory.items.length - 1 && "border-b border-gray-50"
                    )}
                  >
                    <div>
                      <span className="font-semibold text-sm">{item.label}</span>
                      {item.requiresPlate && (
                        <span className="ml-2 text-[10px] bg-gray-100 font-bold uppercase text-gray-500 px-1.5 py-0.5 rounded tracking-widest">需車號</span>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block px-1">請選擇報案類型</label>
              <div className="grid grid-cols-2 gap-3">
                {ReportCategories.map((category) => {
                  const Icon = iconMap[category.iconName] || HelpCircle;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category)}
                      className="flex flex-col items-center justify-center p-5 border border-gray-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-2xl hover:border-gray-300 active:scale-[0.98] transition-all gap-3"
                    >
                      <Icon className="w-6 h-6 text-black" strokeWidth={1.5} />
                      <span className="font-bold text-xs text-gray-900 tracking-wide">{category.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Form Bottom Sheet Modal */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={closeForm}
              className="fixed inset-0 bg-black z-40 max-w-md mx-auto"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 w-full max-w-md bg-white rounded-t-3xl z-50 overflow-hidden shadow-2xl border-t border-gray-200 flex flex-col max-h-[90vh]"
            >
              <div className="p-6 overflow-y-auto scroll-hide space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h3 className="text-xl font-bold tracking-tight text-gray-900">{selectedItem.label}</h3>
                  <button onClick={closeForm} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full active:bg-gray-200 transition-colors">
                    <X className="w-4 h-4 text-gray-500 font-bold" strokeWidth={2.5} />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                      檢舉地點資訊 (可手動修改) <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={manualAddress}
                      onChange={(e) => setManualAddress(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  {(selectedCategory?.id === 'parking' || selectedCategory?.id === 'occupy' || selectedCategory?.id === 'noise' || selectedItem?.label.includes('車')) && (
                    <div>
                      <div className="flex items-end justify-between mb-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                          車牌號碼 (選填)
                        </label>
                        <span className="text-[9px] text-gray-400 font-medium">填寫有時只會致電車主，不填將迫使警員到場</span>
                      </div>
                      <input 
                        type="text" 
                        value={plateNumber}
                        onChange={handlePlateChange}
                        placeholder="例如：ABC-1234"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black uppercase tracking-wider"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                      補充說明 (選填)
                    </label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="簡述情況"
                      rows={2}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black resize-none"
                    />
                  </div>
                  
                  <div className="flex items-start bg-red-50/50 p-3 rounded-xl border border-red-100">
                     <div className="flex items-center h-5">
                       <input 
                         type="checkbox" 
                         id="includeWarning" 
                         checked={includeWarning} 
                         onChange={(e) => setIncludeWarning(e.target.checked)}
                         className="w-4 h-4 text-red-600 bg-white border-red-300 rounded focus:ring-red-500 focus:ring-2"
                       />
                     </div>
                     <label htmlFor="includeWarning" className="ml-3 text-xs font-medium text-red-800">
                       附加聲明：要求員警確實出勤，並警告若不處理將上傳影片至網路公審以防吃案。
                     </label>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col space-y-3 shrink-0">
                <button 
                  onClick={handleSend}
                  disabled={!manualAddress.trim()}
                  className="w-full bg-black text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all text-sm uppercase tracking-widest active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-30 disabled:shadow-none disabled:active:scale-100"
                >
                  <Send className="w-4 h-4" />
                  送出簡訊報案 (SMS)
                </button>
                
                {!phoneNumber && city && (
                  <p className="text-[10px] text-red-500 text-center font-bold tracking-widest">
                    未找到「{city}」對應的報案號碼。
                  </p>
                )}
                 <div className="flex justify-center space-x-4">
                    <span className="text-[10px] text-gray-400 tracking-widest">系統版本 v2.4.0</span>
                    <span className="text-[10px] text-gray-400 tracking-widest">隱私加密傳輸</span>
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
