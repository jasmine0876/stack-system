export default function AnalysisSummary({ analysis }) {
  if (!analysis?.length) return null;

  // Icon logic based on text content
  const getIcon = (text) => {
    if (text.includes('強勢') || text.includes('偏多') || text.includes('站穩')) {
      return (
        <div className="w-8 h-8 rounded-full bg-stock-up-bg flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-stock-up" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </div>
      );
    }
    if (text.includes('弱勢') || text.includes('偏弱') || text.includes('跌破')) {
      return (
        <div className="w-8 h-8 rounded-full bg-stock-down-bg flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-stock-down" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      );
    }
    if (text.includes('⚠️') || text.includes('免責') || text.includes('不構成')) {
      return (
        <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
      );
    }
    if (text.includes('超買') || text.includes('高檔') || text.includes('高點')) {
      return (
        <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
      );
    }
    if (text.includes('超賣') || text.includes('低檔') || text.includes('低點')) {
      return (
        <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
          </svg>
        </div>
      );
    }
    // Default: neutral
    return (
      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-accent-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    );
  };

  // Separate disclaimer from analysis
  const mainAnalysis = analysis.filter((a) => !a.includes('⚠️'));
  const disclaimer = analysis.find((a) => a.includes('⚠️'));

  return (
    <div className="glass-card animate-fade-in-up-delay-5">
      <h3 className="text-lg font-bold text-navy-100 mb-5 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        白話分析結論
        <span className="text-xs font-normal text-navy-500 ml-1">— 為初學者翻譯技術指標</span>
      </h3>

      <div className="space-y-3">
        {mainAnalysis.map((text, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-xl bg-navy-800/30 border border-navy-700/20 hover:bg-navy-800/50 transition-colors duration-200"
          >
            {getIcon(text)}
            <p className="text-sm text-navy-200 leading-relaxed pt-1">{text}</p>
          </div>
        ))}
      </div>

      {disclaimer && (
        <div className="mt-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <div className="flex items-start gap-3">
            {getIcon(disclaimer)}
            <p className="text-xs text-amber-300/80 leading-relaxed pt-1.5">
              {disclaimer.replace('⚠️ ', '')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
