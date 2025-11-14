import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import { Menu, Globe2, Wallet, GraduationCap, HandCoins, ShieldCheck, FileCheck2, MapPin, Languages } from 'lucide-react'
import Spline from '@splinetool/react-spline'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Navbar(){
  const [open,setOpen]=useState(false)
  return (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur border-b border-white/20 bg-white/60">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-blue-500 text-white shadow-sm">
            <span className="relative">
              <span className="absolute -top-1 -left-1 text-[10px]">🔗</span>
              <span className="text-lg">📚</span>
            </span>
          </span>
          <span>EduChain</span>
        </Link>
        <div className="hidden md:flex gap-6 text-sm">
          <NavLink to="/student" className={({isActive})=> isActive? 'text-indigo-600 font-semibold':'text-gray-700 hover:text-gray-900'}>Student Portal</NavLink>
          <NavLink to="/donor" className={({isActive})=> isActive? 'text-indigo-600 font-semibold':'text-gray-700 hover:text-gray-900'}>Donor Portal</NavLink>
          <NavLink to="/csr" className={({isActive})=> isActive? 'text-indigo-600 font-semibold':'text-gray-700 hover:text-gray-900'}>CSR</NavLink>
        </div>
        <button className="md:hidden p-2" onClick={()=>setOpen(!open)}><Menu /></button>
      </div>
      {open && (
        <div className="md:hidden px-4 pb-4 grid gap-2 text-sm">
          <NavLink to="/student" onClick={()=>setOpen(false)}>Student Portal</NavLink>
          <NavLink to="/donor" onClick={()=>setOpen(false)}>Donor Portal</NavLink>
          <NavLink to="/csr" onClick={()=>setOpen(false)}>CSR</NavLink>
        </div>
      )}
    </div>
  )
}

function Hero(){
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode" style={{ width:'100%', height:'100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/90 pointer-events-none"/>
      <div className="relative z-10 max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8">
        <div className="py-28">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">Funding Education with Trust, Transparency and Speed</h1>
          <p className="mt-4 text-gray-700 md:text-lg">Two powerful portals: Students raise micro and big scholarships with verified proofs; Donors fund globally with all major payment methods and blockchain-backed tracking.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/student" className="px-5 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Enter Student Portal</Link>
            <Link to="/donor" className="px-5 py-3 rounded-lg bg-white shadow border border-gray-200 hover:border-gray-300">Open Donor Portal</Link>
          </div>
          <div className="mt-6 flex gap-6 text-gray-700">
            <span className="inline-flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-600"/>AI + KYC Verification</span>
            <span className="inline-flex items-center gap-2"><MapPin className="w-5 h-5 text-rose-600"/>Geo Heatmaps</span>
            <span className="inline-flex items-center gap-2"><Globe2 className="w-5 h-5 text-blue-600"/>Multi-language</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function StudentPortal(){
  const [students, setStudents] = useState([])
  useEffect(()=>{
    fetch(`${API}/students`).then(r=>r.json()).then(setStudents).catch(()=>{})
  },[])
  return (
    <div className="max-w-6xl mx-auto px-4 py-28">
      <h2 className="text-3xl font-bold">Student Portal</h2>
      <p className="text-gray-600 mt-1">Submit KYC, upload proofs, track trust score.</p>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white/80 backdrop-blur border border-gray-200">
          <h3 className="font-semibold flex items-center gap-2"><FileCheck2 className="w-5 h-5"/>Proof Submission</h3>
          <ProofForm />
        </div>
        <div className="p-6 rounded-2xl bg-white/80 backdrop-blur border border-gray-200">
          <h3 className="font-semibold flex items-center gap-2"><ShieldCheck className="w-5 h-5"/>KYC Verification</h3>
          <KYCForm />
        </div>
      </div>

      <div className="mt-10">
        <h3 className="font-semibold">Students (for discovery)</h3>
        <div className="mt-3 grid md:grid-cols-3 gap-4">
          {students.map(s=> (
            <div key={s.id} className="p-4 rounded-xl border bg-white">
              <div className="font-medium">{s.full_name}</div>
              <div className="text-sm text-gray-600">{s.school_name}</div>
              <div className="text-sm">Trust Score: <span className="font-semibold">{s.trust_score ?? 0}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DonorPortal(){
  const [amount,setAmount]=useState('1000')
  const [scholarship,setScholarship]=useState('micro')
  const [gateway,setGateway]=useState('upi')
  const [currency,setCurrency]=useState('INR')
  const [status,setStatus]=useState(null)

  const initiate=async()=>{
    const res = await fetch(`${API}/donations/initiate`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ scholarship, amount: Number(amount), currency, gateway })})
    const data = await res.json()
    setStatus(data)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-28">
      <h2 className="text-3xl font-bold">Donor Portal</h2>
      <p className="text-gray-600 mt-1">Fund students via UPI, cards, net-banking, PayPal, Stripe, Google Pay, Apple Pay and more.</p>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white/80 backdrop-blur border border-gray-200">
          <h3 className="font-semibold flex items-center gap-2"><HandCoins className="w-5 h-5"/>Create a Donation</h3>
          <div className="mt-4 grid gap-3">
            <label className="text-sm">Amount (supports multi-currency)</label>
            <input value={amount} onChange={e=>setAmount(e.target.value)} className="px-3 py-2 rounded border"/>
            <div className="grid grid-cols-2 gap-3">
              <select value={currency} onChange={e=>setCurrency(e.target.value)} className="px-3 py-2 rounded border">
                <option>INR</option>
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
              <select value={scholarship} onChange={e=>setScholarship(e.target.value)} className="px-3 py-2 rounded border">
                <option value="micro">Micro Scholarship (₹10–₹5,000)</option>
                <option value="big">Big Scholarship (₹10,000–₹10,00,000)</option>
              </select>
            </div>
            <label className="text-sm">Payment Method</label>
            <select value={gateway} onChange={e=>setGateway(e.target.value)} className="px-3 py-2 rounded border">
              <option value="upi">UPI</option>
              <option value="cards">Cards</option>
              <option value="netbanking">Net Banking</option>
              <option value="paypal">PayPal</option>
              <option value="stripe">Stripe</option>
              <option value="gpay">Google Pay</option>
              <option value="applepay">Apple Pay</option>
              <option value="intl_wallet">International Wallet</option>
            </select>
            <button onClick={initiate} className="mt-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Proceed</button>
            {status && (
              <div className="text-sm text-gray-700">Status: {status.status} • Reference: {status.reference}</div>
            )}
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-white/80 backdrop-blur border border-gray-200">
          <h3 className="font-semibold flex items-center gap-2"><Wallet className="w-5 h-5"/>Blockchain Tracking</h3>
          <p className="text-sm text-gray-600">Every donation receives an immutable reference on-chain. Integrations for EVM chains with proof hashes are supported.</p>
        </div>
      </div>
    </div>
  )
}

function ProofForm(){
  const [studentId,setStudentId]=useState('')
  const [title,setTitle]=useState('')
  const [amount,setAmount]=useState('')
  const submit=async()=>{
    await fetch(`${API}/proofs`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({student_id: studentId, title, amount: Number(amount) || null, files: []})})
    alert('Submitted')
  }
  return (
    <div className="mt-3 grid gap-3">
      <input placeholder="Student ID" value={studentId} onChange={e=>setStudentId(e.target.value)} className="px-3 py-2 rounded border"/>
      <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} className="px-3 py-2 rounded border"/>
      <input placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} className="px-3 py-2 rounded border"/>
      <button onClick={submit} className="px-4 py-2 rounded bg-emerald-600 text-white">Upload</button>
    </div>
  )
}

