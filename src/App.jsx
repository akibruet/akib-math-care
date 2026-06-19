import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { db } from './firebase'; 
import { collection, addDoc } from 'firebase/firestore';

export default function App() {
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
    bloodGroup: 'A+',
    guardianPhone: '',
    studentPhone: '',
    batchCategory: 'HSC 1st Year',
    examName: 'SSC',
    examBoard: 'Rajshahi',
    examYear: '',
    examGpa: '',
    amount: ''
  });
  
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptNo, setReceiptNo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const receiptRef = useRef();
  const fullFormRef = useRef();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.studentNameEn || !formData.studentPhone || !formData.amount) {
      alert("অনুগ্রহ করে শিক্ষার্থীর নাম (English), মোবাইল নাম্বার এবং টাকার পরিমাণ অবশ্যই লিখুন!");
      return;
    }

    setIsSubmitting(true);
    try {
      const generatedReceiptNo = 'AMAAC-' + Math.floor(100000 + Math.random() * 900000);
      setReceiptNo(generatedReceiptNo);

      await addDoc(collection(db, "students"), {
        ...formData,
        receiptNo: generatedReceiptNo,
        date: new Date().toLocaleDateString(),
        createdAt: new Date()
      });

      setIsSubmitting(false);
      setShowReceipt(true);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("ডাটাবেজে সেভ করতে সমস্যা হয়েছে!");
      setIsSubmitting(false);
    }
  };

  const handlePrintReceipt = useReactToPrint({ contentRef: receiptRef });
  const handlePrintFullForm = useReactToPrint({ contentRef: fullFormRef });

  // একক পেজে ফিট করার জন্য ডিজাইনটিকে আরও নিখুঁত করা হয়েছে
  const renderFormContent = (isReadOnly = false) => (
    <div className="bg-[#e2f1f5] p-4 rounded-xl border-2 border-cyan-800 w-full text-slate-800 text-xs print-exact print-page-break" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact', pageBreakInside: 'avoid' }}>
      
      {/* Header Panel with New Bold Contacts */}
      <div className="flex flex-row justify-between items-center border-b-2 border-cyan-800 pb-2 mb-3">
        <div className="bg-cyan-900 text-white p-2 font-bold text-center rounded-lg text-[11px] tracking-wider w-20 h-20 flex items-center justify-center border border-cyan-950 shrink-0">
          AKIB<br/>MATH<br/>CARE
        </div>
        <div className="text-center flex-1 px-4">
          <h1 className="text-3xl font-black text-cyan-950 tracking-wider uppercase leading-none">AKIB MATH</h1>
          <p className="text-xs font-bold text-cyan-800 tracking-wide uppercase mt-1">ACADEMIC AND ADMISSION CARE</p>
          <p className="text-[10px] bg-cyan-950 text-white inline-block px-3 py-0.5 rounded-full font-semibold mt-1">
            Director: Md. Akibul Hasan (Akib) <span className="text-[8px] opacity-80">(CSE, RUET)</span>
          </p>
          <p className="text-[10px] text-cyan-900 font-bold mt-1">Malopara, Mohila College Road, Kadirganj, Rajshahi</p>
          <p className="text-[10px] text-slate-700 font-mono mt-0.5">
            Contact Us: <strong className="text-cyan-950 text-xs">01602501062</strong>, <strong className="text-cyan-950 text-xs">01784292677</strong>
          </p>
        </div>
        <div className="w-20 h-24 border-2 border-dashed border-cyan-800 bg-white/70 flex items-center justify-center text-center text-[9px] text-gray-400 p-2 rounded shrink-0">
          Attach Photo Here
        </div>
      </div>
      
      <div className="space-y-2.5">
        {/* Top Info Grid */}
        <div className="grid grid-cols-4 gap-2 bg-cyan-900/10 p-2 rounded-lg border border-cyan-800/20 text-[11px]">
          <div>
            <label className="block font-bold mb-0.5 text-cyan-950">Roll No</label>
            {isReadOnly ? <div className="p-1.5 bg-white rounded border border-slate-300 min-h-[28px] font-bold">{formData.rollNo}</div> : 
            <input name="rollNo" value={formData.rollNo} onChange={handleChange} placeholder="e.g. 101" className="w-full p-1.5 border bg-white rounded focus:outline-none" />}
          </div>
          <div>
            <label className="block font-bold mb-0.5 text-cyan-950">Batch Name</label>
            {isReadOnly ? <div className="p-1.5 bg-white rounded border border-slate-300 min-h-[28px] font-bold">{formData.batchName}</div> : 
            <input name="batchName" value={formData.batchName} onChange={handleChange} placeholder="e.g. Alpha" className="w-full p-1.5 border bg-white rounded focus:outline-none" />}
          </div>
          <div>
            <label className="block font-bold mb-0.5 text-cyan-950">Batch Time</label>
            {isReadOnly ? <div className="p-1.5 bg-white rounded border border-slate-300 min-h-[28px] font-bold">{formData.batchTime}</div> : 
            <input name="batchTime" value={formData.batchTime} onChange={handleChange} placeholder="e.g. 09:00 AM" className="w-full p-1.5 border bg-white rounded focus:outline-none" />}
          </div>
          <div>
            <label className="block font-bold mb-0.5 text-cyan-950">Class Day</label>
            {isReadOnly ? <div className="p-1.5 bg-white rounded border border-slate-300 min-h-[28px] font-bold">{formData.classDays}</div> : 
            <select name="classDays" value={formData.classDays} onChange={handleChange} className="w-full p-1.5 border bg-white rounded focus:outline-none text-xs">
              <option value="Sat-Mon-Wed">Sat, Mon, Wed</option>
              <option value="Sun-Tue-Thu">Sun, Tue, Thu</option>
            </select>}
          </div>
        </div>

        {/* Main Information Fields */}
        <div className="space-y-2 bg-white p-3 rounded-lg border border-slate-200 text-[11px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-cyan-950 mb-0.5">Student Name (English Block Letter) *</label>
              {isReadOnly ? <div className="p-1.5 bg-slate-50 border rounded uppercase font-bold min-h-[28px]">{formData.studentNameEn}</div> :
              <input name="studentNameEn" required value={formData.studentNameEn} onChange={handleChange} placeholder="MD. AKIBUL HASAN" className="w-full p-1.5 border rounded uppercase focus:outline-none" />}
            </div>
            <div>
              <label className="block font-bold text-cyan-950 mb-0.5">ছাত্র/ছাত্রীর নাম (বাংলায়)</label>
              {isReadOnly ? <div className="p-1.5 bg-slate-50 border rounded font-bold min-h-[28px]">{formData.studentNameBn}</div> :
              <input name="studentNameBn" value={formData.studentNameBn} onChange={handleChange} placeholder="মোঃ আকিবুল হাসান" className="w-full p-1.5 border rounded focus:outline-none" />}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block font-bold text-cyan-950 mb-0.5">Father's Name</label>
                {isReadOnly ? <div className="p-1.5 bg-slate-50 border rounded min-h-[28px]">{formData.fathersName}</div> :
                <input name="fathersName" value={formData.fathersName} onChange={handleChange} placeholder="Father's Name" className="w-full p-1.5 border rounded focus:outline-none" />}
              </div>
              <div>
                <label className="block font-bold text-cyan-950 mb-0.5">Profession</label>
                {isReadOnly ? <div className="p-1.5 bg-slate-50 border rounded min-h-[28px]">{formData.fathersProfession}</div> :
                <input name="fathersProfession" value={formData.fathersProfession} onChange={handleChange} placeholder="Profession" className="w-full p-1.5 border rounded focus:outline-none" />}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block font-bold text-cyan-950 mb-0.5">Mother's Name</label>
                {isReadOnly ? <div className="p-1.5 bg-slate-50 border rounded min-h-[28px]">{formData.mothersName}</div> :
                <input name="mothersName" value={formData.mothersName} onChange={handleChange} placeholder="Mother's Name" className="w-full p-1.5 border rounded focus:outline-none" />}
              </div>
              <div>
                <label className="block font-bold text-cyan-950 mb-0.5">Profession</label>
                {isReadOnly ? <div className="p-1.5 bg-slate-50 border rounded min-h-[28px]">{formData.mothersProfession}</div> :
                <input name="mothersProfession" value={formData.mothersProfession} onChange={handleChange} placeholder="Profession" className="w-full p-1.5 border rounded focus:outline-none" />}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-cyan-950 mb-0.5">Address (ঠিকানা)</label>
            {isReadOnly ? <div className="p-1.5 bg-slate-50 border rounded min-h-[28px]">{formData.address}</div> :
            <input name="address" value={formData.address} onChange={handleChange} placeholder="Vill, Post, Thana, District" className="w-full p-1.5 border rounded focus:outline-none" />}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block font-bold text-cyan-950 mb-0.5">Name Of School</label>
              {isReadOnly ? <div className="p-1.5 bg-slate-50 border rounded min-h-[28px]">{formData.schoolName}</div> :
              <input name="schoolName" value={formData.schoolName} onChange={handleChange} placeholder="Enter school name" className="w-full p-1.5 border rounded focus:outline-none" />}
            </div>
            <div>
              <label className="block font-bold text-cyan-950 mb-0.5">Blood Group</label>
              {isReadOnly ? <div className="p-1.5 bg-slate-50 border rounded min-h-[28px] font-bold text-center">{formData.bloodGroup}</div> :
              <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full p-1.5 border rounded focus:outline-none text-xs">
                <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
              </select>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-cyan-950 mb-0.5">Name Of College</label>
              {isReadOnly ? <div className="p-1.5 bg-slate-50 border rounded min-h-[28px]">{formData.collegeName}</div> :
              <input name="collegeName" value={formData.collegeName} onChange={handleChange} placeholder="Enter college name" className="w-full p-1.5 border rounded focus:outline-none" />}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-cyan-950 mb-0.5">Contact No (Guardian)</label>
                {isReadOnly ? <div className="p-1.5 bg-slate-50 border rounded min-h-[28px]">{formData.guardianPhone}</div> :
                <input name="guardianPhone" value={formData.guardianPhone} onChange={handleChange} placeholder="01XXXXXXXXX" className="w-full p-1.5 border rounded focus:outline-none" />}
              </div>
              <div>
                <label className="block font-bold text-cyan-950 mb-0.5">Contact No (Student) *</label>
                {isReadOnly ? <div className="p-1.5 bg-slate-50 border rounded min-h-[28px] font-bold">{formData.studentPhone}</div> :
                <input name="studentPhone" required value={formData.studentPhone} onChange={handleChange} placeholder="01XXXXXXXXX" className="w-full p-1.5 border rounded focus:outline-none" />}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block font-bold mb-0.5 text-cyan-950">Batch (কোর্স ব্যাচ)</label>
              {isReadOnly ? <div className="p-1.5 bg-cyan-50/50 border border-cyan-200 rounded font-bold min-h-[28px]">{formData.batchCategory}</div> :
              <select name="batchCategory" value={formData.batchCategory} onChange={handleChange} className="w-full p-1.5 border bg-cyan-50/50 rounded font-semibold focus:outline-none text-xs">
                <option>HSC 1st Year</option>
                <option>HSC 2nd Year</option>
                <option>HSC Final Preparation</option>
                <option>Admission</option>
              </select>}
            </div>
            <div>
              <label className="block font-bold mb-0.5 text-cyan-950">Admission/Monthly Fee (BDT) *</label>
              {isReadOnly ? <div className="p-1.5 bg-cyan-50/50 border border-cyan-200 rounded font-black min-h-[28px]">{formData.amount} TK</div> :
              <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount in TK" className="w-full p-1.5 border bg-cyan-50/50 rounded font-bold focus:outline-none" />}
            </div>
          </div>
        </div>

        {/* Academic Records Table */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 text-[11px]">
          <h3 className="font-bold text-cyan-950 mb-1 uppercase border-b pb-0.5">Academic Records</h3>
          <table className="w-full text-left border-collapse border border-slate-300">
            <thead>
              <tr className="bg-cyan-950 text-white" style={{ backgroundColor: '#083344 !important', color: '#ffffff !important' }}>
                <th className="p-1.5 border border-slate-300">Examination</th>
                <th className="p-1.5 border border-slate-300">Board</th>
                <th className="p-1.5 border border-slate-300">Passing Year</th>
                <th className="p-1.5 border border-slate-300">G.P.A</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-1.5 border border-slate-300 font-medium">
                  {isReadOnly ? formData.examName : <select name="examName" value={formData.examName} onChange={handleChange} className="w-full focus:outline-none"><option>SSC</option><option>JSC</option></select>}
                </td>
                <td className="p-1.5 border border-slate-300 font-medium">
                  {isReadOnly ? formData.examBoard : <select name="examBoard" value={formData.examBoard} onChange={handleChange} className="w-full focus:outline-none"><option>Rajshahi</option><option>Dhaka</option><option>Dinajpur</option><option>Jashore</option></select>}
                </td>
                <td className="p-1.5 border border-slate-300 font-bold">
                  {isReadOnly ? formData.examYear : <input name="examYear" value={formData.examYear} onChange={handleChange} placeholder="e.g. 2024" className="w-full focus:outline-none" />}
                </td>
                <td className="p-1.5 border border-slate-300 font-bold text-cyan-900">
                  {isReadOnly ? formData.examGpa : <input name="examGpa" value={formData.examGpa} onChange={handleChange} placeholder="e.g. 5.00" className="w-full focus:outline-none" />}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Declaration & Signatures */}
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
      
      {/* গ্লোবাল প্রিন্ট মার্জিন এবং ফিক্সিং স্টাইলব্লক */}
      <style>{`
        @media print {
          .print-exact {
            background-color: #e2f1f5 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-page-break {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          body { background: white; }
          .no-print { display: none; }
          @page {
            size: A4;
            margin: 0.25in;
          }
        }
      `}</style>

      {!showReceipt ? (
        <div className="w-full max-w-3xl rounded-xl shadow-2xl">
          {renderFormContent(false)}
          <div className="bg-[#e2f1f5] px-6 pb-6 md:px-8 md:pb-8 rounded-b-xl">
            <button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="w-full bg-cyan-900 text-white py-3 rounded-lg font-bold text-base hover:bg-cyan-950 transition shadow-lg disabled:bg-gray-400"
            >
              {isSubmitting ? "Saving Form Data to Database..." : "Submit Form & Generate Receipt"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full max-w-3xl space-y-6">
          
          {/* ১. মানি রশিদ */}
          <div className="w-full bg-white p-2 rounded-xl shadow-md border">
            <h2 className="text-sm font-bold text-cyan-950 px-4 py-2 border-b">রশিদ প্রিভিউ (Money Receipt Preview)</h2>
            <div className="p-4 flex justify-center">
              <div ref={receiptRef} className="bg-white p-8 w-full border-2 border-dashed border-gray-400 text-sm font-sans">
                <div className="text-center border-b-2 pb-3 mb-6 border-cyan-800">
                  <h3 className="text-2xl font-black text-cyan-900 tracking-wide uppercase">AKIB MATH</h3>
                  <p className="text-xs font-bold text-cyan-700 uppercase tracking-wider">ACADEMIC & ADMISSION CARE</p>
                  <p className="text-[11px] text-gray-500 font-medium mt-1">Malopara, Mohila College Road, Kadirganj, Rajshahi</p>
                  <div className="mt-3 inline-block bg-slate-100 text-cyan-950 font-bold px-6 py-1 rounded border tracking-widest text-sm">
                    MONEY RECEIPT (টাকা প্রাপ্তির রশিদ)
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-xs mb-6">
                  <p><strong>Roll No:</strong> {formData.rollNo || 'N/A'}</p>
                  <p className="text-right"><strong>Receipt No:</strong> {receiptNo}</p>
                  <p><strong>Batch Name:</strong> {formData.batchName || 'N/A'} ({formData.batchTime || 'N/A'})</p>
                  <p className="text-right"><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                  <p className="col-span-2"><strong>Class Day:</strong> {formData.classDays}</p>
                </div>
                
                <hr className="border-gray-300 my-3" />
                
                <div className="space-y-3 text-xs">
                  <p><strong className="inline-block w-36">Student Name:</strong> <span className="uppercase font-bold text-cyan-950">{formData.studentNameEn}</span></p>
                  <p><strong className="inline-block w-36">College Name:</strong> {formData.collegeName || 'N/A'}</p>
                  <p><strong className="inline-block w-36">Contact No:</strong> {formData.studentPhone}</p>
                  <p><strong className="inline-block w-36">Course Category:</strong> <span className="font-semibold">{formData.batchCategory}</span></p>
                </div>
                
                <hr className="border-gray-300 my-4" />
                
                <div className="flex justify-between font-bold text-base bg-slate-100 p-3 rounded border border-slate-200">
                  <span>Total Paid Amount (মোট প্রাপ্ত টাকা):</span>
                  <span className="text-cyan-950 text-lg">{formData.amount} TK</span>
                </div>

                <div className="mt-14 flex justify-between text-[11px] text-gray-500 pt-4 border-t border-gray-200 font-semibold">
                  <p className="italic">Generated Digitally</p>
                  <p className="border-t-2 border-black px-6 pt-1 text-gray-800">Authority Signature</p>
                </div>
              </div>
            </div>
          </div>

          {/* ২. ১ পেজে অপ্টিমাইজড ভর্তি ফরম */}
          <div className="w-full bg-white p-2 rounded-xl shadow-md border">
            <h2 className="text-sm font-bold text-cyan-950 px-4 py-2 border-b">ভর্তি ফরম প্রিভিউ (Admission Form Preview)</h2>
            <div className="p-4" ref={fullFormRef}>
              {renderFormContent(true)}
            </div>
          </div>
          
          {/* বাটন প্যানেল */}
          <div className="flex flex-wrap gap-4 justify-center w-full bg-white p-4 rounded-xl shadow border no-print">
            <button onClick={handlePrintReceipt} className="bg-cyan-800 text-white px-5 py-2.5 rounded-lg font-bold shadow hover:bg-cyan-900 transition text-sm">
              🖨️ Print Money Receipt
            </button>
            <button onClick={handlePrintFullForm} className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold shadow hover:bg-indigo-700 transition text-sm">
              📝 Print Admission Form
            </button>
            <button onClick={() => {
              setFormData({
                rollNo: '', batchName: '', batchTime: '', classDays: 'Sat-Mon-Wed',
                studentNameEn: '', studentNameBn: '', fathersName: '', fathersProfession: '',
                mothersName: '', mothersProfession: '', address: '', schoolName: '',
                collegeName: '', bloodGroup: 'A+', guardianPhone: '', studentPhone: '',
                batchCategory: 'HSC 1st Year', examName: 'SSC', examBoard: 'Rajshahi',
                examYear: '', examGpa: '', amount: ''
              });
              setShowReceipt(false);
            }} className="bg-slate-500 text-white px-5 py-2.5 rounded-lg font-bold shadow hover:bg-slate-600 transition text-sm">
              🔄 New Admission
            </button>
          </div>
        </div>
      )}
    </div>
  );
}