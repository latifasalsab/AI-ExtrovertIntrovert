import React, { useState } from 'react';
import axios from 'axios';

const featureQuestions = {
  Time_spent_Alone: [
    'Berapa jam yang kamu habiskan sendirian setiap hari? (0-24)',
    'Apakah kamu lebih suka menyendiri daripada berada di keramaian? (0-10)'
  ],
  Stage_fear: [
    'Apakah kamu takut berbicara di depan umum? (0-10)',
    'Seberapa cemas kamu saat harus tampil di depan banyak orang? (0-10)'
  ],
  Social_event_attendance: [
    'Seberapa sering kamu menghadiri acara sosial per minggu? (0-10)',
    'Seberapa antusias kamu menghadiri acara besar seperti konser atau pesta? (0-10)'
  ],
  Going_outside: [
    'Berapa kali kamu pergi keluar rumah dalam seminggu? (0-10)',
    'Seberapa nyaman kamu bepergian sendirian? (0-10)'
  ],
  Drained_after_socializing: [
    'Apakah kamu merasa lelah setelah bersosialisasi lama? (0-10)',
    'Apakah kamu merasa butuh waktu menyendiri setelah kumpul bareng? (0-10)'
  ],
  Friends_circle_size: [
    'Berapa banyak teman dekat yang kamu miliki? (0-10)',
    'Seberapa luas jaringan sosial kamu? (0-10)'
  ],
  Post_frequency: [
    'Seberapa sering kamu memposting di media sosial? (0-10)',
    'Apakah kamu merasa nyaman membagikan kehidupan pribadimu secara online? (0-10)'
  ]
};

const iconIntrovert = (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="56" fill="#E0E7FF" stroke="#6366F1" strokeWidth="4"/>
    <ellipse cx="60" cy="70" rx="30" ry="20" fill="#6366F1" opacity="0.15"/>
    <circle cx="60" cy="54" r="22" fill="#6366F1"/>
    <ellipse cx="60" cy="54" rx="10" ry="14" fill="#A5B4FC"/>
    <ellipse cx="60" cy="54" rx="5" ry="7" fill="#fff"/>
  </svg>
);
const iconExtrovert = (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="56" fill="#FEF9C3" stroke="#F59E42" strokeWidth="4"/>
    <ellipse cx="60" cy="70" rx="30" ry="20" fill="#F59E42" opacity="0.15"/>
    <circle cx="60" cy="54" r="22" fill="#F59E42"/>
    <ellipse cx="60" cy="54" rx="10" ry="14" fill="#FDE68A"/>
    <ellipse cx="60" cy="54" rx="5" ry="7" fill="#fff"/>
  </svg>
);