function KYCForm(){
  const [studentId,setStudentId]=useState('')
  const [idp,setIdp]=useState('')
  const [sid,setSid]=useState('')
  const [letter,setLetter]=useState('')
  const [selfie,setSelfie]=useState('')
  const submit=async()=>{
    await fetch(`${API}/kyc`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ student_id: studentId, id_proof_url: idp, student_id_card_url: sid, school_letter_url: letter || null, selfie_url: selfie, status: 'pending' })})
    alert('KYC submitted')
  }
  return (
    <div className="mt-3 grid gap-3">
      <input placeholder="Student ID" value={studentId} onChange={e=>setStudentId(e.target.value)} className="px-3 py-2 rounded border"/>
      <input placeholder="ID Proof URL" value={idp} onChange={e=>setIdp(e.target.value)} className="px-3 py-2 rounded border"/>
      <input placeholder="Student ID Card URL" value={sid} onChange={e=>setSid(e.target.value)} className="px-3 py-2 rounded border"/>
      <input placeholder="School Letter URL (optional)" value={letter} onChange={e=>setLetter(e.target.value)} className="px-3 py-2 rounded border"/>
      <input placeholder="Selfie URL" value={selfie} onChange={e=>setSelfie(e.target.value)} className="px-3 py-2 rounded border"/>
      <button onClick={submit} className="px-4 py-2 rounded bg-indigo-600 text-white">Submit</button>
    </div>
  )
}

function CSR(){
  return (
    <div className="max-w-6xl mx-auto px-4 py-28">
      <h2 className="text-3xl font-bold">CSR Tools</h2>
      <p className="text-gray-600 mt-1">Set goals, allocate budgets and track impact via transparent dashboards.</p>
    </div>
  )
}

function Home(){
  return (
    <>
      <Hero/>
      <section className="py-16 bg-gradient-to-b from-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-6">
          <Feature icon={<GraduationCap className="w-6 h-6"/>} title="Micro & Big Scholarships" desc="From ₹10 to ₹10,00,000 with transparent milestones."/>
          <Feature icon={<ShieldCheck className="w-6 h-6"/>} title="AI Verification" desc="Document scanning and trust score engine to reduce fraud."/>
          <Feature icon={<Globe2 className="w-6 h-6"/>} title="Multi-language & Currency" desc="Reach donors globally in their language and currency."/>
        </div>
      </section>
    </>
  )
}

function Feature({icon,title,desc}){
  return (
    <div className="p-6 rounded-2xl bg-white/70 backdrop-blur border border-gray-200 hover:shadow-lg transition">
      <div className="text-indigo-600">{icon}</div>
      <div className="mt-3 font-semibold">{title}</div>
      <div className="text-sm text-gray-600">{desc}</div>
    </div>
  )
}

export default function App(){
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/student" element={<StudentPortal/>}/>
        <Route path="/donor" element={<DonorPortal/>}/>
        <Route path="/csr" element={<CSR/>}/>
      </Routes>
    </BrowserRouter>
  )
}
