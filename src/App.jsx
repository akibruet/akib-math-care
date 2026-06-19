import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { db } from './firebase'; 
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export default function App() {
  const [searchRoll, setSearchRoll] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [currentSlipNo, setCurrentSlipNo] = useState(1);

  const [formData, setFormData] = useState({
    rollNo: '',
    batchName: '',
    batchTime: '',
    classDays: 'Sat-Mon-Wed',
    studentNameEn: '',
    studentNameBn: '',
    fathersName: '',
    fathersProfession: '',
    mothersName: '',
    mothersProfession: '',
    address: '',
    schoolName: '',
    collegeName: '',
    guardianPhone: '',
    studentPhone: '',
    batchCategory: 'HSC 1st Year', 
    
    sscBoard: 'Rajshahi', sscYear: '', sscGpa: '',
    hscBoard: 'Rajshahi', hscYear: '', hscGpa: '',
    
    paymentType: 'New Admission',
    totalCourseFee: '14000', 
    previousPaid: 0,        
    admissionFeePaid: ''    
  });
  
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptNo, setReceiptNo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const receiptRef = useRef();
  const fullFormRef = useRef();

  const handleFindStudent = async () => {
    if (!searchRoll) {
      alert("অনুগ্রহ করে খোঁজার জন্য রোল নাম্বারটি লিখুন!");
      return;
    }
    setIsSearching(true);
    try {
      const q = query(collection(db, "students"), where("rollNo", "==", searchRoll.trim()));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        alert("এই রোল নাম্বারের কোনো শিক্ষার্থীর তথ্য ডাটাবেজে পাওয়া যায়নি!");
        setIsSearching(false);
        return;
      }

      let latestDoc = null;
      let maxSlipNo = 0;

      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        const docSlipNo = Number(docData.slipNo || 1);
        if (docSlipNo >= maxSlipNo) {
          maxSlipNo = docSlipNo;
          latestDoc = { id: doc.id, ...docData };
        }
      });

      const currentDueFromDb = Number(latestDoc.dueAmount || 0);
      const totalFeeFromDb = Number(latestDoc.totalCourseFee || 14000);
      const calculatedPrevPaid = totalFeeFromDb - currentDueFromDb;

      setFormData({
        ...latestDoc,
        paymentType: 'Due Payment',
        previousPaid: calculatedPrevPaid,
        admissionFeePaid: '' 
      });

      setCurrentSlipNo(maxSlipNo + 1);
      alert(`শিক্ষার্থী "${latestDoc.studentNameEn}" এর তথ্য লোড হয়েছে!\nবর্তমান বকেয়া আছে: ${currentDueFromDb} TK`);
    } catch (error) {
      console.error("Error searching student: ", error);
      alert("অনুসন্ধান করতে সমস্যা হয়েছে!");
    }
    setIsSearching(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formData.studentNameEn || !formData.studentPhone || !formData.admissionFeePaid) {
      alert("অনুগ্রহ করে নাম, মোবাইল এবং আজকের জমার পরিমাণ অবশ্যই লিখুন!");
      return;
    }

    setIsSubmitting(true);
    try {
      const generatedReceiptNo = 'AMAAC-' + Math.floor(100000 + Math.random() * 900000);
      setReceiptNo(generatedReceiptNo);

      const totalFee = Number(formData.totalCourseFee || 0);
      const prevPaid = Number(formData.previousPaid || 0);
      const paidNow = Number(formData.admissionFeePaid || 0);
      const finalDueCalculated = totalFee - prevPaid - paidNow;

      const paymentData = {
        ...formData,
        dueAmount: finalDueCalculated,
        slipNo: currentSlipNo,
        receiptNo: generatedReceiptNo,
        date: new Date().toLocaleDateString(),
        createdAt: new Date()
      };

      await addDoc(collection(db, "students"), paymentData);
      setIsSubmitting(false);
      setShowReceipt(true);
    } catch (error) {
      console.error("Error saving payment: ", error);
      alert("ডাটাবেজে সেভ করতে সমস্যা হয়েছে!");
      setIsSubmitting(false);
    }
  };

  const handlePrintReceipt = useReactToPrint({ contentRef: receiptRef });
  const handlePrintFullForm = useReactToPrint({ contentRef: fullFormRef });

  const renderFormContent = (isReadOnly = false) => (
    <div className="bg-[#e2f1f5] p-5 rounded-xl border-2 border-cyan-800 w-full text-slate-800 text-xs print-exact print-page-break" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact', pageBreakInside: 'avoid' }}>
      
      {/* Header Panel */}
      <div className="flex flex-row justify-between items-center border-b-2 border-cyan-800 pb-2 mb-3">
        {/* লোগো সার্কেল বড় এবং নিচের লেখাকে শার্প/হাইলাইট করতে ফিল্টার ও স্কেল scale-[2.35] ব্যবহার করা হয়েছে */}
        <div className="w-24 h-24 bg-white rounded-xl border-2 border-cyan-800/40 flex items-center justify-center overflow-hidden shrink-0 shadow-sm p-1">
          <img 
            src="/logo.png" 
            alt="Akib Math Care" 
            className="w-full h-full object-contain transform scale-[2.35] filter contrast-125 brightness-95"
            style={{ filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.15)) contrast(1.2)' }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = '<div class="text-[11px] font-bold text-center text-cyan-950">AKIB<br/>MATH<br/>CARE</div>';
            }}
          />
        </div>
        <div className="text-center flex-1 px-4">
          <h1 className="text-4xl font-black text-cyan-950 tracking-wider uppercase leading-none">AKIB MATH</h1>
          <p className="text-sm font-bold text-cyan-800 tracking-wide uppercase mt-1">ACADEMIC AND ADMISSION CARE</p>
          <p className="text-[10px] bg-cyan-950 text-white inline-block px-4 py-0.5 rounded-full font-semibold mt-1.5">
            Director: Md. Akibul Hasan (Akib) <span className="text-[8px] opacity-80">(CSE, RUET)</span>
          </p>
          <p className="text-[11px] text-cyan-900 font-bold mt-1">Malopara, Mohila College Road, Kadirganj, Rajshahi</p>
          <p className="text-[10px] text-slate-700 font-mono mt-0.5">
            Contact Us: <strong className="text-cyan-950 text-xs">01602501062</strong>, <strong className="text-cyan-950 text-xs">01784292677</strong>
          </p>
        </div>
        <div className="w-24 h-28 border-2 border-dashed border-cyan-800 bg-white/70 flex items-center justify-center text-center text-[10px] text-gray-400 p-2 rounded shrink-0">
          Attach Photo Here
        </div>
      </div>
      
      <div className="space-y-3.5">
        {/* Top Info Grid */}
        <div className="flex flex-row gap-3 bg-cyan-900/10 p-2.5 rounded-lg border border-cyan-800/20 text-[11px]">
          <div className="flex-1">
            <label className="block font-bold mb-0.5 text-cyan-950">Roll No</label>
            {isReadOnly ? <div className="p-2 bg-white rounded border border-slate-300 min-h-[34px] font-bold">{formData.rollNo}</div> : 
            <input name="rollNo" value={formData.rollNo} onChange={handleChange} placeholder="e.g. 101" className="w-full p-2 border bg-white rounded focus:outline-none" />}
          </div>
          <div className="flex-1">
            <label className="block font-bold mb-0.5 text-cyan-950">Batch Name</label>
            {isReadOnly ? <div className="p-2 bg-white rounded border border-slate-300 min-h-[34px] font-bold">{formData.batchName}</div> : 
            <input name="batchName" value={formData.batchName} onChange={handleChange} placeholder="e.g. Alpha" className="w-full p-2 border bg-white rounded focus:outline-none" />}
          </div>
          <div className="flex-1">
            <label className="block font-bold mb-0.5 text-cyan-950">Batch Time</label>
            {isReadOnly ? <div className="p-2 bg-white rounded border border-slate-300 min-h-[34px] font-bold">{formData.batchTime}</div> : 
            <input name="batchTime" value={formData.batchTime} onChange={handleChange} placeholder="e.g. 09:00 AM" className="w-full p-2 border bg-white rounded focus:outline-none" />}
          </div>
          <div className="flex-1">
            <label className="block font-bold mb-0.5 text-cyan-950">Class Day</label>
            {isReadOnly ? <div className="p-2 bg-white rounded border border-slate-300 min-h-[34px] font-bold">{formData.classDays}</div> : 
            <select name="classDays" value={formData.classDays} onChange={handleChange} className="w-full p-2 border bg-white rounded focus:outline-none text-xs">
              <option value="Sat-Mon-Wed">Sat, Mon, Wed</option>
              <option value="Sun-Tue-Thu">Sun, Tue, Thu</option>
            </select>}
          </div>
        </div>

        {/* Main Form Fields */}
        <div className="space-y-3 bg-white p-4 rounded-lg border border-slate-200 text-[11px]">
          <div className="flex flex-row gap-3">
            <div className="flex-1">
              <label className="block font-bold text-cyan-950 mb-0.5">Student Name (English Block Letter) *</label>
              {isReadOnly ? <div className="p-2 bg-slate-50 border rounded uppercase font-bold min-h-[34px]">{formData.studentNameEn}</div> :
              <input name="studentNameEn" required value={formData.studentNameEn} onChange={handleChange} placeholder="MD. AKIBUL HASAN" className="w-full p-2 border rounded uppercase focus:outline-none" />}
            </div>
            <div className="flex-1">
              <label className="block font-bold text-cyan-950 mb-0.5">ছাত্র/ছাত্রীর নাম (বাংলায়)</label>
              {isReadOnly ? <div className="p-2 bg-slate-50 border rounded font-bold min-h-[34px]">{formData.studentNameBn}</div> :
              <input name="studentNameBn" value={formData.studentNameBn} onChange={handleChange} placeholder="মোঃ আকিবুল হাসান" className="w-full p-2 border rounded focus:outline-none" />}
            </div>
          </div>

          <div className="flex flex-row gap-3">
            <div className="flex-[4] flex gap-2">
              <div className="flex-[2]">
                <label className="block font-bold text-cyan-950 mb-0.5">Father's Name</label>
                {isReadOnly ? <div className="p-2 bg-slate-50 border rounded min-h-[34px]">{formData.fathersName}</div> :
                <input name="fathersName" value={formData.fathersName} onChange={handleChange} placeholder="Father's Name" className="w-full p-2 border rounded focus:outline-none" />}
              </div>
              <div className="flex-1">
                <label className="block font-bold text-cyan-950 mb-0.5">Profession</label>
                {isReadOnly ? <div className="p-2 bg-slate-50 border rounded min-h-[34px]">{formData.fathersProfession}</div> :
                <input name="fathersProfession" value={formData.fathersProfession} onChange={handleChange} placeholder="Profession" className="w-full p-2 border rounded focus:outline-none" />}
              </div>
            </div>
            
            <div className="flex-[4] flex gap-2">
              <div className="flex-[2]">
                <label className="block font-bold text-cyan-950 mb-0.5">Mother's Name</label>
                {isReadOnly ? <div className="p-2 bg-slate-50 border rounded min-h-[34px]">{formData.mothersName}</div> :
                <input name="mothersName" value={formData.mothersName} onChange={handleChange} placeholder="Mother's Name" className="w-full p-2 border rounded focus:outline-none" />}
              </div>
              <div className="flex-1">
                <label className="block font-bold text-cyan-950 mb-0.5">Profession</label>
                {isReadOnly ? <div className="p-2 bg-slate-50 border rounded min-h-[34px]">{formData.mothersProfession}</div> :
                <input name="mothersProfession" value={formData.mothersProfession} onChange={handleChange} placeholder="Profession" className="w-full p-2 border rounded focus:outline-none" />}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-cyan-950 mb-0.5">Address (ঠিকানা)</label>
            {isReadOnly ? <div className="p-2 bg-slate-50 border rounded min-h-[34px]">{formData.address}</div> :
            <input name="address" value={formData.address} onChange={handleChange} placeholder="Vill, Post, Thana, District" className="w-full p-2 border rounded focus:outline-none" />}
          </div>

          <div>
            <label className="block font-bold text-cyan-950 mb-0.5">Name Of School</label>
            {isReadOnly ? <div className="p-2 bg-slate-50 border rounded min-h-[34px]">{formData.schoolName}</div> :
            <input name="schoolName" value={formData.schoolName} onChange={handleChange} placeholder="Enter school name" className="w-full p-2 border rounded focus:outline-none" />}
          </div>

          <div className="flex flex-row gap-3">
            <div className="flex-1">
              <label className="block font-bold text-cyan-950 mb-0.5">Name Of College</label>
              {isReadOnly ? <div className="p-2 bg-slate-50 border rounded min-h-[34px]">{formData.collegeName}</div> :
              <input name="collegeName" value={formData.collegeName} onChange={handleChange} placeholder="Enter college name" className="w-full p-2 border rounded focus:outline-none" />}
            </div>
            <div className="flex-1 flex gap-2">
              <div className="flex-1">
                <label className="block font-bold text-cyan-950 mb-0.5">Contact No (Guardian)</label>
                {isReadOnly ? <div className="p-2 bg-slate-50 border rounded min-h-[34px]">{formData.guardianPhone}</div> :
                <input name="guardianPhone" value={formData.guardianPhone} onChange={handleChange} placeholder="01XXXXXXXXX" className="w-full p-2 border rounded focus:outline-none" />}
              </div>
              <div className="flex-1">
                <label className="block font-bold text-cyan-950 mb-0.5">Contact No (Student) *</label>
                {isReadOnly ? <div className="p-2 bg-slate-50 border rounded min-h-[34px] font-bold">{formData.studentPhone}</div> :
                <input name="studentPhone" required value={formData.studentPhone} onChange={handleChange} placeholder="01XXXXXXXXX" className="w-full p-2 border rounded focus:outline-none" />}
              </div>
            </div>
          </div>

          {/* Fee & Batch Row */}
          <div className="flex flex-row gap-3 pt-1">
            <div className="flex-1">
              <label className="block font-bold mb-0.5 text-cyan-950">Batch / Year *</label>
              {isReadOnly ? <div className="p-2 bg-white border border-slate-300 rounded font-bold min-h-[34px]">{formData.batchCategory}</div> :
              <select name="batchCategory" value={formData.batchCategory} onChange={handleChange} className="w-full p-2 border bg-white rounded font-semibold focus:outline-none text-xs">
                <option value="HSC 1st Year">HSC 1st Year</option>
                <option value="HSC 2nd Year">HSC 2nd Year</option>
                <option value="HSC Preparation">HSC Preparation</option>
                <option value="Admission (Varsity)">Admission (Varsity)</option>
                <option value="Admission (Medical)">Admission (Medical)</option>
                <option value="Admission (Engineering)">Admission (Engineering)</option>
              </select>}
            </div>
            <div className="flex-1">
              <label className="block font-bold mb-0.5 text-cyan-950">Total Course Fee</label>
              <div className="p-2 bg-slate-50 border rounded font-bold min-h-[34px]">{formData.totalCourseFee} TK</div>
            </div>
            <div className="flex-1">
              <label className="block font-bold mb-0.5 text-cyan-950">Previously Paid</label>
              <div className="p-2 bg-slate-50 border rounded font-semibold text-emerald-700 min-h-[34px]">{formData.previousPaid} TK</div>
            </div>
            <div className="flex-1">
              <label className="block font-bold mb-0.5 text-cyan-950">Amount Paid Now *</label>
              {isReadOnly ? <div className="p-2 bg-cyan-900 text-white rounded font-black min-h-[34px]">{formData.admissionFeePaid} TK</div> :
              <input type="number" name="admissionFeePaid" value={formData.admissionFeePaid} onChange={handleChange} placeholder="আজকে জমার পরিমাণ" className="w-full p-2 border bg-white rounded font-black focus:outline-none" />}
            </div>
          </div>
        </div>

        {/* Academic Records */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 text-[11px]">
          <h3 className="font-bold text-cyan-950 mb-1.5 uppercase border-b pb-0.5">Academic Records</h3>
          <table className="w-full text-left border-collapse border border-slate-300">
            <thead>
              <tr className="bg-cyan-950 text-white">
                <th className="p-2 border border-slate-300">Examination</th>
                <th className="p-2 border border-slate-300">Board</th>
                <th className="p-2 border border-slate-300">Passing Year</th>
                <th className="p-2 border border-slate-300">G.P.A</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border border-slate-300 font-bold bg-slate-50">SSC</td>
                <td className="p-1 border border-slate-300">
                  {isReadOnly ? formData.sscBoard : <select name="sscBoard" value={formData.sscBoard} onChange={handleChange} className="w-full focus:outline-none"><option>Rajshahi</option><option>Dhaka</option><option>Dinajpur</option><option>Jashore</option></select>}
                </td>
                <td className="p-1 border border-slate-300">
                  {isReadOnly ? formData.sscYear : <input name="sscYear" value={formData.sscYear} onChange={handleChange} placeholder="e.g. 2024" className="w-full p-1 focus:outline-none" />}
                </td>
                <td className="p-1 border border-slate-300">
                  {isReadOnly ? formData.sscGpa : <input name="sscGpa" value={formData.sscGpa} onChange={handleChange} placeholder="e.g. 5.00" className="w-full p-1 focus:outline-none font-bold" />}
                </td>
              </tr>
              <tr>
                <td className="p-2 border border-slate-300 font-bold bg-slate-50">HSC</td>
                <td className="p-1 border border-slate-300">
                  {isReadOnly ? formData.hscBoard : <select name="hscBoard" value={formData.hscBoard} onChange={handleChange} className="w-full focus:outline-none"><option>Rajshahi</option><option>Dhaka</option><option>Dinajpur</option><option>Jashore</option></select>}
                </td>
                <td className="p-1 border border-slate-300">
                  {isReadOnly ? formData.hscYear : <input name="hscYear" value={formData.hscYear} onChange={handleChange} placeholder="e.g. 2026" className="w-full p-1 focus:outline-none" />}
                </td>
                <td className="p-1 border border-slate-300">
                  {isReadOnly ? formData.hscGpa : <input name="hscGpa" value={formData.hscGpa} onChange={handleChange} placeholder="e.g. 5.00" className="w-full p-1 focus:outline-none font-bold" />}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Declaration */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 text-justify space-y-4 text-[11px]">
          <p className="italic text-slate-700 leading-relaxed">
            I am <span className="font-bold underline uppercase text-cyan-950 px-1">{formData.studentNameEn || '...........................................'}</span> hereby promising that I must follow the rules & regulations of <span className="font-bold text-cyan-900">"AKIB MATH ACADEMIC AND ADMISSION CARE"</span> and willing to be bound to obey any decision of the authority.
          </p>
          
          <div className="grid grid-cols-3 gap-4 pt-4 text-center text-[10px] font-bold text-slate-600">
            <div className="border-t border-dashed border-slate-400 pt-1">Signature Of Student</div>
            <div className="border-t border-dashed border-slate-400 pt-1">Signature Of Guardian</div>
            <div className="border-t border-dashed border-slate-400 pt-1">Signature Of Authority</div>
          </div>
        </div>

        <p className="text-center font-bold text-[10px] text-red-700 uppercase tracking-wider mt-0.5">Admission cannot be cancelled any way</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6 flex flex-col items-center font-sans text-slate-800">
      
      {!showReceipt && (
        <div className="w-full max-w-3xl bg-cyan-950 text-white p-4 rounded-t-xl flex items-center justify-between shadow-md no-print gap-4">
          <div className="flex-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">Due Clearance Mode (বকেয়া কালেকশন)</h3>
            <p className="text-[10px] opacity-75">রোল নাম্বার লিখে সার্চ দিলে খুচরা সহ আগের সব হিসাব অটো লোড হয়ে যাবে</p>
          </div>
          <div className="flex flex-row gap-2">
            <input 
              type="text" 
              value={searchRoll} 
              onChange={(e) => setSearchRoll(e.target.value)}
              placeholder="Enter Student Roll..." 
              className="p-2 text-xs rounded bg-white text-slate-900 font-bold focus:outline-none w-44"
            />
            <button 
              onClick={handleFindStudent}
              disabled={isSearching}
              className="bg-emerald-600 px-4 py-2 rounded text-xs font-bold hover:bg-emerald-700 transition disabled:bg-slate-500"
            >
              {isSearching ? "Searching..." : "🔍 Find Student"}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          .print-exact { background-color: #e2f1f5 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .print-page-break { page-break-inside: avoid !important; break-inside: avoid !important; }
          body { background: white; }
          .no-print { display: none !important; }
          @page { size: A4; margin: 0.25in 0.35in; }
          .flex { display: flex !important; flex-direction: row !important; }
          .flex-1 { flex: 1 1 0% !important; }
        }
      `}</style>

      {!showReceipt ? (
        <div className="w-full max-w-3xl rounded-b-xl shadow-2xl">
          {renderFormContent(false)}
          <div className="bg-[#e2f1f5] px-6 pb-6 md:px-8 md:pb-8 rounded-b-xl">
            <button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="w-full bg-cyan-900 text-white py-3 rounded-lg font-bold text-base hover:bg-cyan-950 transition shadow-lg disabled:bg-gray-400"
            >
              {isSubmitting ? "Saving & Generating Receipt..." : "Submit Payment & Print"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full max-w-3xl space-y-6">
          
          {/* রশিদ প্রিভিউ */}
          <div className="w-full bg-white p-2 rounded-xl shadow-md border">
            <div className="flex justify-between items-center px-4 py-2 border-b bg-slate-50">
              <h2 className="text-sm font-bold text-cyan-950">রশিদ প্রিভিউ (Money Receipt Preview)</h2>
              <span className="bg-cyan-900 text-white font-black px-3 py-1 rounded text-xs">
                SLIP NO: #{currentSlipNo}
              </span>
            </div>
            <div className="p-4 flex justify-center">
              <div ref={receiptRef} className="bg-white p-8 w-full border-2 border-dashed border-gray-400 text-sm font-sans">
                
                {/* রিসিট হেডার লোগো ফ্রেম (scale-[2.35]) */}
                <div className="flex flex-row items-center border-b-2 pb-3 mb-4 border-cyan-800 gap-3">
                  <div className="w-20 h-20 bg-white rounded-xl border border-cyan-800/30 flex items-center justify-center overflow-hidden shrink-0 p-1">
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-contain transform scale-[2.35] filter contrast-125" style={{ filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.15)) contrast(1.2)' }} />
                  </div>
                  <div className="text-center flex-1">
                    <h3 className="text-2xl font-black text-cyan-900 tracking-wide uppercase">AKIB MATH</h3>
                    <p className="text-xs font-bold text-cyan-700 uppercase tracking-wider">ACADEMIC & ADMISSION CARE</p>
                    <p className="text-[10px] text-gray-500 font-medium">Malopara, Mohila College Road, Kadirganj, Rajshahi</p>
                    <p className="text-[10px] text-slate-700 font-mono mt-0.5">
                      Contact: <strong className="text-cyan-950 text-xs">01602501062</strong>, <strong className="text-cyan-950 text-xs">01784292677</strong>
                    </p>
                  </div>
                </div>

                <div className="mt-2 text-center mb-4">
                  <div className="inline-block bg-slate-900 text-white font-black px-5 py-0.5 rounded tracking-widest text-xs">
                    MONEY RECEIPT / SLIP #{currentSlipNo}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-y-2 text-xs mb-4">
                  <p><strong>Roll No:</strong> {formData.rollNo || 'N/A'}</p>
                  <p className="text-right"><strong>Receipt No:</strong> {receiptNo}</p>
                  <p><strong>Batch Name:</strong> {formData.batchName || 'N/A'}</p>
                  <p className="text-right"><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                  <p><strong>Class Day:</strong> {formData.classDays}</p>
                  <p className="text-right"><strong>Batch Time:</strong> {formData.batchTime || 'N/A'}</p>
                </div>
                
                <hr className="border-gray-300 my-2" />
                
                <div className="space-y-2 text-xs mb-4">
                  <p><strong className="inline-block w-36">Student Name:</strong> <span className="uppercase font-bold text-cyan-950">{formData.studentNameEn}</span></p>
                  <p><strong className="inline-block w-36">Contact No:</strong> {formData.studentPhone}</p>
                  <p><strong className="inline-block w-36">Batch / Year:</strong> <span className="font-bold text-cyan-900 tracking-wide uppercase">{formData.batchCategory}</span></p>
                </div>
                
                <hr className="border-gray-300 my-2" />
                
                <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1.5 text-xs font-medium">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Course Fee (মোট কোর্স ফি):</span>
                    <span>{Number(formData.totalCourseFee).toLocaleString()} TK</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Previously Paid (পূর্বে মোট জমা):</span>
                    <span>{Number(formData.previousPaid).toLocaleString()} TK</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold border-b pb-1">
                    <span>Amount Paid Now (আজকে জমা):</span>
                    <span>{Number(formData.admissionFeePaid).toLocaleString()} TK</span>
                  </div>
                  <div className="flex justify-between text-red-700 font-black text-sm pt-0.5">
                    <span>Current Due Amount (বর্তমান মোট বকেয়া):</span>
                    <span className="underline">
                      {(Number(formData.totalCourseFee) - Number(formData.previousPaid) - Number(formData.admissionFeePaid)) <= 0 ? 
                        "0.00 TK (PAID)" : 
                        `${(Number(formData.totalCourseFee) - Number(formData.previousPaid) - Number(formData.admissionFeePaid)).toLocaleString()} TK`
                      }
                    </span>
                  </div>
                </div>

                <div className="mt-12 flex justify-between text-[11px] text-gray-500 pt-4 border-t border-gray-200 font-semibold">
                  <p className="italic">Slip #{currentSlipNo} | Generated Digitally</p>
                  <p className="border-t-2 border-black px-6 pt-1 text-gray-800">Authority Signature</p>
                </div>
              </div>
            </div>
          </div>

          {/* ভর্তি ফরম প্রিভিউ */}
          <div className="w-full bg-white p-2 rounded-xl shadow-md border">
            <h2 className="text-sm font-bold text-cyan-950 px-4 py-2 border-b">ভর্তি ফরম প্রিভিউ (Admission Form Preview)</h2>
            <div className="p-4" ref={fullFormRef}>
              {renderFormContent(true)}
            </div>
          </div>
          
          {/* অ্যাকশন প্যানেল */}
          <div className="flex flex-wrap gap-4 justify-center w-full bg-white p-4 rounded-xl shadow border no-print">
            <button onClick={handlePrintReceipt} className="bg-cyan-800 text-white px-5 py-2.5 rounded-lg font-bold shadow hover:bg-cyan-900 transition text-sm">
              🖨️ Print Receipt
            </button>
            <button onClick={handlePrintFullForm} className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold shadow hover:bg-indigo-700 transition text-sm">
              📝 Print Admission Form
            </button>
            <button onClick={() => {
              setFormData({
                rollNo: '', batchName: '', batchTime: '', classDays: 'Sat-Mon-Wed',
                studentNameEn: '', studentNameBn: '', fathersName: '', fathersProfession: '',
                mothersName: '', mothersProfession: '', address: '', schoolName: '',
                collegeName: '', guardianPhone: '', studentPhone: '', batchCategory: 'HSC 1st Year', 
                sscBoard: 'Rajshahi', sscYear: '', sscGpa: '', hscBoard: 'Rajshahi', hscYear: '', hscGpa: '', 
                paymentType: 'New Admission', totalCourseFee: '14000', previousPaid: 0, admissionFeePaid: ''
              });
              setSearchRoll('');
              setShowReceipt(false);
            }} className="bg-slate-500 text-white px-5 py-2.5 rounded-lg font-bold shadow hover:bg-slate-600 transition text-sm">
              🔄 Clear / New Admission
            </button>
          </div>
        </div>
      )}
    </div>
  );
}