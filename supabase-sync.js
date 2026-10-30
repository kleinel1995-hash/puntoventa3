(function(){
  const KEYS = ["productosPOS", "inventarioPOS", "comprasPOS", "ventasPOS", "cotizacionesPOS", "clientesPOS", "gastosPOS", "proveedoresPOS", "configNegocio", "configImpuesto", "configImpresora", "configPagos", "usuariosPOS", "cierresPOS", "usuarioActualPOS"];
  const FLAG = "__pos_supabase_hydrated";
  const url = window.SUPABASE_URL, anon = window.SUPABASE_ANON_KEY;
  if(!url || !anon || url.includes("TU-PROYECTO") || anon.includes("TU_SUPABASE")){
    console.warn("Supabase POS: configura supabase-config.js para activar la sincronización.");
    return;
  }
  const loadClient = () => new Promise((resolve,reject)=>{
    if(window.supabase?.createClient) return resolve();
    const s=document.createElement("script");
    s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    s.onload=resolve; s.onerror=reject; document.head.appendChild(s);
  });
  loadClient().then(async()=>{
    const db=window.supabase.createClient(url,anon);
    window.posSupabase=db;
    // Primera carga: descarga datos remotos antes de ejecutar el POS con datos locales.
    if(sessionStorage.getItem(FLAG)!=="1"){
      try{
        const {data,error}=await db.from("pos_app_data").select("key,value");
        if(error) throw error;
        (data||[]).forEach(row=>{
          if(KEYS.includes(row.key)) localStorage.setItem(row.key,JSON.stringify(row.value));
        });
        sessionStorage.setItem(FLAG,"1");
        location.reload();
        return;
      }catch(e){ console.error("No se pudieron descargar datos de Supabase:",e); }
    }
    const originalSet=localStorage.setItem.bind(localStorage);
    const pending=new Map(); let timer;
    localStorage.setItem=function(key,value){
      originalSet(key,value);
      if(!KEYS.includes(key)) return;
      try{
        const parsed=JSON.parse(value);
        pending.set(key,parsed);
        clearTimeout(timer);
        timer=setTimeout(async()=>{
          const rows=[...pending.entries()].map(([k,v])=>({key:k,value:v,updated_at:new Date().toISOString()}));
          pending.clear();
          const {error}=await db.from("pos_app_data").upsert(rows,{onConflict:"key"});
          if(error) console.error("Error sincronizando "+key+":",error);
        },500);
      }catch(e){console.error("Dato POS no válido para sincronizar:",key,e);}
    };
    window.posSyncNow=async()=>{
      const rows=KEYS.flatMap(key=>{
        const value=localStorage.getItem(key);
        if(value===null)return [];
        try{return [{key,value:JSON.parse(value),updated_at:new Date().toISOString()}]}catch(e){return []}
      });
      const {error}=await db.from("pos_app_data").upsert(rows,{onConflict:"key"});
      if(error) throw error;
      return true;
    };
    window.dispatchEvent(new CustomEvent("pos-supabase-ready"));
    console.info("POS conectado a Supabase.");
  }).catch(e=>console.error("Supabase no pudo iniciar:",e));
})();