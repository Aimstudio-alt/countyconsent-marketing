export default function Footer() {
  return (
    <footer style={{background:'#0a2818'}}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:'rgba(255,255,255,0.1)'}}>
                <svg className="w-4.5 h-4.5 text-white" style={{width:'18px',height:'18px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="font-bold text-white text-base">CountyConsent</span>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{color:'#6b9980'}}>
              Junior Golf Safeguarding, Done Right. The only GDPR-compliant digital consent system built specifically for county golf unions and clubs.
            </p>
            <a href="#demo" className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{background:'#c9921c',color:'white'}}>
              Request a demo
            </a>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase mb-5" style={{color:'#6b9980'}}>Platform</h4>
            <ul className="space-y-3">
              {[['Features','#features'],['How it works','#how-it-works'],['Pricing','#pricing'],['FAQ','#faq']].map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="text-sm transition-colors hover:text-white" style={{color:'#a0bfb0'}}>{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Compliance */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase mb-5" style={{color:'#6b9980'}}>Compliance</h4>
            <ul className="space-y-3">
              {['UK GDPR compliant','England Golf aligned','SafeGolf accreditation ready','ICO-ready audit exports','UK data storage'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm" style={{color:'#a0bfb0'}}>
                  <svg className="w-3.5 h-3.5 flex-shrink-0" style={{color:'#34a866'}} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4" style={{borderColor:'rgba(255,255,255,0.07)'}}>
          <p className="text-xs" style={{color:'#4d7a62'}}>
            &copy; {new Date().getFullYear()} CountyConsent. All rights reserved. Built in partnership with Durham County Golf Union.
          </p>
          <p className="text-xs" style={{color:'#4d7a62'}}>
            UK GDPR · ICO registered · Data stored in the United Kingdom
          </p>
        </div>
      </div>
    </footer>
  )
}