const PersonalityTest = () => {
  const [started, setStarted] = useState(false);
  const [page, setPage] = useState(0);
  const [responses, setResponses] = useState({});
  const [result, setResult] = useState(null);

  const questions = Object.values(featureQuestions).flat();
  const featureKeys = Object.keys(featureQuestions);
  const flatFeatures = featureKeys.flatMap(feat => Array(featureQuestions[feat].length).fill(feat));
  const qPerPage = 2;
  const startQ = page * qPerPage;
  const endQ = startQ + qPerPage;

  const handleChange = (idx, feat, val) => {
    setResponses(prev => ({ ...prev, [`q_${idx}_${feat}`]: val }));
  };

  const handleSubmit = async () => {
    const userInputs = {};
    featureKeys.forEach(feat => userInputs[feat] = []);
    flatFeatures.forEach((feat, i) => {
      userInputs[feat].push(responses[`q_${i}_${feat}`] || 0);
    });
    const finalInputs = featureKeys.map(feat => {
      const values = userInputs[feat];
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      return avg;
    });

    try {
      const res = await axios.post('/api/predict', { input: finalInputs });
      setResult(res.data);
    } catch (err) {
      console.error('Prediction error:', err);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #a7bfff 0%, #fbc2eb 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      padding: '0',
    }}>
      {!started ? (
        <div style={{
          maxWidth: 520,
          width: '100%',
          margin: '32px 16px',
          padding: '40px 28px',
          background: 'rgba(255,255,255,0.97)',
          borderRadius: 24,
          boxShadow: '0 8px 32px 0 rgba(99,102,241,0.10), 0 1.5px 8px 0 #fbc2eb44',
          fontFamily: 'Inter, Arial, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px solid #fbc2eb55',
          position: 'relative',
          textAlign: 'center',
        }}>
          <h1 style={{color:'#6366F1', fontWeight:700, fontSize: '2.1rem', marginBottom: 16, letterSpacing:1}}>🧠 Tes Kepribadian Mini</h1>
          <p style={{color:'#b83280', marginBottom: 32, fontWeight:500, fontSize:'1.13em'}}>Selamat datang di Tes Kepribadian Mini!<br/>Klik tombol di bawah ini untuk memulai tes dan ketahui apakah kamu <strong>Introvert</strong> atau <strong>Extrovert</strong>.</p>
          <button onClick={() => setStarted(true)} style={{padding:'16px 36px', background:'linear-gradient(90deg,#a7bfff,#fbc2eb)', color:'#fff', border:'none', borderRadius:12, fontWeight:700, fontSize:'1.15em', cursor:'pointer', boxShadow:'0 1px 8px #a7bfff33', marginBottom:12}}>Mulai Tes</button>
          <p style={{ fontSize: '0.95em', color: '#b83280', textAlign:'center', fontWeight:500, marginTop:24 }}>Dibuat dengan ❤️ oleh Latifa Salsabila & Tiara Yoga Pratiwi</p>
        </div>
      ) : (
        <div style={{
          maxWidth: 520,
          width: '100%',
          margin: '32px 16px',
          padding: '32px 24px',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: 24,
          boxShadow: '0 8px 32px 0 rgba(99,102,241,0.10), 0 1.5px 8px 0 #fbc2eb44',
          fontFamily: 'Inter, Arial, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          border: '2px solid #fbc2eb55',
          position: 'relative',
        }}>
          {/* <div style={{position:'absolute', top:0, left:0, width:'100%', height:8, background:'linear-gradient(90deg,#a7bfff,#fbc2eb)', borderTopLeftRadius:24, borderTopRightRadius:24}}></div> */}
          <h1 style={{textAlign:'center', color:'#6366F1', fontWeight:700, fontSize: '2.1rem', marginBottom: 8, letterSpacing:1}}>🧠 Tes Kepribadian Mini</h1>
          <p style={{textAlign:'center', color:'#b83280', marginBottom: 28, fontWeight:500}}>Jawab pertanyaan berikut untuk mengetahui apakah kamu <strong>Introvert</strong> atau <strong>Extrovert</strong>.</p>
          <div>
            {questions.slice(startQ, endQ).map((q, i) => {
              const idx = startQ + i;
              const feat = flatFeatures[idx];
              const max = q.includes('(0-24)') ? 24 : 10;
              return (
                <div key={idx} style={{ marginBottom: 32, background:'#fbc2eb22', borderRadius:12, padding:'18px 16px 10px 16px', boxShadow:'0 1px 6px #a7bfff22' }}>
                  <label style={{fontWeight:600, color:'#b83280', display:'block', marginBottom:10, fontSize:'1.08em'}}>{q}</label>
                  <input
                    type="range"
                    min="0"
                    max={max}
                    value={responses[`q_${idx}_${feat}`] || 0}
                    onChange={e => handleChange(idx, feat, parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: '#b83280', height: '5px', marginBottom:6 }}
                  />
                  <div style={{textAlign:'right', color:'#b83280', fontWeight:700, fontSize:'1.15em'}}>{responses[`q_${idx}_${feat}`] || 0}</div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, gap: 12 }}>
            {page > 0 && (
              <button onClick={() => setPage(page - 1)} style={{flex:1, padding:'13px 0', background:'linear-gradient(90deg,#a7bfff,#fbc2eb)', color:'#6366F1', border:'none', borderRadius:8, fontWeight:700, fontSize:'1em', cursor:'pointer', boxShadow:'0 1px 4px #a7bfff33'}}>⬅ Kembali</button>
            )}
            {endQ < questions.length ? (
              <button onClick={() => setPage(page + 1)} style={{flex:1, padding:'13px 0', background:'linear-gradient(90deg,#fbc2eb,#a7bfff)', color:'#b83280', border:'none', borderRadius:8, fontWeight:700, fontSize:'1em', cursor:'pointer', boxShadow:'0 1px 4px #fbc2eb33'}}>Lanjut ➡</button>
            ) : (
              <button onClick={handleSubmit} style={{flex:1, padding:'13px 0', background:'linear-gradient(90deg,#a7bfff,#fbc2eb)', color:'#fff', border:'none', borderRadius:8, fontWeight:700, fontSize:'1em', cursor:'pointer', boxShadow:'0 1px 4px #a7bfff33'}}>🎯 Prediksi</button>
            )}
          </div>
          {result && (
            <div style={{ marginTop: 36, textAlign: 'center', background:'linear-gradient(135deg,#fbc2eb33 60%,#a7bfff33 100%)', borderRadius:18, padding:28, boxShadow:'0 2px 12px #a7bfff22', border:'2px solid #a7bfff33' }}>
              <h2 style={{color: result.label === 'Introvert' ? '#6366F1' : '#F59E42', fontWeight:700, fontSize:'1.5rem'}}>Hasil Prediksi: {result.label}</h2>
              <div style={{margin:'18px auto', width:120, height:120, display:'flex', alignItems:'center', justifyContent:'center'}}>
                {result.label === 'Introvert' ? iconIntrovert : iconExtrovert}
              </div>
              <p style={{color:'#b83280', fontSize:'1.13em', marginTop:8, fontWeight:500}}>{result.label === 'Introvert'
                ? 'Introvert itu keren loh! Kamu nyaman dengan diri sendiri dan reflektif 🧘‍♀️'
                : 'Extrovert itu hebat! Kamu suka eksplorasi dan energi kamu nular ke orang lain 🌟'}</p>
            </div>
          )}
          <hr style={{margin:'32px 0 12px 0', border:'none', borderTop:'1px solid #eee'}} />
          <p style={{ fontSize: '0.95em', color: '#b83280', textAlign:'center', fontWeight:500 }}>Dibuat dengan ❤️ oleh Latifa Salsabila & Tiara Yoga Pratiwi</p>
          <style>{`
            @media (max-width: 700px) {
              div[style*='max-width: 520px'] {
                max-width: 98vw !important;
                padding: 4vw !important;
                border-radius: 0 !important;
                margin: 0 !important;
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default PersonalityTest;
