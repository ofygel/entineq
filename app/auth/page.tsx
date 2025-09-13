'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function AuthPage(){
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(()=>{ (async()=>{
    const { data:{ session } } = await supabaseBrowser.auth.getSession();
    if (session) router.replace('/');
  })(); }, [router]);

  const sendSms = async ()=> {
    setLoading(true);
    const { error } = await supabaseBrowser.auth.signInWithOtp({ phone, options:{ channel:'sms' } });
    setLoading(false);
    if (error) return alert(error.message);
    setSent(true);
  };
  const verifySms = async ()=> {
    setLoading(true);
    const { error } = await supabaseBrowser.auth.verifyOtp({ phone, token: otp, type:'sms' });
    setLoading(false);
    if (error) return alert(error.message);
    router.replace('/');
  };
  const magicLink = async ()=> {
    setLoading(true);
    const { error } = await supabaseBrowser.auth.signInWithOtp({ email, options:{ emailRedirectTo: location.origin } });
    setLoading(false);
    if (error) return alert(error.message);
    alert('Письмо отправлено. Проверьте почту.');
  };

  return (
    <div className="container-mobile pt-safe pb-safe">
      <div className="card mt-6 space-y-3">
        <h1 className="text-xl font-semibold">Вход по телефону</h1>
        {!sent ? (
          <>
            <input className="input" placeholder="+7 777 123 45 67" value={phone} onChange={e=>setPhone(e.target.value)} />
            <button className="btn btn-secondary w-full" disabled={!phone||loading} onClick={sendSms}>Отправить код</button>
          </>
        ) : (
          <>
            <input className="input" placeholder="Код из SMS" value={otp} onChange={e=>setOtp(e.target.value)} />
            <button className="btn btn-secondary w-full" disabled={!otp||loading} onClick={verifySms}>Подтвердить</button>
            <button className="btn btn-ghost w-full" onClick={()=>setSent(false)}>Изменить номер</button>
          </>
        )}
      </div>

      <div className="card mt-4 space-y-3">
        <h2 className="font-semibold">Или вход по email (dev)</h2>
        <input className="input" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
        <button className="btn btn-ghost w-full" disabled={!email||loading} onClick={magicLink}>Выслать magic-link</button>
      </div>
    </div>
  );
}
