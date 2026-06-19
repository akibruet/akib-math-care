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
    
    // Academic Table
    examName: 'SSC',
    examBoard: 'Rajshahi',
    examYear: '',
    examGpa: '',
    
    amount: ''
  });
  
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptNo, setReceiptNo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // দুটি আলাদা প্রিন্টের জন্য দুটি আলাদা রিফ
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

  // মানি রিসিট প্রিন্ট ফাংশন
  const handlePrintReceipt = useReactToPrint({
    contentRef: receiptRef,
  });

  // পুরো ভর্তি ফরম প্রিন্ট ফাংশন
  const handlePrintFullForm = useReactToPrint({
    contentRef: fullFormRef,
  });

  // ফর্মের মূল ডিজাইন (যা ইনপুট পেজে এবং প্রিন্ট প্রিভিউ পেজে দুটিতেই ব্যবহার হবে)
  const renderFormContent = (isReadOnly = false) => (
    <div className="bg-[#e2f1f5] p-6 md:p-8 rounded-xl border-2 border-cyan-800 w-full text-slate-800 text-xs">
      {/* Header Copy with New Name */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b-2 border-cyan-800 pb-4 mb-6">
        <div className="bg-cyan-900 text-white p-3 font-bold text-center rounded-lg text-xs tracking-wider w-24 h-24 flex items-center justify-center border border-cyan-950">
          AKIB<br/>MATH<br/>CARE
        </div>
        <div className="text-center flex-1 my-2 md:my-0 px-2">
          <h1 className="text-3xl font-black text-cyan-950 tracking-wide uppercase">AKIB MATH ACADEMIC AND ADMISSION CARE</h1>
          <p className="text-xs bg-cyan-950 text-white inline-block px-4 py-0.5 rounded-full font-semibold mt-1">
            Director: Md. Akibul Hasan (Akib) <span className="text-[10px] opacity-80">(CSE, RUET)</span>
          </p>
          <p className="text-[11px] text-cyan-900 font-bold mt-2">Malopara, Mohila College Road, Kadirganj, Rajshahi</p>
          <p className="text-[10px] text-slate-600 font-mono">Contact Us: 01837192604, 01784292677</p>
        </div>
        <div className="w-24 h-28 border-2 border-dashed border-cyan-800 bg-white/50 flex items-center justify-center text-center text-[10px] text-gray-400 p-2 rounded">
          Attach Photo Here
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Top Batch & Roll Info */}
        <div className="grid grid-cols-4 gap-3 bg-cyan-900/10 p-3 rounded-lg border border-cyan-800/20">
          <div>
            <label className="block font-bold mb-1">Roll No</label>
            <input name="rollNo" disabled={isReadOnly} value={formData.rollNo} onChange={handleChange} placeholder="e.g. 101" className="w-full p-2 border bg-white rounded focus:outline-none" />
          </div>
          <div>
            <label className="block font-bold mb-1">Batch Name</label>
            <input name="batchName" disabled={isReadOnly} value={formData.batchName} onChange={handleChange} placeholder="e.g. Alpha" className="w-full p-2 border bg-white rounded focus:outline-none" />
          </div>
          <div>
            <label className="block font-bold mb-1">Batch Time</label>
            <input name="batchTime" disabled={isReadOnly} value={formData.batchTime} onChange={handleChange} placeholder="e.g. 09:00 AM" className="w-full p-2 border bg-white rounded focus:outline-none" />
          </div>
          <div>
            <label className="block font-bold mb-1">Class Day</label>
            <select name="classDays" disabled={isReadOnly} value={formData.classDays} onChange={handleChange} className="w-full p-2 border bg-white rounded focus:outline-none">
              <option value="Sat-Mon-Wed">Sat, Mon, Wed</option>
              <option value="Sun-Tue-Thu">Sun, Tue, Thu</option>
            </select>
          </div>
        </div>

        {/* Core Form Fields */}
        <div className="space-y-3 bg-white p-4 rounded-lg shadow-inner border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-cyan-950 mb-0.5">Student Name (English Block Letter) *</label>
              <input name="studentNameEn" disabled={isReadOnly} value={formData.studentNameEn} onChange={handleChange} placeholder="MD. AKIBUL HASAN" className="w-full p-2 border rounded uppercase focus:outline-none" />
            </div>
            <div>
              <label className="block font-bold text-cyan-950 mb-0.5">ছাত্র/ছাত্রীর নাম (বাংলায়)</label>
              <input name="studentNameBn" disabled={isReadOnly} value={formData.studentNameBn} onChange={handleChange} placeholder="মোঃ আকিবুল হাসান" className="w-full p-2 border rounded focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block font-bold mb-0.5">Father's Name</label>
                <input name="fathersName" disabled={isReadOnly} value={formData.fathersName} onChange={handleChange} placeholder="Father's Name" className="w-full p-2 border rounded focus:outline-none" />
              </div>
              <div>
                <label className="block font-bold mb-0.5">Profession</label>
                <input name="fathersProfession" disabled={isReadOnly} value={formData.fathersProfession} onChange={handleChange} placeholder="Profession" className="w-full p-2 border rounded focus:outline-none" />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block font-bold mb-0.5">Mother's Name</label>
                <input name="mothersName" disabled={isReadOnly} value={formData.mothersName} onChange={handleChange} placeholder="Mother's Name" className="w-full p-2 border rounded focus:outline-none" />
              </div>
              <div>
                <label className="block font-bold mb-0.5">Profession</label>
                <input name="mothersProfession" disabled={isReadOnly} value={formData.mothersProfession} onChange={handleChange} placeholder="Profession" className="w-full p-2 border rounded focus:outline-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold mb-0.5">Address (ঠিকানা)</label>
            <input name="address" disabled={isReadOnly} value={formData.address} onChange={handleChange} placeholder="Vill, Post, Thana, District" className="w-full p-2 border rounded focus:outline-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block font-bold mb-0.5">Name Of School</label>
              <input name="schoolName" disabled={isReadOnly} value={formData.schoolName} onChange={handleChange} placeholder="Enter school name" className="w-full p-2 border rounded focus:outline-none" />
            </div>
            <div>
              <label className="block font-bold mb-0.5">Blood Group</label>
              <select name="bloodGroup" disabled={isReadOnly} value={formData.bloodGroup} onChange={handleChange} className="w-full p-2 border rounded focus:outline-none">
                <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-cyan-950 mb-0.5">Name Of College</label>
              <input name="collegeName" disabled={isReadOnly} value={formData.collegeName} onChange={handleChange} placeholder="Enter college name" className="w-full p-2 border rounded focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold mb-0.5">Contact No (Guardian)</label>
                <input name="guardianPhone" disabled={isReadOnly} value={formData.guardianPhone} onChange={handleChange} placeholder="01XXXXXXXXX" className="w-full p-2 border rounded focus:outline-none" />
              </div>
              <div>
                <label className="block font-bold mb-0.5">Contact No (Student) *</label>
                <input name="studentPhone" disabled={isReadOnly} value={formData.studentPhone} onChange={handleChange} placeholder="01XXXXXXXXX" className="w-full p-2 border rounded focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block font-bold mb-0.5 text-cyan-950">Batch (কোর্স ব্যাচ)</label>
              <select name="batchCategory" disabled={isReadOnly} value={formData.batchCategory} onChange={handleChange} className="w-full p-2 border bg-cyan-50/50 rounded font-semibold focus:outline-none">
                <option>HSC 1st Year</option>
                <option>HSC 2nd Year</option>
                <option>HSC Final Preparation</option>
                <option>Admission</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-0.5 text-cyan-950">Admission/Monthly Fee (BDT) *</label>
              <input type="number" name="amount" disabled={isReadOnly} value={formData.amount} onChange={handleChange} placeholder="Amount in TK" className="w-full p-2 border bg-cyan-50/50 rounded font-bold text-sm focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Academic Info Table */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h3 className="font-bold text-cyan-950 mb-2 uppercase border-b pb-1">Academic Records</h3>
          <div className="overflow-x-auto">
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
                  <td className="p-1 border border-slate-300">
                    <select name="examName" disabled={isReadOnly} value={formData.examName} onChange={handleChange} className="w-full p-1 focus:outline-none"><option>SSC</option><option>JSC</option></select>
                  </td>
                  <td className="p-1 border border-slate-300">
                    <select name="examBoard" disabled={isReadOnly} value={formData.examBoard} onChange={handleChange} className="w-full p-1 focus:outline-none">
                      <option>Rajshahi</option><option>Dhaka</option><option>Dinajpur</option><option>Jashore</option>
                    </select>
                  </td>
                  <td className="p-1 border border-slate-300">
                    <input name="examYear" disabled={isReadOnly} value={formData.examYear} onChange={handleChange} placeholder="e.g. 2024" className="w-full p-1 focus:outline-none" />
                  </td>
                  <td className="p-1 border border-slate-300">
                    <input name="examGpa" disabled={isReadOnly} value={formData.examGpa} onChange={handleChange} placeholder="e.g. 5.00" className="w-full p-1 focus:outline-none" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Promising Lines & Signatures */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 text-justify space-y-4">
          <p className="italic text-slate-700 leading-relaxed">
            I am <span className="font-bold underline uppercase">{formData.studentNameEn || '...........................................'}</span> hereby promising that I must follow the rules & regulations of <span className="font-bold text-cyan-900">"AKIB MATH ACADEMIC AND ADMISSION CARE"</span> and willing to be bound to obey any decision of the authority.
          </p>
          
          <div className="grid grid-cols-3 gap-4 pt-6 text-center text-[11px] font-bold text-slate-600">
            <div className="border-t border-dashed border-slate-400 pt-1">Signature Of Student</div>
            <div className="border-t border-dashed border-slate-400 pt-1">Signature Of Guardian</div>
            <div className="border-t border-dashed border-slate-400 pt-1">Signature Of Authority</div>
          </div>
        </div>

        <p className="text-center font-bold text-xs text-red-700 uppercase tracking-wider">Admission cannot be cancelled any way</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6 flex flex-col items-center font-sans text-slate-800">
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
        /* সফল স্ক্রিন: রিসিট এবং ফর্ম দুটোই বড় আকারে থাকবে এবং আলাদা প্রিন্ট করা যাবে */
        <div className="flex flex-col items-center w-full max-w-3xl space-y-8">
          
          {/* ১. আপডেটেড বড় মানি রিসিট (উইডথ এখন ফুল ৩রা সাইজ কভার করবে) */}
          <div className="w-full bg-white p-2 rounded-xl shadow-md border">
            <h2 className="text-sm font-bold text-cyan-950 px-4 py-2 border-b">রশিদ প্রিভিউ (Money Receipt Preview)</h2>
            <div className="p-4 flex justify-center">
              <div ref={receiptRef} className="bg-white p-8 w-full border-2 border-dashed border-gray-400 text-sm font-sans">
                <div className="text-center border-b-2 pb-3 mb-6">
                  <h3 className="text-2xl font-black text-cyan-900 tracking-wide uppercase">AKIB MATH ACADEMIC & ADMISSION CARE</h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">Malopara, Mohila College Road, Kadirganj, Rajshahi</p>
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

          {/* ২. ভর্তি ফরম প্রিভিউ প্যানেল (যা প্রিন্ট করা যাবে) */}
          <div className="w-full bg-white p-2 rounded-xl shadow-md border">
            <h2 className="text-sm font-bold text-cyan-950 px-4 py-2 border-b">ভর্তি ফরম প্রিভিউ (Admission Form Preview)</h2>
            <div className="p-4" ref={fullFormRef}>
              {renderFormContent(true)}
            </div>
          </div>
          
          {/* অ্যাকশন বাটন কন্ট্রোল প্যানেল */}
          <div className="flex flex-wrap gap-4 justify-center w-full bg-white p-4 rounded-xl shadow border">
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