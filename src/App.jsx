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
  const receiptRef = useRef();

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

      // Firestore-এ নতুন নামসহ ডাটা সেভ হচ্ছে
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

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
  });

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6 flex flex-col items-center font-sans text-slate-800">
      {!showReceipt ? (
        <div className="bg-[#e2f1f5] p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-3xl border-2 border-cyan-800">
          
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-cyan-900/10 p-3 rounded-lg border border-cyan-800/20 text-xs">
              <div>
                <label className="block font-bold mb-1">Roll No</label>
                <input name="rollNo" placeholder="e.g. 101" onChange={handleChange} className="w-full p-2 border bg-white rounded focus:outline-none focus:ring-1 focus:ring-cyan-800" />
              </div>
              <div>
                <label className="block font-bold mb-1">Batch Name</label>
                <input name="batchName" placeholder="e.g. Alpha" onChange={handleChange} className="w-full p-2 border bg-white rounded focus:outline-none focus:ring-1 focus:ring-cyan-800" />
              </div>
              <div>
                <label className="block font-bold mb-1">Batch Time</label>
                <input name="batchTime" placeholder="e.g. 09:00 AM" onChange={handleChange} className="w-full p-2 border bg-white rounded focus:outline-none focus:ring-1 focus:ring-cyan-800" />
              </div>
              <div>
                <label className="block font-bold mb-1">Class Day</label>
                <select name="classDays" onChange={handleChange} className="w-full p-2 border bg-white rounded focus:outline-none focus:ring-1 focus:ring-cyan-800">
                  <option value="Sat-Mon-Wed">Sat, Mon, Wed</option>
                  <option value="Sun-Tue-Thu">Sun, Tue, Thu</option>
                </select>
              </div>
            </div>

            {/* Core Form Fields */}
            <div className="space-y-3 bg-white p-4 rounded-lg shadow-inner border border-slate-200 text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-cyan-950 mb-0.5">Student Name (English Block Letter) *</label>
                  <input name="studentNameEn" required placeholder="MD. AKIBUL HASAN" onChange={handleChange} className="w-full p-2 border rounded uppercase focus:outline-none focus:border-cyan-800" />
                </div>
                <div>
                  <label className="block font-bold text-cyan-950 mb-0.5">ছাত্র/ছাত্রীর নাম (বাংলায়)</label>
                  <input name="studentNameBn" placeholder="মোঃ আকিবুল হাসান" onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:border-cyan-800" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block font-bold mb-0.5">Father's Name</label>
                    <input name="fathersName" placeholder="Father's Name" onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:border-cyan-800" />
                  </div>
                  <div>
                    <label className="block font-bold mb-0.5">Profession</label>
                    <input name="fathersProfession" placeholder="Profession" onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:border-cyan-800" />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block font-bold mb-0.5">Mother's Name</label>
                    <input name="mothersName" placeholder="Mother's Name" onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:border-cyan-800" />
                  </div>
                  <div>
                    <label className="block font-bold mb-0.5">Profession</label>
                    <input name="mothersProfession" placeholder="Profession" onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:border-cyan-800" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-0.5">Address (ঠিকানা)</label>
                <input name="address" placeholder="Vill, Post, Thana, District" onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:border-cyan-800" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block font-bold mb-0.5">Name Of School</label>
                  <input name="schoolName" placeholder="Enter school name" onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:border-cyan-800" />
                </div>
                <div>
                  <label className="block font-bold mb-0.5">Blood Group</label>
                  <select name="bloodGroup" onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:border-cyan-800">
                    <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                    <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-cyan-950 mb-0.5">Name Of College</label>
                  <input name="collegeName" placeholder="Enter college name" onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:border-cyan-800" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold mb-0.5">Contact No (Guardian)</label>
                    <input name="guardianPhone" placeholder="01XXXXXXXXX" onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:border-cyan-800" />
                  </div>
                  <div>
                    <label className="block font-bold mb-0.5">Contact No (Student) *</label>
                    <input name="studentPhone" required placeholder="01XXXXXXXXX" onChange={handleChange} className="w-full p-2 border rounded focus:outline-none focus:border-cyan-800" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-bold mb-0.5 text-cyan-950">Batch (কোর্স ব্যাচ)</label>
                  <select name="batchCategory" onChange={handleChange} className="w-full p-2 border bg-cyan-50/50 rounded font-semibold focus:outline-none focus:border-cyan-800">
                    <option>HSC 1st Year</option>
                    <option>HSC 2nd Year</option>
                    <option>HSC Final Preparation</option>
                    <option>Admission</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-0.5 text-cyan-950">Admission/Monthly Fee (BDT) *</label>
                  <input type="number" name="amount" required placeholder="Amount in TK" onChange={handleChange} className="w-full p-2 border bg-cyan-50/50 rounded font-bold text-sm focus:outline-none focus:border-cyan-800" />
                </div>
              </div>

            </div>

            {/* Academic Info Table Section */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs">
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
                        <select name="examName" onChange={handleChange} className="w-full p-1 focus:outline-none"><option>SSC</option><option>JSC</option></select>
                      </td>
                      <td className="p-1 border border-slate-300">
                        <select name="examBoard" onChange={handleChange} className="w-full p-1 focus:outline-none">
                          <option>Rajshahi</option><option>Dhaka</option><option>Dinajpur</option><option>Jashore</option>
                        </select>
                      </td>
                      <td className="p-1 border border-slate-300">
                        <input name="examYear" placeholder="e.g. 2024" onChange={handleChange} className="w-full p-1 focus:outline-none" />
                      </td>
                      <td className="p-1 border border-slate-300">
                        <input name="examGpa" placeholder="e.g. 5.00" onChange={handleChange} className="w-full p-1 focus:outline-none" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Promising Lines with New Name */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs text-justify space-y-4">
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
        /* Digital Receipt Screen with New Name */
        <div className="flex flex-col items-center">
          <div ref={receiptRef} className="bg-white p-6 w-[380px] border-2 border-dashed border-gray-400 text-sm font-sans shadow-md">
            <div className="text-center border-b pb-2 mb-4">
              <h3 className="text-lg font-black text-cyan-900 tracking-wide uppercase">AKIB MATH ACADEMIC & ADMISSION CARE</h3>
              <p className="text-xs text-gray-500">Malopara, Mohila College Road, Rajshahi</p>
              <p className="text-xs font-bold mt-3 bg-slate-100 text-cyan-950 py-1 rounded tracking-widest border">MONEY RECEIPT</p>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <p><strong>Roll No:</strong> {formData.rollNo || 'N/A'}</p>
                <p><strong>Receipt No:</strong> {receiptNo}</p>
              </div>
              <div className="flex justify-between">
                <p><strong>Batch:</strong> {formData.batchName || 'N/A'} ({formData.batchTime || 'N/A'})</p>
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
              </div>
              <hr className="border-gray-300" />
              <p><strong className="inline-block w-28">Student Name:</strong> <span className="uppercase font-semibold">{formData.studentNameEn}</span></p>
              <p><strong className="inline-block w-28">College:</strong> {formData.collegeName || 'N/A'}</p>
              <p><strong className="inline-block w-28">Contact No:</strong> {formData.studentPhone}</p>
              <p><strong className="inline-block w-28">Course Type:</strong> {formData.batchCategory}</p>
              <hr className="border-gray-300" />
              <div className="flex justify-between font-bold text-sm bg-slate-100 p-2 rounded border">
                <span>Total Paid (টাকা প্রাপ্তি):</span>
                <span>{formData.amount} TK</span>
              </div>
            </div>

            <div className="mt-10 flex justify-between text-[10px] text-gray-500 pt-4 border-t border-gray-200">
              <p className="italic">Generated Digitally</p>
              <p className="border-t border-black px-3 font-bold text-gray-800">Authority Signature</p>
            </div>
          </div>
          
          <div className="mt-6 space-x-4">
            <button onClick={handlePrint} className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-bold shadow hover:bg-emerald-700 transition">Print Money Receipt</button>
            <button onClick={() => setShowReceipt(false)} className="bg-slate-500 text-white px-6 py-2.5 rounded-lg font-bold shadow hover:bg-slate-600 transition">Back to Form</button>
          </div>
        </div>
      )}
    </div>
  );
}