# Semantic Garbage Collection (SGC) - Antigravity Protocol

## 🎯 Overview

A prototype implementation of the **Autonomous Data Decay Framework** utilizing Shannon entropy calculation for intelligent data lifecycle management. This system autonomously identifies low-entropy data and transforms it into compact semantic vector embeddings.

**Research Paper:** "Autonomous Data Decay: A Framework for Semantic Garbage Collection Utilizing the Antigravity Protocol"  


---

## 🚀 Live Demo

**Deployed Application:[](https://semantic-gc-live.pages.dev/)

---

## 📋 What It Does

This prototype demonstrates the core Semantic Garbage Collection algorithm:

1. **File Upload** - Accepts dataset files (log files, text files, repetitive data)
2. **Shannon Entropy Analysis** - Calculates information entropy using the formula: H(X) = -Σ p(xi) log₂ p(xi)
3. **Threshold Detection** - Evaluates files against 4.5 bits/byte threshold
4. **Distillation Decision** - Routes low-entropy files (< 4.5) to distillation phase
5. **Size Reduction** - Transforms data into semantic vectors with dramatic size reduction
6. **Results Display** - Shows original size, dissolved size, and dissolution ratio

---

## 🛠️ Technology Stack

- **Frontend:** HTML, CSS, JavaScript
- **Styling:** Glassmorphism design
- **Deployment:** Cloudflare Pages
- **Algorithm:** Shannon Entropy calculation (client-side)
- **Architecture:** Serverless, no API keys required

---

## ⚙️ How to Run Locally

1. Clone the repository:
```bash
git clone https://github.com/[your-username]/[repo-name].git
cd [repo-name]
```

2. Open `index.html` in your browser or use a local server:
```bash
python -m http.server 8000
# OR
npx serve
```

3. Navigate to `http://localhost:8000`

---

## 📊 How It Works

### Shannon Entropy Calculation
The system calculates byte-level entropy to determine data redundancy:
- **High Entropy (≥ 4.5):** Good compression, file retained
- **Low Entropy (< 4.5):** High redundancy, candidate for distillation

### Distillation Process
Low-entropy files undergo semantic distillation:
1. File content analyzed for patterns
2. Semantic vectors generated
3. Original file "dissolved" 
4. Compact vector representation stored

---

## ⚠️ Current Limitations

This is a **research prototype** with the following limitations:

1. **Minimum File Size:** Files below 1KB cannot be processed (insufficient byte patterns for meaningful entropy calculation)
2. **No Persistent Storage:** Files are processed and results displayed, but not saved to backend
3. **Search Functionality:** Currently non-operational (planned for future implementation)
4. **Vector Readability:** Dissolved vectors are machine-readable only (LLM compatible, not human-readable)
5. **Client-Side Processing:** All computation happens in browser (no server-side processing)

---

## 🔮 Future Roadmap

### Planned Enhancements:
- ✅ Backend persistence using Cloudflare KV
- ✅ Semantic search implementation
- ✅ Human-readable vector summaries
- ✅ Antigravity Protocol integration (decentralized vector storage)
- ✅ Support for larger file processing
- ✅ Multi-file batch processing
- ✅ Performance comparison with traditional storage

---

## 📖 Research Context

This prototype validates the core concepts presented in our IEEE paper:
- Autonomous data decay mechanisms
- Shannon entropy as data viability metric
- Lossy knowledge paradigm
- 99%+ storage reduction potential

**Full Paper:** Available upon request or after symposium presentation

---

## 🎓 Academic Information

**Team:** Team Dynamos  
**Institution:** R.M.D Engineering College, Chennai  
**Department:** Electronics and Communication Engineering  
**Event:** Ozmenta Symposium 2026 - Paper Presentation  

**Team Members:**
- Ganesh S 
- Hemavarshini M 

**Mentor:** Dr. Kamalrajan

---

## 📝 License

This is an academic research project. Code provided as-is for educational purposes.

---

## 🤝 Contributing

This is currently a research prototype. For questions or collaboration inquiries, please contact via the email addresses in the paper.

---

## 📧 Contact

For technical queries related to this implementation:
- Email: 25ec034@rmd.ac.in | 25ec050@rmd.ac.in
- Mentor: kamal.snh@rmd.ac.in

---

**Note:** This prototype demonstrates theoretical concepts from our research paper. Full production implementation with complete Antigravity Protocol integration is planned for future development phases.
